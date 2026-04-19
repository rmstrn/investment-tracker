package handlers

import (
	"math"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// ComparePortfolioPerformance is the multi-benchmark variant of
// /portfolio/performance per openapi.yaml PortfolioPerformanceCompare.
// 1–3 benchmarks via comma-separated `benchmarks=` param; period as
// in /performance.
//
// Same TD-020 caveat as the single-benchmark endpoint — until
// benchmark_prices lands, every benchmark entry returns null for
// benchmark_return_percent and alpha_percent (the openapi schema for
// both is now nullable, regenerated in this commit). The
// X-Benchmark-Unavailable header signals the gap.
//
// Plus+ tier-gated: free returns 403 FEATURE_LOCKED.
//
// Stats block carries portfolio-only aggregates (avg monthly return +
// volatility) computed over the snapshot series. Best/worst-month
// rollup is best-effort; with sub-monthly snapshot density it is left
// as null instead of fudged.
func ComparePortfolioPerformance(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		period := c.Query("period")
		if _, ok := validPerformancePeriods[period]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "period must be one of 1m, 3m, 6m, 1y, all"))
		}
		raw := strings.TrimSpace(c.Query("benchmarks"))
		if raw == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "benchmarks is required (comma-separated, 1-3 items)"))
		}
		benchmarks := strings.Split(raw, ",")
		if len(benchmarks) < 1 || len(benchmarks) > 3 {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "benchmarks must be 1-3 comma-separated items"))
		}
		for i, b := range benchmarks {
			b = strings.TrimSpace(b)
			if _, ok := validPerformanceBenchmarks[b]; !ok {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid benchmark "+b))
			}
			benchmarks[i] = b
		}

		if !users.HasTier(user, users.TierPlus) {
			return errs.Respond(c, reqID,
				errs.New(http.StatusForbidden, "FEATURE_LOCKED", "Multi-benchmark comparison requires Plus or higher"))
		}

		startDate := periodStart(time.Now().UTC(), period)
		snaps, err := loadSnapshots(ctx, deps, user.ID, startDate)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load snapshots"))
		}

		portfolioReturn, portfolioSeries := computePortfolioOnlySeries(snaps)

		c.Set("X-Benchmark-Unavailable", "true")
		benchmarksOut := make([]fiber.Map, 0, len(benchmarks))
		for _, b := range benchmarks {
			benchmarksOut = append(benchmarksOut, fiber.Map{
				"benchmark":                b,
				"benchmark_return_percent": nil,
				"alpha_percent":            nil,
				"series":                   []any{},
			})
		}

		return c.JSON(fiber.Map{
			"period":                   period,
			"portfolio_return_percent": portfolioReturn,
			"portfolio_series":         portfolioSeries,
			"benchmarks":               benchmarksOut,
			"stats":                    computeStats(snaps),
		})
	}
}

// computePortfolioOnlySeries is the compare endpoint's variant of
// computePortfolioSeries — it does not pre-emit benchmark fields per
// point because PortfolioPerformanceCompare's portfolio_series shape
// only carries portfolio_return_percent.
func computePortfolioOnlySeries(snaps []dbgen.PortfolioSnapshot) (float64, []fiber.Map) {
	if len(snaps) == 0 {
		return 0.0, []fiber.Map{}
	}
	base := snaps[0].TotalValueBase
	out := make([]fiber.Map, 0, len(snaps))
	for _, s := range snaps {
		var pct decimal.Decimal
		if !base.IsZero() {
			pct = s.TotalValueBase.Sub(base).Div(base)
		}
		f, _ := pct.Float64()
		out = append(out, fiber.Map{
			"date":                     s.SnapshotDate.Time.UTC().Format("2006-01-02"),
			"portfolio_return_percent": f,
		})
	}
	last, _ := out[len(out)-1]["portfolio_return_percent"].(float64)
	return last, out
}

// computeStats produces the openapi PortfolioPerformanceStats block:
// avg_return_percent + volatility computed over consecutive snapshot
// returns. Best/worst month requires monthly bucketing; with the
// current daily snapshot cadence we leave both fields null rather
// than approximate (TD-028: monthly rollup once snapshot density
// guarantees coverage).
func computeStats(snaps []dbgen.PortfolioSnapshot) fiber.Map {
	if len(snaps) < 2 {
		return fiber.Map{
			"best_month":         nil,
			"worst_month":        nil,
			"avg_return_percent": 0.0,
			"volatility":         0.0,
		}
	}
	returns := make([]float64, 0, len(snaps)-1)
	for i := 1; i < len(snaps); i++ {
		prev := snaps[i-1].TotalValueBase
		cur := snaps[i].TotalValueBase
		if prev.IsZero() {
			continue
		}
		r, _ := cur.Sub(prev).Div(prev).Float64()
		returns = append(returns, r)
	}
	if len(returns) == 0 {
		return fiber.Map{
			"best_month":         nil,
			"worst_month":        nil,
			"avg_return_percent": 0.0,
			"volatility":         0.0,
		}
	}
	var sum float64
	for _, r := range returns {
		sum += r
	}
	mean := sum / float64(len(returns))
	var variance float64
	for _, r := range returns {
		d := r - mean
		variance += d * d
	}
	stdev := math.Sqrt(variance / float64(len(returns)))
	return fiber.Map{
		"best_month":         nil,
		"worst_month":        nil,
		"avg_return_percent": mean,
		"volatility":         stdev,
	}
}
