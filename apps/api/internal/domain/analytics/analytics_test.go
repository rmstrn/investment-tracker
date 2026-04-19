package analytics

import (
	"testing"

	"github.com/shopspring/decimal"
)

// returnsFromStrings is test sugar so table-driven cases stay
// readable; shopspring/decimal's RequireFromString handles the
// conversion.
func returnsFromStrings(t *testing.T, ss ...string) []decimal.Decimal {
	t.Helper()
	out := make([]decimal.Decimal, len(ss))
	for i, s := range ss {
		out[i] = decimal.RequireFromString(s)
	}
	return out
}

func TestSharpe_InsufficientData(t *testing.T) {
	for _, n := range [][]string{nil, {"0.01"}} {
		_, err := Sharpe(returnsFromStrings(t, n...), decimal.Zero, 252)
		if err != ErrInsufficientData {
			t.Fatalf("n=%d: err = %v, want ErrInsufficientData", len(n), err)
		}
	}
}

func TestSharpe_ZeroVariance_ReturnsZero(t *testing.T) {
	// Constant returns → stdev = 0 → Sharpe undefined → handler returns 0.
	rs := returnsFromStrings(t, "0.01", "0.01", "0.01", "0.01")
	s, err := Sharpe(rs, decimal.Zero, 252)
	if err != nil {
		t.Fatalf("err = %v", err)
	}
	if !s.IsZero() {
		t.Fatalf("sharpe on constant returns = %v, want 0", s)
	}
}

func TestSharpe_PositiveOnUpDrift(t *testing.T) {
	// Returns tilted upward → Sharpe must be positive.
	rs := returnsFromStrings(t, "0.01", "0.02", "0.015", "0.03", "0.018")
	s, err := Sharpe(rs, decimal.Zero, 252)
	if err != nil {
		t.Fatalf("err = %v", err)
	}
	if !s.IsPositive() {
		t.Fatalf("sharpe = %v, want positive", s)
	}
}

func TestSortino_NoDownsideSample_ReturnsZero(t *testing.T) {
	// All returns >= riskFree → no downside → 0 fallback (not +inf).
	rs := returnsFromStrings(t, "0.01", "0.02", "0.03")
	s, err := Sortino(rs, decimal.Zero, 252)
	if err != nil {
		t.Fatalf("err = %v", err)
	}
	if !s.IsZero() {
		t.Fatalf("sortino = %v, want 0 when no downside", s)
	}
}

func TestSortino_WithDownside_IsFinitePositive(t *testing.T) {
	rs := returnsFromStrings(t, "0.05", "-0.02", "0.03", "-0.01", "0.04")
	s, err := Sortino(rs, decimal.Zero, 252)
	if err != nil {
		t.Fatalf("err = %v", err)
	}
	if !s.IsPositive() {
		t.Fatalf("sortino = %v, want positive", s)
	}
}

func TestMaxDrawdown_MonotonicDecline(t *testing.T) {
	// Monotonic decline from 100 → 50 → -50% drawdown, peak at idx 0.
	values := returnsFromStrings(t, "100", "90", "80", "70", "60", "50")
	dd, peak, trough, err := MaxDrawdown(values)
	if err != nil {
		t.Fatalf("err = %v", err)
	}
	if peak != 0 || trough != 5 {
		t.Fatalf("peak/trough = %d/%d, want 0/5", peak, trough)
	}
	// Full 50% drawdown, signed negative.
	want := decimal.RequireFromString("-0.5")
	if !dd.Equal(want) {
		t.Fatalf("dd = %v, want %v", dd, want)
	}
}

func TestMaxDrawdown_RecoversThenDropsAgain(t *testing.T) {
	// Peaks at index 3 (120), then drops to 90 by index 5 — worst DD
	// originates from the new peak, not index 0.
	values := returnsFromStrings(t, "100", "105", "110", "120", "100", "90")
	dd, peak, trough, err := MaxDrawdown(values)
	if err != nil {
		t.Fatalf("err = %v", err)
	}
	if peak != 3 {
		t.Fatalf("peak = %d, want 3 (new peak)", peak)
	}
	if trough != 5 {
		t.Fatalf("trough = %d, want 5", trough)
	}
	// 120 → 90 = -25%.
	want := decimal.RequireFromString("-0.25")
	if !dd.Equal(want) {
		t.Fatalf("dd = %v, want %v", dd, want)
	}
}

func TestMaxDrawdown_NoDrop_ReturnsZero(t *testing.T) {
	values := returnsFromStrings(t, "100", "110", "120")
	dd, _, _, err := MaxDrawdown(values)
	if err != nil {
		t.Fatalf("err = %v", err)
	}
	if !dd.IsZero() {
		t.Fatalf("dd = %v, want 0", dd)
	}
}

func TestMaxDrawdown_InsufficientData(t *testing.T) {
	for _, n := range [][]string{nil, {"100"}} {
		_, _, _, err := MaxDrawdown(returnsFromStrings(t, n...))
		if err != ErrInsufficientData {
			t.Fatalf("n=%d: err = %v, want ErrInsufficientData", len(n), err)
		}
	}
}

func TestVolatility_ConstantReturns_Zero(t *testing.T) {
	rs := returnsFromStrings(t, "0.01", "0.01", "0.01")
	v, err := Volatility(rs, 252)
	if err != nil {
		t.Fatalf("err = %v", err)
	}
	if !v.IsZero() {
		t.Fatalf("vol = %v, want 0 on constant returns", v)
	}
}

func TestVolatility_PositiveOnVariance(t *testing.T) {
	rs := returnsFromStrings(t, "0.02", "-0.01", "0.03", "-0.02", "0.01")
	v, err := Volatility(rs, 252)
	if err != nil {
		t.Fatalf("err = %v", err)
	}
	if !v.IsPositive() {
		t.Fatalf("vol = %v, want positive", v)
	}
}

func TestUnderwater_SpotCheck(t *testing.T) {
	// Values: 100, 110 (new peak), 99 (-10% underwater), 110 (back to peak),
	// 121 (new peak). Expected: [0, 0, -0.10, 0, 0].
	values := returnsFromStrings(t, "100", "110", "99", "110", "121")
	uw := Underwater(values)
	if len(uw) != 5 {
		t.Fatalf("len = %d, want 5", len(uw))
	}
	if !uw[0].IsZero() || !uw[1].IsZero() || !uw[3].IsZero() || !uw[4].IsZero() {
		t.Fatalf("peak-points should be 0: %v", uw)
	}
	want := decimal.RequireFromString("-0.1")
	if !uw[2].Equal(want) {
		t.Fatalf("uw[2] = %v, want %v", uw[2], want)
	}
}

func TestUnderwater_Empty_ReturnsEmpty(t *testing.T) {
	if got := Underwater(nil); len(got) != 0 {
		t.Fatalf("nil input → len = %d, want 0", len(got))
	}
}
