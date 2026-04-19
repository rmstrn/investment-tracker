// Package tax implements the pure-function tax-report builder backing
// GET /portfolio/tax. Given a chronologically-ordered slice of
// Transaction inputs plus a target jurisdiction and year, it returns
// a Report whose shape the handler maps directly onto openapi
// TaxReport.
//
// Cost-basis method is FIFO today; the handler exposes no `method`
// query parameter (openapi spec does not define one — TD-034 tracks
// a future cost-basis picker UI + the tax_lots table that
// SpecificID would need). LIFO is supported internally for
// completeness.
//
// Withholding is always zero from this package — the transactions
// schema has no per-row withholding_amount column (TD-031). The
// handler masks the field to null in the response and sets
// X-Withholding-Unavailable: true so clients know to ignore the
// zero.
package tax

import (
	"errors"
	"sort"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

// Sentinel errors — handlers map these to well-known codes.
var (
	ErrUnsupportedJurisdiction = errors.New("tax: unsupported jurisdiction")
	ErrUnsupportedMethod       = errors.New("tax: unsupported cost-basis method")
)

// Jurisdiction values currently implemented. Additions land in
// estimatedTaxableIncome's switch and an enum update here.
type Jurisdiction string

const (
	JurisdictionUS Jurisdiction = "US"
	JurisdictionDE Jurisdiction = "DE"
)

// Method is the cost-basis picker. FIFO is the industry default;
// LIFO is accepted but has no external surface today.
type Method string

const (
	FIFO Method = "fifo"
	LIFO Method = "lifo"
)

// Transaction is the package-internal shape for a ledger row. The
// handler converts sqlc rows into this struct so the pure pkg stays
// DB-agnostic and unit-testable.
type Transaction struct {
	ID              uuid.UUID
	Symbol          string
	TransactionType string // buy, sell, dividend, split, transfer_in, transfer_out, fee
	Quantity        decimal.Decimal
	Price           decimal.Decimal
	Fee             decimal.Decimal
	Currency        string
	ExecutedAt      time.Time
}

// ReportTx is one row in the per-transaction breakdown of a report.
// Mirrors openapi TaxTransaction.
type ReportTx struct {
	TransactionID     uuid.UUID
	ExecutedAt        time.Time
	Symbol            string
	Kind              string // realized_gain, realized_loss, dividend, withholding, other
	Amount            decimal.Decimal
	Currency          string
	HoldingPeriodDays *int
}

// Report is the FIFO/LIFO-matched rollup. The handler projects this
// directly into the openapi TaxReport schema.
type Report struct {
	Jurisdiction           Jurisdiction
	Year                   int
	RealizedGains          decimal.Decimal
	RealizedLosses         decimal.Decimal // absolute value, positive
	DividendsReceived      decimal.Decimal
	WithholdingTax         decimal.Decimal // always zero today (TD-031); handler masks to null
	EstimatedTaxableIncome decimal.Decimal
	Transactions           []ReportTx
}

// Supported reports whether this jurisdiction has dedicated
// estimated_taxable_income rules. Handlers use this to emit the
// 400 JURISDICTION_NOT_SUPPORTED response before running the
// compute path.
func Supported(j Jurisdiction) bool {
	switch j {
	case JurisdictionUS, JurisdictionDE:
		return true
	}
	return false
}

// SupportedJurisdictions returns the list exposed in the 400-error
// body so clients can render a "pick from these" prompt.
func SupportedJurisdictions() []string {
	return []string{string(JurisdictionUS), string(JurisdictionDE)}
}

// Build runs the FIFO/LIFO matcher and assembles a Report for the
// target year. Pre-year transactions are processed to establish the
// open-lot state but never appear in Report.Transactions.
//
// txs does not need to be pre-sorted — Build sorts a copy
// chronologically so callers do not have to care.
func Build(txs []Transaction, jurisdiction Jurisdiction, year int, method Method) (*Report, error) {
	if !Supported(jurisdiction) {
		return nil, ErrUnsupportedJurisdiction
	}
	if method != FIFO && method != LIFO {
		return nil, ErrUnsupportedMethod
	}

	sorted := make([]Transaction, len(txs))
	copy(sorted, txs)
	sort.SliceStable(sorted, func(i, j int) bool {
		return sorted[i].ExecutedAt.Before(sorted[j].ExecutedAt)
	})

	lots := map[string][]lot{}
	report := &Report{
		Jurisdiction: jurisdiction,
		Year:         year,
		Transactions: []ReportTx{},
	}
	reportCurrency := ""

	for _, t := range sorted {
		if reportCurrency == "" {
			reportCurrency = t.Currency
		}
		inYear := t.ExecutedAt.UTC().Year() == year

		switch t.TransactionType {
		case "buy", "transfer_in":
			// Add a lot. Fee is folded into cost basis so the realised
			// gain on the sell side already accounts for it.
			costPerUnit := t.Price
			if !t.Quantity.IsZero() {
				costPerUnit = t.Price.Add(t.Fee.Div(t.Quantity))
			}
			lots[t.Symbol] = append(lots[t.Symbol], lot{
				Quantity:    t.Quantity,
				CostPerUnit: costPerUnit,
				AcquiredAt:  t.ExecutedAt,
			})
		case "sell", "transfer_out":
			realised, holdingDays := matchAgainstLots(lots, t, method)
			if inYear {
				rows := toReportRows(t, realised, holdingDays, reportCurrency)
				report.Transactions = append(report.Transactions, rows...)
				for _, row := range rows {
					if row.Kind == "realized_gain" {
						report.RealizedGains = report.RealizedGains.Add(row.Amount)
					}
					if row.Kind == "realized_loss" {
						report.RealizedLosses = report.RealizedLosses.Add(row.Amount.Abs())
					}
				}
			}
		case "dividend":
			if !inYear {
				continue
			}
			amount := t.Quantity.Mul(t.Price) // dividend rows store amount-per-share in `price`
			report.DividendsReceived = report.DividendsReceived.Add(amount)
			report.Transactions = append(report.Transactions, ReportTx{
				TransactionID: t.ID,
				ExecutedAt:    t.ExecutedAt,
				Symbol:        t.Symbol,
				Kind:          "dividend",
				Amount:        amount,
				Currency:      t.Currency,
			})
		default:
			// split / fee / anything unknown — ignored for tax purposes.
		}
	}

	report.EstimatedTaxableIncome = estimatedTaxableIncome(jurisdiction, report)
	return report, nil
}

// ---------- internals ----------

type lot struct {
	Quantity    decimal.Decimal
	CostPerUnit decimal.Decimal
	AcquiredAt  time.Time
}

// matchAgainstLots pops lots off the head (FIFO) or tail (LIFO) of the
// per-symbol queue until the sell quantity is filled. Returns the
// per-match realisations so the caller can classify each as
// gain/loss and annotate holding period.
func matchAgainstLots(lots map[string][]lot, sell Transaction, method Method) (realised []match, holdingDays []int) {
	remaining := sell.Quantity
	for remaining.IsPositive() && len(lots[sell.Symbol]) > 0 {
		var (
			head lot
			idx  int
			pop  func()
		)
		if method == FIFO {
			idx = 0
		} else {
			idx = len(lots[sell.Symbol]) - 1
		}
		head = lots[sell.Symbol][idx]
		pop = func() {
			ls := lots[sell.Symbol]
			lots[sell.Symbol] = append(ls[:idx], ls[idx+1:]...)
		}

		matchedQty := head.Quantity
		if head.Quantity.GreaterThan(remaining) {
			matchedQty = remaining
		}

		// Proportional sell-side fee so the matched slice carries its
		// share of costs on both sides.
		var sellFeeAlloc decimal.Decimal
		if !sell.Quantity.IsZero() {
			sellFeeAlloc = sell.Fee.Mul(matchedQty).Div(sell.Quantity)
		}
		proceeds := sell.Price.Mul(matchedQty).Sub(sellFeeAlloc)
		cost := head.CostPerUnit.Mul(matchedQty)
		pnl := proceeds.Sub(cost)

		days := int(sell.ExecutedAt.Sub(head.AcquiredAt).Hours() / 24)
		realised = append(realised, match{
			Qty:      matchedQty,
			PnL:      pnl,
			Currency: sell.Currency,
			Symbol:   sell.Symbol,
		})
		holdingDays = append(holdingDays, days)

		if head.Quantity.GreaterThan(remaining) {
			// Partial consumption — shrink the lot in place.
			newHead := head
			newHead.Quantity = head.Quantity.Sub(remaining)
			lots[sell.Symbol][idx] = newHead
			remaining = decimal.Zero
		} else {
			remaining = remaining.Sub(head.Quantity)
			pop()
		}
	}
	// remaining > 0 means the user sold more than they held on record
	// (short sale or data hole). MVP: treat the uncovered portion as
	// a zero-cost gain so the report still balances and a warning is
	// the UI's problem (TD-037 — short-sale handling when margin
	// trading lands).
	if remaining.IsPositive() {
		var sellFeeAlloc decimal.Decimal
		if !sell.Quantity.IsZero() {
			sellFeeAlloc = sell.Fee.Mul(remaining).Div(sell.Quantity)
		}
		pnl := sell.Price.Mul(remaining).Sub(sellFeeAlloc)
		realised = append(realised, match{
			Qty:      remaining,
			PnL:      pnl,
			Currency: sell.Currency,
			Symbol:   sell.Symbol,
		})
		holdingDays = append(holdingDays, 0)
	}
	return realised, holdingDays
}

type match struct {
	Qty      decimal.Decimal
	PnL      decimal.Decimal
	Currency string
	Symbol   string
}

func toReportRows(sell Transaction, realised []match, days []int, _ string) []ReportTx {
	out := make([]ReportTx, 0, len(realised))
	for i, m := range realised {
		kind := "realized_gain"
		if m.PnL.IsNegative() {
			kind = "realized_loss"
		}
		d := days[i]
		out = append(out, ReportTx{
			TransactionID:     sell.ID,
			ExecutedAt:        sell.ExecutedAt,
			Symbol:            m.Symbol,
			Kind:              kind,
			Amount:            m.PnL,
			Currency:          m.Currency,
			HoldingPeriodDays: &d,
		})
	}
	return out
}

// estimatedTaxableIncome is the minimal jurisdiction dispatch. These
// are MVP approximations — a licensed tax advisor is the canonical
// source. TD-036 tracks the full rule-set incl. wash-sale, long/short
// bracket split, couple-filing thresholds.
func estimatedTaxableIncome(j Jurisdiction, r *Report) decimal.Decimal {
	net := r.RealizedGains.Sub(r.RealizedLosses)
	switch j {
	case JurisdictionUS:
		// US: simplified net capital gains. Short/long split + wash-sale
		// → TD-036.
		return net
	case JurisdictionDE:
		// DE: Sparer-Pauschbetrag 1000 EUR single allowance applied to
		// net capital income. Couples (2000) → TD-036.
		allowance := decimal.NewFromInt(1000)
		taxable := net.Sub(allowance)
		if taxable.IsNegative() {
			return decimal.Zero
		}
		return taxable
	}
	return net
}
