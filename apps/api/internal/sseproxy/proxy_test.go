package sseproxy

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/google/uuid"
)

// syncBuffer is a goroutine-safe buffer we can point sseproxy Run's
// Writer at. The happy-path proxy test asserts on accumulated SSE
// bytes after Run returns.
type syncBuffer struct {
	mu  sync.Mutex
	buf bytes.Buffer
}

func (b *syncBuffer) Write(p []byte) (int, error) {
	b.mu.Lock()
	defer b.mu.Unlock()
	return b.buf.Write(p)
}

func (b *syncBuffer) String() string {
	b.mu.Lock()
	defer b.mu.Unlock()
	return b.buf.String()
}

// canonicalStream returns a complete, well-formed AI Service stream
// with a text block, a tool_use, and message_stop. Useful for
// happy-path Run tests.
func canonicalStream() string {
	return strings.Join([]string{
		"event: message_start",
		`data: {"type":"message_start","message_id":"msg_upstream"}`,
		"",
		"event: content_block_start",
		`data: {"type":"content_block_start","index":0,"block_type":"text"}`,
		"",
		"event: content_delta",
		`data: {"type":"content_delta","text":"Hello "}`,
		"",
		"event: content_delta",
		`data: {"type":"content_delta","text":"world"}`,
		"",
		"event: content_block_stop",
		`data: {"type":"content_block_stop","index":0}`,
		"",
		"event: tool_use",
		`data: {"type":"tool_use","tool_use_id":"t-1","name":"portfolio","input":{"id":"abc"}}`,
		"",
		"event: message_stop",
		`data: {"type":"message_stop","stop_reason":"end_turn","usage":{"model":"claude","input_tokens":10,"output_tokens":25,"cost_usd":0.003}}`,
		"",
		"",
	}, "\n")
}

// TestRunHappyPath exercises the whole pipeline: reader → collector
// → translator → writer. The test asserts on collected content
// blocks, tokens, re-serialised outbound frames, and GotMessageStop.
func TestRunHappyPath(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	convID := uuid.New()
	out := &syncBuffer{}
	res, err := Run(ctx, StreamOpts{
		Upstream:       io.NopCloser(strings.NewReader(canonicalStream())),
		Writer:         out,
		ConversationID: convID,
		RequestID:      "req-1",
		Heartbeat:      5 * time.Second, // well above stream length
	})
	if err != nil {
		t.Fatalf("Run: %v", err)
	}
	if !res.GotMessageStop {
		t.Errorf("GotMessageStop should be true")
	}
	if res.TotalTokens != 35 {
		t.Errorf("TotalTokens: got %d want 35", res.TotalTokens)
	}
	if res.Model != "claude" {
		t.Errorf("Model: got %q", res.Model)
	}
	if res.StopReason != "end_turn" {
		t.Errorf("StopReason: got %q", res.StopReason)
	}

	// Outbound frames should carry conversation_id + uuid message_id
	// + openapi delta shape.
	outStr := out.String()
	if !strings.Contains(outStr, `"conversation_id":"`+convID.String()+`"`) {
		t.Errorf("missing conversation_id in output")
	}
	if strings.Contains(outStr, `"message_id":"msg_upstream"`) {
		t.Errorf("upstream message_id should have been rewritten to server uuid")
	}
	if !strings.Contains(outStr, `"delta":{"text":"Hello "}`) {
		t.Errorf("delta shape not rewritten; output:\n%s", outStr)
	}

	// Content blocks JSON has both the text block and the tool_use.
	var blocks []map[string]any
	if err := json.Unmarshal(res.ContentBlocksJSON, &blocks); err != nil {
		t.Fatalf("decode blocks: %v", err)
	}
	if len(blocks) != 2 {
		t.Fatalf("blocks len: got %d want 2", len(blocks))
	}
	if blocks[0]["text"] != "Hello world" {
		t.Errorf("combined text: got %v", blocks[0]["text"])
	}
	if blocks[1]["name"] != "portfolio" {
		t.Errorf("tool_use name: got %v", blocks[1]["name"])
	}
}

// TestRunMidStreamDrop models an upstream TCP drop: the reader hits
// ErrUnexpectedEOF before any message_stop arrives. Run must return
// a Result with GotMessageStop=false so the handler can skip persist.
func TestRunMidStreamDrop(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	partial := "event: content_delta\ndata: {\"type\":\"content_delta\",\"text"
	res, err := Run(ctx, StreamOpts{
		Upstream:       io.NopCloser(strings.NewReader(partial)),
		Writer:         &syncBuffer{},
		ConversationID: uuid.New(),
		Heartbeat:      5 * time.Second,
	})
	if err == nil {
		t.Errorf("expected non-nil error for mid-stream drop")
	}
	if res.GotMessageStop {
		t.Errorf("GotMessageStop must be false on drop")
	}
}

// TestRunMessageStopErrorPersists covers the revised AC #3: when the
// upstream emits an error frame but then still delivers
// message_stop, GotMessageStop=true + ErrorCode / ErrorMessage are
// both populated. Handler persists the turn — tokens were spent.
func TestRunMessageStopErrorPersists(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	src := strings.Join([]string{
		"event: message_start",
		`data: {"type":"message_start","message_id":"m-1"}`,
		"",
		"event: content_block_start",
		`data: {"type":"content_block_start","index":0,"block_type":"text"}`,
		"",
		"event: content_delta",
		`data: {"type":"content_delta","text":"partial"}`,
		"",
		"event: error",
		`data: {"type":"error","message":"llm timeout","code":"LLM_TIMEOUT"}`,
		"",
		"event: message_stop",
		`data: {"type":"message_stop","stop_reason":"error","usage":{"model":"claude","input_tokens":5,"output_tokens":2,"cost_usd":0.0001}}`,
		"",
		"",
	}, "\n")

	res, err := Run(ctx, StreamOpts{
		Upstream:       io.NopCloser(strings.NewReader(src)),
		Writer:         &syncBuffer{},
		ConversationID: uuid.New(),
		Heartbeat:      5 * time.Second,
	})
	if err != nil {
		t.Fatalf("Run: %v", err)
	}
	if !res.GotMessageStop {
		t.Errorf("GotMessageStop should be true — message_stop arrived after error")
	}
	if res.StopReason != "error" {
		t.Errorf("StopReason: got %q", res.StopReason)
	}
	if res.ErrorCode != "LLM_TIMEOUT" {
		t.Errorf("ErrorCode: got %q", res.ErrorCode)
	}
}

// TestRunHeartbeatEmitted proves the writer goroutine injects a
// keep-alive comment when the upstream stalls. A slow upstream that
// blocks past Heartbeat duration should see a `: keep-alive` comment
// appear in the output before the real frames.
func TestRunHeartbeatEmitted(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	// Pipe-backed upstream so we can delay the first byte past the
	// heartbeat tick.
	pr, pw := io.Pipe()
	go func() {
		time.Sleep(80 * time.Millisecond)
		_, _ = pw.Write([]byte(canonicalStream()))
		_ = pw.Close()
	}()

	out := &syncBuffer{}
	_, err := Run(ctx, StreamOpts{
		Upstream:       pr,
		Writer:         out,
		ConversationID: uuid.New(),
		Heartbeat:      20 * time.Millisecond,
	})
	if err != nil {
		t.Fatalf("Run: %v", err)
	}
	if !strings.Contains(out.String(), ": keep-alive") {
		t.Errorf("expected heartbeat in output, got:\n%s", out.String())
	}
}

// TestRunContextCancelReturns ensures a client disconnect (ctx
// cancelled) unblocks Run promptly even if the upstream is still
// producing.
func TestRunContextCancelReturns(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())

	pr, pw := io.Pipe()
	go func() {
		// Dribble forever; the test cancels ctx before we finish.
		for i := 0; i < 100; i++ {
			_, _ = pw.Write([]byte("event: noop\ndata: {}\n\n"))
			time.Sleep(5 * time.Millisecond)
		}
		_ = pw.Close()
	}()

	done := make(chan error, 1)
	go func() {
		_, err := Run(ctx, StreamOpts{
			Upstream:       pr,
			Writer:         &syncBuffer{},
			ConversationID: uuid.New(),
			Heartbeat:      5 * time.Second,
		})
		done <- err
	}()

	time.Sleep(30 * time.Millisecond)
	cancel()

	select {
	case err := <-done:
		if err == nil {
			t.Errorf("expected ctx error on cancel")
		}
	case <-time.After(time.Second):
		t.Fatalf("Run did not return within 1s of cancel")
	}
}

// TestRunSyncModeDiscardsFrames uses io.Discard as the writer — the
// proxy still collects content blocks + usage so the non-streaming
// /ai/chat handler can reuse the same pipeline. Heartbeat is large
// so it never fires in this short test.
func TestRunSyncModeDiscardsFrames(t *testing.T) {
	ctx := context.Background()
	res, err := Run(ctx, StreamOpts{
		Upstream:       io.NopCloser(strings.NewReader(canonicalStream())),
		Writer:         io.Discard,
		ConversationID: uuid.New(),
		Heartbeat:      10 * time.Second,
	})
	if err != nil {
		t.Fatalf("Run: %v", err)
	}
	if !res.GotMessageStop {
		t.Errorf("GotMessageStop should be true")
	}
	if res.TotalTokens != 35 {
		t.Errorf("TotalTokens: got %d", res.TotalTokens)
	}
}
