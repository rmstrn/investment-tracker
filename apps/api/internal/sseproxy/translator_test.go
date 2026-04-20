package sseproxy

import (
	"encoding/json"
	"strings"
	"testing"

	"github.com/google/uuid"
)

// TestTranslateMessageStartStampsConversation confirms the translator
// re-writes message_start to carry the openapi-required
// conversation_id and a server-allocated message_id (discarding the
// AI Service's opaque Anthropic id).
func TestTranslateMessageStartStampsConversation(t *testing.T) {
	convID := uuid.New()
	c := NewCollector(convID)

	in := Frame{Event: "message_start", Data: []byte(`{"type":"message_start","message_id":"msg_abc"}`)}
	out, emit, err := Translate(in, c, "req-1")
	if err != nil {
		t.Fatalf("Translate: %v", err)
	}
	if !emit {
		t.Fatalf("expected emit=true")
	}
	var decoded map[string]any
	if err := json.Unmarshal(out.Data, &decoded); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if decoded["conversation_id"] != convID.String() {
		t.Errorf("conversation_id: got %v want %v", decoded["conversation_id"], convID)
	}
	if mid, _ := decoded["message_id"].(string); mid == "msg_abc" || mid == "" {
		t.Errorf("message_id should be a server-allocated uuid, got %q", mid)
	}
	if _, err := uuid.Parse(decoded["message_id"].(string)); err != nil {
		t.Errorf("message_id not a uuid: %v", err)
	}
}

// TestTranslateContentDeltaRewritesShape converts the AI Service
// `{text}` form into the openapi `{index, delta: {text}}` shape. The
// index is taken from the most-recently-opened block so callers do
// not have to track it.
func TestTranslateContentDeltaRewritesShape(t *testing.T) {
	c := NewCollector(uuid.New())
	// Open a block at index 3 first.
	_, _, _ = Translate(Frame{
		Event: "content_block_start",
		Data:  []byte(`{"type":"content_block_start","index":3,"block_type":"text"}`),
	}, c, "")
	_ = c.Observe(Frame{
		Event: "content_block_start",
		Data:  []byte(`{"type":"content_block_start","index":3,"block_type":"text"}`),
	})

	in := Frame{Event: "content_delta", Data: []byte(`{"type":"content_delta","text":"hello"}`)}
	out, emit, err := Translate(in, c, "")
	if err != nil || !emit {
		t.Fatalf("Translate: err=%v emit=%v", err, emit)
	}
	var decoded map[string]any
	_ = json.Unmarshal(out.Data, &decoded)
	if decoded["index"].(float64) != 3 {
		t.Errorf("index: got %v want 3", decoded["index"])
	}
	delta := decoded["delta"].(map[string]any)
	if delta["text"] != "hello" {
		t.Errorf("delta.text: got %v", delta["text"])
	}
}

// TestTranslateMessageStopShape flattens the AI Service usage object
// to the openapi-documented tokens_used integer and carries the
// server-allocated message_id.
func TestTranslateMessageStopShape(t *testing.T) {
	c := NewCollector(uuid.New())
	in := Frame{Event: "message_stop", Data: []byte(
		`{"type":"message_stop","stop_reason":"end_turn","usage":{"model":"claude","input_tokens":10,"output_tokens":25,"cost_usd":0.002}}`,
	)}
	out, emit, err := Translate(in, c, "")
	if err != nil || !emit {
		t.Fatalf("Translate: err=%v emit=%v", err, emit)
	}
	var decoded map[string]any
	_ = json.Unmarshal(out.Data, &decoded)
	if decoded["tokens_used"].(float64) != 35 {
		t.Errorf("tokens_used: got %v want 35", decoded["tokens_used"])
	}
	if decoded["stop_reason"] != "end_turn" {
		t.Errorf("stop_reason: got %v", decoded["stop_reason"])
	}
	if _, err := uuid.Parse(decoded["message_id"].(string)); err != nil {
		t.Errorf("message_id not uuid: %v", err)
	}
}

// TestTranslateErrorWrapsInEnvelope reshapes the AI Service `{message,
// code}` into the openapi ErrorEnvelope form and stamps request_id
// so Sentry can cross-correlate mid-stream failures (TD-048 mostly
// lives on the AI Service side, but Core API pre-populates request_id
// unconditionally).
func TestTranslateErrorWrapsInEnvelope(t *testing.T) {
	c := NewCollector(uuid.New())
	in := Frame{Event: "error", Data: []byte(`{"type":"error","message":"upstream blew up","code":"LLM_TIMEOUT"}`)}
	out, emit, err := Translate(in, c, "req-xyz")
	if err != nil || !emit {
		t.Fatalf("Translate: err=%v emit=%v", err, emit)
	}
	var decoded map[string]any
	_ = json.Unmarshal(out.Data, &decoded)
	env := decoded["error"].(map[string]any)
	if env["code"] != "LLM_TIMEOUT" {
		t.Errorf("code: got %v", env["code"])
	}
	if env["message"] != "upstream blew up" {
		t.Errorf("message: got %v", env["message"])
	}
	if env["request_id"] != "req-xyz" {
		t.Errorf("request_id: got %v", env["request_id"])
	}
}

// TestTranslateErrorFallbackCode injects AI_STREAM_ERROR when the
// upstream omits a code — openapi clients always get a machine-
// readable bucket to branch on.
func TestTranslateErrorFallbackCode(t *testing.T) {
	c := NewCollector(uuid.New())
	in := Frame{Event: "error", Data: []byte(`{"type":"error","message":"boom"}`)}
	out, _, _ := Translate(in, c, "")
	if !strings.Contains(string(out.Data), `"code":"AI_STREAM_ERROR"`) {
		t.Errorf("expected AI_STREAM_ERROR fallback: %s", out.Data)
	}
}

// TestTranslateToolResultWrapsContent wraps the AI Service bare
// string `content` in the openapi AIMessageContentText[] shape.
func TestTranslateToolResultWrapsContent(t *testing.T) {
	c := NewCollector(uuid.New())
	in := Frame{Event: "tool_result", Data: []byte(
		`{"type":"tool_result","tool_use_id":"t-1","is_error":false,"content":"42"}`,
	)}
	out, emit, err := Translate(in, c, "")
	if err != nil || !emit {
		t.Fatalf("Translate: err=%v emit=%v", err, emit)
	}
	var decoded map[string]any
	_ = json.Unmarshal(out.Data, &decoded)
	arr := decoded["content"].([]any)
	if len(arr) != 1 {
		t.Fatalf("content array len: got %d want 1", len(arr))
	}
	first := arr[0].(map[string]any)
	if first["type"] != "text" || first["text"] != "42" {
		t.Errorf("content[0]: got %v", first)
	}
}

// TestTranslateUnknownEventDropped keeps the proxy forward-
// compatible: a new AI Service event the Core API has never seen
// must not crash the stream.
func TestTranslateUnknownEventDropped(t *testing.T) {
	c := NewCollector(uuid.New())
	in := Frame{Event: "something_new", Data: []byte(`{}`)}
	_, emit, err := Translate(in, c, "")
	if err != nil || emit {
		t.Errorf("expected drop, got err=%v emit=%v", err, emit)
	}
}

// TestCollectorContentBlocksJSONOrder preserves index order even
// when AI frames arrive out of monotonic order (synthetic tool_use
// indexing is derived from the last seen index).
func TestCollectorContentBlocksJSONOrder(t *testing.T) {
	c := NewCollector(uuid.New())
	_ = c.Observe(Frame{Event: "content_block_start", Data: []byte(`{"index":0,"block_type":"text"}`)})
	_ = c.Observe(Frame{Event: "content_delta", Data: []byte(`{"text":"hi"}`)})
	_ = c.Observe(Frame{Event: "content_block_stop", Data: []byte(`{"index":0}`)})
	_ = c.Observe(Frame{Event: "tool_use", Data: []byte(`{"tool_use_id":"t-1","name":"portfolio","input":{"x":1}}`)})

	raw, err := c.ContentBlocksJSON()
	if err != nil {
		t.Fatalf("ContentBlocksJSON: %v", err)
	}
	var arr []map[string]any
	_ = json.Unmarshal(raw, &arr)
	if len(arr) != 2 {
		t.Fatalf("len: got %d want 2 — %s", len(arr), raw)
	}
	if arr[0]["type"] != "text" || arr[0]["text"] != "hi" {
		t.Errorf("block 0: got %v", arr[0])
	}
	if arr[1]["type"] != "tool_use" || arr[1]["tool_use_id"] != "t-1" {
		t.Errorf("block 1: got %v", arr[1])
	}
}

// TestCollectorTotalTokensSum confirms the value persisted to
// ai_messages.tokens_used is input + output from message_stop.
func TestCollectorTotalTokensSum(t *testing.T) {
	c := NewCollector(uuid.New())
	_ = c.Observe(Frame{Event: "message_stop", Data: []byte(
		`{"stop_reason":"end_turn","usage":{"model":"claude","input_tokens":7,"output_tokens":13,"cost_usd":0.001}}`,
	)})
	if got := c.TotalTokens(); got != 20 {
		t.Errorf("TotalTokens: got %d want 20", got)
	}
	if !c.GotStop {
		t.Errorf("GotStop should be true after message_stop")
	}
}
