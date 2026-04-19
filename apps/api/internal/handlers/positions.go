package handlers

import (
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/fx"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/portfolio"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// ListPositions returns the authenticated user's current holdings,
// enriched with current price, value, and P&L in base + display
// currencies. Response: openapi.yaml Position[] under `data`.
//
// Query:
//   - ?sort=value_desc|value_asc|pnl_desc|pnl_asc|alpha (default value_desc)
//   - ?currency=<ISO-4217>                              (overrides user default)
//   - ?group_by=account|symbol|asset_type               (accepted but not applied
//     until PR B2b adds the grouped response shape — current endpoint
//     returns the flat list per openapi.yaml Position schema)
func ListPositions(deps *app.Deps) fiber.Handler {
	fxResolver := fx.New(deps.Pool, deps.Cache)

	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		display := resolveDisplayCurrency(c, user)
		sortKey := strings.ToLower(strings.TrimSpace(c.Query("sort", "value_desc")))
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

		sortPositions(snap.Positions, sortKey)

		fxBaseToDisplay := lookupFX(fxMap, BaseCurrency, display)
		items := make([]fiber.Map, 0, len(snap.Positions))
		for _, ep := range snap.Positions {
			items = append(items, shapePositionItem(ep, display, fxBaseToDisplay))
		}
		return c.JSON(fiber.Map{"data": items})
	}
}

// sortPositions orders the slice in place. Unknown sort keys fall back
// to value_desc without erroring — the openapi enum already restricts
// valid inputs at the gateway / typed-client level.
func sortPositions(ps []portfolio.EnrichedPosition, key string) {
	switch key {
	case "value_asc":
		sort.Slice(ps, func(i, j int) bool { return ps[i].ValueBase.LessThan(ps[j].ValueBase) })
	case "pnl_desc":
		sort.Slice(ps, func(i, j int) bool { return ps[i].PnLAbsoluteBase.GreaterThan(ps[j].PnLAbsoluteBase) })
	case "pnl_asc":
		sort.Slice(ps, func(i, j int) bool { return ps[i].PnLAbsoluteBase.LessThan(ps[j].PnLAbsoluteBase) })
	case "alpha":
		sort.Slice(ps, func(i, j int) bool { return ps[i].Symbol < ps[j].Symbol })
	default: // value_desc
		sort.Slice(ps, func(i, j int) bool { return ps[i].ValueBase.GreaterThan(ps[j].ValueBase) })
	}
}

// shapePositionItem converts an EnrichedPosition into the openapi.yaml
// Position shape.
func shapePositionItem(ep portfolio.EnrichedPosition, display string, fxBaseToDisplay decimal.Decimal) fiber.Map {
	avgCost := any(nil)
	if ep.AvgCost.Valid {
		avgCost = ep.AvgCost.Decimal.StringFixed(10)
	}
	pnlPct, _ := ep.PnLPercent.Float64()
	return fiber.Map{
		"id":         ep.ID.String(),
		"account_id": ep.AccountID.String(),
		"symbol":     ep.Symbol,
		"asset_type": ep.AssetType,
		"quantity":   ep.Quantity.StringFixed(10),
		"avg_cost":   avgCost,
		"currency":   ep.Currency,
		"values": fiber.Map{
			"base": fiber.Map{
				"currency":    BaseCurrency,
				"total_value": ep.ValueBase.StringFixed(10),
				"total_cost":  ep.CostBase.StringFixed(10),
			},
			"display": fiber.Map{
				"currency":    display,
				"total_value": ep.ValueBase.Mul(fxBaseToDisplay).StringFixed(10),
				"total_cost":  ep.CostBase.Mul(fxBaseToDisplay).StringFixed(10),
				"fx_rate":     fxBaseToDisplay.String(),
				"fx_date":     time.Now().UTC().Format("2006-01-02"),
			},
		},
		"pnl_absolute": fiber.Map{
			"base":    ep.PnLAbsoluteBase.StringFixed(10),
			"display": ep.PnLAbsoluteBase.Mul(fxBaseToDisplay).StringFixed(10),
		},
		"pnl_percent":        pnlPct,
		"last_calculated_at": time.Now().UTC().Format(time.RFC3339),
	}
}
