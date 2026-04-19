package handlers

import (
	"errors"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// ListAccounts returns the authenticated user's connected accounts per
// openapi.yaml `Account[]` inside a PaginatedEnvelope. Accounts are
// rare (typical user has <10) so pagination is degenerate: the
// handler returns every active row in one page with has_more=false.
// The cursor + limit query params are accepted for spec-compliance
// and ignored — if a user ever crosses 100 accounts a real cursor
// will need to land here.
//
// Soft-deleted (deleted_at IS NOT NULL) rows are omitted by the
// underlying ListAccountsByUser query (PR A).
func ListAccounts(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		rows, err := dbgen.New(deps.Pool).ListAccountsByUser(ctx, user.ID)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list accounts"))
		}

		items := make([]fiber.Map, 0, len(rows))
		for _, a := range rows {
			items = append(items, shapeAccount(a))
		}

		return c.JSON(fiber.Map{
			"data": items,
			"meta": fiber.Map{
				"has_more":    false,
				"next_cursor": nil,
				"total_count": len(items),
			},
		})
	}
}

// GetAccount returns one Account scoped to the authed user. 404 when
// the id does not exist or belongs to another user (the underlying
// query joins on user_id so cross-user access surfaces as ErrNoRows).
func GetAccount(deps *app.Deps) fiber.Handler {
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
			ID:     id,
			UserID: user.ID,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load account"))
		}
		return c.JSON(shapeAccount(row))
	}
}

// GetAccountStatus projects the sync columns into AccountSyncStatus.
// Same scoping rules + 404 semantics as GetAccount.
//
// next_sync_at is null today — we do not record a queue/scheduler
// estimate at the row level. PR B3's manual-sync endpoint will set it
// when it enqueues; until then leave as null per nullable spec.
func GetAccountStatus(deps *app.Deps) fiber.Handler {
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
			ID:     id,
			UserID: user.ID,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load account status"))
		}

		var lastSync any
		if row.LastSyncedAt.Valid {
			lastSync = row.LastSyncedAt.Time.UTC().Format(time.RFC3339)
		}
		var syncErr any
		if row.SyncError != nil {
			syncErr = *row.SyncError
		}

		return c.JSON(fiber.Map{
			"account_id":     row.ID.String(),
			"sync_status":    row.SyncStatus,
			"last_synced_at": lastSync,
			"sync_error":     syncErr,
			"next_sync_at":   nil,
		})
	}
}

// shapeAccount projects the sqlc Account row into the openapi Account
// shape. Notable: `credentials_encrypted` and `credentials_kek_id`
// stay server-side and are NEVER serialised.
func shapeAccount(a dbgen.Account) fiber.Map {
	var lastSync any
	if a.LastSyncedAt.Valid {
		lastSync = a.LastSyncedAt.Time.UTC().Format(time.RFC3339)
	}
	var syncErr any
	if a.SyncError != nil {
		syncErr = *a.SyncError
	}
	var deleted any
	if a.DeletedAt.Valid {
		deleted = a.DeletedAt.Time.UTC().Format(time.RFC3339)
	}
	var externalID any
	if a.ExternalAccountID != nil {
		externalID = *a.ExternalAccountID
	}

	return fiber.Map{
		"id":                       a.ID.String(),
		"broker_name":              a.BrokerName,
		"display_name":             a.DisplayName,
		"account_type":             a.AccountType,
		"connection_type":          a.ConnectionType,
		"external_account_id":      externalID,
		"base_currency":            a.BaseCurrency,
		"last_synced_at":           lastSync,
		"sync_status":              a.SyncStatus,
		"sync_error":               syncErr,
		"is_included_in_portfolio": a.IsIncludedInPortfolio,
		"deleted_at":               deleted,
		"created_at":               a.CreatedAt.Time.UTC().Format(time.RFC3339),
		"updated_at":               a.UpdatedAt.Time.UTC().Format(time.RFC3339),
	}
}
