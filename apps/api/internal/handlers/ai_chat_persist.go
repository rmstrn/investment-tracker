package handlers

// AI chat persist + upstream-error mapping. Split out of
// ai_chat_shared.go in Sprint C cluster 1c — request parsing lives in
// ai_chat_request.go, history loading in ai_chat_history.go. This
// file owns:
//   - persistTurn            — the user+assistant+usage+touch tx
//   - persistTurnBackground  — detached-context wrapper used by the
//                              streaming handler so a mid-stream
//                              client disconnect does NOT roll back
//                              the billing insert (TD-R091 guarantee)
//   - clampToInt32 / clampCost — DB-safety guards against upstream
//                                reporting bugs
//   - mapUpstreamStreamErr   — AI Service client error → Coded envelope
//
// The persist + clamp surface is test-sensitive — integration tests
// in ai_chat_stream_integration_test.go assert the exact row shape
// and clamp behavior. Changing what persists requires updating those
// tests in lockstep.

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/aiservice"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/sseproxy"
)

// persistTurn writes the user turn + the assistant turn + usage ledger
// + conversation touch in a single DB transaction. Called after a
// successful message_stop; never called when GotMessageStop is false.
//
// `ctx` is the background context the caller passes so a client
// disconnect on the HTTP side does not roll back a billing insert
// (tokens were already spent upstream).
func persistTurn(
	ctx context.Context,
	pool *pgxpool.Pool,
	log *zerolog.Logger,
	userID, conversationID uuid.UUID,
	userBlocks []ChatUserBlock,
	result *sseproxy.Result,
) error {
	userBlob, err := userContentJSON(userBlocks)
	if err != nil {
		return fmt.Errorf("marshal user content: %w", err)
	}
	assistantBlob := result.ContentBlocksJSON
	if len(assistantBlob) == 0 {
		assistantBlob = []byte("[]")
	}

	cost := clampCost(decimal.NewFromFloat(result.CostUSD), log)

	tx, err := pool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	q := dbgen.New(tx)

	if _, err := q.InsertAIMessage(ctx, dbgen.InsertAIMessageParams{
		ID:             uuid.Must(uuid.NewV7()),
		ConversationID: conversationID,
		Role:           "user",
		Content:        userBlob,
		TokensUsed:     nil,
	}); err != nil {
		return fmt.Errorf("insert user message: %w", err)
	}

	tokens := clampToInt32(result.TotalTokens)
	if _, err := q.InsertAIMessage(ctx, dbgen.InsertAIMessageParams{
		ID:             result.MessageID,
		ConversationID: conversationID,
		Role:           "assistant",
		Content:        assistantBlob,
		TokensUsed:     &tokens,
	}); err != nil {
		return fmt.Errorf("insert assistant message: %w", err)
	}

	convPtr := conversationID
	if _, err := q.RecordAIUsage(ctx, dbgen.RecordAIUsageParams{
		UserID:         userID,
		ConversationID: &convPtr,
		Model:          result.Model,
		InputTokens:    clampToInt32(result.InputTokens),
		OutputTokens:   clampToInt32(result.OutputTokens),
		CostUsd:        cost,
	}); err != nil {
		return fmt.Errorf("record ai_usage: %w", err)
	}

	if err := q.TouchAIConversation(ctx, conversationID); err != nil {
		return fmt.Errorf("touch conversation: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit: %w", err)
	}
	return nil
}

// persistTurnBackground runs persistTurn on a detached context with
// the fixed timeout. Used by the streaming handler where the client
// has already received the whole response and we cannot let the
// request context cancel the DB write.
//
// Must be invoked from inside SendStreamWriter's async callback
// (TD-R091). Calling it from the outer handler would read a still-
// nil sseproxy.Result.
func persistTurnBackground(
	log *zerolog.Logger,
	pool *pgxpool.Pool,
	userID, conversationID uuid.UUID,
	userBlocks []ChatUserBlock,
	result *sseproxy.Result,
) {
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), persistTimeout)
		defer cancel()
		if err := persistTurn(ctx, pool, log, userID, conversationID, userBlocks, result); err != nil {
			if log != nil {
				log.Error().Err(err).
					Str("conversation_id", conversationID.String()).
					Str("user_id", userID.String()).
					Str("message_id", result.MessageID.String()).
					Msg("ai chat: persist turn failed — tokens already spent upstream")
			}
		}
	}()
}

// clampToInt32 guards the ai_messages.tokens_used / ai_usage token
// columns (INTEGER on Postgres) against an upstream that reports an
// impossible value. Claude's current max context is well under
// math.MaxInt32, so real usage never hits the clamp — this exists
// purely to keep the DB INSERT safe if the AI Service returns garbage.
func clampToInt32(n int) int32 {
	if n < 0 {
		return 0
	}
	const maxInt32 = 1<<31 - 1
	if n > maxInt32 {
		return maxInt32
	}
	return int32(n)
}

// clampCost caps cost_usd at the ai_usage column's NUMERIC(10,6) max.
// A WARN log + clamped value is safer than letting the CHECK
// constraint fail — tokens were still spent, and per-call cost
// exceeding $9,999.99 almost certainly signals an upstream-reporting
// bug we want visible but non-fatal.
func clampCost(in decimal.Decimal, log *zerolog.Logger) decimal.Decimal {
	if in.IsNegative() {
		// DB CHECK is (cost_usd >= 0); zero the anomaly and log.
		if log != nil {
			log.Warn().Str("cost_in", in.String()).Msg("ai chat: negative cost_usd — clamped to 0")
		}
		return decimal.Zero
	}
	if in.GreaterThanOrEqual(costUSDMaxDecimal) {
		if log != nil {
			log.Warn().Str("cost_in", in.String()).
				Str("cost_cap", costUSDMaxDecimal.String()).
				Msg("ai chat: cost_usd exceeds column cap — clamped")
		}
		return costUSDMaxDecimal
	}
	return in
}

// mapUpstreamStreamErr turns an aiservice client error (StreamChat
// pre-stream failure) into the client-facing Coded error. 401/403
// upstream → 502 BAD_GATEWAY + ERR log (Sentry will pick it up from
// the log sink), not a passthrough — a valid user must not see an
// internal-token leak.
func mapUpstreamStreamErr(err error, log *zerolog.Logger, reqID string) *errs.Coded {
	if errors.Is(err, aiservice.ErrUpstreamAuth) {
		if log != nil {
			log.Error().Err(err).Str("request_id", reqID).
				Msg("ai chat: upstream rejected internal token (Core API config bug)")
		}
		return errs.New(http.StatusBadGateway, "BAD_GATEWAY", "AI service unavailable")
	}
	var uu *aiservice.ErrUpstreamUnavailable
	if errors.As(err, &uu) {
		if log != nil {
			log.Warn().Err(err).Str("request_id", reqID).
				Int("upstream_status", uu.StatusCode).
				Msg("ai chat: upstream non-2xx")
		}
		return errs.New(http.StatusBadGateway, "BAD_GATEWAY", "AI service unavailable")
	}
	if log != nil {
		log.Warn().Err(err).Str("request_id", reqID).Msg("ai chat: upstream call failed")
	}
	return errs.New(http.StatusBadGateway, "BAD_GATEWAY", "AI service unavailable")
}
