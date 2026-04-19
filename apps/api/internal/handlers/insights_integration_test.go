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

func seedDismissedInsight(t *testing.T, userID uuid.UUID, title string, generatedAt, dismissedAt time.Time) {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO insights (id, user_id, insight_type, title, body, generated_at, dismissed_at)
		VALUES ($1, $2, 'performance', $3, 'body', $4, $5)
	`, id, userID, title,
		pgtype.Timestamptz{Time: generatedAt, Valid: true},
		pgtype.Timestamptz{Time: dismissedAt, Valid: true})
	if err != nil {
		t.Fatalf("seed dismissed insight: %v", err)
	}
}

func TestListInsights_ActiveOnlyByDefault(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	seedInsight(t, uid, "performance", "Active 1", time.Now().UTC())
	seedDismissedInsight(t, uid, "Dismissed 1",
		time.Now().UTC().AddDate(0, 0, -2),
		time.Now().UTC().AddDate(0, 0, -1))

	resp, body := doJSON(t, a, fiber.MethodGet, "/ai/insights",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 1 {
		t.Fatalf("len = %d, want 1 (dismissed excluded)", len(data))
	}
	if data[0].(map[string]any)["title"] != "Active 1" {
		t.Fatalf("title = %v", data[0].(map[string]any)["title"])
	}
}

func TestListInsights_IncludeDismissed(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	seedInsight(t, uid, "performance", "Active 1", time.Now().UTC())
	seedDismissedInsight(t, uid, "Dismissed 1",
		time.Now().UTC().AddDate(0, 0, -2),
		time.Now().UTC().AddDate(0, 0, -1))

	resp, body := doJSON(t, a, fiber.MethodGet, "/ai/insights?include_dismissed=true",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d", resp.StatusCode)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if len(out["data"].([]any)) != 2 {
		t.Fatalf("len = %d, want 2 (with include_dismissed)", len(out["data"].([]any)))
	}
}

func TestListInsights_EmptyState(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	resp, body := doJSON(t, a, fiber.MethodGet, "/ai/insights",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d", resp.StatusCode)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if len(out["data"].([]any)) != 0 {
		t.Fatalf("len = %d, want 0", len(out["data"].([]any)))
	}
}
