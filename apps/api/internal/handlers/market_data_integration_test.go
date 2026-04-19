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

func seedFxRate(t *testing.T, base, quote, rate string, asOf time.Time) {
	t.Helper()
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO fx_rates (base_currency, quote_currency, rate, as_of, source)
		VALUES ($1, $2, $3, $4, 'test')
	`, base, quote, decimal.RequireFromString(rate),
		pgtype.Date{Time: asOf, Valid: true})
	if err != nil {
		t.Fatalf("seed fx: %v", err)
	}
}

func TestListFxRates_Latest(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	today := time.Now().UTC()
	seedFxRate(t, "USD", "EUR", "0.90", today.AddDate(0, 0, -2))
	seedFxRate(t, "USD", "EUR", "0.92", today)
	seedFxRate(t, "USD", "GBP", "0.78", today)

	resp, body := doJSON(t, a, fiber.MethodGet, "/fx_rates",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 2 {
		t.Fatalf("len = %d, want 2 (distinct pairs)", len(data))
	}
	// USD→EUR should surface the newer row.
	for _, it := range data {
		m := it.(map[string]any)
		if m["base_currency"] == "USD" && m["quote_currency"] == "EUR" {
			if m["rate"].(string)[:4] != "0.92" {
				t.Fatalf("USD→EUR rate = %v, want newer 0.92*", m["rate"])
			}
		}
	}
}

func TestListFxRates_FilterBase(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	seedFxRate(t, "USD", "EUR", "0.90", time.Now().UTC())
	seedFxRate(t, "EUR", "USD", "1.11", time.Now().UTC())

	resp, body := doJSON(t, a, fiber.MethodGet, "/fx_rates?base=USD",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d", resp.StatusCode)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 1 {
		t.Fatalf("len = %d, want 1 (filtered on base=USD)", len(data))
	}
}

func TestListPrices_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	now := time.Now().UTC()
	seedPrice(t, "AAPL", "stock", "USD", "175", now)
	seedPrice(t, "MSFT", "stock", "USD", "300", now)

	resp, body := doJSON(t, a, fiber.MethodGet, "/prices?symbols=AAPL,MSFT,UNKNOWN",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 2 {
		t.Fatalf("len = %d, want 2 (unknown silently missed)", len(data))
	}
}

func TestListPrices_MissingSymbols_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet, "/prices",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}
