package sseproxy

import (
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
)

// outFrame is the pair of (event, data) written to the client in the
// openapi-compliant SSE shape. Data is already JSON-encoded.
type outFrame struct {
	Event string
	Data  []byte
}

// Translate converts one AI Service frame into its openapi-compliant
// counterpart. The Collector must be observing the same stream so
// field values (MessageID, current index) are in sync.
//
// Returned outFrame is ready to be serialised by writeFrame. When
// the frame carries no client-visible payload (e.g. the AI Service
// emits a `message_start` duplicate, or an unknown event), the
// boolean return is false and the caller skips the write.
func Translate(f Frame, c *Collector, reqID string) (outFrame, bool, error) {
	switch f.Event {
	case "message_start":
		payload := map[string]any{
			"type":            "message_start",
			"message_id":      c.MessageID.String(),
			"conversation_id": c.ConversationID.String(),
		}
		return encodeFrame("message_start", payload)

	case "content_block_start":
		var e aiContentBlockStart
		if err := json.Unmarshal(f.Data, &e); err != nil {
			return outFrame{}, false, fmt.Errorf("translator: content_block_start: %w", err)
		}
		// Openapi enum is [text, tool_use, impact_card, callout] —
		// the AI Service only emits the first two. Pass-through.
		payload := map[string]any{
			"type":       "content_block_start",
			"index":      e.Index,
			"block_type": e.BlockType,
		}
		return encodeFrame("content_block_start", payload)

	case "content_delta":
		var e aiContentDelta
		if err := json.Unmarshal(f.Data, &e); err != nil {
			return outFrame{}, false, fmt.Errorf("translator: content_delta: %w", err)
		}
		idx := c.currentIndex()
		if idx < 0 {
			// No open block — upstream bug. Drop silently.
			return outFrame{}, false, nil
		}
		payload := map[string]any{
			"type":  "content_delta",
			"index": idx,
			"delta": map[string]any{"text": e.Text},
		}
		return encodeFrame("content_delta", payload)

	case "content_block_stop":
		var e aiContentBlockStop
		if err := json.Unmarshal(f.Data, &e); err != nil {
			return outFrame{}, false, fmt.Errorf("translator: content_block_stop: %w", err)
		}
		payload := map[string]any{
			"type":  "content_block_stop",
			"index": e.Index,
		}
		return encodeFrame("content_block_stop", payload)

	case "tool_use":
		var e aiToolUse
		if err := json.Unmarshal(f.Data, &e); err != nil {
			return outFrame{}, false, fmt.Errorf("translator: tool_use: %w", err)
		}
		var input any
		if len(e.Input) == 0 {
			input = map[string]any{}
		} else if err := json.Unmarshal(e.Input, &input); err != nil {
			input = map[string]any{}
		}
		payload := map[string]any{
			"type":        "tool_use",
			"tool_use_id": e.ToolUseID,
			"name":        e.Name,
			"input":       input,
		}
		return encodeFrame("tool_use", payload)

	case "tool_result":
		var e aiToolResult
		if err := json.Unmarshal(f.Data, &e); err != nil {
			return outFrame{}, false, fmt.Errorf("translator: tool_result: %w", err)
		}
		// Openapi wraps tool_result.content as AIMessageContentText[]
		// — an array of {type:"text", text:"..."}. The AI Service
		// sends a bare string, so we wrap it.
		payload := map[string]any{
			"type":        "tool_result",
			"tool_use_id": e.ToolUseID,
			"is_error":    e.IsError,
			"content":     []map[string]any{{"type": "text", "text": e.Content}},
		}
		return encodeFrame("tool_result", payload)

	case "message_stop":
		var e aiMessageStop
		if err := json.Unmarshal(f.Data, &e); err != nil {
			return outFrame{}, false, fmt.Errorf("translator: message_stop: %w", err)
		}
		payload := map[string]any{
			"type":        "message_stop",
			"message_id":  c.MessageID.String(),
			"tokens_used": e.Usage.InputTokens + e.Usage.OutputTokens,
		}
		if e.StopReason != "" {
			payload["stop_reason"] = e.StopReason
		}
		return encodeFrame("message_stop", payload)

	case "error":
		var e aiError
		if err := json.Unmarshal(f.Data, &e); err != nil {
			return outFrame{}, false, fmt.Errorf("translator: error: %w", err)
		}
		return errorFrame(e.Code, e.Message, reqID)

	default:
		return outFrame{}, false, nil
	}
}

// errorFrame renders a synthetic `error` frame in the openapi shape.
// code is optional — it falls back to AI_STREAM_ERROR so clients
// always have a machine-readable bucket.
func errorFrame(code, message, reqID string) (outFrame, bool, error) {
	if code == "" {
		code = "AI_STREAM_ERROR"
	}
	env := map[string]any{
		"code":    code,
		"message": message,
	}
	if reqID != "" {
		env["request_id"] = reqID
	}
	payload := map[string]any{
		"type":  "error",
		"error": env,
	}
	return encodeFrame("error", payload)
}

// encodeFrame marshals the payload and wraps it in an outFrame with
// the matching event name.
func encodeFrame(event string, payload map[string]any) (outFrame, bool, error) {
	data, err := json.Marshal(payload)
	if err != nil {
		return outFrame{}, false, fmt.Errorf("translator: marshal %s: %w", event, err)
	}
	return outFrame{Event: event, Data: data}, true, nil
}

// NewSyntheticMessageID generates a uuid v7 the way NewCollector
// does. Exposed only for tests that want to assert on message_id
// continuity without constructing a Collector.
func NewSyntheticMessageID() uuid.UUID {
	id, err := uuid.NewV7()
	if err != nil {
		return uuid.New()
	}
	return id
}
