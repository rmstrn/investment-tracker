//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
)

func TestGetPortfolioHistory_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	today := time.Now().UTC()
	seedSnapshot(t, uid, today.AddDate(0, 0, -10), "1000", "1000")
	seedSnapshot(t, uid, today.AddDate(0, 0, -5), "1100", "1000")
	seedSnapshot(t, uid, today, "1200", "1000")

	resp, body := doJSON(t, a, fiber.MethodGet, "/portfolio/history?period=1m",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)

	if out["period"] != "1m" || out["base_currency"] != "USD" {
		t.Fatalf("envelope wrong: %v", out)
	}
	points := out["points"].([]any)
	if len(points) != 3 {
		t.Fatalf("points = %d, want 3", len(points))
	}
	last := points[2].(map[string]any)
	vb := last["value_base"].(map[string]any)
	if vb["total_value"].(string)[:4] != "1200" {
		t.Fatalf("last total_value = %v, want 1200*", vb["total_value"])
	}
}

func TestGetPortfolioHistory_EmptyState(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet, "/portfolio/history?period=1y",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d (empty must be 200)", resp.StatusCode)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if len(out["points"].([]any)) != 0 {
		t.Fatalf("points = %d, want 0", len(out["points"].([]any)))
	}
}

func TestGetPortfolioHistory_InvalidPeriod(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet, "/portfolio/history?period=2y",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}
