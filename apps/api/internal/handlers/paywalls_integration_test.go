//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
)

func TestListMyPaywalls_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	today := time.Now().UTC()
	yesterday := today.AddDate(0, 0, -1)

	// Two paywall dismissals today, one unrelated counter, one expired.
	seedUsageCounter(t, uid, "paywall_dismissed_ai_messages_daily", today, 1)
	seedUsageCounter(t, uid, "paywall_dismissed_connected_accounts", today, 1)
	seedUsageCounter(t, uid, "ai_messages_daily", today, 5)                       // unrelated counter — must be excluded
	seedUsageCounter(t, uid, "paywall_dismissed_ai_messages_daily", yesterday, 1) // expired — excluded

	resp, body := doJSON(t, a, fiber.MethodGet, "/me/paywalls",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 2 {
		t.Fatalf("len(data) = %d, want 2 (today's dismissals only)", len(data))
	}
	triggers := map[string]bool{}
	for _, it := range data {
		m := it.(map[string]any)
		triggers[m["trigger"].(string)] = true
		if m["reset_at"] == nil || m["dismissed_on"] == nil {
			t.Fatalf("missing reset_at/dismissed_on in %v", m)
		}
	}
	if !triggers["ai_messages_daily"] || !triggers["connected_accounts"] {
		t.Fatalf("missing expected triggers: %v", triggers)
	}
}

func TestListMyPaywalls_EmptyState(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet, "/me/paywalls",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if len(out["data"].([]any)) != 0 {
		t.Fatalf("len = %d, want 0", len(out["data"].([]any)))
	}
}
