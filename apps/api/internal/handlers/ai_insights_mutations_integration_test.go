//go:build integration

package handlers_test

import (
	"context"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func seedInsightRow(t *testing.T, userID uuid.UUID, title string) uuid.UUID {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO insights (id, user_id, insight_type, title, body, severity, generated_at)
		VALUES ($1, $2, 'performance', $3, 'body', 'info', $4)
	`, id, userID, title, pgtype.Timestamptz{Time: time.Now().UTC(), Valid: true})
	if err != nil {
		t.Fatalf("seed insight: %v", err)
	}
	return id
}

func TestDismissInsight_HappyPath_Idempotent(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	insightID := seedInsightRow(t, uid, "Up 5%")

	// First call — 204, dismissed_at set.
	resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/insights/"+insightID.String()+"/dismiss",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNoContent {
		t.Fatalf("first status = %d, want 204", resp.StatusCode)
	}
	var firstDismissed time.Time
	if err := testPool.QueryRow(context.Background(),
		"SELECT dismissed_at FROM insights WHERE id = $1", insightID).Scan(&firstDismissed); err != nil {
		t.Fatalf("read dismissed_at: %v", err)
	}
	if firstDismissed.IsZero() {
		t.Fatalf("dismissed_at not set")
	}

	// Second call — still 204, but dismissed_at unchanged (COALESCE).
	time.Sleep(50 * time.Millisecond)
	resp, _ = doJSON(t, a, fiber.MethodPost, "/ai/insights/"+insightID.String()+"/dismiss",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNoContent {
		t.Fatalf("second status = %d", resp.StatusCode)
	}
	var secondDismissed time.Time
	_ = testPool.QueryRow(context.Background(),
		"SELECT dismissed_at FROM insights WHERE id = $1", insightID).Scan(&secondDismissed)
	if !secondDismissed.Equal(firstDismissed) {
		t.Fatalf("dismissed_at changed on second dismiss: %v vs %v", firstDismissed, secondDismissed)
	}
}

func TestDismissInsight_NotFound(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	phantom := uuid.Must(uuid.NewV7())

	resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/insights/"+phantom.String()+"/dismiss",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, want 404", resp.StatusCode)
	}
}

func TestDismissInsight_CrossUser_404(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	other := seedUser(t, "free")
	otherInsight := seedInsightRow(t, other, "OtherUserInsight")

	resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/insights/"+otherInsight.String()+"/dismiss",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("cross-user status = %d, want 404", resp.StatusCode)
	}
}

func TestMarkInsightViewed_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	insightID := seedInsightRow(t, uid, "ViewMe")

	resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/insights/"+insightID.String()+"/viewed",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNoContent {
		t.Fatalf("status = %d", resp.StatusCode)
	}
	var viewedAt time.Time
	_ = testPool.QueryRow(context.Background(),
		"SELECT viewed_at FROM insights WHERE id = $1", insightID).Scan(&viewedAt)
	if viewedAt.IsZero() {
		t.Fatalf("viewed_at not set")
	}
}

func TestMarkInsightViewed_NotFound(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	phantom := uuid.Must(uuid.NewV7())

	resp, _ := doJSON(t, a, fiber.MethodPost, "/ai/insights/"+phantom.String()+"/viewed",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, want 404", resp.StatusCode)
	}
}
