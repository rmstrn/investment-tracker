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
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

var validPerformancePeriods = map[string]struct{}{
	"1m": {}, "3m": {}, "6m": {}, "1y": {}, "all": {},
}

var validPerformanceBenchmarks = map[string]struct{}{
	"SPX": {}, "QQQ": {}, "ACWI": {}, "BTC": {},
}

// GetPortfolioPerformance returns the portfolio's total return over the
// requested period plus a day-by-day series, per openapi.yaml
// PortfolioPerformance.
//
// Data availability caveat (TD-020): the schema defines
// benchmark_return_percent as a required non-nullable number, but no
// benchmark_prices table or feed worker exists yet. Until one ships,
// this handler emits `null` for both benchmark_return_percent and
// alpha_percent — a deliberate, documented contract deviation that is
// more useful to callers than a 501 (AI Service can still consume the
// portfolio-side data). The X-Benchmark-Unavailable response header
// signals the gap to clients that must fail closed.
//
// Tier gate: benchmarked performance is a Plus+ feature
// (openapi.yaml /portfolio/performance "403: Benchmark requires Plus
// or higher"). Free tier → 403 FEATURE_LOCKED.
func GetPortfolioPerformance(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		period := c.Query("period")
		benchmark := c.Query("benchmark")
		if _, ok := validPerformancePeriods[period]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "period must be one of 1m, 3m, 6m, 1y, all"))
		}
		if _, ok := validPerformanceBenchmarks[benchmark]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "benchmark must be one of SPX, QQQ, ACWI, BTC"))
		}

		if !users.HasTier(user, users.TierPlus) {
			return errs.Respond(c, reqID,
				errs.New(http.StatusForbidden, "FEATURE_LOCKED", "Portfolio benchmarking requires Plus or higher"))
		}

		startDate := periodStart(time.Now().UTC(), period)
		snapshots, err := loadSnapshots(ctx, deps, user.ID, startDate)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load portfolio snapshots"))
		}

		portfolioReturn, series := computePortfolioSeries(snapshots)

		c.Set("X-Benchmark-Unavailable", "true")
		deps.Log.Info().
			Str("request_id", reqID).
			Str("user_id", user.ID.String()).
			Str("period", period).
			Str("benchmark", benchmark).
			Int("snapshots", len(snapshots)).
			Msg("portfolio performance served without benchmark data (TD-020)")

		return c.JSON(fiber.Map{
			"period":                   period,
			"benchmark":                benchmark,
			"portfolio_return_percent": portfolioReturn,
			"benchmark_return_percent": nil, // TD-020 — see handler docstring
			"alpha_percent":            nil, // TD-020 — alpha = portfolio - benchmark
			"series":                   series,
		})
	}
}

// periodStart translates a period token to an inclusive start date.
// "all" returns the zero date so the snapshot query effectively spans
// the full history.
func periodStart(now time.Time, period string) time.Time {
	day := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	switch period {
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

func loadSnapshots(ctx context.Context, deps *app.Deps, userID uuid.UUID, start time.Time) ([]dbgen.PortfolioSnapshot, error) {
	if start.IsZero() {
		start = time.Date(1970, 1, 1, 0, 0, 0, 0, time.UTC)
	}
	return dbgen.New(deps.Pool).ListSnapshotsByUserSince(ctx, dbgen.ListSnapshotsByUserSinceParams{
		UserID:       userID,
		SnapshotDate: pgtype.Date{Time: start, Valid: true},
	})
}

// computePortfolioSeries returns the total return over the snapshot
// range plus the per-day series normalised to the first snapshot.
// Edge cases:
//   - 0 snapshots: return 0.0, empty series (spec requires non-null
//     portfolio_return_percent even when we have no data — it is literally
//     a 0% return on 0 observations).
//   - 1 snapshot: return 0.0, single-point series at 0%.
func computePortfolioSeries(snaps []dbgen.PortfolioSnapshot) (float64, []fiber.Map) {
	if len(snaps) == 0 {
		return 0.0, []fiber.Map{}
	}
	base := snaps[0].TotalValueBase
	series := make([]fiber.Map, 0, len(snaps))
	for _, s := range snaps {
		var pct decimal.Decimal
		if !base.IsZero() {
			pct = s.TotalValueBase.Sub(base).Div(base)
		}
		pctF, _ := pct.Float64()
		series = append(series, fiber.Map{
			"date":                     s.SnapshotDate.Time.UTC().Format("2006-01-02"),
			"portfolio_return_percent": pctF,
			"benchmark_return_percent": nil, // TD-020
		})
	}
	lastPct := series[len(series)-1]["portfolio_return_percent"].(float64)
	return lastPct, series
}
