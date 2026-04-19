//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
)

func TestSearchMarket_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	now := time.Now().UTC()
	seedPrice(t, "AAPL", "stock", "USD", "175", now)
	seedPrice(t, "AMZN", "stock", "USD", "180", now)
	seedPrice(t, "BTC", "crypto", "USD", "65000", now)

	resp, body := doJSON(t, a, fiber.MethodGet, "/market/search?q=A",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 2 {
		t.Fatalf("len = %d, want 2 (AAPL + AMZN)", len(data))
	}
	if resp.Header.Get("X-Search-Provider") != "prices_table" {
		t.Fatalf("missing X-Search-Provider header")
	}
}

func TestSearchMarket_AssetTypeFilter(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	now := time.Now().UTC()
	seedPrice(t, "AAPL", "stock", "USD", "175", now)
	seedPrice(t, "BTC", "crypto", "USD", "65000", now)

	resp, body := doJSON(t, a, fiber.MethodGet, "/market/search?q=A&asset_type=crypto",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d", resp.StatusCode)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if len(out["data"].([]any)) != 0 {
		t.Fatalf("len = %d, want 0 (no crypto starting with A)", len(out["data"].([]any)))
	}
}

func TestSearchMarket_MissingQ_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet, "/market/search",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}
