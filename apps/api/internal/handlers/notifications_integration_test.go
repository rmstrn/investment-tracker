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

func seedNotification(t *testing.T, userID uuid.UUID, ntype, title string, createdAt time.Time, readAt *time.Time) uuid.UUID {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	var r pgtype.Timestamptz
	if readAt != nil {
		r = pgtype.Timestamptz{Time: *readAt, Valid: true}
	}
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO notifications (id, user_id, type, title, body, created_at, read_at)
		VALUES ($1, $2, $3, $4, 'body', $5, $6)
	`, id, userID, ntype, title, pgtype.Timestamptz{Time: createdAt, Valid: true}, r)
	if err != nil {
		t.Fatalf("seed notification: %v", err)
	}
	return id
}

func TestListNotifications_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	now := time.Now().UTC()
	_ = seedNotification(t, uid, "insight_generated", "A", now.AddDate(0, 0, -1), nil)
	read := now.AddDate(0, 0, -2)
	_ = seedNotification(t, uid, "sync_completed", "B", now.AddDate(0, 0, -3), &read)

	resp, raw := doJSON(t, a, fiber.MethodGet, "/notifications",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	data := out["data"].([]any)
	if len(data) != 2 {
		t.Fatalf("len = %d, want 2", len(data))
	}
	first := data[0].(map[string]any)
	if first["title"] != "A" {
		t.Fatalf("first title = %v, want A (sort DESC)", first["title"])
	}
}

func TestListNotifications_UnreadOnly(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	now := time.Now().UTC()
	read := now.AddDate(0, 0, -1)
	_ = seedNotification(t, uid, "insight_generated", "Unread", now, nil)
	_ = seedNotification(t, uid, "sync_completed", "Read", now.AddDate(0, 0, -2), &read)

	resp, raw := doJSON(t, a, fiber.MethodGet, "/notifications?unread_only=true",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d", resp.StatusCode)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	data := out["data"].([]any)
	if len(data) != 1 {
		t.Fatalf("len = %d, want 1 (unread only)", len(data))
	}
}

func TestGetUnreadCount_CapsAt99(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	now := time.Now().UTC()
	for i := 0; i < 120; i++ {
		_ = seedNotification(t, uid, "insight_generated", "U", now.Add(-time.Duration(i)*time.Minute), nil)
	}

	resp, raw := doJSON(t, a, fiber.MethodGet, "/notifications/unread_count",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d", resp.StatusCode)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["unread"].(float64) != 99 {
		t.Fatalf("unread = %v, want 99 (capped)", out["unread"])
	}
}

func TestMarkNotificationRead_IdempotentHappy(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	nid := seedNotification(t, uid, "insight_generated", "Ping", time.Now().UTC(), nil)

	// First call: 204.
	resp, _ := doJSON(t, a, fiber.MethodPost, "/notifications/"+nid.String()+"/read",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNoContent {
		t.Fatalf("first status = %d, want 204", resp.StatusCode)
	}

	// Second call (different idempotency key to avoid middleware replay):
	// still 204 because the UPDATE's COALESCE keeps the original read_at.
	resp, _ = doJSON(t, a, fiber.MethodPost, "/notifications/"+nid.String()+"/read",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNoContent {
		t.Fatalf("second status = %d, want 204", resp.StatusCode)
	}
}

func TestMarkNotificationRead_NotFound(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	phantom := uuid.Must(uuid.NewV7())
	resp, _ := doJSON(t, a, fiber.MethodPost, "/notifications/"+phantom.String()+"/read",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, want 404", resp.StatusCode)
	}
}

func TestMarkAllNotificationsRead_ReturnsCount(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	now := time.Now().UTC()
	read := now.AddDate(0, 0, -1)
	for i := 0; i < 3; i++ {
		_ = seedNotification(t, uid, "insight_generated", "U", now, nil)
	}
	// One already-read should NOT be double-counted.
	_ = seedNotification(t, uid, "sync_completed", "R", now.AddDate(0, 0, -2), &read)

	resp, raw := doJSON(t, a, fiber.MethodPost, "/notifications/read_all",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["marked_count"].(float64) != 3 {
		t.Fatalf("marked_count = %v, want 3", out["marked_count"])
	}

	// Second call flips nothing — still OK, just 0.
	resp, raw = doJSON(t, a, fiber.MethodPost, "/notifications/read_all",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("second status = %d", resp.StatusCode)
	}
	_ = json.Unmarshal(raw, &out)
	if out["marked_count"].(float64) != 0 {
		t.Fatalf("second marked_count = %v, want 0", out["marked_count"])
	}
}
