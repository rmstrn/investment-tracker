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

// seedPosition inserts one positions row directly. Returns the
// position id for downstream lookups.
func seedPositionRow(t *testing.T, userID, accountID uuid.UUID, symbol, qty, avgCost, currency string) uuid.UUID {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO positions (id, user_id, account_id, symbol, asset_type, quantity, avg_cost, currency)
		VALUES ($1, $2, $3, $4, 'stock', $5, $6, $7)
	`, id, userID, accountID, symbol,
		decimal.RequireFromString(qty), decimal.RequireFromString(avgCost), currency)
	if err != nil {
		t.Fatalf("seed position: %v", err)
	}
	return id
}

func TestGetPosition_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	acc := seedAccountForTx(t, uid, "USD")
	pos := seedPositionRow(t, uid, acc, "AAPL", "10", "100", "USD")
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO prices (symbol, asset_type, currency, price, as_of, source)
		VALUES ('AAPL', 'stock', 'USD', $1, $2, 'test')
	`, decimal.RequireFromString("120"), pgtype.Timestamptz{Time: time.Now().UTC(), Valid: true})
	if err != nil {
		t.Fatalf("seed price: %v", err)
	}

	resp, body := doJSON(t, a, fiber.MethodGet, "/positions/"+pos.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["symbol"] != "AAPL" {
		t.Fatalf("symbol = %v", out["symbol"])
	}
}

func TestGetPosition_NotFound(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	phantom := uuid.Must(uuid.NewV7())

	resp, body := doJSON(t, a, fiber.MethodGet, "/positions/"+phantom.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}

func TestListPositionTransactions_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	acc := seedAccountForTx(t, uid, "USD")
	pos := seedPositionRow(t, uid, acc, "AAPL", "10", "100", "USD")

	base := time.Date(2026, 4, 1, 12, 0, 0, 0, time.UTC)
	_ = seedTransaction(t, uid, acc, "AAPL", "stock", "buy", "10", "100", "USD", base)
	_ = seedTransaction(t, uid, acc, "AAPL", "stock", "buy", "5", "110", "USD", base.Add(1*time.Hour))
	// Different symbol — must NOT show up.
	_ = seedTransaction(t, uid, acc, "MSFT", "stock", "buy", "1", "300", "USD", base.Add(2*time.Hour))

	resp, body := doJSON(t, a, fiber.MethodGet, "/positions/"+pos.String()+"/transactions",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 2 {
		t.Fatalf("len = %d, want 2 (AAPL only)", len(data))
	}
}

func TestListPositionTransactions_NotFound(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	phantom := uuid.Must(uuid.NewV7())

	resp, body := doJSON(t, a, fiber.MethodGet, "/positions/"+phantom.String()+"/transactions",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}
