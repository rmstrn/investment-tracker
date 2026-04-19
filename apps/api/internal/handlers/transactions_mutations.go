package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/transactions"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// ---------- POST /transactions ----------

// CreateTransaction manually records a transaction. Fingerprint
// deduplication guards against double-submits: if the same
// (account_id, symbol, quantity, price, txtype, minute) already
// exists for this user, the INSERT's ON CONFLICT DO NOTHING returns
// no row → we emit 409 DUPLICATE_TRANSACTION.
//
// source is hardcoded to 'manual' — POSTs from clients never stand
// in for API-synced rows (the sync worker writes those directly).
func CreateTransaction(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		var req struct {
			AccountID       string           `json:"account_id"`
			Symbol          string           `json:"symbol"`
			AssetType       string           `json:"asset_type"`
			TransactionType string           `json:"transaction_type"`
			Quantity        decimal.Decimal  `json:"quantity"`
			Price           *decimal.Decimal `json:"price"`
			Currency        string           `json:"currency"`
			Fee             *decimal.Decimal `json:"fee"`
			ExecutedAt      string           `json:"executed_at"`
			Notes           *string          `json:"notes"`
		}
		if err := json.Unmarshal(c.Body(), &req); err != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid JSON body"))
		}

		accountID, perr := uuid.Parse(strings.TrimSpace(req.AccountID))
		if perr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid account_id"))
		}
		sym := strings.ToUpper(strings.TrimSpace(req.Symbol))
		if sym == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "symbol is required"))
		}
		if _, ok := validAssetTypes[req.AssetType]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "asset_type must be one of stock, etf, crypto"))
		}
		if _, ok := validTransactionTypes[req.TransactionType]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "transaction_type must be one of buy, sell, dividend, split, transfer_in, transfer_out, fee"))
		}
		if req.Currency == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "currency is required"))
		}
		executedAt, tErr := time.Parse(time.RFC3339, req.ExecutedAt)
		if tErr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "executed_at must be RFC3339"))
		}

		// Verify the account belongs to this user. Without this a
		// malicious caller could attach a transaction to someone
		// else's account.
		if _, err := dbgen.New(deps.Pool).GetAccountByID(ctx, dbgen.GetAccountByIDParams{
			ID: accountID, UserID: user.ID,
		}); err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "account_id does not belong to this user"))
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to verify account"))
		}

		price := decimal.NullDecimal{}
		if req.Price != nil {
			price = decimal.NullDecimal{Decimal: *req.Price, Valid: true}
		}
		fee := decimal.Zero
		if req.Fee != nil {
			fee = *req.Fee
		}
		fp := transactions.Fingerprint(accountID, sym, req.Quantity, price, req.TransactionType, executedAt)

		row, err := dbgen.New(deps.Pool).InsertTransaction(ctx, dbgen.InsertTransactionParams{
			ID:              uuid.Must(uuid.NewV7()),
			UserID:          user.ID,
			AccountID:       accountID,
			Symbol:          sym,
			AssetType:       req.AssetType,
			TransactionType: req.TransactionType,
			Quantity:        req.Quantity,
			Price:           price,
			Currency:        strings.ToUpper(req.Currency),
			Fee:             fee,
			ExecutedAt:      pgtype.Timestamptz{Time: executedAt, Valid: true},
			Source:          "manual",
			SourceDetails:   nil,
			Fingerprint:     fp,
			Notes:           req.Notes,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				// ON CONFLICT DO NOTHING returned no row → dup.
				return errs.Respond(c, reqID,
					errs.New(http.StatusConflict, "DUPLICATE_TRANSACTION",
						"a transaction with the same fingerprint already exists"))
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to create transaction"))
		}
		return c.Status(http.StatusCreated).JSON(shapeTransaction(row))
	}
}

// ---------- PATCH /transactions/{id} ----------

// UpdateTransaction edits a manual transaction. Non-manual rows are
// immutable (§15.5) — the handler pre-checks source and returns 403
// so clients get a clear signal instead of a silent no-op.
func UpdateTransaction(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, perr := uuid.Parse(c.Params("id"))
		if perr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid transaction id"))
		}

		q := dbgen.New(deps.Pool)
		current, err := q.GetTransactionByID(ctx, dbgen.GetTransactionByIDParams{ID: id, UserID: user.ID})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load transaction"))
		}
		if current.Source != "manual" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusForbidden, "FORBIDDEN",
					"only manual transactions can be edited"))
		}

		var req struct {
			Quantity   *decimal.Decimal `json:"quantity"`
			Price      *decimal.Decimal `json:"price"`
			Fee        *decimal.Decimal `json:"fee"`
			ExecutedAt *string          `json:"executed_at"`
			Notes      *string          `json:"notes"`
		}
		if err := json.Unmarshal(c.Body(), &req); err != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid JSON body"))
		}

		var executedAt pgtype.Timestamptz
		if req.ExecutedAt != nil {
			t, tErr := time.Parse(time.RFC3339, *req.ExecutedAt)
			if tErr != nil {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "executed_at must be RFC3339"))
			}
			executedAt = pgtype.Timestamptz{Time: t, Valid: true}
		}

		params := dbgen.UpdateManualTransactionParams{
			ID:         id,
			UserID:     user.ID,
			ExecutedAt: executedAt,
			Notes:      req.Notes,
		}
		if req.Quantity != nil {
			params.Quantity = decimal.NullDecimal{Decimal: *req.Quantity, Valid: true}
		}
		if req.Price != nil {
			params.Price = decimal.NullDecimal{Decimal: *req.Price, Valid: true}
		}
		if req.Fee != nil {
			params.Fee = decimal.NullDecimal{Decimal: *req.Fee, Valid: true}
		}

		row, err := q.UpdateManualTransaction(ctx, params)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				// Race: row existed at the source-check moment but was
				// non-manual at UPDATE time. Treat as 403.
				return errs.Respond(c, reqID,
					errs.New(http.StatusForbidden, "FORBIDDEN",
						"only manual transactions can be edited"))
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to update transaction"))
		}
		return c.JSON(shapeTransaction(row))
	}
}

// ---------- DELETE /transactions/{id} ----------

// DeleteTransaction removes a manual transaction (hard delete).
// Non-manual rows are immutable (same rule as PATCH); handler pre-
// checks and returns 403.
func DeleteTransaction(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, perr := uuid.Parse(c.Params("id"))
		if perr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid transaction id"))
		}

		q := dbgen.New(deps.Pool)
		current, err := q.GetTransactionByID(ctx, dbgen.GetTransactionByIDParams{ID: id, UserID: user.ID})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load transaction"))
		}
		if current.Source != "manual" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusForbidden, "FORBIDDEN",
					"only manual transactions can be deleted"))
		}

		affected, err := q.DeleteManualTransaction(ctx, dbgen.DeleteManualTransactionParams{
			ID:     id,
			UserID: user.ID,
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to delete transaction"))
		}
		if affected == 0 {
			// Race between the source-check and DELETE — surface as 404.
			return errs.Respond(c, reqID, errs.ErrNotFound)
		}
		return c.SendStatus(http.StatusNoContent)
	}
}
