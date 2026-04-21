package handlers

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
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
