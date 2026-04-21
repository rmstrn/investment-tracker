package handlers

// AI chat history + ownership checks. Split out of ai_chat_shared.go
// in Sprint C cluster 1c — request parsing lives in ai_chat_request.go
// and persistence in ai_chat_persist.go. This file owns:
//   - flattenStoredContent  — JSONB → plain text for history payloads
//   - loadChatHistory       — pulls last historyCap user|assistant rows
//   - assertConversationOwned — ownership check that returns 404 on
//     cross-user access to avoid leaking conversation existence.

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/aiservice"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

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
