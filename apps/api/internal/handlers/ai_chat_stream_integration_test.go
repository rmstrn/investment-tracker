//go:build integration

package handlers_test

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

// fakeAIStream bootstraps an httptest.Server that answers
// POST /internal/chat/stream with a caller-supplied SSE script. It
// captures the inbound body + headers for assertions. Use
// `delayFirstByte` to simulate a slow upstream (heartbeat coverage).
type fakeAIStream struct {
	*httptest.Server
	gotAuth   string
	gotUserID string
	gotReqID  string
	gotAccept string
	gotPath   string
	gotBody   []byte
}

// newFakeAIStream serves `script` as the SSE body. When status is
// non-2xx the script is returned as-is (handy for 401/500 tests).
func newFakeAIStream(t *testing.T, status int, script string, delayFirstByte time.Duration) *fakeAIStream {
	t.Helper()
	fs := &fakeAIStream{}
	fs.Server = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fs.gotAuth = r.Header.Get("Authorization")
		fs.gotUserID = r.Header.Get("X-User-Id")
		fs.gotReqID = r.Header.Get("X-Request-Id")
		fs.gotAccept = r.Header.Get("Accept")
		fs.gotPath = r.URL.Path
		raw, _ := io.ReadAll(r.Body)
		fs.gotBody = raw
		if status >= 200 && status < 300 {
			w.Header().Set("Content-Type", "text/event-stream")
			w.Header().Set("X-Accel-Buffering", "no")
		}
		w.WriteHeader(status)
		flusher, _ := w.(http.Flusher)
		if delayFirstByte > 0 {
			if flusher != nil {
				flusher.Flush()
			}
			time.Sleep(delayFirstByte)
		}
		_, _ = w.Write([]byte(script))
		if flusher != nil {
			flusher.Flush()
		}
	}))
	t.Cleanup(fs.Close)
	return fs
}

// canonicalChatScript is a minimal well-formed stream: one text
// block, one tool_use, clean message_stop with non-zero usage.
func canonicalChatScript() string {
	return strings.Join([]string{
		"event: message_start",
		`data: {"type":"message_start","message_id":"msg_up"}`,
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
		"event: message_stop",
		`data: {"type":"message_stop","stop_reason":"end_turn","usage":{"model":"claude","input_tokens":10,"output_tokens":20,"cost_usd":0.0015}}`,
		"",
		"",
	}, "\n")
}

// seedChatConversation is a thin wrapper over the shared
// seedConversation helper that drops the timestamp / title args for
// chat tests where they are irrelevant.
func seedChatConversation(t *testing.T, userID uuid.UUID) uuid.UUID {
	t.Helper()
	return seedConversation(t, userID, "Test thread", time.Now().UTC())
}

// waitForAssistantMessage polls ai_messages until an assistant row
// for the given conversation appears. Used by stream tests where
// persist runs on a background goroutine.
func waitForAssistantMessage(t *testing.T, convID uuid.UUID, timeout time.Duration) {
	t.Helper()
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		var count int
		err := testPool.QueryRow(context.Background(),
			`SELECT COUNT(*)::int FROM ai_messages WHERE conversation_id = $1 AND role = 'assistant'`,
			convID).Scan(&count)
		if err == nil && count > 0 {
			return
		}
		time.Sleep(20 * time.Millisecond)
	}
	t.Fatalf("assistant message not persisted within %v", timeout)
}

// TestChatStream_HappyPath_PersistsAndReSerialises exercises the
// end-to-end flow. We expect: 200 text/event-stream, openapi-
// compliant frames in the body, user + assistant rows in ai_messages,
// one ai_usage row, conversation.updated_at bumped.
func TestChatStream_HappyPath_PersistsAndReSerialises(t *testing.T) {
	resetDB(t)
	fake := newFakeAIStream(t, http.StatusOK, canonicalChatScript(), 0)
	a := newTestAppWithAI(t, fake.URL, "tok")
	uid := seedUser(t, "plus")
	convID := seedChatConversation(t, uid)

	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/chat/stream",
		uid.String(), testSharedInternalToken, map[string]any{
			"conversation_id": convID.String(),
			"message":         map[string]any{"content": []map[string]any{{"type": "text", "text": "hi"}}},
		})
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d body = %s", resp.StatusCode, raw)
	}
	if ct := resp.Header.Get("Content-Type"); !strings.HasPrefix(ct, "text/event-stream") {
		t.Errorf("Content-Type = %q", ct)
	}

	// Re-serialised frames must carry conversation_id + openapi
	// delta shape + tokens_used integer.
	body := string(raw)
	if !strings.Contains(body, `"conversation_id":"`+convID.String()+`"`) {
		t.Errorf("conversation_id missing in message_start: %s", body)
	}
	if strings.Contains(body, `"message_id":"msg_up"`) {
		t.Errorf("upstream message_id leaked — should have been rewritten")
	}
	if !strings.Contains(body, `"delta":{"text":"Hello "}`) {
		t.Errorf("content_delta not rewritten to openapi shape: %s", body)
	}
	if !strings.Contains(body, `"tokens_used":30`) {
		t.Errorf("message_stop should carry tokens_used=30: %s", body)
	}

	// Wait for background persist.
	waitForAssistantMessage(t, convID, 2*time.Second)

	// One user + one assistant row.
	var userN, asstN int
	_ = testPool.QueryRow(context.Background(),
		`SELECT COUNT(*)::int FROM ai_messages WHERE conversation_id=$1 AND role='user'`, convID).
		Scan(&userN)
	_ = testPool.QueryRow(context.Background(),
		`SELECT COUNT(*)::int FROM ai_messages WHERE conversation_id=$1 AND role='assistant'`, convID).
		Scan(&asstN)
	if userN != 1 || asstN != 1 {
		t.Errorf("message rows: user=%d assistant=%d", userN, asstN)
	}

	// ai_usage row matches the usage reported by upstream.
	var model string
	var in, out int
	err := testPool.QueryRow(context.Background(),
		`SELECT model, input_tokens, output_tokens FROM ai_usage WHERE user_id = $1`, uid).
		Scan(&model, &in, &out)
	if err != nil {
		t.Fatalf("ai_usage row missing: %v", err)
	}
	if model != "claude" || in != 10 || out != 20 {
		t.Errorf("usage row: model=%q in=%d out=%d", model, in, out)
	}

	// Upstream contract: headers stamped + body includes flattened
	// message + correct path.
	if fake.gotPath != "/internal/chat/stream" {
		t.Errorf("upstream path = %q", fake.gotPath)
	}
	if fake.gotAccept != "text/event-stream" {
		t.Errorf("upstream Accept = %q", fake.gotAccept)
	}
	if !strings.Contains(string(fake.gotBody), `"message":"hi"`) {
		t.Errorf("upstream body missing flattened message: %s", fake.gotBody)
	}
}

// TestChatStream_Upstream401Returns502 ensures a pre-stream auth
// failure surfaces as a JSON 502 — the client never sees a
// text/event-stream response with no actual stream behind it.
func TestChatStream_Upstream401Returns502(t *testing.T) {
	resetDB(t)
	fake := newFakeAIStream(t, http.StatusUnauthorized, `{"detail":"bad"}`, 0)
	a := newTestAppWithAI(t, fake.URL, "wrong-token")
	uid := seedUser(t, "plus")
	convID := seedChatConversation(t, uid)

	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/chat/stream",
		uid.String(), testSharedInternalToken, map[string]any{
			"conversation_id": convID.String(),
			"message":         map[string]any{"content": []map[string]any{{"type": "text", "text": "hi"}}},
		})
	if resp.StatusCode != fiber.StatusBadGateway {
		t.Fatalf("status = %d want 502 body = %s", resp.StatusCode, raw)
	}
	ct := resp.Header.Get("Content-Type")
	if !strings.HasPrefix(ct, "application/json") {
		t.Errorf("pre-stream error should be JSON, got %q", ct)
	}
}

// TestChatStream_MidStreamDropNoPersist covers AC #3 revised: a
// stream that ends without message_stop must not persist the
// assistant turn, so the user does not see a ghost message the AI
// never finished.
func TestChatStream_MidStreamDropNoPersist(t *testing.T) {
	resetDB(t)
	partial := "event: message_start\ndata: {\"type\":\"message_start\",\"message_id\":\"m\"}\n\nevent: content_delta\ndata: {\"type\":\"content_delta\",\"text\":\"half"
	fake := newFakeAIStream(t, http.StatusOK, partial, 0)
	a := newTestAppWithAI(t, fake.URL, "tok")
	uid := seedUser(t, "plus")
	convID := seedChatConversation(t, uid)

	resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/chat/stream",
		uid.String(), testSharedInternalToken, map[string]any{
			"conversation_id": convID.String(),
			"message":         map[string]any{"content": []map[string]any{{"type": "text", "text": "hi"}}},
		})
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d — stream handler still returns 200 on mid-stream drop", resp.StatusCode)
	}

	// Give any would-be persist goroutine a window to run, then
	// assert no ai_messages / ai_usage rows landed.
	time.Sleep(200 * time.Millisecond)
	var n int
	_ = testPool.QueryRow(context.Background(),
		`SELECT COUNT(*)::int FROM ai_messages WHERE conversation_id=$1`, convID).Scan(&n)
	if n != 0 {
		t.Errorf("ai_messages should be empty on mid-stream drop, got %d", n)
	}
	var u int
	_ = testPool.QueryRow(context.Background(),
		`SELECT COUNT(*)::int FROM ai_usage WHERE user_id=$1`, uid).Scan(&u)
	if u != 0 {
		t.Errorf("ai_usage should be empty on mid-stream drop, got %d", u)
	}
}

// TestChatStream_MessageStopAfterErrorStillPersists covers the
// revised AC #3: an `error` event followed by `message_stop` means
// tokens were spent and the assistant content is final; we persist.
func TestChatStream_MessageStopAfterErrorStillPersists(t *testing.T) {
	resetDB(t)
	script := strings.Join([]string{
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

	fake := newFakeAIStream(t, http.StatusOK, script, 0)
	a := newTestAppWithAI(t, fake.URL, "tok")
	uid := seedUser(t, "plus")
	convID := seedChatConversation(t, uid)

	resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/chat/stream",
		uid.String(), testSharedInternalToken, map[string]any{
			"conversation_id": convID.String(),
			"message":         map[string]any{"content": []map[string]any{{"type": "text", "text": "hi"}}},
		})
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d", resp.StatusCode)
	}

	waitForAssistantMessage(t, convID, 2*time.Second)
	var asstN int
	_ = testPool.QueryRow(context.Background(),
		`SELECT COUNT(*)::int FROM ai_messages WHERE conversation_id=$1 AND role='assistant'`, convID).Scan(&asstN)
	if asstN != 1 {
		t.Errorf("assistant row should be present after message_stop with stop_reason=error, got %d", asstN)
	}
}

// TestChatStream_HistoryLoadedAndToolRoleSkipped verifies Core API
// plucks only user|assistant rows when building AI Service history.
// A seeded `tool` role row lives for audit but must not reach the
// upstream payload — AI Service Pydantic rejects any role outside
// user|assistant.
func TestChatStream_HistoryLoadedAndToolRoleSkipped(t *testing.T) {
	resetDB(t)
	fake := newFakeAIStream(t, http.StatusOK, canonicalChatScript(), 0)
	a := newTestAppWithAI(t, fake.URL, "tok")
	uid := seedUser(t, "plus")
	convID := seedChatConversation(t, uid)

	// Seed three prior messages: user, assistant, tool. Timestamps
	// are 30s / 20s / 10s ago so ASC ordering is stable.
	base := time.Now().UTC()
	seedMessage(t, convID, "user", "earlier user", base.Add(-30*time.Second))
	seedMessage(t, convID, "assistant", "earlier asst", base.Add(-20*time.Second))
	seedMessage(t, convID, "tool", "tool audit only", base.Add(-10*time.Second))

	resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/chat/stream",
		uid.String(), testSharedInternalToken, map[string]any{
			"conversation_id": convID.String(),
			"message":         map[string]any{"content": []map[string]any{{"type": "text", "text": "next"}}},
		})
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d", resp.StatusCode)
	}

	body := string(fake.gotBody)
	if !strings.Contains(body, `"role":"user","content":"earlier user"`) {
		t.Errorf("history missing user row: %s", body)
	}
	if !strings.Contains(body, `"role":"assistant","content":"earlier asst"`) {
		t.Errorf("history missing assistant row: %s", body)
	}
	if strings.Contains(body, "tool audit only") {
		t.Errorf("tool role leaked into history payload: %s", body)
	}
}

// TestChatStream_CrossUserConversation404 confirms ownership is
// checked before anything else — another user's conversation id
// surfaces as 404, not as upstream 500 or a leaked row.
func TestChatStream_CrossUserConversation404(t *testing.T) {
	resetDB(t)
	a := newTestAppWithAI(t, "http://localhost:1", "tok")
	uid := seedUser(t, "plus")
	otherUID := seedUser(t, "plus")
	convID := seedChatConversation(t, otherUID) // belongs to the *other* user

	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/chat/stream",
		uid.String(), testSharedInternalToken, map[string]any{
			"conversation_id": convID.String(),
			"message":         map[string]any{"content": []map[string]any{{"type": "text", "text": "hi"}}},
		})
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d want 404 body = %s", resp.StatusCode, raw)
	}
}

// TestChatStream_ValidationErrors covers the openapi field contract:
// missing conversation_id, empty content, non-text block type. Each
// produces 400 VALIDATION_ERROR before the upstream is contacted.
func TestChatStream_ValidationErrors(t *testing.T) {
	resetDB(t)
	a := newTestAppWithAI(t, "http://localhost:1", "tok")
	uid := seedUser(t, "plus")
	convID := seedChatConversation(t, uid)

	cases := []struct {
		name string
		body map[string]any
	}{
		{
			name: "missing conversation_id",
			body: map[string]any{
				"message": map[string]any{"content": []map[string]any{{"type": "text", "text": "x"}}},
			},
		},
		{
			name: "empty content",
			body: map[string]any{
				"conversation_id": convID.String(),
				"message":         map[string]any{"content": []map[string]any{}},
			},
		},
		{
			name: "non-text block",
			body: map[string]any{
				"conversation_id": convID.String(),
				"message":         map[string]any{"content": []map[string]any{{"type": "tool_use", "text": "x"}}},
			},
		},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/chat/stream",
				uid.String(), testSharedInternalToken, tc.body)
			if resp.StatusCode != fiber.StatusBadRequest {
				t.Errorf("status = %d want 400", resp.StatusCode)
			}
		})
	}
}

// TestChatSync_HappyPath_ReturnsJSONResponseAndPersists exercises
// the non-streaming endpoint. The handler consumes the upstream
// stream, assembles AIChatResponse, and writes the same DB rows as
// the stream variant.
func TestChatSync_HappyPath_ReturnsJSONResponseAndPersists(t *testing.T) {
	resetDB(t)
	fake := newFakeAIStream(t, http.StatusOK, canonicalChatScript(), 0)
	a := newTestAppWithAI(t, fake.URL, "tok")
	uid := seedUser(t, "plus")
	convID := seedChatConversation(t, uid)

	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/chat",
		uid.String(), testSharedInternalToken, map[string]any{
			"conversation_id": convID.String(),
			"message":         map[string]any{"content": []map[string]any{{"type": "text", "text": "hi"}}},
		})
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d body = %s", resp.StatusCode, raw)
	}
	if ct := resp.Header.Get("Content-Type"); !strings.HasPrefix(ct, "application/json") {
		t.Errorf("Content-Type = %q", ct)
	}

	var out map[string]any
	if err := json.Unmarshal(raw, &out); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if out["tokens_used"].(float64) != 30 {
		t.Errorf("tokens_used = %v want 30", out["tokens_used"])
	}
	msg := out["message"].(map[string]any)
	if msg["role"] != "assistant" {
		t.Errorf("message.role = %v", msg["role"])
	}
	content := msg["content"].([]any)
	if len(content) == 0 {
		t.Fatalf("message.content is empty")
	}
	first := content[0].(map[string]any)
	if first["type"] != "text" || first["text"] != "Hello world" {
		t.Errorf("content[0]: got %v", first)
	}

	// Persist is synchronous for /ai/chat — rows should exist before
	// the response returns.
	var asstN int
	_ = testPool.QueryRow(context.Background(),
		`SELECT COUNT(*)::int FROM ai_messages WHERE conversation_id=$1 AND role='assistant'`, convID).Scan(&asstN)
	if asstN != 1 {
		t.Errorf("expected 1 assistant row after sync, got %d", asstN)
	}
}

// TestChatSync_NoMessageStop502 confirms the sync endpoint refuses
// to return a "success" response when the upstream never completed.
func TestChatSync_NoMessageStop502(t *testing.T) {
	resetDB(t)
	partial := "event: message_start\ndata: {\"type\":\"message_start\",\"message_id\":\"m\"}\n\n"
	fake := newFakeAIStream(t, http.StatusOK, partial, 0)
	a := newTestAppWithAI(t, fake.URL, "tok")
	uid := seedUser(t, "plus")
	convID := seedChatConversation(t, uid)

	resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/chat",
		uid.String(), testSharedInternalToken, map[string]any{
			"conversation_id": convID.String(),
			"message":         map[string]any{"content": []map[string]any{{"type": "text", "text": "hi"}}},
		})
	if resp.StatusCode != fiber.StatusBadGateway {
		t.Fatalf("status = %d want 502", resp.StatusCode)
	}
}

// TestChatStream_AirateLimitGate_FreeTier confirms the daily counter
// applies to chat too — /ai/chat/stream sits behind airatelimit, so
// the 6th request for a Free-tier user returns 429 before the
// upstream is even contacted. Uses a server whose port is
// deliberately unreachable so a regression would surface as an
// upstream 502 instead of 429.
func TestChatStream_AirateLimitGate_FreeTier(t *testing.T) {
	resetDB(t)
	fake := newFakeAIStream(t, http.StatusOK, canonicalChatScript(), 0)
	a := newTestAppWithAI(t, fake.URL, "tok")
	uid := seedUser(t, "free")
	convID := seedChatConversation(t, uid)

	payload := map[string]any{
		"conversation_id": convID.String(),
		"message":         map[string]any{"content": []map[string]any{{"type": "text", "text": "hi"}}},
	}
	for i := 1; i <= 5; i++ {
		resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/chat/stream",
			uid.String(), testSharedInternalToken, payload)
		if resp.StatusCode != fiber.StatusOK {
			t.Fatalf("attempt %d: status = %d body = %s", i, resp.StatusCode, raw)
		}
	}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/chat/stream",
		uid.String(), testSharedInternalToken, payload)
	if resp.StatusCode != fiber.StatusTooManyRequests {
		t.Fatalf("6th status = %d want 429 body = %s", resp.StatusCode, raw)
	}
}

// TestChatSync_CostClampOnOverflow ensures the NUMERIC(10,6) cap is
// respected — if the upstream reports an absurd cost_usd the handler
// writes the clamp value, not a check-violation error.
func TestChatSync_CostClampOnOverflow(t *testing.T) {
	resetDB(t)
	script := strings.Join([]string{
		"event: message_start",
		`data: {"type":"message_start","message_id":"m"}`,
		"",
		"event: content_block_start",
		`data: {"type":"content_block_start","index":0,"block_type":"text"}`,
		"",
		"event: content_delta",
		`data: {"type":"content_delta","text":"ok"}`,
		"",
		"event: message_stop",
		fmt.Sprintf(`data: {"type":"message_stop","stop_reason":"end_turn","usage":{"model":"claude","input_tokens":1,"output_tokens":1,"cost_usd":%s}}`, "10000000.0"),
		"",
		"",
	}, "\n")

	fake := newFakeAIStream(t, http.StatusOK, script, 0)
	a := newTestAppWithAI(t, fake.URL, "tok")
	uid := seedUser(t, "plus")
	convID := seedChatConversation(t, uid)

	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/chat",
		uid.String(), testSharedInternalToken, map[string]any{
			"conversation_id": convID.String(),
			"message":         map[string]any{"content": []map[string]any{{"type": "text", "text": "hi"}}},
		})
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d body = %s", resp.StatusCode, raw)
	}

	var cost string
	err := testPool.QueryRow(context.Background(),
		`SELECT cost_usd::text FROM ai_usage WHERE user_id = $1`, uid).Scan(&cost)
	if err != nil {
		t.Fatalf("cost query: %v", err)
	}
	if !strings.HasPrefix(cost, "9999.") {
		t.Errorf("cost not clamped: got %q", cost)
	}
}
