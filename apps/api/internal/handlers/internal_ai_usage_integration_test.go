//go:build integration

// Integration tests for POST /internal/ai/usage.
//
// Shared container + Redis + app harness come from integration_setup_test.go.
// Tests start with resetDB(t) for isolation.
//
// Run:
//
//	go test -tags integration ./internal/handlers/...
package handlers_test

import (
	"context"
	"testing"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"

	"github.com/rmstrn/investment-tracker/apps/api/internal/handlers"
)

func TestInternalAIUsage_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, _ := doJSON(t, a, fiber.MethodPost, "/internal/ai/usage",
		uid.String(), testSharedInternalToken, map[string]any{
			"user_id":       uid.String(),
			"model":         "claude-sonnet-4-6",
			"input_tokens":  120,
			"output_tokens": 340,
			"cost_usd":      "0.012345",
		})
	if resp.StatusCode != fiber.StatusAccepted {
		t.Fatalf("status = %d, want 202", resp.StatusCode)
	}

	var rowCount int
	if err := testPool.QueryRow(context.Background(),
		`SELECT count(*) FROM ai_usage WHERE user_id = $1`, uid,
	).Scan(&rowCount); err != nil || rowCount != 1 {
		t.Fatalf("ai_usage rows = %d (err=%v), want 1", rowCount, err)
	}

	var counter int
	if err := testPool.QueryRow(context.Background(),
		`SELECT count FROM usage_counters WHERE user_id = $1 AND counter_type = $2`,
		uid, handlers.AIUsageCounterType,
	).Scan(&counter); err != nil || counter != 1 {
		t.Fatalf("counter = %d (err=%v), want 1", counter, err)
	}
}

func TestInternalAIUsage_ClerkJWTCallerRejected(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, _ := doJSON(t, a, fiber.MethodPost, "/internal/ai/usage",
		uid.String(), "totally-not-the-internal-token",
		map[string]any{
			"user_id": uid.String(), "model": "claude-sonnet-4-6",
			"input_tokens": 1, "output_tokens": 1, "cost_usd": "0.001",
		})
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401", resp.StatusCode)
	}
}

func TestInternalAIUsage_UserIDHeaderMismatch(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	other := uuid.Must(uuid.NewV7())

	resp, _ := doJSON(t, a, fiber.MethodPost, "/internal/ai/usage",
		uid.String(), testSharedInternalToken, map[string]any{
			"user_id":       other.String(), // deliberately wrong
			"model":         "claude-sonnet-4-6",
			"input_tokens":  1,
			"output_tokens": 1,
			"cost_usd":      "0.001",
		})
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
}

func TestInternalAIUsage_DuplicateDeliveryWritesTwice(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	body := map[string]any{
		"user_id":       uid.String(),
		"model":         "claude-haiku-4-5-20251001",
		"input_tokens":  10,
		"output_tokens": 20,
		"cost_usd":      "0.000100",
	}
	for i := 0; i < 2; i++ {
		resp, _ := doJSON(t, a, fiber.MethodPost, "/internal/ai/usage",
			uid.String(), testSharedInternalToken, body)
		if resp.StatusCode != fiber.StatusAccepted {
			t.Fatalf("call %d status = %d", i, resp.StatusCode)
		}
	}

	var rows, counter int
	_ = testPool.QueryRow(context.Background(),
		`SELECT count(*) FROM ai_usage WHERE user_id = $1`, uid,
	).Scan(&rows)
	_ = testPool.QueryRow(context.Background(),
		`SELECT count FROM usage_counters WHERE user_id = $1 AND counter_type = $2`,
		uid, handlers.AIUsageCounterType,
	).Scan(&counter)
	if rows != 2 || counter != 2 {
		t.Fatalf("rows=%d counter=%d; want 2/2 (fire-and-forget dup accepted)", rows, counter)
	}
}

func TestInternalAIUsage_NonExistentUserFailsAtAuth(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	ghost := uuid.Must(uuid.NewV7()).String()

	resp, _ := doJSON(t, a, fiber.MethodPost, "/internal/ai/usage",
		ghost, testSharedInternalToken, map[string]any{
			"user_id": ghost, "model": "claude-sonnet-4-6",
			"input_tokens": 1, "output_tokens": 1, "cost_usd": "0.001",
		})
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401 (unknown user)", resp.StatusCode)
	}
}
