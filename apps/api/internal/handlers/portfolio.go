package handlers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/fx"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/portfolio"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// BaseCurrency is the reporting currency stored on portfolio_snapshots.
// It is "USD today" per TASK_03 migration comment; an override column
// exists so we can switch without another migration.
const BaseCurrency = "USD"

// GetPortfolio returns the current portfolio snapshot for the
// authenticated user in base (USD) and display currencies.
//
// Query: ?currency=<ISO-4217> (overrides user.display_currency).
// Response: openapi.yaml PortfolioSnapshot.
//
// Resolution: positions from Postgres, prices batch-fetched, FX rates
// through fx.Resolver (Redis-first). Missing-price positions are
// excluded from totals and counted via the X-Partial-Portfolio header.
func GetPortfolio(deps *app.Deps) fiber.Handler {
	fxResolver := fx.New(deps.Pool, deps.Cache)

	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		display := resolveDisplayCurrency(c, user)
		ctx := c.Context()

		positions, err := loadPositions(ctx, deps.Pool, user.ID)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load positions"))
		}

		prices, err := loadPricesForPositions(ctx, deps.Pool, positions)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load prices"))
		}

		fxMap, err := loadFXForPositions(ctx, fxResolver, positions, BaseCurrency, display)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to resolve fx rates"))
		}

		snap, err := portfolio.CalculateSnapshot(positions, prices, fxMap, BaseCurrency, display)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "portfolio calculation failed"))
		}

		if snap.Partial {
			c.Set("X-Partial-Portfolio", "true")
			deps.Log.Warn().
				Str("request_id", reqID).
				Str("user_id", user.ID.String()).
				Strs("unresolved", snap.UnresolvedSymbols).
				Msg("portfolio snapshot served with unresolved prices")
		}

		return c.JSON(shapePortfolioSnapshot(snap, fxMap, display))
	}
}

// ----- response shaping ---------------------------------------------

// shapePortfolioSnapshot converts the domain snapshot into the
// openapi.yaml PortfolioSnapshot shape. Money values become decimal
// strings per the Money schema pattern; allocations stay as floats
// (openapi spec says number/float for fractions).
func shapePortfolioSnapshot(snap *portfolio.Snapshot, fxMap map[portfolio.FXKey]decimal.Decimal, display string) fiber.Map {
	fxRate := lookupFX(fxMap, snap.BaseCurrency, display)

	base := fiber.Map{
		"currency":    snap.BaseCurrency,
		"total_value": snap.TotalValueBase.StringFixed(10),
		"total_cost":  snap.TotalCostBase.StringFixed(10),
	}
	displayValues := fiber.Map{
		"currency":    display,
		"total_value": snap.TotalValueDisplay.StringFixed(10),
		"total_cost":  snap.TotalCostBase.Mul(fxRate).StringFixed(10),
		"fx_rate":     fxRate.String(),
		"fx_date":     time.Now().UTC().Format("2006-01-02"),
	}

	pnlAbsoluteBase := snap.TotalPnLBase.StringFixed(10)
	pnlAbsoluteDisplay := snap.TotalPnLBase.Mul(fxRate).StringFixed(10)

	pnlPercent, _ := snap.TotalPnLPercent.Float64()

	return fiber.Map{
		"snapshot_date": snap.ComputedAt.UTC().Format("2006-01-02"),
		"values": fiber.Map{
			"base":    base,
			"display": displayValues,
		},
		"pnl_absolute": fiber.Map{
			"base":    pnlAbsoluteBase,
			"display": pnlAbsoluteDisplay,
		},
		"pnl_percent":   pnlPercent,
		"allocation":    allocationFloats(snap.BySymbol),
		"by_asset_type": allocationFloats(snap.ByAssetType),
		"by_currency":   allocationFloats(snap.ByCurrency),
	}
}

// allocationFloats converts a decimal-fraction map to the float-fraction
// shape demanded by PortfolioAllocation. Precision loss here is fine —
// these are display fractions (0..1), not money.
func allocationFloats(in map[string]decimal.Decimal) map[string]float64 {
	out := make(map[string]float64, len(in))
	for k, v := range in {
		f, _ := v.Float64()
		out[k] = f
	}
	return out
}

func lookupFX(fxMap map[portfolio.FXKey]decimal.Decimal, base, quote string) decimal.Decimal {
	if base == quote {
		return decimal.NewFromInt(1)
	}
	if r, ok := fxMap[portfolio.FXKey{Base: base, Quote: quote}]; ok {
		return r
	}
	if r, ok := fxMap[portfolio.FXKey{Base: quote, Quote: base}]; ok && !r.IsZero() {
		return decimal.NewFromInt(1).Div(r)
	}
	return decimal.NewFromInt(1) // safe fallback; unresolved FX surfaced elsewhere
}

// ----- data loaders -------------------------------------------------

func loadPositions(ctx context.Context, pool positionQuerier, userID uuid.UUID) ([]portfolio.Position, error) {
	q := dbgen.New(pool)
	rows, err := q.ListPositionsByUser(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("list positions: %w", err)
	}
	out := make([]portfolio.Position, 0, len(rows))
	for _, p := range rows {
		out = append(out, portfolio.Position{
			ID:        p.ID,
			AccountID: p.AccountID,
			Symbol:    p.Symbol,
			AssetType: p.AssetType,
			Quantity:  p.Quantity,
			AvgCost:   p.AvgCost,
			Currency:  strings.ToUpper(p.Currency),
		})
	}
	return out, nil
}

// loadPricesForPositions fetches one price per unique
// (symbol, asset_type, currency) tuple. A missing row is silently
// omitted — the calculator interprets absence as "unresolved".
func loadPricesForPositions(ctx context.Context, pool positionQuerier, positions []portfolio.Position) (map[portfolio.PriceKey]decimal.Decimal, error) {
	q := dbgen.New(pool)
	out := map[portfolio.PriceKey]decimal.Decimal{}
	seen := map[portfolio.PriceKey]struct{}{}
	for _, p := range positions {
		k := portfolio.PriceKey{Symbol: p.Symbol, AssetType: p.AssetType, Currency: p.Currency}
		if _, already := seen[k]; already {
			continue
		}
		seen[k] = struct{}{}
		row, err := q.GetPrice(ctx, dbgen.GetPriceParams{
			Symbol:    p.Symbol,
			AssetType: p.AssetType,
			Currency:  p.Currency,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				continue
			}
			return nil, fmt.Errorf("get price %s/%s/%s: %w", p.Symbol, p.AssetType, p.Currency, err)
		}
		out[k] = row.Price
	}
	return out, nil
}

// loadFXForPositions resolves every native-currency → (base, display)
// pair the calculator will need. Uses fx.Resolver (Redis-first).
func loadFXForPositions(ctx context.Context, r *fx.Resolver, positions []portfolio.Position, base, display string) (map[portfolio.FXKey]decimal.Decimal, error) {
	out := map[portfolio.FXKey]decimal.Decimal{}
	currencies := map[string]struct{}{base: {}, display: {}}
	for _, p := range positions {
		currencies[p.Currency] = struct{}{}
	}

	for cur := range currencies {
		for _, target := range []string{base, display} {
			if cur == target {
				continue
			}
			rate, err := r.Rate(ctx, cur, target)
			if err != nil {
				return nil, fmt.Errorf("fx %s→%s: %w", cur, target, err)
			}
			out[portfolio.FXKey{Base: cur, Quote: target}] = rate
		}
	}
	return out, nil
}

// ----- tiny plumbing bits ------------------------------------------

// positionQuerier matches both *pgxpool.Pool and pgx.Tx without leaking
// the concrete types up to the signature.
type positionQuerier interface {
	dbgen.DBTX
}

// resolveDisplayCurrency picks the display currency: explicit ?currency
// query parameter wins; otherwise falls back to the user's stored
// display_currency; otherwise BaseCurrency.
func resolveDisplayCurrency(c fiber.Ctx, user *dbgen.User) string {
	if q := strings.ToUpper(strings.TrimSpace(c.Query("currency"))); q != "" {
		return q
	}
	if user != nil && user.DisplayCurrency != "" {
		return strings.ToUpper(user.DisplayCurrency)
	}
	return BaseCurrency
}
