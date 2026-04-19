//go:build integration

package handlers_test

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/shopspring/decimal"
)

func seedPrice(t *testing.T, symbol, assetType, currency, price string, asOf time.Time) {
	t.Helper()
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO prices (symbol, asset_type, currency, price, as_of, source)
		VALUES ($1, $2, $3, $4, $5, 'test')
	`, symbol, assetType, currency, decimal.RequireFromString(price),
		pgtype.Timestamptz{Time: asOf, Valid: true})
	if err != nil {
		t.Fatalf("seed price: %v", err)
	}
}

func TestGetMarketQuote_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	seedPrice(t, "AAPL", "stock", "USD", "175.25", time.Now().UTC())

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/market/quote?symbol=AAPL&asset_type=stock",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["symbol"] != "AAPL" {
		t.Fatalf("symbol = %v", out["symbol"])
	}
	if out["currency"] != "USD" {
		t.Fatalf("currency = %v, want USD (preferred)", out["currency"])
	}
	if out["price"].(string)[:6] != "175.25" {
		t.Fatalf("price = %v, want 175.25*", out["price"])
	}
}

func TestGetMarketQuote_PrefersUSDWhenMultipleCurrencies(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	// Newer EUR row — the handler must still prefer USD per GetLatestPrice.
	seedPrice(t, "AAPL", "stock", "EUR", "160.00", time.Now().UTC())
	seedPrice(t, "AAPL", "stock", "USD", "175.25", time.Now().UTC().Add(-1*time.Hour))

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/market/quote?symbol=AAPL&asset_type=stock",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["currency"] != "USD" {
		t.Fatalf("currency = %v, want USD", out["currency"])
	}
}

func TestGetMarketQuote_Miss_Returns404WithRetryHint(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/market/quote?symbol=UNKNOWN&asset_type=stock",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, want 404, body = %s", resp.StatusCode, body)
	}
	if resp.Header.Get("Retry-After") == "" {
		t.Fatal("missing Retry-After header on quote miss")
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)
	errMap := out["error"].(map[string]any)
	if errMap["code"] != "QUOTE_NOT_AVAILABLE" {
		t.Fatalf("code = %v, want QUOTE_NOT_AVAILABLE", errMap["code"])
	}
	details, _ := errMap["details"].(map[string]any)
	if details == nil || details["retry_after_seconds"].(float64) != 60 {
		t.Fatalf("retry_after_seconds missing or wrong: %v", details)
	}
}

func TestGetMarketQuote_MissingSymbol_Returns400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/market/quote?asset_type=stock",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}

func TestGetMarketQuote_InvalidAssetType_Returns400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/market/quote?symbol=AAPL&asset_type=bond",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}
