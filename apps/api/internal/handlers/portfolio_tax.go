package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/tax"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/tiers"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// GetPortfolioTax returns a FIFO-computed tax report for one
// (jurisdiction, year) tuple per openapi TaxReport. Pro-only.
// Cost-basis method is FIFO hardcoded (TD-034 tracks cost-basis
// picker UI + tax_lots migration for SpecificID).
//
// withholding_tax always comes back as null until per-transaction
// withholding lands in the schema (TD-031); the
// X-Withholding-Unavailable header signals the scope-cut.
//
// Unsupported jurisdiction → 400 JURISDICTION_NOT_SUPPORTED with a
// `supported_jurisdictions` details array the UI can render as a
// picker prompt.
func GetPortfolioTax(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		jurisdictionRaw := c.Query("jurisdiction")
		if jurisdictionRaw == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "jurisdiction is required"))
		}

		yearRaw := c.Query("year")
		if yearRaw == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "year is required"))
		}
		year, convErr := strconv.Atoi(yearRaw)
		if convErr != nil || year < 2000 || year > 2100 {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "year must be an integer between 2000 and 2100"))
		}

		j := tax.Jurisdiction(jurisdictionRaw)
		if !tax.Supported(j) {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "JURISDICTION_NOT_SUPPORTED",
					"jurisdiction "+jurisdictionRaw+" not supported yet").
					WithDetails(map[string]any{
						"supported_jurisdictions": tax.SupportedJurisdictions(),
					}))
		}

		if !tiers.For(user.SubscriptionTier).TaxReports {
			return errs.Respond(c, reqID,
				errs.New(http.StatusForbidden, "FEATURE_LOCKED", "Tax reports require Pro"))
		}

		rows, err := dbgen.New(deps.Pool).ListAllTransactionsByUser(ctx, user.ID)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load transactions"))
		}

		txs := toTaxTransactions(rows)
		report, err := tax.Build(txs, j, year, tax.FIFO)
		if err != nil {
			if errors.Is(err, tax.ErrUnsupportedMethod) || errors.Is(err, tax.ErrUnsupportedJurisdiction) {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", err.Error()))
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to build tax report"))
		}

		c.Set("X-Withholding-Unavailable", "true")
		return c.JSON(shapeTaxReport(report, rows))
	}
}

// toTaxTransactions converts dbgen.Transaction rows into the
// DB-agnostic shape the tax pkg wants. Nullable Price (for splits)
// collapses to decimal.Zero — splits are ignored by the matcher
// anyway (no 'split' case in the switch).
func toTaxTransactions(rows []dbgen.Transaction) []tax.Transaction {
	out := make([]tax.Transaction, 0, len(rows))
	for _, r := range rows {
		price := decimal.Zero
		if r.Price.Valid {
			price = r.Price.Decimal
		}
		out = append(out, tax.Transaction{
			ID:              r.ID,
			Symbol:          r.Symbol,
			TransactionType: r.TransactionType,
			Quantity:        r.Quantity,
			Price:           price,
			Fee:             r.Fee,
			Currency:        r.Currency,
			ExecutedAt:      r.ExecutedAt.Time,
		})
	}
	return out
}

// shapeTaxReport projects the pure-pkg Report into the openapi
// TaxReport shape. Top-level monetary fields are openapi `Money` —
// a plain decimal string, NOT a {amount, currency} object — so
// StringFixed(10) is emitted directly. Per-transaction rows do carry
// their own currency string because TaxTransaction.currency is a
// separate field. withholding_tax stays null (TD-031).
func shapeTaxReport(r *tax.Report, _ []dbgen.Transaction) fiber.Map {
	txItems := make([]fiber.Map, 0, len(r.Transactions))
	for _, t := range r.Transactions {
		row := fiber.Map{
			"transaction_id": t.TransactionID.String(),
			"executed_at":    t.ExecutedAt.UTC().Format(time.RFC3339),
			"symbol":         t.Symbol,
			"kind":           t.Kind,
			"amount":         t.Amount.StringFixed(10),
			"currency":       t.Currency,
		}
		if t.HoldingPeriodDays != nil {
			row["holding_period_days"] = *t.HoldingPeriodDays
		} else {
			row["holding_period_days"] = nil
		}
		txItems = append(txItems, row)
	}

	return fiber.Map{
		"jurisdiction":             string(r.Jurisdiction),
		"year":                     r.Year,
		"realized_gains":           r.RealizedGains.StringFixed(10),
		"realized_losses":          r.RealizedLosses.StringFixed(10),
		"dividends_received":       r.DividendsReceived.StringFixed(10),
		"withholding_tax":          nil, // TD-031
		"estimated_taxable_income": r.EstimatedTaxableIncome.StringFixed(10),
		"transactions":             txItems,
	}
}
