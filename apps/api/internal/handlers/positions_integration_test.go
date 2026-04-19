//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"

	"github.com/gofiber/fiber/v3"
)

func TestListPositions_HappyPath_DefaultSortValueDesc(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	// AAPL is worth 1200 (10*120); BTC is worth 60000 (1*60000). BTC first.
	seedPositionWithPrice(t, uid, "AAPL", "USD", "10", "100", "120")
	seedPositionWithPrice(t, uid, "BTC", "USD", "1", "30000", "60000")

	resp, body := doJSON(t, a, fiber.MethodGet, "/positions",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d body=%s", resp.StatusCode, body)
	}
	var out struct {
		Data []map[string]any `json:"data"`
	}
	if err := json.Unmarshal(body, &out); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if len(out.Data) != 2 {
		t.Fatalf("len(data) = %d, want 2", len(out.Data))
	}
	if out.Data[0]["symbol"] != "BTC" {
		t.Fatalf("default sort: first = %v, want BTC (value_desc)", out.Data[0]["symbol"])
	}
}

func TestListPositions_SortAlpha(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	seedPositionWithPrice(t, uid, "BTC", "USD", "1", "30000", "60000")
	seedPositionWithPrice(t, uid, "AAPL", "USD", "10", "100", "120")

	resp, body := doJSON(t, a, fiber.MethodGet, "/positions?sort=alpha",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d body=%s", resp.StatusCode, body)
	}
	var out struct {
		Data []map[string]any `json:"data"`
	}
	_ = json.Unmarshal(body, &out)
	if out.Data[0]["symbol"] != "AAPL" || out.Data[1]["symbol"] != "BTC" {
		t.Fatalf("alpha sort: got %v, %v", out.Data[0]["symbol"], out.Data[1]["symbol"])
	}
}

func TestListPositions_UnauthenticatedRejected(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	resp, _ := doJSON(t, a, fiber.MethodGet, "/positions", "", "", nil)
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401", resp.StatusCode)
	}
}
