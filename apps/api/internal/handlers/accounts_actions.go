package handlers

// Account-action handlers: POST /accounts/{id}/{sync,reconnect,pause,resume}.
// Split out of accounts_mutations.go in Sprint C cluster 1c — keeping
// CRUD (Create/Update/Delete) separate from actions makes the file
// easier to navigate when a new account action lands (TD-046 aggregator
// reconnect flow, pause-on-failure auto-recovery, etc.) and keeps
// account CRUD at a grepable ~200 lines.

import (
	"errors"
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/asynqpub"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

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
