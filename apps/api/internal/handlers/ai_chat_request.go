package handlers

// AI chat request parsing. Sits alongside ai_chat_history.go and
// ai_chat_persist.go (split out of ai_chat_shared.go in Sprint C
// cluster 1c). This file owns:
//   - AIChatRequest openapi shape (ChatRequestBody + nested types)
//   - parseChatRequestBody — shape validator reused by both /ai/chat
//     and /ai/chat/stream handlers
//   - User-content flattening helpers used by both request parsing
//     and the background persist path.
//
// Persist + history live in sibling files; nothing here touches the
// DB or the AI Service client.

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// Bounds used across both chat handlers. Values are deliberate:
//   - historyCap matches the AI Service ChatRequest.history max.
//     MUST stay in sync with apps/ai/src/ai_service/models.py
//     `ChatRequest.history = Field(max_length=40)`. Sprint C
//     cluster 3a will replace this duplication with a shared
//     codegen source; until then, any change here requires the
//     same edit on the Python side.
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
//
// Not migrated to httputil.BindAndValidate because the cross-field
// checks (non-Nil ConversationID, non-empty Content, content[].type
// discriminator, flattened-length bound) don't fit struct tags
// cleanly. TD-sprint-C-1d could revisit this with a custom validator.
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

// userContentJSON serialises the caller's content blocks into the
// JSONB shape ai_messages.content expects (openapi AIMessageContent[]
// with text blocks only). Used by the persist path and kept next to
// the request types that own the input shape.
func userContentJSON(blocks []ChatUserBlock) ([]byte, error) {
	arr := make([]map[string]any, len(blocks))
	for i, b := range blocks {
		arr[i] = map[string]any{"type": "text", "text": b.Text}
	}
	return json.Marshal(arr)
}
