//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"

	"github.com/gofiber/fiber/v3"
)

// The list is stubbed pending the Clerk Backend SDK (TD-027). The
// contract assertion is simple: 200 + empty data + X-Clerk-Unavailable
// header so callers can tell the stub apart from a real "no sessions"
// response once the SDK lands.
func TestListMySessions_Stub_Returns200Empty(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet, "/me/sessions",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	if resp.Header.Get("X-Clerk-Unavailable") != "true" {
		t.Fatalf("missing X-Clerk-Unavailable header")
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if len(out["data"].([]any)) != 0 {
		t.Fatalf("len(data) = %d, want 0 from stub", len(out["data"].([]any)))
	}
}
