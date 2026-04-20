package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

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

// Bounds used across both chat handlers. Values are deliberate:
//   - historyCap matches the AI Service ChatRequest.history max (40).
//   - userMessageMaxChars matches the AI Service Field(max_length=8000)
//     guard — shorter would reject requests the upstream would accept
//     without reason.
//   - persistTimeout caps the background DB write so a stuck pool does
//     not leak goroutines on every stream turn.
//   - costUSDMax / costUSDMaxDecimal mirror the ai_usage column cap
//     (NUMERIC(10,6)) so the writer never violates the CHECK constraint.
const (
	historyCap          = 40
	userMessageMaxChars = 8000
	persistTimeout      = 10 * time.Second
	costUSDMax          = 9999.999999
)

var costUSDMaxDecimal = decimal.NewFromFloat(costUSDMax)

// ChatRequestBody is the Core API openapi AIChatRequest. Marshalled
// by both /ai/chat and /ai/chat/stream handlers before the stream
// pipeline takes over.
type ChatRequestBody struct {
	ConversationID uuid.UUID     `json:"conversation_id"`
	Message        ChatUserInput `json:"message"`
	Model          string        `json:"model,omitempty"`
	// Context is accepted but not forwarded — AI Service's Pydantic
	// ChatRequest (`extra="forbid"`) rejects unknown fields, and
	// adding it cross-service is follow-up work.
	Context json.RawMessage `json:"context,omitempty"`
}

// ChatUserInput carries the user turn's content blocks. Per openapi
// AIChatRequest, only text blocks are permitted on input (users do
// not emit tool_use / impact_card / callout).
type ChatUserInput struct {
	Content []ChatUserBlock `json:"content"`
}

// ChatUserBlock is the AIMessageContentText shape: {type:"text", text}.
// No other types are accepted on input.
type ChatUserBlock struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

// parseChatRequestBody decodes and validates the request body against
// the openapi AIChatRequest contract. Rejects unknown types, empty
// messages, and oversize payloads with a single 400.
func parseChatRequestBody(raw []byte) (*ChatRequestBody, *errs.Coded) {
	if len(raw) == 0 {
		return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "request body is required")
	}
	var req ChatRequestBody
	if err := json.Unmarshal(raw, &req); err != nil {
		return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid JSON body")
	}
	if req.ConversationID == uuid.Nil {
		return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "conversation_id is required")
	}
	if len(req.Message.Content) == 0 {
		return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "message.content must have at least one block")
	}
	for i, b := range req.Message.Content {
		if b.Type != "text" {
			return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR",
				fmt.Sprintf("message.content[%d].type must be 'text'", i))
		}
	}
	if n := flattenLen(req.Message.Content); n == 0 {
		return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "message is empty")
	} else if n > userMessageMaxChars {
		return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR",
			fmt.Sprintf("message exceeds %d chars", userMessageMaxChars))
	}
	return &req, nil
}

// flattenUserContent joins user text blocks with the Anthropic-standard
// "\n\n" separator. Single-block input returns the text as-is — no
// leading / trailing newlines that would otherwise skew short prompts.
func flattenUserContent(blocks []ChatUserBlock) string {
	switch len(blocks) {
	case 0:
		return ""
	case 1:
		return blocks[0].Text
	default:
		parts := make([]string, len(blocks))
		for i, b := range blocks {
			parts[i] = b.Text
		}
		return strings.Join(parts, "\n\n")
	}
}

// flattenLen is the total length of text blocks (counted before the
// "\n\n" separators are added) — we use this for the pre-upstream
// length check so a tighter bound can be enforced without paying the
// cost of a full join.
func flattenLen(blocks []ChatUserBlock) int {
	n := 0
	for _, b := range blocks {
		n += len(b.Text)
	}
	return n
}

// flattenStoredContent walks an ai_messages.content JSONB blob and
// produces the plain-text string the AI Service expects in history
// payloads. Only text blocks contribute; tool_use / tool_result rows
// are dropped. The separator is "\n\n" for multi-block, none for
// single — same contract as user input flattening.
func flattenStoredContent(raw []byte) string {
	if len(raw) == 0 {
		return ""
	}
	var blocks []map[string]any
	if err := json.Unmarshal(raw, &blocks); err != nil {
		return ""
	}
	texts := make([]string, 0, len(blocks))
	for _, b := range blocks {
		if b["type"] == "text" {
			if s, ok := b["text"].(string); ok && s != "" {
				texts = append(texts, s)
			}
		}
	}
	switch len(texts) {
	case 0:
		return ""
	case 1:
		return texts[0]
	default:
		return strings.Join(texts, "\n\n")
	}
}

// loadChatHistory pulls the last `historyCap` user|assistant rows for
// this conversation, oldest-first, flattens them into the AI Service
// ChatHistoryMessage shape, and drops anything without text payload
// (synthetic tool_use only rows). `tool` role rows never reach the
// history payload by SQL-level filter in the query definition.
func loadChatHistory(ctx context.Context, q *dbgen.Queries, conversationID uuid.UUID) ([]aiservice.ChatHistoryMessage, error) {
	rows, err := q.ListAIConversationMessagesForContext(ctx, dbgen.ListAIConversationMessagesForContextParams{
		ConversationID: conversationID,
		RowLimit:       historyCap,
	})
	if err != nil {
		return nil, fmt.Errorf("load history: %w", err)
	}
	out := make([]aiservice.ChatHistoryMessage, 0, len(rows))
	for _, r := range rows {
		text := flattenStoredContent(r.Content)
		if text == "" {
			continue
		}
		out = append(out, aiservice.ChatHistoryMessage{Role: r.Role, Content: text})
	}
	return out, nil
}

// assertConversationOwned verifies the conversation belongs to the
// caller. A not-found / cross-user attempt returns 404 so we never
// leak conversation existence across accounts.
func assertConversationOwned(ctx context.Context, q *dbgen.Queries, convID, userID uuid.UUID) *errs.Coded {
	if _, err := q.GetAIConversationByID(ctx, dbgen.GetAIConversationByIDParams{ID: convID, UserID: userID}); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errs.ErrNotFound
		}
		return errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load conversation")
	}
	return nil
}

// userContentJSON serialises the caller's content blocks into the
// JSONB shape ai_messages.content expects (openapi AIMessageContent[]
// with text blocks only).
func userContentJSON(blocks []ChatUserBlock) ([]byte, error) {
	arr := make([]map[string]any, len(blocks))
	for i, b := range blocks {
		arr[i] = map[string]any{"type": "text", "text": b.Text}
	}
	return json.Marshal(arr)
}

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

// persistTurnBackground runs persistTurn on a detached context with
// the fixed timeout. Used by the streaming handler where the client
// has already received the whole response and we cannot let the
// request context cancel the DB write.
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
