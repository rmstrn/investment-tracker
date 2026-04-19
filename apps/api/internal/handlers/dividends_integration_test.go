//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
)

func TestListDividends_HappyPath_Plus(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")
	acc := seedAccountForTx(t, uid, "USD")

	base := time.Date(2026, 4, 1, 12, 0, 0, 0, time.UTC)
	_ = seedTransaction(t, uid, acc, "AAPL", "stock", "dividend", "10", "0.25", "USD", base)
	_ = seedTransaction(t, uid, acc, "MSFT", "stock", "dividend", "5", "0.75", "USD", base.Add(24*time.Hour))
	// Non-dividend row — must be excluded.
	_ = seedTransaction(t, uid, acc, "AAPL", "stock", "buy", "10", "150", "USD", base)

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/dividends",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 2 {
		t.Fatalf("len(data) = %d, want 2", len(data))
	}

	first := data[0].(map[string]any)
	if first["symbol"] != "MSFT" {
		t.Fatalf("first = %v, want MSFT (sort DESC)", first["symbol"])
	}
	if first["status"] != "paid" {
		t.Fatalf("status = %v, want paid", first["status"])
	}
	// amount_per_share = 0.75, total = 5 * 0.75 = 3.75.
	if first["amount_per_share"].(string)[:4] != "0.75" {
		t.Fatalf("amount_per_share = %v", first["amount_per_share"])
	}
	if first["total_amount"].(string)[:4] != "3.75" {
		t.Fatalf("total_amount = %v", first["total_amount"])
	}
}

func TestListDividends_FreeTier_Returns403(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/dividends",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("status = %d, want 403, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["error"].(map[string]any)["code"] != "FEATURE_LOCKED" {
		t.Fatalf("code = %v, want FEATURE_LOCKED", out["error"])
	}
}

func TestListDividends_EmptyState_Returns200(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/dividends",
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

func TestListDividends_DateFilter(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")
	acc := seedAccountForTx(t, uid, "USD")

	_ = seedTransaction(t, uid, acc, "AAPL", "stock", "dividend", "10", "0.25", "USD",
		time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC))
	_ = seedTransaction(t, uid, acc, "MSFT", "stock", "dividend", "10", "0.75", "USD",
		time.Date(2026, 4, 1, 0, 0, 0, 0, time.UTC))

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/dividends?from=2026-01-01",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 1 {
		t.Fatalf("len = %d, want 1 (only recent dividend)", len(data))
	}
	if data[0].(map[string]any)["symbol"] != "MSFT" {
		t.Fatalf("symbol = %v, want MSFT", data[0].(map[string]any)["symbol"])
	}
}
