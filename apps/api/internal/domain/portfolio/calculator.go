// Package portfolio contains the core portfolio-valuation maths.
//
// The calculator is a pure function: given positions, prices, and FX rates
// it produces a snapshot with values, P&L, and group-by breakdowns. The
// HTTP / DB / cache plumbing lives in handlers; keeping this package pure
// makes it trivial to unit-test across currencies, missing prices, and
// missing FX rates.
package portfolio

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

// Position is the minimal shape the calculator needs. Mirrors dbgen.Position
// without leaking pgtype into the domain API.
type Position struct {
	ID        uuid.UUID
	AccountID uuid.UUID
	Symbol    string
	AssetType string              // "stock" | "etf" | "crypto"
	Quantity  decimal.Decimal     // can be negative (shorts) — handled as-is
	AvgCost   decimal.NullDecimal // NULL when cost basis unknown
	Currency  string              // native currency of the holding
}

// PriceKey identifies a price quote.
type PriceKey struct {
	Symbol    string
	AssetType string
	Currency  string
}

// FXKey identifies an exchange rate. Rates are interpreted as "1 Base = rate Quote".
type FXKey struct {
	Base  string
	Quote string
}

// EnrichedPosition is a Position plus its computed valuation.
type EnrichedPosition struct {
	Position
	CurrentPrice      decimal.Decimal
	ValueNative       decimal.Decimal // qty * price, in Position.Currency
	ValueBase         decimal.Decimal // native → base via FX
	ValueDisplay      decimal.Decimal // native → display via FX
	CostBase          decimal.Decimal // avg_cost * qty, then FX → base
	PnLAbsoluteBase   decimal.Decimal // value_base - cost_base (zero when AvgCost is NULL)
	PnLPercent        decimal.Decimal // pnl / cost, as fraction (0.12 == 12%)
	PriceResolved     bool            // false if we fell back to zero for an unknown price
	CostBasisResolved bool            // false if AvgCost was NULL
}

// Snapshot is what CalculateSnapshot returns.
type Snapshot struct {
	BaseCurrency      string
	DisplayCurrency   string
	TotalValueBase    decimal.Decimal
	TotalCostBase     decimal.Decimal
	TotalPnLBase      decimal.Decimal
	TotalPnLPercent   decimal.Decimal
	TotalValueDisplay decimal.Decimal

	ByAssetType map[string]decimal.Decimal // fraction of total_value, 0..1
	BySymbol    map[string]decimal.Decimal
	ByCurrency  map[string]decimal.Decimal

	Positions  []EnrichedPosition
	ComputedAt time.Time

	// UnresolvedSymbols lists positions for which no price was available.
	// These positions are excluded from the totals (skipped, not valued
	// at zero) so P&L stays meaningful for the priced legs. Callers
	// MUST surface this list to the user as a "partial" warning.
	UnresolvedSymbols []string

	// Partial is true whenever UnresolvedSymbols is non-empty. Kept as a
	// scalar for ergonomic handler-side checks.
	Partial bool
}

// CalculateSnapshot values a set of positions and produces a snapshot.
//
//   - prices: map keyed by (symbol, asset_type, currency)
//   - fx: map keyed by (base, quote). The identity rate (USD→USD) does
//     not need to be supplied; it is synthesised as 1.0.
//   - baseCurrency: the canonical reporting currency stored on
//     portfolio_snapshots (USD today).
//   - displayCurrency: user preference; totals are also returned in
//     this currency for convenience.
//
// Missing data is handled gracefully: positions with no price are listed
// under UnresolvedSymbols with a zero valuation, and positions with no
// cost basis have a zero P&L contribution.
func CalculateSnapshot(
	positions []Position,
	prices map[PriceKey]decimal.Decimal,
	fx map[FXKey]decimal.Decimal,
	baseCurrency string,
	displayCurrency string,
) (*Snapshot, error) {
	if baseCurrency == "" {
		return nil, errors.New("portfolio: base currency required")
	}
	if displayCurrency == "" {
		displayCurrency = baseCurrency
	}
	baseCurrency = strings.ToUpper(baseCurrency)
	displayCurrency = strings.ToUpper(displayCurrency)

	snap := &Snapshot{
		BaseCurrency:    baseCurrency,
		DisplayCurrency: displayCurrency,
		ByAssetType:     map[string]decimal.Decimal{},
		BySymbol:        map[string]decimal.Decimal{},
		ByCurrency:      map[string]decimal.Decimal{},
		Positions:       make([]EnrichedPosition, 0, len(positions)),
		ComputedAt:      time.Now().UTC(),
	}

	totalValueBase := decimal.Zero
	totalCostBase := decimal.Zero

	for _, p := range positions {
		if p.Quantity.IsZero() {
			continue
		}
		nativeCur := strings.ToUpper(p.Currency)
		priceKey := PriceKey{Symbol: p.Symbol, AssetType: p.AssetType, Currency: nativeCur}

		price, priceOK := prices[priceKey]
		if !priceOK {
			// Skip unpriceable positions from totals to keep P&L meaningful.
			// Caller reads UnresolvedSymbols / Partial to surface a warning.
			snap.UnresolvedSymbols = append(snap.UnresolvedSymbols, p.Symbol)
			continue
		}

		ep := EnrichedPosition{Position: p, CurrentPrice: price, PriceResolved: true}
		ep.ValueNative = price.Mul(p.Quantity)

		fxBase, err := resolveFX(fx, nativeCur, baseCurrency)
		if err != nil {
			return nil, fmt.Errorf("portfolio: fx %s→%s: %w", nativeCur, baseCurrency, err)
		}
		fxDisplay, err := resolveFX(fx, nativeCur, displayCurrency)
		if err != nil {
			return nil, fmt.Errorf("portfolio: fx %s→%s: %w", nativeCur, displayCurrency, err)
		}

		ep.ValueBase = ep.ValueNative.Mul(fxBase)
		ep.ValueDisplay = ep.ValueNative.Mul(fxDisplay)

		if p.AvgCost.Valid {
			ep.CostBasisResolved = true
			costNative := p.AvgCost.Decimal.Mul(p.Quantity)
			ep.CostBase = costNative.Mul(fxBase)
			ep.PnLAbsoluteBase = ep.ValueBase.Sub(ep.CostBase)
			if !ep.CostBase.IsZero() {
				ep.PnLPercent = ep.PnLAbsoluteBase.Div(ep.CostBase)
			}
		}

		totalValueBase = totalValueBase.Add(ep.ValueBase)
		totalCostBase = totalCostBase.Add(ep.CostBase)

		// Group-by aggregations (dollar amounts; converted to fractions below).
		snap.ByAssetType[p.AssetType] = snap.ByAssetType[p.AssetType].Add(ep.ValueBase)
		snap.BySymbol[p.Symbol] = snap.BySymbol[p.Symbol].Add(ep.ValueBase)
		snap.ByCurrency[nativeCur] = snap.ByCurrency[nativeCur].Add(ep.ValueBase)

		snap.Positions = append(snap.Positions, ep)
	}

	snap.Partial = len(snap.UnresolvedSymbols) > 0

	snap.TotalValueBase = totalValueBase
	snap.TotalCostBase = totalCostBase
	snap.TotalPnLBase = totalValueBase.Sub(totalCostBase)
	if !totalCostBase.IsZero() {
		snap.TotalPnLPercent = snap.TotalPnLBase.Div(totalCostBase)
	}

	// Convert the group-by dollar amounts to fractions of total value.
	if !totalValueBase.IsZero() {
		for k, v := range snap.ByAssetType {
			snap.ByAssetType[k] = v.Div(totalValueBase)
		}
		for k, v := range snap.BySymbol {
			snap.BySymbol[k] = v.Div(totalValueBase)
		}
		for k, v := range snap.ByCurrency {
			snap.ByCurrency[k] = v.Div(totalValueBase)
		}
	}

	// Display-currency total: avoid a second pass if base == display.
	if displayCurrency == baseCurrency {
		snap.TotalValueDisplay = totalValueBase
	} else {
		rate, err := resolveFX(fx, baseCurrency, displayCurrency)
		if err != nil {
			return nil, fmt.Errorf("portfolio: fx %s→%s: %w", baseCurrency, displayCurrency, err)
		}
		snap.TotalValueDisplay = totalValueBase.Mul(rate)
	}

	return snap, nil
}

// resolveFX returns the rate that turns 1 base into `quote` units. Identity
// (base == quote) is always 1.0 without consulting the map. The inverse
// rate is tried as a fallback — this matters for sparse fx_rates tables
// that store only one direction.
func resolveFX(fx map[FXKey]decimal.Decimal, base, quote string) (decimal.Decimal, error) {
	if base == quote {
		return decimal.NewFromInt(1), nil
	}
	if r, ok := fx[FXKey{Base: base, Quote: quote}]; ok {
		return r, nil
	}
	if r, ok := fx[FXKey{Base: quote, Quote: base}]; ok && !r.IsZero() {
		return decimal.NewFromInt(1).Div(r), nil
	}
	return decimal.Zero, fmt.Errorf("missing fx rate %s→%s", base, quote)
}
