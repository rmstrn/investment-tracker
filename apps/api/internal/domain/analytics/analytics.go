// Package analytics implements pure-function quant metrics used by
// GET /portfolio/analytics. Every public function here is
// side-effect-free, decimal-based, and unit-testable without a DB.
//
// Functions are happy to operate on any time-series of returns or
// equity values — the handler is responsible for turning snapshots
// into that shape (e.g. period-over-period returns for Sharpe/Sortino/
// Volatility, raw values for MaxDrawdown/Underwater).
//
// Annualisation: the periodsPerYear argument is "how many of these
// samples fit in a year" — 252 for daily business days, 52 weekly,
// 12 monthly. Callers pass the ratio that matches the snapshot
// cadence of the period they chose in the handler.
package analytics

import (
	"errors"
	"math"

	"github.com/shopspring/decimal"
)

// ErrInsufficientData is returned when a metric cannot be meaningfully
// computed for the provided sample (typically n < 2). Handlers map
// this to a JSON zero for the affected field rather than a 500.
var ErrInsufficientData = errors.New("analytics: insufficient data")

// Sharpe returns the annualised Sharpe ratio. Returns (0, nil) when
// the sample stdev is zero (constant returns → mathematically
// undefined; zero is the least-surprising display value).
//
// Formula: ((mean(r) - rf) / stdev(r)) * sqrt(periodsPerYear).
func Sharpe(returns []decimal.Decimal, riskFree decimal.Decimal, periodsPerYear int) (decimal.Decimal, error) {
	if len(returns) < 2 {
		return decimal.Zero, ErrInsufficientData
	}
	mean := meanDec(returns)
	stdev := stdevDec(returns, mean)
	if stdev.IsZero() {
		return decimal.Zero, nil
	}
	excess := mean.Sub(riskFree)
	sharpe := excess.Div(stdev)
	return sharpe.Mul(sqrtDec(decimal.NewFromInt(int64(periodsPerYear)))), nil
}

// Sortino returns the annualised Sortino ratio — Sharpe restricted to
// downside deviation. Excess-return mean in the numerator stays the
// same; denominator uses only sub-target returns (r < riskFree).
//
// Returns (0, nil) when no sample is below the target or the
// downside stdev is zero.
func Sortino(returns []decimal.Decimal, riskFree decimal.Decimal, periodsPerYear int) (decimal.Decimal, error) {
	if len(returns) < 2 {
		return decimal.Zero, ErrInsufficientData
	}
	mean := meanDec(returns)
	excess := mean.Sub(riskFree)

	var variance decimal.Decimal
	var n int
	for _, r := range returns {
		if r.LessThan(riskFree) {
			d := r.Sub(riskFree)
			variance = variance.Add(d.Mul(d))
			n++
		}
	}
	if n == 0 {
		return decimal.Zero, nil
	}
	downsideStdev := sqrtDec(variance.Div(decimal.NewFromInt(int64(n))))
	if downsideStdev.IsZero() {
		return decimal.Zero, nil
	}
	return excess.Div(downsideStdev).Mul(sqrtDec(decimal.NewFromInt(int64(periodsPerYear)))), nil
}

// MaxDrawdown returns the worst peak-to-trough drawdown in the series,
// as a signed fraction (always <= 0; -0.23 == -23%). peakIdx and
// troughIdx pin down where the drawdown occurred so the handler can
// surface start/end dates.
//
// Equal-to-peak values never produce a drawdown. Empty / one-element
// series return 0 and ErrInsufficientData.
func MaxDrawdown(values []decimal.Decimal) (maxDD decimal.Decimal, peakIdx, troughIdx int, err error) {
	if len(values) < 2 {
		return decimal.Zero, 0, 0, ErrInsufficientData
	}
	peak := values[0]
	peakAt := 0
	worst := decimal.Zero
	worstPeak := 0
	worstTrough := 0
	for i, v := range values {
		if v.GreaterThan(peak) {
			peak = v
			peakAt = i
			continue
		}
		if peak.IsZero() {
			continue
		}
		dd := v.Sub(peak).Div(peak) // signed negative
		if dd.LessThan(worst) {
			worst = dd
			worstPeak = peakAt
			worstTrough = i
		}
	}
	return worst, worstPeak, worstTrough, nil
}

// Volatility returns the annualised stdev of returns as a unitless
// decimal (0.12 == 12%). Empty / one-element series return 0 and
// ErrInsufficientData.
func Volatility(returns []decimal.Decimal, periodsPerYear int) (decimal.Decimal, error) {
	if len(returns) < 2 {
		return decimal.Zero, ErrInsufficientData
	}
	stdev := stdevDec(returns, meanDec(returns))
	return stdev.Mul(sqrtDec(decimal.NewFromInt(int64(periodsPerYear)))), nil
}

// Underwater computes the drawdown-from-running-peak for every point
// in an equity series. The first point's drawdown is always 0;
// every subsequent point is signed negative (<= 0). This is the raw
// series the openapi PortfolioAnalytics.underwater_series wants.
//
// An empty input yields an empty output (not an error — an empty
// chart is a legit empty-state render).
func Underwater(values []decimal.Decimal) []decimal.Decimal {
	out := make([]decimal.Decimal, 0, len(values))
	if len(values) == 0 {
		return out
	}
	peak := values[0]
	for _, v := range values {
		if v.GreaterThan(peak) {
			peak = v
		}
		var dd decimal.Decimal
		if !peak.IsZero() {
			dd = v.Sub(peak).Div(peak)
		}
		out = append(out, dd)
	}
	return out
}

// ---------- internal helpers ----------

func meanDec(xs []decimal.Decimal) decimal.Decimal {
	if len(xs) == 0 {
		return decimal.Zero
	}
	sum := decimal.Zero
	for _, x := range xs {
		sum = sum.Add(x)
	}
	return sum.Div(decimal.NewFromInt(int64(len(xs))))
}

func stdevDec(xs []decimal.Decimal, mean decimal.Decimal) decimal.Decimal {
	if len(xs) < 2 {
		return decimal.Zero
	}
	var variance decimal.Decimal
	for _, x := range xs {
		d := x.Sub(mean)
		variance = variance.Add(d.Mul(d))
	}
	// Sample stdev uses (n-1); annualisation cares about the scale,
	// not the bias, but sample-stdev is the industry default for
	// ratios like Sharpe.
	variance = variance.Div(decimal.NewFromInt(int64(len(xs) - 1)))
	return sqrtDec(variance)
}

// sqrtDec implements square root via float64 — shopspring/decimal has
// no native sqrt, and the quant metrics we emit display at ~6
// significant digits client-side, so a trip through float is within
// tolerance. Negative or zero inputs return zero.
func sqrtDec(x decimal.Decimal) decimal.Decimal {
	f, _ := x.Float64()
	if f <= 0 {
		return decimal.Zero
	}
	return decimal.NewFromFloat(math.Sqrt(f))
}
