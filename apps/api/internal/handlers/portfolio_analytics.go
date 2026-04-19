package handlers

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/analytics"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/tiers"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

var validAnalyticsPeriods = map[string]struct{}{
	"3m": {}, "6m": {}, "1y": {}, "3y": {}, "all": {},
}

// tradingDaysPerYear annualises Sharpe/Sortino/Volatility assuming
// daily snapshots. If snapshot cadence ever drops to weekly, switch
// to 52; monthly → 12.
const tradingDaysPerYear = 252

// GetPortfolioAnalytics returns the Pro-tier quant block per openapi
// PortfolioAnalytics. Sharpe/Sortino/MaxDrawdown/Volatility and the
// underwater series come out of the analytics pkg against
// period-over-period returns derived from portfolio_snapshots;
// factor_exposure / style_box / correlation_matrix are null until
// their data feeds land (TD-032/033) and the X-Analytics-Partial
// header signals the scope-cut.
//
// Empty state (no snapshots or a single-point series) returns 200
// with metrics zeroed — not 404. First-time users see a zeroed
// chart rather than an error modal.
func GetPortfolioAnalytics(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		period := c.Query("period", "1y")
		if _, ok := validAnalyticsPeriods[period]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "period must be one of 3m, 6m, 1y, 3y, all"))
		}

		if !tiers.For(user.SubscriptionTier).AdvancedAnalytics {
			return errs.Respond(c, reqID,
				errs.New(http.StatusForbidden, "FEATURE_LOCKED", "Advanced analytics requires Pro"))
		}

		snaps, err := loadSnapshotsForAnalytics(ctx, deps, user.ID, period)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load snapshots"))
		}

		values := extractValues(snaps)
		returns := periodReturns(values)

		sharpe, _ := analytics.Sharpe(returns, decimal.Zero, tradingDaysPerYear)
		sortino, _ := analytics.Sortino(returns, decimal.Zero, tradingDaysPerYear)
		vol, _ := analytics.Volatility(returns, tradingDaysPerYear)
		maxDD, _, _, _ := analytics.MaxDrawdown(values)

		underwater := analytics.Underwater(values)
		uwPoints := buildUnderwaterPoints(snaps, underwater, period)

		c.Set("X-Analytics-Partial", "true")
		deps.Log.Info().
			Str("request_id", reqID).
			Str("user_id", user.ID.String()).
			Str("period", period).
			Int("snapshots", len(snaps)).
			Msg("portfolio analytics served with null factor/style/correlation (TD-032/033)")

		return c.JSON(fiber.Map{
			"period":             period,
			"sharpe":             floatOrZero(sharpe),
			"sortino":            floatOrZero(sortino),
			"max_drawdown":       floatOrZero(maxDD),
			"volatility":         floatOrZero(vol),
			"underwater_series":  uwPoints,
			"factor_exposure":    nil, // TD-032
			"style_box":          nil, // TD-032
			"correlation_matrix": nil, // TD-033
		})
	}
}

// loadSnapshotsForAnalytics is the same logic as the B2b history
// handler's loader — kept a separate function so analytics does not
// leak into portfolio_history's identifier namespace.
func loadSnapshotsForAnalytics(ctx context.Context, deps *app.Deps, userID uuid.UUID, period string) ([]dbgen.PortfolioSnapshot, error) {
	start := analyticsPeriodStart(time.Now().UTC(), period)
	if start.IsZero() {
		start = time.Date(1970, 1, 1, 0, 0, 0, 0, time.UTC)
	}
	return dbgen.New(deps.Pool).ListSnapshotsByUserSince(ctx, dbgen.ListSnapshotsByUserSinceParams{
		UserID:       userID,
		SnapshotDate: pgtype.Date{Time: start, Valid: true},
	})
}

func analyticsPeriodStart(now time.Time, period string) time.Time {
	day := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	switch period {
	case "3m":
		return day.AddDate(0, -3, 0)
	case "6m":
		return day.AddDate(0, -6, 0)
	case "1y":
		return day.AddDate(-1, 0, 0)
	case "3y":
		return day.AddDate(-3, 0, 0)
	default: // all
		return time.Time{}
	}
}

// extractValues pulls total_value_base from every snapshot into a
// Decimal slice, preserving the ORDER BY snapshot_date ASC that
// ListSnapshotsByUserSince already guarantees.
func extractValues(snaps []dbgen.PortfolioSnapshot) []decimal.Decimal {
	out := make([]decimal.Decimal, 0, len(snaps))
	for _, s := range snaps {
		out = append(out, s.TotalValueBase)
	}
	return out
}

// periodReturns converts an equity series into the per-interval
// returns analytics.Sharpe et al. expect.
func periodReturns(values []decimal.Decimal) []decimal.Decimal {
	if len(values) < 2 {
		return nil
	}
	out := make([]decimal.Decimal, 0, len(values)-1)
	for i := 1; i < len(values); i++ {
		prev := values[i-1]
		if prev.IsZero() {
			out = append(out, decimal.Zero)
			continue
		}
		out = append(out, values[i].Sub(prev).Div(prev))
	}
	return out
}

// buildUnderwaterPoints pairs the underwater fractions with their
// snapshot dates and downsamples to weekly when the period is long
// enough that a daily series would blow past ~500 points. Keeps the
// payload reasonable for the UI chart.
func buildUnderwaterPoints(snaps []dbgen.PortfolioSnapshot, underwater []decimal.Decimal, period string) []fiber.Map {
	if len(snaps) != len(underwater) {
		return []fiber.Map{}
	}
	step := 1
	if period == "1y" || period == "3y" || period == "all" {
		// Weekly downsample; snapshot cadence assumed daily.
		step = 7
	}
	out := make([]fiber.Map, 0, len(snaps)/step+1)
	for i := 0; i < len(snaps); i += step {
		f, _ := underwater[i].Float64()
		out = append(out, fiber.Map{
			"date":             snaps[i].SnapshotDate.Time.UTC().Format("2006-01-02"),
			"drawdown_percent": f,
		})
	}
	return out
}

func floatOrZero(d decimal.Decimal) float64 {
	f, _ := d.Float64()
	return f
}

// analyticsPeriodStart and co are intentionally not exported — they
// would collide with the /portfolio/performance file's periodStart
// once that handler also moves to the same period tokens. The
// redundancy is 12 lines; deduping is DRY-for-DRY's-sake.
var _ = errors.New // keep the import slot visible for future error wiring
