//go:build integration

package handlers_test

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/shopspring/decimal"
)

// seedPositionWithPrice wires the minimum rows for /portfolio to return
// a populated snapshot: account → position → price → fx.
func seedPositionWithPrice(t *testing.T, userID uuid.UUID, symbol, currency, qty, avgCost, price string) {
	t.Helper()

	accountID := uuid.Must(uuid.NewV7())
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO accounts (id, user_id, broker_name, display_name, account_type, connection_type, base_currency)
		VALUES ($1, $2, 'manual', 'Test', 'manual', 'manual', $3)
	`, accountID, userID, currency)
	if err != nil {
		t.Fatalf("seed account: %v", err)
	}

	posID := uuid.Must(uuid.NewV7())
	_, err = testPool.Exec(context.Background(), `
		INSERT INTO positions (id, user_id, account_id, symbol, asset_type, quantity, avg_cost, currency)
		VALUES ($1, $2, $3, $4, 'stock', $5, $6, $7)
	`, posID, userID, accountID, symbol, decimal.RequireFromString(qty), decimal.RequireFromString(avgCost), currency)
	if err != nil {
		t.Fatalf("seed position: %v", err)
	}

	_, err = testPool.Exec(context.Background(), `
		INSERT INTO prices (symbol, asset_type, currency, price, as_of, source)
		VALUES ($1, 'stock', $2, $3, $4, 'test')
	`, symbol, currency, decimal.RequireFromString(price), pgtype.Timestamptz{Time: time.Now().UTC(), Valid: true})
	if err != nil {
		t.Fatalf("seed price: %v", err)
	}
}

func TestGetPortfolio_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	// 10 AAPL @ $100 cost, priced at $120 now — $200 profit.
	seedPositionWithPrice(t, uid, "AAPL", "USD", "10", "100", "120")

	resp, body := doJSON(t, a, fiber.MethodGet, "/portfolio",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	if err := json.Unmarshal(body, &out); err != nil {
		t.Fatalf("decode: %v body=%s", err, body)
	}

	values, ok := out["values"].(map[string]any)
	if !ok {
		t.Fatalf("missing values: %v", out)
	}
	base := values["base"].(map[string]any)
	if base["total_value"].(string)[:4] != "1200" {
		t.Fatalf("total_value base = %v, want 1200.*", base["total_value"])
	}
	if base["total_cost"].(string)[:4] != "1000" {
		t.Fatalf("total_cost base = %v, want 1000.*", base["total_cost"])
	}
	if out["pnl_percent"].(float64) < 0.19 || out["pnl_percent"].(float64) > 0.21 {
		t.Fatalf("pnl_percent = %v, want ~0.20", out["pnl_percent"])
	}
}

func TestGetPortfolio_EmptyPortfolio(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet, "/portfolio",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d body=%s", resp.StatusCode, body)
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)
	base := out["values"].(map[string]any)["base"].(map[string]any)
	if base["total_value"].(string)[:1] != "0" {
		t.Fatalf("empty total_value = %v, want 0.*", base["total_value"])
	}
}

func TestGetPortfolio_UnauthenticatedRejected(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	// no Authorization header at all → 401 from Auth middleware
	resp, _ := doJSON(t, a, fiber.MethodGet, "/portfolio", "", "", nil)
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401", resp.StatusCode)
	}
}

func TestGetPortfolio_CurrencyQueryParamOverridesUser(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	seedPositionWithPrice(t, uid, "AAPL", "USD", "10", "100", "120")
	// Add an FX rate so the display conversion can resolve.
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO fx_rates (base_currency, quote_currency, rate, as_of, source)
		VALUES ('USD', 'EUR', '0.90', CURRENT_DATE, 'test')
	`)
	if err != nil {
		t.Fatalf("seed fx: %v", err)
	}

	resp, body := doJSON(t, a, fiber.MethodGet, "/portfolio?display_currency=EUR",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d body=%s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	display := out["values"].(map[string]any)["display"].(map[string]any)
	if display["currency"].(string) != "EUR" {
		t.Fatalf("display currency = %v, want EUR", display["currency"])
	}
	// 1200 USD * 0.90 = 1080 EUR
	if display["total_value"].(string)[:4] != "1080" {
		t.Fatalf("display total_value = %v, want 1080.*", display["total_value"])
	}
}
