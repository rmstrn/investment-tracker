//go:build integration

package handlers_test

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func seedUsageCounter(t *testing.T, userID uuid.UUID, counterType string, date time.Time, count int) {
	t.Helper()
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO usage_counters (user_id, counter_type, counter_date, count)
		VALUES ($1, $2, $3, $4)
	`, userID, counterType, pgtype.Date{Time: date, Valid: true}, count)
	if err != nil {
		t.Fatalf("seed usage_counter: %v", err)
	}
}

func seedInsight(t *testing.T, userID uuid.UUID, insightType, title string, generatedAt time.Time) {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO insights (id, user_id, insight_type, title, body, generated_at)
		VALUES ($1, $2, $3, $4, 'body', $5)
	`, id, userID, insightType, title, pgtype.Timestamptz{Time: generatedAt, Valid: true})
	if err != nil {
		t.Fatalf("seed insight: %v", err)
	}
}

func TestGetMe_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	resp, body := doJSON(t, a, fiber.MethodGet, "/me",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["id"] != uid.String() {
		t.Fatalf("id = %v, want %v", out["id"], uid.String())
	}
	if out["subscription_tier"] != "plus" {
		t.Fatalf("subscription_tier = %v", out["subscription_tier"])
	}
	if out["deletion_scheduled_at"] != nil {
		t.Fatalf("deletion_scheduled_at = %v, want nil", out["deletion_scheduled_at"])
	}
}

func TestGetMyUsage_FreeTier(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	// Seed 3 ai_messages today and 2 insights this week.
	seedUsageCounter(t, uid, "ai_messages_daily", time.Now().UTC(), 3)
	seedInsight(t, uid, "performance", "title-1", time.Now().UTC())
	seedInsight(t, uid, "cost", "title-2", time.Now().UTC().AddDate(0, 0, -2))

	resp, body := doJSON(t, a, fiber.MethodGet, "/me/usage",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["tier"] != "free" {
		t.Fatalf("tier = %v, want free", out["tier"])
	}
	counters := out["counters"].(map[string]any)

	aiDaily := counters["ai_messages_daily"].(map[string]any)
	if aiDaily["used"].(float64) != 3 {
		t.Fatalf("ai used = %v, want 3", aiDaily["used"])
	}
	if aiDaily["limit"].(float64) != 5 {
		t.Fatalf("ai limit = %v, want 5 (free tier cap)", aiDaily["limit"])
	}

	insights := counters["insights_weekly"].(map[string]any)
	if insights["used"].(float64) != 2 {
		t.Fatalf("insights used = %v, want 2", insights["used"])
	}

	accounts := counters["connected_accounts"].(map[string]any)
	if accounts["used"].(float64) != 0 {
		t.Fatalf("accounts used = %v, want 0 (no accounts seeded)", accounts["used"])
	}
	if accounts["reset_at"] != nil {
		t.Fatalf("connected_accounts reset_at = %v, want nil (no reset)", accounts["reset_at"])
	}
}

func TestGetMyUsage_ProTier_UnlimitedIsNull(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "pro")

	resp, body := doJSON(t, a, fiber.MethodGet, "/me/usage",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)
	counters := out["counters"].(map[string]any)

	for _, name := range []string{"ai_messages_daily", "connected_accounts", "insights_weekly"} {
		c := counters[name].(map[string]any)
		if c["limit"] != nil {
			t.Fatalf("%s.limit = %v, want nil for pro", name, c["limit"])
		}
	}
}

func TestGetMyUsage_EmptyState(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet, "/me/usage",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d", resp.StatusCode)
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)
	c := out["counters"].(map[string]any)
	for _, name := range []string{"ai_messages_daily", "connected_accounts", "insights_weekly"} {
		used := c[name].(map[string]any)["used"].(float64)
		if used != 0 {
			t.Fatalf("%s.used = %v, want 0 on empty state", name, used)
		}
	}
}
