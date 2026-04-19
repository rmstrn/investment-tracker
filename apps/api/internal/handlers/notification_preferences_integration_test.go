//go:build integration

package handlers_test

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

func TestGetNotificationPreferences_Defaults(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet, "/me/notification-preferences",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)

	prefs := out["preferences"].(map[string]any)
	for _, k := range []string{"insight_generated", "sync_completed", "sync_failed", "dividend_paid", "price_alert", "billing_event"} {
		p, ok := prefs[k].(map[string]any)
		if !ok {
			t.Fatalf("missing %s in preferences", k)
		}
		if p["email"] != true || p["push"] != true || p["in_app"] != true {
			t.Fatalf("defaults for %s = %v, want all true", k, p)
		}
	}

	digest := out["digest"].(map[string]any)
	if digest["enabled"] != true {
		t.Fatalf("digest.enabled = %v, want true by default", digest["enabled"])
	}
	if digest["weekday"].(float64) != 0 {
		t.Fatalf("digest.weekday = %v, want 0 (Monday)", digest["weekday"])
	}
	if digest["quiet_start"] != nil || digest["quiet_end"] != nil {
		t.Fatalf("digest quiet hours should default to nil, got %v / %v", digest["quiet_start"], digest["quiet_end"])
	}
}

func TestGetNotificationPreferences_PartialRows(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	seedPrefRow(t, uid, "insight_generated", false, true, true)
	seedDigestRow(t, uid, false, 3, "21:00", "08:00")

	resp, body := doJSON(t, a, fiber.MethodGet, "/me/notification-preferences",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)
	prefs := out["preferences"].(map[string]any)
	insight := prefs["insight_generated"].(map[string]any)
	if insight["email"] != false {
		t.Fatalf("email = %v, want false (seeded override)", insight["email"])
	}
	// An un-seeded type still defaults to all-on.
	sync := prefs["sync_failed"].(map[string]any)
	if sync["email"] != true {
		t.Fatalf("sync_failed.email = %v, want true", sync["email"])
	}

	digest := out["digest"].(map[string]any)
	if digest["enabled"] != false {
		t.Fatalf("digest.enabled = %v, want false", digest["enabled"])
	}
	if digest["weekday"].(float64) != 3 {
		t.Fatalf("digest.weekday = %v, want 3", digest["weekday"])
	}
	if digest["quiet_start"] != "21:00" || digest["quiet_end"] != "08:00" {
		t.Fatalf("quiet hours = %v / %v", digest["quiet_start"], digest["quiet_end"])
	}
}

func seedPrefRow(t *testing.T, userID uuid.UUID, ntype string, email, push, inApp bool) {
	t.Helper()
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO notification_preferences (user_id, type, email, push, in_app)
		VALUES ($1, $2, $3, $4, $5)
	`, userID, ntype, email, push, inApp)
	if err != nil {
		t.Fatalf("seed pref row: %v", err)
	}
}

func seedDigestRow(t *testing.T, userID uuid.UUID, enabled bool, weekday int, quietStart, quietEnd string) {
	t.Helper()
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO user_digest_preferences (user_id, digest_enabled, digest_weekday, quiet_start, quiet_end)
		VALUES ($1, $2, $3, $4::time, $5::time)
	`, userID, enabled, weekday, quietStart, quietEnd)
	if err != nil {
		t.Fatalf("seed digest row: %v", err)
	}
}
