package sseproxy

import (
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
)

// AI Service frame shapes (mirror ai_service/models.py). We keep
// them private to the package — everything leaves the proxy in the
// openapi-compliant OutFrame shape or in the Collector Result.
type (
	aiContentBlockStart struct {
		Type      string `json:"type"`
		Index     int    `json:"index"`
		BlockType string `json:"block_type"`
	}
	aiContentDelta struct {
		Type string `json:"type"`
		Text string `json:"text"`
	}
	aiContentBlockStop struct {
		Type  string `json:"type"`
		Index int    `json:"index"`
	}
	aiToolUse struct {
		Type      string          `json:"type"`
		ToolUseID string          `json:"tool_use_id"`
		Name      string          `json:"name"`
		Input     json.RawMessage `json:"input"`
	}
	aiToolResult struct {
		Type      string `json:"type"`
		ToolUseID string `json:"tool_use_id"`
		IsError   bool   `json:"is_error"`
		Content   string `json:"content"`
	}
	aiTokenUsage struct {
		Model        string  `json:"model"`
		InputTokens  int     `json:"input_tokens"`
		OutputTokens int     `json:"output_tokens"`
		CostUSD      float64 `json:"cost_usd"`
	}
	aiMessageStop struct {
		Type       string       `json:"type"`
		StopReason string       `json:"stop_reason"`
		Usage      aiTokenUsage `json:"usage"`
	}
	aiError struct {
		Type    string `json:"type"`
		Message string `json:"message"`
		Code    string `json:"code"`
	}
)

// blockKind enumerates the three openapi block_type values the
// assistant can emit. `impact_card` / `callout` in the openapi spec
// are reserved for UI-generated cards and do not come out of the
// streaming LLM today.
type blockKind string

const (
	blockText     blockKind = "text"
	blockToolUse  blockKind = "tool_use"
	blockToolRslt blockKind = "tool_result"
)

// collectedBlock is one entry of the persisted JSONB content array.
// Exactly one of Text / ToolUse / ToolResult is populated, picked
// by Kind.
type collectedBlock struct {
	Kind       blockKind
	Index      int
	Text       string
	ToolUseID  string
	ToolName   string
	ToolInput  json.RawMessage
	IsError    bool
	ResultText string
}

// Collector is the state machine fed one AI frame at a time. It
// derives the data the handler needs to persist the assistant turn
// once the stream terminates cleanly (message_stop received).
type Collector struct {
	// Allocated MessageID the Core API owns. Generated at
	// message_start time so the re-serialised openapi frame can
	// carry an openapi-format uuid even if the AI Service emits a
	// non-UUID message_id string.
	MessageID uuid.UUID
	// ConversationID plumbed from the caller so message_start
	// re-serialisation can stamp it (openapi schema requires it).
	ConversationID uuid.UUID

	// Ordered by first-seen index.
	order  []int
	blocks map[int]*collectedBlock

	// Populated on message_stop.
	GotStop    bool
	StopReason string
	Usage      aiTokenUsage

	// Populated when an `error` frame arrives. The stream may still
	// continue after one error event and eventually emit message_stop,
	// in which case both fields coexist on the Result.
	HasError     bool
	ErrorCode    string
	ErrorMessage string
}

// NewCollector returns a Collector. The MessageID is generated app-
// side so openapi clients see a valid uuid even when the upstream
// message_id is an Anthropic opaque string.
func NewCollector(conversationID uuid.UUID) *Collector {
	mid, err := uuid.NewV7()
	if err != nil {
		// uuid.NewV7 only fails on time-source failure; fall back
		// to v4 rather than bubbling an error up from a simple
		// constructor.
		mid = uuid.New()
	}
	return &Collector{
		MessageID:      mid,
		ConversationID: conversationID,
		blocks:         map[int]*collectedBlock{},
	}
}

// Observe updates the Collector with one parsed Frame. Unknown event
// names are silently ignored so a minor upstream change does not
// break the proxy mid-stream.
func (c *Collector) Observe(f Frame) error {
	switch f.Event {
	case "message_start":
		// Nothing to capture — the AI Service-supplied message_id
		// is discarded; openapi-side MessageID was pre-allocated.
		return nil

	case "content_block_start":
		var e aiContentBlockStart
		if err := json.Unmarshal(f.Data, &e); err != nil {
			return fmt.Errorf("sseproxy: content_block_start: %w", err)
		}
		kind := blockText
		if e.BlockType == "tool_use" {
			kind = blockToolUse
		}
		c.ensureBlock(e.Index, kind)
		return nil

	case "content_delta":
		var e aiContentDelta
		if err := json.Unmarshal(f.Data, &e); err != nil {
			return fmt.Errorf("sseproxy: content_delta: %w", err)
		}
		// The AI Service does not ship an `index` in content_delta
		// (single open block at a time). We attribute deltas to the
		// most recently opened block of kind text / tool_use.
		idx := c.currentIndex()
		if idx < 0 {
			// Delta with no open block — upstream bug. Skip.
			return nil
		}
		b := c.blocks[idx]
		if b != nil && b.Kind == blockText {
			b.Text += e.Text
		}
		return nil

	case "content_block_stop":
		// Nothing to mutate; the block is already in the map.
		return nil

	case "tool_use":
		var e aiToolUse
		if err := json.Unmarshal(f.Data, &e); err != nil {
			return fmt.Errorf("sseproxy: tool_use: %w", err)
		}
		// tool_use frames can arrive as standalone events (no
		// matching content_block_start in the AI Service's current
		// shape). Synthesise a block slot at the next index.
		idx := c.nextIndex()
		c.ensureBlock(idx, blockToolUse)
		b := c.blocks[idx]
		b.ToolUseID = e.ToolUseID
		b.ToolName = e.Name
		b.ToolInput = append([]byte(nil), e.Input...)
		return nil

	case "tool_result":
		var e aiToolResult
		if err := json.Unmarshal(f.Data, &e); err != nil {
			return fmt.Errorf("sseproxy: tool_result: %w", err)
		}
		idx := c.nextIndex()
		c.ensureBlock(idx, blockToolRslt)
		b := c.blocks[idx]
		b.ToolUseID = e.ToolUseID
		b.IsError = e.IsError
		b.ResultText = e.Content
		return nil

	case "message_stop":
		var e aiMessageStop
		if err := json.Unmarshal(f.Data, &e); err != nil {
			return fmt.Errorf("sseproxy: message_stop: %w", err)
		}
		c.GotStop = true
		c.StopReason = e.StopReason
		c.Usage = e.Usage
		return nil

	case "error":
		// No state mutation — handler decides whether to continue
		// reading for a possible message_stop or abort.
		return nil

	default:
		return nil
	}
}

func (c *Collector) ensureBlock(idx int, kind blockKind) {
	if _, ok := c.blocks[idx]; ok {
		return
	}
	c.order = append(c.order, idx)
	c.blocks[idx] = &collectedBlock{Kind: kind, Index: idx}
}

// currentIndex returns the index of the most-recently-seen block,
// or -1 if nothing has been opened yet.
func (c *Collector) currentIndex() int {
	if len(c.order) == 0 {
		return -1
	}
	return c.order[len(c.order)-1]
}

// nextIndex derives a synthetic index for tool_use / tool_result
// frames that the AI Service emits without a paired
// content_block_start.
func (c *Collector) nextIndex() int {
	if len(c.order) == 0 {
		return 0
	}
	return c.order[len(c.order)-1] + 1
}

// ContentBlocksJSON renders the collected assistant content as a
// JSON array in the openapi AIMessageContent[] shape. Empty text
// blocks are dropped — they come from content_block_start events
// that never received deltas (the AI Service sometimes opens a
// block then errors out). Returns `[]` for an empty result so the
// JSONB column is never NULL.
func (c *Collector) ContentBlocksJSON() ([]byte, error) {
	arr := make([]map[string]any, 0, len(c.order))
	for _, idx := range c.order {
		b := c.blocks[idx]
		switch b.Kind {
		case blockText:
			if b.Text == "" {
				continue
			}
			arr = append(arr, map[string]any{"type": "text", "text": b.Text})
		case blockToolUse:
			var input any
			if len(b.ToolInput) == 0 {
				input = map[string]any{}
			} else {
				if err := json.Unmarshal(b.ToolInput, &input); err != nil {
					input = map[string]any{}
				}
			}
			arr = append(arr, map[string]any{
				"type":        "tool_use",
				"tool_use_id": b.ToolUseID,
				"name":        b.ToolName,
				"input":       input,
			})
		case blockToolRslt:
			arr = append(arr, map[string]any{
				"type":        "tool_result",
				"tool_use_id": b.ToolUseID,
				"is_error":    b.IsError,
				"content":     []map[string]any{{"type": "text", "text": b.ResultText}},
			})
		}
	}
	return json.Marshal(arr)
}

// TotalTokens is the value persisted to ai_messages.tokens_used.
// Matches the openapi AIChatResponse.tokens_used contract (sum of
// input + output). The per-split values land in ai_usage.
func (c *Collector) TotalTokens() int {
	return c.Usage.InputTokens + c.Usage.OutputTokens
}
