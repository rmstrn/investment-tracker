package tax

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

func tx(ts string, kind, symbol, qty, price string) Transaction {
	t, _ := time.Parse("2006-01-02", ts)
	return Transaction{
		ID:              uuid.Must(uuid.NewV7()),
		Symbol:          symbol,
		TransactionType: kind,
		Quantity:        decimal.RequireFromString(qty),
		Price:           decimal.RequireFromString(price),
		Currency:        "USD",
		ExecutedAt:      t,
	}
}

func TestBuild_UnsupportedJurisdiction(t *testing.T) {
	_, err := Build(nil, Jurisdiction("FR"), 2026, FIFO)
	if err != ErrUnsupportedJurisdiction {
		t.Fatalf("err = %v, want ErrUnsupportedJurisdiction", err)
	}
}

func TestBuild_UnsupportedMethod(t *testing.T) {
	_, err := Build(nil, JurisdictionUS, 2026, Method("specific_id"))
	if err != ErrUnsupportedMethod {
		t.Fatalf("err = %v, want ErrUnsupportedMethod", err)
	}
}

func TestBuild_FIFO_SimpleGain(t *testing.T) {
	// Buy 10 @ 100 in 2025-06, sell 10 @ 150 in 2026-03 → gain 500.
	txs := []Transaction{
		tx("2025-06-01", "buy", "AAPL", "10", "100"),
		tx("2026-03-01", "sell", "AAPL", "10", "150"),
	}
	r, err := Build(txs, JurisdictionUS, 2026, FIFO)
	if err != nil {
		t.Fatalf("build: %v", err)
	}
	want := decimal.NewFromInt(500)
	if !r.RealizedGains.Equal(want) {
		t.Fatalf("gains = %v, want 500", r.RealizedGains)
	}
	if !r.RealizedLosses.IsZero() {
		t.Fatalf("losses = %v, want 0", r.RealizedLosses)
	}
	if len(r.Transactions) != 1 {
		t.Fatalf("len(Transactions) = %d, want 1", len(r.Transactions))
	}
	if r.Transactions[0].Kind != "realized_gain" {
		t.Fatalf("kind = %v, want realized_gain", r.Transactions[0].Kind)
	}
	// Holding period: 2025-06-01 → 2026-03-01 = 273 days.
	if *r.Transactions[0].HoldingPeriodDays != 273 {
		t.Fatalf("holding days = %d, want 273", *r.Transactions[0].HoldingPeriodDays)
	}
}

func TestBuild_FIFO_MultipleLots(t *testing.T) {
	// Two buys (different cost), sell spanning both.
	txs := []Transaction{
		tx("2025-01-01", "buy", "AAPL", "10", "100"),
		tx("2025-06-01", "buy", "AAPL", "10", "200"),
		tx("2026-02-01", "sell", "AAPL", "15", "250"),
	}
	r, err := Build(txs, JurisdictionUS, 2026, FIFO)
	if err != nil {
		t.Fatalf("build: %v", err)
	}
	// FIFO: first 10 @ 100 match 10 @ 250 → 1500 gain; next 5 of the
	// 200-lot @ 250 → 5 * (250-200) = 250 gain. Total 1750.
	want := decimal.NewFromInt(1750)
	if !r.RealizedGains.Equal(want) {
		t.Fatalf("gains = %v, want 1750", r.RealizedGains)
	}
	if len(r.Transactions) != 2 {
		t.Fatalf("rows = %d, want 2 (lot-by-lot split)", len(r.Transactions))
	}
}

func TestBuild_LIFO_DifferentPnL_FromFIFO(t *testing.T) {
	txs := []Transaction{
		tx("2025-01-01", "buy", "AAPL", "10", "100"),
		tx("2025-06-01", "buy", "AAPL", "10", "200"),
		tx("2026-02-01", "sell", "AAPL", "10", "250"),
	}
	r, err := Build(txs, JurisdictionUS, 2026, LIFO)
	if err != nil {
		t.Fatalf("build: %v", err)
	}
	// LIFO: newest lot (10 @ 200) matches → 10 * (250-200) = 500.
	want := decimal.NewFromInt(500)
	if !r.RealizedGains.Equal(want) {
		t.Fatalf("LIFO gains = %v, want 500", r.RealizedGains)
	}
}

func TestBuild_RealizedLoss(t *testing.T) {
	txs := []Transaction{
		tx("2025-06-01", "buy", "AAPL", "10", "200"),
		tx("2026-03-01", "sell", "AAPL", "10", "150"),
	}
	r, err := Build(txs, JurisdictionUS, 2026, FIFO)
	if err != nil {
		t.Fatalf("build: %v", err)
	}
	// 10 * (150 - 200) = -500 → realized_losses should carry 500 abs.
	want := decimal.NewFromInt(500)
	if !r.RealizedLosses.Equal(want) {
		t.Fatalf("losses = %v, want 500", r.RealizedLosses)
	}
	if !r.RealizedGains.IsZero() {
		t.Fatalf("gains = %v, want 0", r.RealizedGains)
	}
}

func TestBuild_DividendsAggregated(t *testing.T) {
	txs := []Transaction{
		tx("2025-06-01", "buy", "AAPL", "10", "100"),
		tx("2026-04-01", "dividend", "AAPL", "10", "0.50"), // 5.00 total
		tx("2026-07-01", "dividend", "AAPL", "10", "0.60"), // 6.00 total
		tx("2025-01-01", "dividend", "AAPL", "10", "0.20"), // prior year, ignored
	}
	r, err := Build(txs, JurisdictionUS, 2026, FIFO)
	if err != nil {
		t.Fatalf("build: %v", err)
	}
	want := decimal.RequireFromString("11.0")
	if !r.DividendsReceived.Equal(want) {
		t.Fatalf("dividends = %v, want 11", r.DividendsReceived)
	}
}

func TestBuild_PreYearSellExcluded(t *testing.T) {
	// Sell in 2025 shouldn't appear in a 2026 report.
	txs := []Transaction{
		tx("2024-01-01", "buy", "AAPL", "10", "100"),
		tx("2025-06-01", "sell", "AAPL", "10", "150"),
	}
	r, err := Build(txs, JurisdictionUS, 2026, FIFO)
	if err != nil {
		t.Fatalf("build: %v", err)
	}
	if !r.RealizedGains.IsZero() || !r.RealizedLosses.IsZero() {
		t.Fatalf("pre-year sell leaked into 2026 totals: %+v", r)
	}
	if len(r.Transactions) != 0 {
		t.Fatalf("pre-year sell leaked into transactions: %d rows", len(r.Transactions))
	}
}

func TestBuild_DE_SparerPauschbetrag(t *testing.T) {
	// Gain 1200 on a DE report → taxable = 1200 - 1000 = 200.
	txs := []Transaction{
		tx("2025-06-01", "buy", "SAP.DE", "10", "100"),
		tx("2026-03-01", "sell", "SAP.DE", "10", "220"), // +1200 gain
	}
	r, err := Build(txs, JurisdictionDE, 2026, FIFO)
	if err != nil {
		t.Fatalf("build: %v", err)
	}
	want := decimal.NewFromInt(200)
	if !r.EstimatedTaxableIncome.Equal(want) {
		t.Fatalf("DE taxable = %v, want 200", r.EstimatedTaxableIncome)
	}
}

func TestBuild_DE_AllowanceFloorsAtZero(t *testing.T) {
	// Net gain 500 < 1000 allowance → taxable should be 0, not -500.
	txs := []Transaction{
		tx("2025-06-01", "buy", "SAP.DE", "10", "100"),
		tx("2026-03-01", "sell", "SAP.DE", "10", "150"), // +500
	}
	r, err := Build(txs, JurisdictionDE, 2026, FIFO)
	if err != nil {
		t.Fatalf("build: %v", err)
	}
	if !r.EstimatedTaxableIncome.IsZero() {
		t.Fatalf("DE taxable = %v, want 0 (allowance absorbs)", r.EstimatedTaxableIncome)
	}
}

func TestBuild_US_NetGainsSimple(t *testing.T) {
	txs := []Transaction{
		tx("2025-06-01", "buy", "AAPL", "10", "100"),
		tx("2026-03-01", "sell", "AAPL", "5", "150"), // +250
		tx("2026-04-01", "sell", "AAPL", "5", "80"),  // -100 loss
	}
	r, err := Build(txs, JurisdictionUS, 2026, FIFO)
	if err != nil {
		t.Fatalf("build: %v", err)
	}
	// Gains 250, Losses 100, net 150.
	want := decimal.NewFromInt(150)
	if !r.EstimatedTaxableIncome.Equal(want) {
		t.Fatalf("US taxable = %v, want 150", r.EstimatedTaxableIncome)
	}
}

func TestBuild_UnsortedInputIsSorted(t *testing.T) {
	// Swap buy/sell order — Build should still produce the right result.
	txs := []Transaction{
		tx("2026-03-01", "sell", "AAPL", "10", "150"),
		tx("2025-06-01", "buy", "AAPL", "10", "100"),
	}
	r, err := Build(txs, JurisdictionUS, 2026, FIFO)
	if err != nil {
		t.Fatalf("build: %v", err)
	}
	if !r.RealizedGains.Equal(decimal.NewFromInt(500)) {
		t.Fatalf("gains after reorder = %v, want 500", r.RealizedGains)
	}
}
