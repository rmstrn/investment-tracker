//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"

	"github.com/gofiber/fiber/v3"
)

func TestGetMarketHistory_ValidParams_Returns501(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/market/history?symbol=AAPL&asset_type=stock&period=1m&interval=1d",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotImplemented {
		t.Fatalf("status = %d, want 501, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["error"].(map[string]any)["code"] != "NOT_IMPLEMENTED" {
		t.Fatalf("code = %v", out["error"])
	}
}

func TestGetMarketHistory_BadParams_Returns400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/market/history?symbol=AAPL&asset_type=stock&period=2y&interval=1d",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400 (validation should run before 501), body = %s", resp.StatusCode, body)
	}
}
