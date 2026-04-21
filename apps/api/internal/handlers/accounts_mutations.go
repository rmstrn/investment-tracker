package handlers

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/asynqpub"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/handlers/httputil"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// ---------- POST /accounts ----------

// createAccountRequest is the openapi AccountCreateRequest shape
// with validator tags driving shape-level checks. Domain-specific
// normalization (TrimSpace, case-folding, defaulting) still happens
// in the handler body — validator only enforces the wire contract.
type createAccountRequest struct {
	ConnectionType string  `json:"connection_type" validate:"required,oneof=api aggregator import manual"`
	BrokerName     string  `json:"broker_name"`
	DisplayName    string  `json:"display_name"    validate:"required"`
	BaseCurrency   string  `json:"base_currency"`
	AccountType    string  `json:"account_type"    validate:"omitempty,oneof=broker crypto manual"`
	RedirectURL    *string `json:"redirect_url"`
}

// CreateAccount opens an account row per openapi AccountCreateRequest.
// Two paths per the design:
//
//   - connection_type=manual → row is inserted with sync_status='ok'
//     and connect_url:null in the response. Works fully today.
//   - connection_type=aggregator/api → returns 501 NOT_IMPLEMENTED
//     with TD-046 because SnapTrade / Plaid / broker-API clients are
//     not wired. Validation runs first so typos are 400 not 501.
//
// broker_name is required when connection_type != manual. display_name
// and base_currency are always required per spec.
func CreateAccount(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		req, coded := httputil.BindAndValidate[createAccountRequest](c)
		if coded != nil {
			return errs.Respond(c, reqID, coded)
		}

		req.DisplayName = strings.TrimSpace(req.DisplayName)
		req.BaseCurrency = strings.ToUpper(strings.TrimSpace(req.BaseCurrency))

		// Validator passed required/oneof but whitespace-only
		// display_name slipped through — trim-then-check.
		if req.DisplayName == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "display_name is required"))
		}
		if req.ConnectionType != "manual" && req.BrokerName == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "broker_name is required when connection_type != manual"))
		}
		if req.AccountType == "" {
			req.AccountType = "manual"
		}
		if req.BaseCurrency == "" {
			req.BaseCurrency = "USD"
		}

		// Aggregator / api paths need SnapTrade / Plaid / broker-API
		// clients that are not yet wired (TD-046).
		if req.ConnectionType == "aggregator" || req.ConnectionType == "api" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusNotImplemented, "NOT_IMPLEMENTED",
					"aggregator / api connection types require provider clients not yet wired (TD-046)"))
		}

		brokerName := req.BrokerName
		if brokerName == "" {
			brokerName = "manual"
		}

		row, err := dbgen.New(deps.Pool).CreateAccount(ctx, dbgen.CreateAccountParams{
			ID:                   uuid.Must(uuid.NewV7()),
			UserID:               user.ID,
			BrokerName:           brokerName,
			DisplayName:          req.DisplayName,
			AccountType:          req.AccountType,
			ConnectionType:       req.ConnectionType,
			ExternalAccountID:    nil,
			CredentialsEncrypted: nil,
			CredentialsKekID:     nil,
			BaseCurrency:         req.BaseCurrency,
			SyncStatus:           "ok",
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to create account"))
		}

		return c.Status(http.StatusCreated).JSON(fiber.Map{
			"account":     shapeAccount(row),
			"connect_url": nil, // manual path → no OAuth URL
		})
	}
}

// ---------- PATCH /accounts/{id} ----------

// updateAccountRequest is the openapi AccountUpdateRequest shape.
// Both fields are pointer/nullable so the handler can distinguish
// "not supplied" (COALESCE keeps the current value) from "set to
// zero" (e.g. is_included_in_portfolio = false).
type updateAccountRequest struct {
	DisplayName           *string `json:"display_name"`
	IsIncludedInPortfolio *bool   `json:"is_included_in_portfolio"`
}

// UpdateAccount handles display_name + is_included_in_portfolio edits.
// Both fields are optional per AccountUpdateRequest; the sqlc COALESCE
// keeps the column when the caller omits it.
func UpdateAccount(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, parseErr := uuid.Parse(c.Params("id"))
		if parseErr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid account id"))
		}

		// Optional body — both fields are pointer/nullable and either
		// can be absent. BindJSONOptional keeps the empty-body path
		// honoured (no-op PATCH is valid).
		req, coded := httputil.BindJSONOptional[updateAccountRequest](c)
		if coded != nil {
			return errs.Respond(c, reqID, coded)
		}
		if req.DisplayName != nil {
			trimmed := strings.TrimSpace(*req.DisplayName)
			if trimmed == "" {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "display_name cannot be blank"))
			}
			req.DisplayName = &trimmed
		}

		row, err := dbgen.New(deps.Pool).UpdateAccountDisplayOptions(ctx, dbgen.UpdateAccountDisplayOptionsParams{
			ID:                    id,
			UserID:                user.ID,
			DisplayName:           req.DisplayName,
			IsIncludedInPortfolio: req.IsIncludedInPortfolio,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to update account"))
		}
		return c.JSON(shapeAccount(row))
	}
}

// ---------- DELETE /accounts/{id} ----------

// DeleteAccount soft-deletes an account. Historical rows (transactions)
// stay so snapshots still reconstruct correctly.
func DeleteAccount(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, parseErr := uuid.Parse(c.Params("id"))
		if parseErr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid account id"))
		}

		_, err := dbgen.New(deps.Pool).SoftDeleteAccount(ctx, dbgen.SoftDeleteAccountParams{
			ID:     id,
			UserID: user.ID,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to delete account"))
		}
		return c.SendStatus(http.StatusNoContent)
	}
}

// ---------- POST /accounts/{id}/sync ----------

// SyncAccount enqueues a sync_account task and returns the current
// AccountSyncStatus. The handler is intentionally thin — the
// worker is the authority on when the sync actually runs. Per
// openapi the response is 202 Accepted.
func SyncAccount(deps *app.Deps) fiber.Handler {
	return enqueueAccountAction(deps, "manual")
}

// ---------- POST /accounts/{id}/reconnect ----------

// ReconnectAccount is the re-authenticate path for aggregator
// accounts; manual accounts do not need it but the handler accepts
// the call and enqueues a sync_account task with reason=reconnect
// so the worker's log line distinguishes the trigger.
//
// connect_url in the response is null today — a real aggregator
// would build one via SnapTrade / Plaid re-auth (TD-046).
func ReconnectAccount(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, parseErr := uuid.Parse(c.Params("id"))
		if parseErr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid account id"))
		}

		row, err := dbgen.New(deps.Pool).GetAccountByID(ctx, dbgen.GetAccountByIDParams{
			ID: id, UserID: user.ID,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load account"))
		}

		if !deps.Asynq.Enabled() {
			c.Set("X-Async-Unavailable", "true")
		}
		if _, qerr := deps.Asynq.Enqueue(ctx, asynqpub.TaskSyncAccount,
			asynqpub.SyncAccountPayload{
				AccountID: row.ID.String(),
				UserID:    user.ID.String(),
				Reason:    "reconnect",
			}); qerr != nil {
			deps.Log.Warn().Err(qerr).Str("account_id", row.ID.String()).
				Msg("reconnect enqueue failed")
		}

		return c.Status(http.StatusAccepted).JSON(fiber.Map{
			"account":     shapeAccount(row),
			"connect_url": nil, // TD-046
		})
	}
}

// ---------- POST /accounts/{id}/pause ----------

// PauseAccount flips sync_status to 'paused' so the scheduler cron
// skips this account until resume. Idempotent — pausing an already-
// paused account is a no-op 200.
func PauseAccount(deps *app.Deps) fiber.Handler {
	return setAccountState(deps, "paused")
}

// ---------- POST /accounts/{id}/resume ----------

// ResumeAccount flips sync_status back to 'pending' so the next cron
// run picks it up. Setting to 'pending' (not 'ok') mirrors the
// migration's new-account default and keeps the scheduler simple.
func ResumeAccount(deps *app.Deps) fiber.Handler {
	return setAccountState(deps, "pending")
}

// ---------- shared helpers ----------

// enqueueAccountAction emits a sync_account task with the given
// reason, responds 202 with current status, and maps ErrNoRows → 404.
func enqueueAccountAction(deps *app.Deps, reason string) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, parseErr := uuid.Parse(c.Params("id"))
		if parseErr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid account id"))
		}

		row, err := dbgen.New(deps.Pool).GetAccountByID(ctx, dbgen.GetAccountByIDParams{
			ID: id, UserID: user.ID,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load account"))
		}

		if !deps.Asynq.Enabled() {
			c.Set("X-Async-Unavailable", "true")
		}
		if _, qerr := deps.Asynq.Enqueue(ctx, asynqpub.TaskSyncAccount,
			asynqpub.SyncAccountPayload{
				AccountID: row.ID.String(),
				UserID:    user.ID.String(),
				Reason:    reason,
			}); qerr != nil {
			deps.Log.Warn().Err(qerr).Str("account_id", row.ID.String()).
				Msg("sync enqueue failed")
		}

		return c.Status(http.StatusAccepted).JSON(shapeAccountSyncStatus(row))
	}
}

// setAccountState is the pause/resume body — flip sync_status with
// no other side effect.
func setAccountState(deps *app.Deps, newState string) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, parseErr := uuid.Parse(c.Params("id"))
		if parseErr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid account id"))
		}

		row, err := dbgen.New(deps.Pool).SetAccountSyncState(ctx, dbgen.SetAccountSyncStateParams{
			ID:         id,
			UserID:     user.ID,
			SyncStatus: newState,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to set sync state"))
		}
		return c.JSON(shapeAccount(row))
	}
}

// shapeAccountSyncStatus echoes the openapi AccountSyncStatus shape.
// Same surface as GetAccountStatus (b2b) but kept separate so a future
// change that wants different fields on the mutation response path
// does not surprise the read path.
func shapeAccountSyncStatus(a dbgen.Account) fiber.Map {
	var lastSync any
	if a.LastSyncedAt.Valid {
		lastSync = a.LastSyncedAt.Time.UTC().Format("2006-01-02T15:04:05Z07:00")
	}
	var syncErr any
	if a.SyncError != nil {
		syncErr = *a.SyncError
	}
	return fiber.Map{
		"account_id":     a.ID.String(),
		"sync_status":    a.SyncStatus,
		"last_synced_at": lastSync,
		"sync_error":     syncErr,
		"next_sync_at":   nil, // handler doesn't track ETA; TD elsewhere
	}
}
