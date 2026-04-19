//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"

	"github.com/gofiber/fiber/v3"
)

func TestUpdateMe_DisplayCurrencyAndLocale(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	body := map[string]any{"display_currency": "EUR", "locale": "ru"}
	resp, raw := doJSON(t, a, fiber.MethodPatch, "/me",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["display_currency"] != "EUR" {
		t.Fatalf("display_currency = %v", out["display_currency"])
	}
	if out["locale"] != "ru" {
		t.Fatalf("locale = %v", out["locale"])
	}
}

func TestUpdateMe_InvalidCurrency_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, _ := doJSON(t, a, fiber.MethodPatch, "/me",
		uid.String(), testSharedInternalToken, map[string]any{"display_currency": "EURO"})
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
}

func TestDeleteMe_Sets202AndScheduledAt(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, _ := doJSON(t, a, fiber.MethodDelete, "/me",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusAccepted {
		t.Fatalf("status = %d, want 202", resp.StatusCode)
	}

	// GET /me now shows non-null deletion_scheduled_at.
	resp, raw := doJSON(t, a, fiber.MethodGet, "/me",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("get status = %d", resp.StatusCode)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["deletion_scheduled_at"] == nil {
		t.Fatalf("deletion_scheduled_at should be set after DELETE /me")
	}
}

func TestUndoDeletion_ClearsScheduledAt(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	// Schedule deletion first.
	resp, _ := doJSON(t, a, fiber.MethodDelete, "/me",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusAccepted {
		t.Fatalf("delete status = %d", resp.StatusCode)
	}

	// Undo.
	resp, raw := doJSON(t, a, fiber.MethodPost, "/me/undo-deletion",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("undo status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["deletion_scheduled_at"] != nil {
		t.Fatalf("deletion_scheduled_at = %v, want nil after undo", out["deletion_scheduled_at"])
	}
}

func TestDismissPaywall_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, raw := doJSON(t, a, fiber.MethodPost, "/me/paywalls/ai_messages_daily/dismiss",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["trigger"] != "ai_messages_daily" {
		t.Fatalf("trigger = %v", out["trigger"])
	}
	// Subsequent GET /me/paywalls returns this trigger.
	resp, raw = doJSON(t, a, fiber.MethodGet, "/me/paywalls",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("get status = %d", resp.StatusCode)
	}
	var list map[string]any
	_ = json.Unmarshal(raw, &list)
	data := list["data"].([]any)
	if len(data) != 1 || data[0].(map[string]any)["trigger"] != "ai_messages_daily" {
		t.Fatalf("list = %v, want ai_messages_daily", data)
	}
}

func TestDismissPaywall_UnknownTrigger_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, _ := doJSON(t, a, fiber.MethodPost, "/me/paywalls/nonexistent/dismiss",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
}

func TestUpdateNotificationPreferences_PartialUpsert(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	body := map[string]any{
		"preferences": map[string]any{
			"insight_generated": map[string]any{"email": false, "push": true, "in_app": true},
		},
		"digest": map[string]any{
			"enabled":     false,
			"weekday":     3,
			"quiet_start": "21:00",
			"quiet_end":   "08:00",
		},
	}
	resp, raw := doJSON(t, a, fiber.MethodPatch, "/me/notification-preferences",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	prefs := out["preferences"].(map[string]any)
	insight := prefs["insight_generated"].(map[string]any)
	if insight["email"] != false {
		t.Fatalf("email = %v", insight["email"])
	}
	// Untouched type stays on default.
	sync := prefs["sync_failed"].(map[string]any)
	if sync["email"] != true {
		t.Fatalf("sync_failed.email = %v, want default true", sync["email"])
	}
	digest := out["digest"].(map[string]any)
	if digest["enabled"] != false {
		t.Fatalf("digest.enabled = %v", digest["enabled"])
	}
	if digest["weekday"].(float64) != 3 {
		t.Fatalf("weekday = %v, want 3", digest["weekday"])
	}
}

func TestUpdateNotificationPreferences_BadWeekday_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	body := map[string]any{"digest": map[string]any{"weekday": 7}}
	resp, _ := doJSON(t, a, fiber.MethodPatch, "/me/notification-preferences",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
}
