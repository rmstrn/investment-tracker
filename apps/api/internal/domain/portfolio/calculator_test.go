package portfolio_test

import (
	"testing"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/portfolio"
)

func d(s string) decimal.Decimal { return decimal.RequireFromString(s) }
func n(s string) decimal.NullDecimal {
	return decimal.NewNullDecimal(decimal.RequireFromString(s))
}

func newPos(symbol, currency, qty, avgCost string) portfolio.Position {
	return portfolio.Position{
		ID:        uuid.Must(uuid.NewV7()),
		AccountID: uuid.Must(uuid.NewV7()),
		Symbol:    symbol,
		AssetType: "stock",
		Quantity:  d(qty),
		AvgCost:   n(avgCost),
		Currency:  currency,
	}
}

func TestCalculate_SingleCurrencySimpleGain(t *testing.T) {
	positions := []portfolio.Position{
		newPos("AAPL", "USD", "10", "100.00"),
	}
	prices := map[portfolio.PriceKey]decimal.Decimal{
		{Symbol: "AAPL", AssetType: "stock", Currency: "USD"}: d("120.00"),
	}
	fx := map[portfolio.FXKey]decimal.Decimal{}

	snap, err := portfolio.CalculateSnapshot(positions, prices, fx, "USD", "USD")
	if err != nil {
		t.Fatalf("calc: %v", err)
	}
	if !snap.TotalValueBase.Equal(d("1200")) {
		t.Fatalf("total_value = %s, want 1200", snap.TotalValueBase)
	}
	if !snap.TotalCostBase.Equal(d("1000")) {
		t.Fatalf("total_cost = %s, want 1000", snap.TotalCostBase)
	}
	if !snap.TotalPnLBase.Equal(d("200")) {
		t.Fatalf("pnl_absolute = %s, want 200", snap.TotalPnLBase)
	}
	if !snap.TotalPnLPercent.Equal(d("0.2")) {
		t.Fatalf("pnl_percent = %s, want 0.2", snap.TotalPnLPercent)
	}
}

func TestCalculate_MultiCurrencyFXConversion(t *testing.T) {
	positions := []portfolio.Position{
		newPos("AAPL", "USD", "10", "100"), // $1000 @ $120 → $1200
		newPos("BMW.DE", "EUR", "5", "80"), // €400 cost @ €100 → €500
	}
	prices := map[portfolio.PriceKey]decimal.Decimal{
		{Symbol: "AAPL", AssetType: "stock", Currency: "USD"}:   d("120"),
		{Symbol: "BMW.DE", AssetType: "stock", Currency: "EUR"}: d("100"),
	}
	fx := map[portfolio.FXKey]decimal.Decimal{
		{Base: "EUR", Quote: "USD"}: d("1.10"), // 1 EUR = 1.10 USD
	}

	snap, err := portfolio.CalculateSnapshot(positions, prices, fx, "USD", "USD")
	if err != nil {
		t.Fatalf("calc: %v", err)
	}
	// USD leg: $1200, EUR leg value $550 (500 * 1.10). Total $1750.
	if !snap.TotalValueBase.Equal(d("1750")) {
		t.Fatalf("total_value_base = %s, want 1750", snap.TotalValueBase)
	}
	// Costs: $1000 + 400 EUR * 1.10 = $1000 + $440 = $1440.
	if !snap.TotalCostBase.Equal(d("1440")) {
		t.Fatalf("total_cost_base = %s, want 1440", snap.TotalCostBase)
	}
}

func TestCalculate_InverseFXRateFallback(t *testing.T) {
	// Only USD→EUR is in the map; the calculator must invert when we ask
	// for EUR→USD.
	positions := []portfolio.Position{newPos("BMW.DE", "EUR", "5", "80")}
	prices := map[portfolio.PriceKey]decimal.Decimal{
		{Symbol: "BMW.DE", AssetType: "stock", Currency: "EUR"}: d("100"),
	}
	fx := map[portfolio.FXKey]decimal.Decimal{
		{Base: "USD", Quote: "EUR"}: d("0.90"), // 1 USD = 0.90 EUR
	}

	snap, err := portfolio.CalculateSnapshot(positions, prices, fx, "USD", "USD")
	if err != nil {
		t.Fatalf("calc: %v", err)
	}
	// Value in EUR: 500. Inverse of 0.90 is 1/0.9 ≈ 1.111… per EUR.
	// 500 * 1.1111... ≈ 555.555...
	got := snap.TotalValueBase.StringFixed(4)
	if got != "555.5556" {
		t.Fatalf("total_value_base = %s, want ≈ 555.5556", got)
	}
}

func TestCalculate_MissingFXRateFails(t *testing.T) {
	positions := []portfolio.Position{newPos("BMW.DE", "EUR", "5", "80")}
	prices := map[portfolio.PriceKey]decimal.Decimal{
		{Symbol: "BMW.DE", AssetType: "stock", Currency: "EUR"}: d("100"),
	}
	fx := map[portfolio.FXKey]decimal.Decimal{} // no EUR→USD

	_, err := portfolio.CalculateSnapshot(positions, prices, fx, "USD", "USD")
	if err == nil {
		t.Fatal("expected error for missing FX rate, got nil")
	}
}

func TestCalculate_MissingPriceSkippedAndFlaggedPartial(t *testing.T) {
	// Mixed bag: one priceable symbol + one unpriceable. The unpriceable
	// one is skipped from the totals entirely and surfaces via
	// UnresolvedSymbols + Partial=true. Design: P&L stays meaningful for
	// the priced legs; callers render a "partial data" notice.
	positions := []portfolio.Position{
		newPos("AAPL", "USD", "10", "100"),       // priceable
		newPos("UNOBTANIUM", "USD", "10", "100"), // unpriceable
	}
	prices := map[portfolio.PriceKey]decimal.Decimal{
		{Symbol: "AAPL", AssetType: "stock", Currency: "USD"}: d("120"),
	}
	fx := map[portfolio.FXKey]decimal.Decimal{}

	snap, err := portfolio.CalculateSnapshot(positions, prices, fx, "USD", "USD")
	if err != nil {
		t.Fatalf("calc: %v", err)
	}
	if !snap.Partial {
		t.Fatalf("Partial = false, want true")
	}
	if len(snap.UnresolvedSymbols) != 1 || snap.UnresolvedSymbols[0] != "UNOBTANIUM" {
		t.Fatalf("UnresolvedSymbols = %v, want [UNOBTANIUM]", snap.UnresolvedSymbols)
	}
	if len(snap.Positions) != 1 || snap.Positions[0].Symbol != "AAPL" {
		t.Fatalf("Positions should only contain AAPL; got %v", snap.Positions)
	}
	// Totals reflect only the priced leg — 10 * 120 = 1200.
	if !snap.TotalValueBase.Equal(d("1200")) {
		t.Fatalf("value = %s, want 1200 (unresolved excluded)", snap.TotalValueBase)
	}
	if !snap.TotalCostBase.Equal(d("1000")) {
		t.Fatalf("cost = %s, want 1000 (unresolved excluded)", snap.TotalCostBase)
	}
	if !snap.TotalPnLBase.Equal(d("200")) {
		t.Fatalf("pnl = %s, want 200", snap.TotalPnLBase)
	}
}

func TestCalculate_AllPricesMissingReturnsEmptySnapshot(t *testing.T) {
	positions := []portfolio.Position{newPos("UNOBTANIUM", "USD", "10", "100")}
	snap, err := portfolio.CalculateSnapshot(positions,
		map[portfolio.PriceKey]decimal.Decimal{},
		map[portfolio.FXKey]decimal.Decimal{}, "USD", "USD")
	if err != nil {
		t.Fatalf("calc: %v", err)
	}
	if !snap.Partial {
		t.Fatal("expected Partial=true when every symbol is unresolved")
	}
	if !snap.TotalValueBase.IsZero() || !snap.TotalCostBase.IsZero() {
		t.Fatalf("totals must be zero when no positions are priced; got value=%s cost=%s",
			snap.TotalValueBase, snap.TotalCostBase)
	}
}

func TestCalculate_ZeroQuantitySkipped(t *testing.T) {
	positions := []portfolio.Position{
		newPos("AAPL", "USD", "0", "100"), // closed position
	}
	prices := map[portfolio.PriceKey]decimal.Decimal{
		{Symbol: "AAPL", AssetType: "stock", Currency: "USD"}: d("120"),
	}
	snap, err := portfolio.CalculateSnapshot(positions, prices, map[portfolio.FXKey]decimal.Decimal{}, "USD", "USD")
	if err != nil {
		t.Fatalf("calc: %v", err)
	}
	if len(snap.Positions) != 0 {
		t.Fatalf("zero-quantity position should be skipped, got %d positions", len(snap.Positions))
	}
	if !snap.TotalValueBase.IsZero() {
		t.Fatalf("value = %s, want 0", snap.TotalValueBase)
	}
}

func TestCalculate_UnknownCostBasisGivesZeroPnL(t *testing.T) {
	// AvgCost NULL happens for positions imported mid-life (e.g. broker
	// sync with no history). The calculator must not divide by zero.
	positions := []portfolio.Position{{
		ID:        uuid.Must(uuid.NewV7()),
		AccountID: uuid.Must(uuid.NewV7()),
		Symbol:    "AAPL",
		AssetType: "stock",
		Quantity:  d("10"),
		AvgCost:   decimal.NullDecimal{}, // NULL
		Currency:  "USD",
	}}
	prices := map[portfolio.PriceKey]decimal.Decimal{
		{Symbol: "AAPL", AssetType: "stock", Currency: "USD"}: d("120"),
	}

	snap, err := portfolio.CalculateSnapshot(positions, prices, map[portfolio.FXKey]decimal.Decimal{}, "USD", "USD")
	if err != nil {
		t.Fatalf("calc: %v", err)
	}
	if !snap.TotalValueBase.Equal(d("1200")) {
		t.Fatalf("value = %s, want 1200", snap.TotalValueBase)
	}
	if !snap.TotalCostBase.IsZero() {
		t.Fatalf("cost = %s, want 0 for unknown basis", snap.TotalCostBase)
	}
	if !snap.TotalPnLPercent.IsZero() {
		t.Fatalf("pnl%% = %s, want 0 (zero-cost guard)", snap.TotalPnLPercent)
	}
}

func TestCalculate_GroupByFractionsSumToOne(t *testing.T) {
	positions := []portfolio.Position{
		newPos("AAPL", "USD", "10", "100"),
		newPos("BTC", "USD", "1", "30000"),
	}
	prices := map[portfolio.PriceKey]decimal.Decimal{
		{Symbol: "AAPL", AssetType: "stock", Currency: "USD"}: d("150"),
		{Symbol: "BTC", AssetType: "stock", Currency: "USD"}:  d("60000"),
	}
	snap, err := portfolio.CalculateSnapshot(positions, prices, map[portfolio.FXKey]decimal.Decimal{}, "USD", "USD")
	if err != nil {
		t.Fatalf("calc: %v", err)
	}

	sum := decimal.Zero
	for _, v := range snap.BySymbol {
		sum = sum.Add(v)
	}
	if !sum.Equal(decimal.NewFromInt(1)) {
		t.Fatalf("BySymbol fractions sum = %s, want 1.0", sum)
	}
}

func TestCalculate_DisplayCurrencyConversion(t *testing.T) {
	positions := []portfolio.Position{newPos("AAPL", "USD", "10", "100")}
	prices := map[portfolio.PriceKey]decimal.Decimal{
		{Symbol: "AAPL", AssetType: "stock", Currency: "USD"}: d("120"),
	}
	fx := map[portfolio.FXKey]decimal.Decimal{
		{Base: "USD", Quote: "EUR"}: d("0.90"),
	}

	snap, err := portfolio.CalculateSnapshot(positions, prices, fx, "USD", "EUR")
	if err != nil {
		t.Fatalf("calc: %v", err)
	}
	// Base USD $1200 → display EUR: 1200 * 0.90 = 1080.
	if !snap.TotalValueDisplay.Equal(d("1080")) {
		t.Fatalf("total_value_display = %s, want 1080", snap.TotalValueDisplay)
	}
}
