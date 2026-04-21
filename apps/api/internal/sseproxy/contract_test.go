package sseproxy

// Contract-level tests for the SSE frame shape shared between
// Core API and the AI Service. The AI Service is a Python service
// with its own translator and models; Core API carries an
// independent parser + translator here. TD-051 logs the duplication;
// until a shared spec lives in a single place, this file pins the
// contract down with a fixture so silent drift fails loudly.
//
// Fixture: testdata/canonical_stream.txt — hand-authored stream
// that exercises every frame type the AI Service is expected to
// emit today: message_start, content_block_start, content_delta (x3),
// content_block_stop, tool_use, tool_result, message_stop. Update
// the fixture whenever the contract evolves; tests here should
// continue to hold.
//
// These are unit tests (no //go:build tag), so they run on every
// `go test ./...` and guard the contract even when integration tests
// are skipped.

import (
	"context"
	"encoding/json"
	"io"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
)

func loadFixture(t *testing.T, name string) string {
	t.Helper()
	b, err := os.ReadFile("testdata/" + name)
	if err != nil {
		t.Fatalf("load fixture %s: %v", name, err)
	}
	return string(b)
}

// TestContract_CanonicalStream_ResultFieldsExtracted asserts every
// Result field populated from a well-formed stream. If the collector
// or translator starts dropping data, the corresponding field here
// returns to its zero value and the subtest fails with a specific
// pointer to what broke.
func TestContract_CanonicalStream_ResultFieldsExtracted(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	out := &syncBuffer{}
	res, err := Run(ctx, StreamOpts{
		Upstream:       io.NopCloser(strings.NewReader(loadFixture(t, "canonical_stream.txt"))),
		Writer:         out,
		ConversationID: uuid.New(),
		RequestID:      "req-canonical-1",
	})
	if err != nil {
		t.Fatalf("Run: %v", err)
	}
	if res == nil {
		t.Fatal("Result is nil")
	}

	t.Run("message_stop_detected", func(t *testing.T) {
		if !res.GotMessageStop {
			t.Fatal("GotMessageStop = false; expected true after fixture ends with message_stop frame")
		}
	})

	t.Run("usage_from_message_stop", func(t *testing.T) {
		if res.Model != "claude-3-5-sonnet" {
			t.Errorf("Model = %q, want claude-3-5-sonnet", res.Model)
		}
		if res.InputTokens != 420 {
			t.Errorf("InputTokens = %d, want 420", res.InputTokens)
		}
		if res.OutputTokens != 87 {
			t.Errorf("OutputTokens = %d, want 87", res.OutputTokens)
		}
		if res.TotalTokens != 420+87 {
			t.Errorf("TotalTokens = %d, want 507", res.TotalTokens)
		}
		if res.CostUSD < 0.0025 || res.CostUSD > 0.0027 {
			t.Errorf("CostUSD = %v, want ~0.002565", res.CostUSD)
		}
	})

	t.Run("stop_reason_carried", func(t *testing.T) {
		if res.StopReason != "end_turn" {
			t.Errorf("StopReason = %q, want end_turn", res.StopReason)
		}
	})

	t.Run("content_blocks_json_shape", func(t *testing.T) {
		if len(res.ContentBlocksJSON) == 0 {
			t.Fatal("ContentBlocksJSON is empty")
		}
		var blocks []map[string]any
		if err := json.Unmarshal(res.ContentBlocksJSON, &blocks); err != nil {
			t.Fatalf("ContentBlocksJSON not valid JSON: %v\nraw: %s", err, res.ContentBlocksJSON)
		}
		if len(blocks) != 3 {
			t.Fatalf("blocks = %d, want 3 (text + tool_use + tool_result)\npayload: %s", len(blocks), res.ContentBlocksJSON)
		}
		// Block 0: text — concatenation of three content_delta frames.
		if blocks[0]["type"] != "text" {
			t.Errorf("blocks[0].type = %v, want text", blocks[0]["type"])
		}
		if blocks[0]["text"] != "The portfolio is up 2.3%" {
			t.Errorf("blocks[0].text = %q, want %q", blocks[0]["text"], "The portfolio is up 2.3%")
		}
		// Block 1: tool_use — carries input verbatim.
		if blocks[1]["type"] != "tool_use" {
			t.Errorf("blocks[1].type = %v, want tool_use", blocks[1]["type"])
		}
		if blocks[1]["name"] != "get_portfolio" {
			t.Errorf("blocks[1].name = %v, want get_portfolio", blocks[1]["name"])
		}
	})
}

// TestContract_CanonicalStream_OutboundFrames asserts the re-serialised
// frames the proxy writes to the client. This is the openapi
// AIChatStreamEvent contract: field names (delta.text), types, and
// the event-name set clients bind to.
func TestContract_CanonicalStream_OutboundFrames(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	out := &syncBuffer{}
	_, err := Run(ctx, StreamOpts{
		Upstream:       io.NopCloser(strings.NewReader(loadFixture(t, "canonical_stream.txt"))),
		Writer:         out,
		ConversationID: uuid.MustParse("00000000-0000-4000-8000-000000000001"),
		RequestID:      "req-canonical-2",
	})
	if err != nil {
		t.Fatalf("Run: %v", err)
	}
	body := out.String()

	// Every expected outbound event name must appear as an event: line.
	for _, name := range []string{
		"event: message_start",
		"event: content_block_start",
		"event: content_delta",
		"event: content_block_stop",
		"event: tool_use",
		"event: tool_result",
		"event: message_stop",
	} {
		if !strings.Contains(body, name) {
			t.Errorf("outbound stream missing %q\nbody:\n%s", name, body)
		}
	}

	// content_delta frames must carry {"delta":{"text":...}}. This
	// is the exact shape the openapi spec declares (TD-068 tracks
	// the schema cleanup; this test pins the runtime behavior).
	if !strings.Contains(body, `"delta":{"text":"The portfolio "}`) {
		t.Error("first content_delta frame missing expected delta.text shape")
	}

	// message_stop echoes tokens_used computed by the translator.
	if !strings.Contains(body, `"tokens_used":507`) {
		t.Errorf("message_stop frame missing tokens_used=507\nbody tail: %s", safeTail(body, 500))
	}
}

// TestContract_BadJSONInFrame_GracefulSkip asserts that a malformed
// JSON payload inside an otherwise-well-framed SSE stream is
// tolerated: the proxy drops the corrupt frame, the stream keeps
// flowing, and if message_stop arrives afterwards the Run completes
// cleanly with partial content. This is the desired "best-effort"
// streaming semantics — one corrupt frame must not kill the whole
// turn.
//
// Important invariant: the surviving content block reflects only
// the deltas that parsed OK. If the contract ever changes to abort
// on bad-JSON, this test fails and forces a conscious decision
// rather than silent regression.
func TestContract_BadJSONInFrame_GracefulSkip(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	stream := strings.Join([]string{
		"event: message_start",
		`data: {"type":"message_start","message_id":"msg_bad"}`,
		"",
		"event: content_block_start",
		`data: {"type":"content_block_start","index":0,"block_type":"text"}`,
		"",
		"event: content_delta",
		`data: {"type":"content_delta","text":"good "}`,
		"",
		"event: content_delta",
		`data: {this-is-not-json`,
		"",
		"event: content_delta",
		`data: {"type":"content_delta","text":"recovery"}`,
		"",
		"event: content_block_stop",
		`data: {"type":"content_block_stop","index":0}`,
		"",
		"event: message_stop",
		`data: {"type":"message_stop","stop_reason":"end_turn","usage":{"model":"claude","input_tokens":1,"output_tokens":1,"cost_usd":0.0001}}`,
		"",
		"",
	}, "\n")

	out := &syncBuffer{}
	res, err := Run(ctx, StreamOpts{
		Upstream:       io.NopCloser(strings.NewReader(stream)),
		Writer:         out,
		ConversationID: uuid.New(),
		RequestID:      "req-bad-json",
	})
	if err != nil {
		t.Fatalf("Run returned error for bad-JSON stream: %v (expected graceful skip)", err)
	}
	if res == nil {
		t.Fatal("Result nil after bad-JSON graceful skip")
	}
	if !res.GotMessageStop {
		t.Error("GotMessageStop = false; message_stop frame should still be seen after a corrupt delta")
	}

	// Content should contain the surviving deltas but not the corrupt one.
	var blocks []map[string]any
	if err := json.Unmarshal(res.ContentBlocksJSON, &blocks); err != nil {
		t.Fatalf("ContentBlocksJSON invalid: %v", err)
	}
	if len(blocks) == 0 {
		t.Fatal("expected at least one block")
	}
	text, _ := blocks[0]["text"].(string)
	if !strings.Contains(text, "good ") || !strings.Contains(text, "recovery") {
		t.Errorf("surviving block text = %q, want to contain both \"good \" and \"recovery\"", text)
	}
}

// TestContract_ErrorEventTranslated asserts an upstream `error`
// frame is rewritten into the openapi error envelope and the
// Result.ErrorCode / ErrorMessage fields are populated for
// handler-side logging.
func TestContract_ErrorEventTranslated(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	stream := strings.Join([]string{
		"event: message_start",
		`data: {"type":"message_start","message_id":"msg_err"}`,
		"",
		"event: error",
		`data: {"type":"error","code":"UPSTREAM_TIMEOUT","message":"Anthropic gateway returned 504"}`,
		"",
		"",
	}, "\n")

	out := &syncBuffer{}
	res, err := Run(ctx, StreamOpts{
		Upstream:       io.NopCloser(strings.NewReader(stream)),
		Writer:         out,
		ConversationID: uuid.New(),
		RequestID:      "req-err-1",
	})
	if err != nil {
		t.Fatalf("Run: %v", err)
	}
	if res == nil {
		t.Fatal("Result nil")
	}
	if res.GotMessageStop {
		t.Error("GotMessageStop = true on error-only stream; persist would mis-fire")
	}

	body := out.String()
	if !strings.Contains(body, "event: error") {
		t.Errorf("outbound body missing event: error line\nbody: %s", body)
	}
	// request_id from StreamOpts must be carried into the envelope.
	if !strings.Contains(body, `"request_id":"req-err-1"`) {
		t.Errorf("error envelope missing request_id\nbody: %s", body)
	}
	// code passthrough.
	if !strings.Contains(body, `"code":"UPSTREAM_TIMEOUT"`) {
		t.Errorf("error envelope missing upstream code\nbody: %s", body)
	}
}

// TestContract_ErrorEventDefaultCode asserts the translator falls
// back to AI_STREAM_ERROR when upstream emits an error frame with
// an empty code field — machine-readable contract for clients.
func TestContract_ErrorEventDefaultCode(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	stream := strings.Join([]string{
		"event: error",
		`data: {"type":"error","code":"","message":"something went wrong"}`,
		"",
		"",
	}, "\n")

	out := &syncBuffer{}
	_, err := Run(ctx, StreamOpts{
		Upstream:       io.NopCloser(strings.NewReader(stream)),
		Writer:         out,
		ConversationID: uuid.New(),
		RequestID:      "",
	})
	if err != nil {
		t.Fatalf("Run: %v", err)
	}
	if !strings.Contains(out.String(), `"code":"AI_STREAM_ERROR"`) {
		t.Errorf("default code AI_STREAM_ERROR not emitted\nbody: %s", out.String())
	}
}

// TestContract_Run_RequiresUpstream asserts the constructor-level
// precondition: callers that forget to supply Upstream get a
// predictable error instead of a nil-pointer panic.
func TestContract_Run_RequiresUpstream(t *testing.T) {
	_, err := Run(context.Background(), StreamOpts{
		Writer:         &syncBuffer{},
		ConversationID: uuid.New(),
	})
	if err == nil {
		t.Fatal("Run with nil Upstream returned nil error")
	}
	if !strings.Contains(err.Error(), "Upstream") {
		t.Errorf("error = %q, want to mention Upstream", err.Error())
	}
}

// TestContract_Run_RequiresWriter mirrors the Upstream precondition
// for Writer. This protects handlers that build a StreamOpts
// conditionally and forget to set the buffered writer branch.
func TestContract_Run_RequiresWriter(t *testing.T) {
	_, err := Run(context.Background(), StreamOpts{
		Upstream:       io.NopCloser(strings.NewReader("")),
		ConversationID: uuid.New(),
	})
	if err == nil {
		t.Fatal("Run with nil Writer returned nil error")
	}
	if !strings.Contains(err.Error(), "Writer") {
		t.Errorf("error = %q, want to mention Writer", err.Error())
	}
}

// errorWriter always fails a Write — used to exercise writeFrame's
// error return path and the handler's consumer-disconnect story.
type errorWriter struct{}

func (errorWriter) Write(_ []byte) (int, error) { return 0, io.ErrClosedPipe }

// TestContract_WriterFailure_ReturnsError asserts that a write
// failure mid-stream (simulating a dropped client TCP) surfaces as
// a non-nil Run error. The handler uses this signal to log the
// client disconnect and short-circuit further work.
func TestContract_WriterFailure_ReturnsError(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := Run(ctx, StreamOpts{
		Upstream:       io.NopCloser(strings.NewReader(loadFixture(t, "canonical_stream.txt"))),
		Writer:         errorWriter{},
		ConversationID: uuid.New(),
		RequestID:      "req-writer-fail",
	})
	if err == nil {
		t.Error("Run returned nil error for failing writer; handler would never learn the client dropped")
	}
}

// TestContract_FlushFailure_ReturnsError covers the Flush error
// path. fasthttp surfaces a dropped TCP connection as a Flush error
// before the next Write hits an error state, so Flush is the primary
// client-disconnect sentinel in production.
func TestContract_FlushFailure_ReturnsError(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	out := &syncBuffer{}
	_, err := Run(ctx, StreamOpts{
		Upstream:       io.NopCloser(strings.NewReader(loadFixture(t, "canonical_stream.txt"))),
		Writer:         out,
		Flush:          func() error { return io.ErrClosedPipe },
		ConversationID: uuid.New(),
		RequestID:      "req-flush-fail",
	})
	if err == nil {
		t.Error("Run returned nil error when Flush returned ErrClosedPipe")
	}
}

// TestContract_NewSyntheticMessageID_ReturnsValidUUID keeps the one
// exported constructor covered — it's the fallback when the AI
// Service omits a message_id on message_start (should not happen
// in practice but the openapi contract requires the field so the
// collector generates one).
func TestContract_NewSyntheticMessageID_ReturnsValidUUID(t *testing.T) {
	id1 := NewSyntheticMessageID()
	id2 := NewSyntheticMessageID()
	if id1 == uuid.Nil || id2 == uuid.Nil {
		t.Fatal("NewSyntheticMessageID returned uuid.Nil")
	}
	if id1 == id2 {
		t.Errorf("NewSyntheticMessageID collisions: %s == %s", id1, id2)
	}
}

func safeTail(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[len(s)-n:]
}
