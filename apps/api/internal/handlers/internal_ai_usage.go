// Package handlers holds the HTTP handlers for the Core API routes.
// Each handler closes over *server.Deps to access the pool, cache, and
// repos; they never touch globals.
package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// AIUsageCounterType is the usage_counters.counter_type bucket that the
// AI Service's daily quota logic reads to decide whether a user has
// budget left for more messages.
const AIUsageCounterType = "ai_messages_daily"

// allowedAIUsageModels is the whitelist of model identifiers the AI
// Service is permitted to report. Keeping it tight prevents a
// compromised internal token from polluting billing with arbitrary
// strings. Kept in sync with DECISIONS.md "Claude model selection
// matrix".
var allowedAIUsageModels = map[string]struct{}{
	"claude-opus-4-6":           {},
	"claude-sonnet-4-6":         {},
	"claude-haiku-4-5-20251001": {},
}

// aiUsageRequest is the POST /internal/ai/usage body.
//
// user_id is redundant with the X-User-Id header but REQUIRED so we can
// enforce that the body matches the header — defence-in-depth if the
// internal token ever leaks.
type aiUsageRequest struct {
	UserID         uuid.UUID       `json:"user_id"`
	ConversationID *uuid.UUID      `json:"conversation_id"`
	Model          string          `json:"model"`
	InputTokens    int32           `json:"input_tokens"`
	OutputTokens   int32           `json:"output_tokens"`
	CostUSD        decimal.Decimal `json:"cost_usd"`
}

// InternalAIUsage returns the handler for POST /internal/ai/usage.
//
// Contract:
//   - Caller must be internal-auth mode (guarded by RequireInternalAuth
//     one layer up in the router).
//   - Body.user_id MUST equal X-User-Id header (400 on mismatch).
//   - Model MUST be in the whitelist (400).
//   - Token counts / cost MUST be non-negative (400).
//
// Writes atomically:
//   - ai_usage row with model, tokens, cost, optional conversation_id.
//   - usage_counters(user, 'ai_messages_daily', today) += 1.
//
// Response: 202 Accepted with empty body. This is intentionally
// fire-and-forget from the AI Service's perspective.
func InternalAIUsage(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)

		var req aiUsageRequest
		if err := json.Unmarshal(c.Body(), &req); err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid JSON body"))
		}

		if err := req.validate(c.Get("X-User-Id")); err != nil {
			return errs.Respond(c, reqID, err)
		}

		if err := writeAIUsageTx(c.Context(), deps, req); err != nil {
			deps.Log.Error().Err(err).
				Str("request_id", reqID).
				Str("user_id", req.UserID.String()).
				Msg("ai usage write failed")
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to record AI usage"))
		}

		return c.SendStatus(fiber.StatusAccepted)
	}
}

// validate runs the body checks. Returns a *errs.Coded ready to be
// handed to errs.Respond, or nil on success. Takes the X-User-Id
// header value rather than the Ctx so tests can exercise the rules in
// pure Go.
func (r aiUsageRequest) validate(headerUserID string) *errs.Coded {
	// user_id must match X-User-Id — header is the authenticated
	// identity; body is just a self-check.
	if r.UserID.String() != headerUserID {
		return errs.New(http.StatusBadRequest, "VALIDATION_ERROR",
			"user_id in body does not match X-User-Id header").
			WithDetails(map[string]any{
				"body_user_id":   r.UserID.String(),
				"header_user_id": headerUserID,
			})
	}

	if _, ok := allowedAIUsageModels[r.Model]; !ok {
		return errs.New(http.StatusBadRequest, "VALIDATION_ERROR",
			fmt.Sprintf("model %q is not in the allowed set", r.Model))
	}

	if r.InputTokens < 0 || r.OutputTokens < 0 {
		return errs.New(http.StatusBadRequest, "VALIDATION_ERROR",
			"token counts must be non-negative")
	}
	if r.CostUSD.IsNegative() {
		return errs.New(http.StatusBadRequest, "VALIDATION_ERROR",
			"cost_usd must be non-negative")
	}
	return nil
}

// writeAIUsageTx performs both writes in one transaction. If either
// fails, the whole thing rolls back — we never want ai_usage rows
// without a matching counter increment, nor vice versa.
func writeAIUsageTx(ctx context.Context, deps *app.Deps, req aiUsageRequest) error {
	tx, err := deps.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }() // no-op after Commit

	q := dbgen.New(tx)

	if _, err := q.RecordAIUsage(ctx, dbgen.RecordAIUsageParams{
		UserID:         req.UserID,
		ConversationID: req.ConversationID,
		Model:          req.Model,
		InputTokens:    req.InputTokens,
		OutputTokens:   req.OutputTokens,
		CostUsd:        req.CostUSD,
	}); err != nil {
		return fmt.Errorf("insert ai_usage: %w", err)
	}

	today := pgtype.Date{Time: time.Now().UTC(), Valid: true}
	if _, err := q.IncrementUsageCounter(ctx, dbgen.IncrementUsageCounterParams{
		UserID:      req.UserID,
		CounterType: AIUsageCounterType,
		CounterDate: today,
	}); err != nil {
		return fmt.Errorf("upsert usage_counters: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		// Distinguish the "this is fine" case from transient errors for
		// future retries; today we just return it.
		if errors.Is(err, pgx.ErrTxClosed) {
			return nil
		}
		return fmt.Errorf("commit: %w", err)
	}
	return nil
}

// requestIDFromLocals reads the id set by middleware.RequestID. Kept
// local to handlers so we do not re-export a trivial one-liner from
// middleware.
func requestIDFromLocals(c fiber.Ctx) string {
	if id, ok := c.Locals(middleware.LocalsRequestID).(string); ok {
		return id
	}
	return ""
}
