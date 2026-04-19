package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/fx"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

var validHistoryPeriods = map[string]struct{}{
	"1d": {}, "1w": {}, "1m": {}, "3m": {}, "6m": {}, "1y": {}, "all": {},
}

// GetPortfolioHistory returns the equity curve from portfolio_snapshots
// per openapi.yaml PortfolioHistoryResponse. Each point carries both
// base (USD) and display-currency value, the same way GET /portfolio
// reports the current snapshot.
//
// Empty state (no snapshots for this user yet) → 200 with points:[].
// FX rate for the display currency is looked up once for the latest
// snapshot date and applied uniformly across the series — historical
// FX-per-day would require a per-snapshot fx_rates lookup which is
// scope creep. Note in the response (X-FX-Date header) calls out
// which date the FX rate is from so callers know the conversion is
// approximate for older points.
func GetPortfolioHistory(deps *app.Deps) fiber.Handler {
	fxResolver := fx.New(deps.Pool, deps.Cache)

	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		display := resolveDisplayCurrency(c, user)
		ctx := c.Context()

		period := c.Query("period")
		if _, ok := validHistoryPeriods[period]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "period must be one of 1d, 1w, 1m, 3m, 6m, 1y, all"))
		}

		startDate := historyPeriodStart(time.Now().UTC(), period)
		snaps, err := loadSnapshotsB2b(ctx, deps, user.ID, startDate)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load snapshots"))
		}

		fxRate := decimal.NewFromInt(1)
		if BaseCurrency != display {
			rate, ferr := fxResolver.Rate(ctx, BaseCurrency, display)
			if ferr != nil {
				return errs.Respond(c, reqID,
					errs.Wrap(ferr, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to resolve fx"))
			}
			fxRate = rate
			c.Set("X-FX-Date", time.Now().UTC().Format("2006-01-02"))
		}

		points := make([]fiber.Map, 0, len(snaps))
		for _, s := range snaps {
			points = append(points, fiber.Map{
				"date": s.SnapshotDate.Time.UTC().Format("2006-01-02"),
				"value_base": fiber.Map{
					"currency":    BaseCurrency,
					"total_value": s.TotalValueBase.StringFixed(10),
					"total_cost":  s.TotalCostBase.StringFixed(10),
				},
				"value_display": fiber.Map{
					"currency":    display,
					"total_value": s.TotalValueBase.Mul(fxRate).StringFixed(10),
					"total_cost":  s.TotalCostBase.Mul(fxRate).StringFixed(10),
				},
			})
		}

		return c.JSON(fiber.Map{
			"period":           period,
			"base_currency":    BaseCurrency,
			"display_currency": display,
			"points":           points,
		})
	}
}

// historyPeriodStart maps a period string to the inclusive start date
// for the snapshot query. "all" returns the zero time so the loader
// passes a far-past sentinel and pulls every row.
func historyPeriodStart(now time.Time, period string) time.Time {
	day := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	switch period {
	case "1d":
		return day
	case "1w":
		return day.AddDate(0, 0, -7)
	case "1m":
		return day.AddDate(0, -1, 0)
	case "3m":
		return day.AddDate(0, -3, 0)
	case "6m":
		return day.AddDate(0, -6, 0)
	case "1y":
		return day.AddDate(-1, 0, 0)
	default: // all
		return time.Time{}
	}
}

// loadSnapshotsB2b is the same logic as performance.go's loadSnapshots
// but kept distinct so this handler does not import the performance
// file's name. Mirrors the "zero time → 1970 sentinel" pattern.
func loadSnapshotsB2b(ctx context.Context, deps *app.Deps, userID uuid.UUID, start time.Time) ([]dbgen.PortfolioSnapshot, error) {
	if start.IsZero() {
		start = time.Date(1970, 1, 1, 0, 0, 0, 0, time.UTC)
	}
	return dbgen.New(deps.Pool).ListSnapshotsByUserSince(ctx, dbgen.ListSnapshotsByUserSinceParams{
		UserID:       userID,
		SnapshotDate: pgtype.Date{Time: start, Valid: true},
	})
}
