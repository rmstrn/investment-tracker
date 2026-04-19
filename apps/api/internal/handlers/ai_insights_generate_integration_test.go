//go:build integration

package handlers_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

// fakeAIService spins up a httptest.Server pretending to be the AI
// Service /internal/insights/generate endpoint. status + body
// drive the response shape; delay simulates the realistic
// 5-30s LLM round-trip without burning the full 5s in CI (we
// use a short slice — the principle the handler waits is the same).
type fakeAIService struct {
	*httptest.Server
	gotAuth   string
	gotUserID string
	gotPath   string
}

func newFakeAIService(t *testing.T, status int, body string, delay time.Duration) *fakeAIService {
	t.Helper()
	fs := &fakeAIService{}
	fs.Server = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fs.gotAuth = r.Header.Get("Authorization")
		fs.gotUserID = r.Header.Get("X-User-Id")
		fs.gotPath = r.URL.Path
		if delay > 0 {
			time.Sleep(delay)
		}
		w.WriteHeader(status)
		_, _ = w.Write([]byte(body))
	}))
	t.Cleanup(fs.Close)
	return fs
}

func TestGenerateInsights_HappyPath_PersistsAndReturns202(t *testing.T) {
	resetDB(t)
	fake := newFakeAIService(t, http.StatusOK, `{
		"insights": [
			{"insight_type":"performance","title":"Up 5%","body":"Your portfolio is up.","severity":"info"},
			{"insight_type":"diversification","title":"Concentration risk","body":"AAPL is 40%.","severity":"warning"}
		],
		"usage": [{"model":"claude-3-5-haiku","input_tokens":100,"output_tokens":50,"cost_usd":0.001}]
	}`, 200*time.Millisecond)

	a := newTestAppWithAI(t, fake.URL, "test-token-32-bytes-or-more-yes-yes")
	uid := seedUser(t, "plus")

	start := time.Now()
	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/insights/generate",
		uid.String(), testSharedInternalToken, map[string]any{"insight_type": "performance"})
	elapsed := time.Since(start)
	if resp.StatusCode != fiber.StatusAccepted {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	if elapsed < 200*time.Millisecond {
		t.Fatalf("handler returned in %v — should have waited for fake delay", elapsed)
	}

	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["status"] != "done" {
		t.Fatalf("status = %v, want done (Path B sync)", out["status"])
	}
	if out["job_id"] == nil {
		t.Fatalf("missing job_id")
	}
	if out["insight_id"] == nil {
		t.Fatalf("insight_id nil — should be the first persisted insight")
	}

	// Two rows persisted in insights table.
	var count int
	if err := testPool.QueryRow(context.Background(),
		"SELECT COUNT(*)::int FROM insights WHERE user_id = $1", uid).Scan(&count); err != nil {
		t.Fatalf("count: %v", err)
	}
	if count != 2 {
		t.Fatalf("insights persisted = %d, want 2", count)
	}

	// Headers stamped correctly on the upstream call.
	if fake.gotAuth != "Bearer test-token-32-bytes-or-more-yes-yes" {
		t.Fatalf("upstream auth = %q", fake.gotAuth)
	}
	if fake.gotUserID != uid.String() {
		t.Fatalf("upstream X-User-Id = %q, want %s", fake.gotUserID, uid)
	}
	if fake.gotPath != "/internal/insights/generate" {
		t.Fatalf("upstream path = %q", fake.gotPath)
	}
}

func TestGenerateInsights_AIService500_Returns502(t *testing.T) {
	resetDB(t)
	fake := newFakeAIService(t, http.StatusInternalServerError, `{"detail":"boom"}`, 0)
	a := newTestAppWithAI(t, fake.URL, "test-token")
	uid := seedUser(t, "plus")

	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/insights/generate",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadGateway {
		t.Fatalf("status = %d, want 502, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["error"].(map[string]any)["code"] != "EXTERNAL_SERVICE_ERROR" {
		t.Fatalf("code = %v, want EXTERNAL_SERVICE_ERROR", out["error"])
	}
}

func TestGenerateInsights_AIService401_Returns502(t *testing.T) {
	resetDB(t)
	fake := newFakeAIService(t, http.StatusUnauthorized, `{"detail":"bad token"}`, 0)
	a := newTestAppWithAI(t, fake.URL, "wrong-token")
	uid := seedUser(t, "plus")

	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/insights/generate",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadGateway {
		t.Fatalf("status = %d, want 502 (auth fail = our config bug, not user error), body = %s", resp.StatusCode, raw)
	}
}

func TestGenerateInsights_BadInsightType_400(t *testing.T) {
	resetDB(t)
	fake := newFakeAIService(t, http.StatusOK, `{"insights":[],"usage":[]}`, 0)
	a := newTestAppWithAI(t, fake.URL, "tok")
	uid := seedUser(t, "plus")

	resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/insights/generate",
		uid.String(), testSharedInternalToken, map[string]any{"insight_type": "nonsense"})
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
}

func TestGenerateInsights_EmptyInsightsList_StillReturns202(t *testing.T) {
	resetDB(t)
	fake := newFakeAIService(t, http.StatusOK, `{"insights":[],"usage":[]}`, 0)
	a := newTestAppWithAI(t, fake.URL, "tok")
	uid := seedUser(t, "plus")

	resp, raw := doJSON(t, a, fiber.MethodPost, "/ai/insights/generate",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusAccepted {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["insight_id"] != nil {
		t.Fatalf("insight_id = %v, want nil for empty insight list", out["insight_id"])
	}
	if out["status"] != "done" {
		t.Fatalf("status = %v, want done even on empty list", out["status"])
	}
}

func TestGenerateInsights_RateLimit_FreeTierGate(t *testing.T) {
	resetDB(t)
	fake := newFakeAIService(t, http.StatusOK, `{"insights":[],"usage":[]}`, 0)
	a := newTestAppWithAI(t, fake.URL, "tok")
	uid := seedUser(t, "free")

	// Free cap = 5. Sixth call should 429 from airatelimit before
	// reaching the AI Service.
	for i := 1; i <= 5; i++ {
		resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/insights/generate",
			uid.String(), testSharedInternalToken, nil)
		if resp.StatusCode != fiber.StatusAccepted {
			t.Fatalf("attempt %d: status = %d", i, resp.StatusCode)
		}
	}
	resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/insights/generate",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusTooManyRequests {
		t.Fatalf("6th status = %d, want 429", resp.StatusCode)
	}
}

// silence unused import linter when uuid import line is dragged in
// purely by other tests in this file (defensive — uuid is used in
// the existing helpers).
var _ = uuid.Nil
