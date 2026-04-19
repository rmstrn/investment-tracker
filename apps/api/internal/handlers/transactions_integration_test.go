//go:build integration

package handlers_test

import (
	"context"
	"encoding/json"
	"fmt"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/shopspring/decimal"
)

// seedTransaction inserts a transactions row and returns its id + the
// executed_at used. executedAt is passed in so tests can set a known
// order for pagination assertions.
func seedTransaction(
	t *testing.T,
	userID, accountID uuid.UUID,
	symbol, assetType, txType, quantity, price, currency string,
	executedAt time.Time,
) uuid.UUID {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO transactions (
			id, user_id, account_id, symbol, asset_type, transaction_type,
			quantity, price, currency, fee, executed_at, source, fingerprint
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, $10, 'manual', $11)
	`,
		id, userID, accountID, symbol, assetType, txType,
		decimal.RequireFromString(quantity), decimal.RequireFromString(price), currency,
		pgtype.Timestamptz{Time: executedAt, Valid: true},
		fmt.Sprintf("fp-%s", id.String()),
	)
	if err != nil {
		t.Fatalf("seed transaction: %v", err)
	}
	return id
}

func seedAccountForTx(t *testing.T, userID uuid.UUID, currency string) uuid.UUID {
	t.Helper()
	accID := uuid.Must(uuid.NewV7())
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO accounts (id, user_id, broker_name, display_name, account_type, connection_type, base_currency)
		VALUES ($1, $2, 'manual', 'Tx Test', 'manual', 'manual', $3)
	`, accID, userID, currency)
	if err != nil {
		t.Fatalf("seed account: %v", err)
	}
	return accID
}

func TestListTransactions_HappyPath_AllFilters(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	acc := seedAccountForTx(t, uid, "USD")

	base := time.Date(2026, 4, 1, 12, 0, 0, 0, time.UTC)
	_ = seedTransaction(t, uid, acc, "AAPL", "stock", "buy", "10", "100", "USD", base)
	_ = seedTransaction(t, uid, acc, "AAPL", "stock", "dividend", "10", "0.25", "USD", base.Add(1*time.Hour))
	_ = seedTransaction(t, uid, acc, "BTC", "crypto", "buy", "0.1", "50000", "USD", base.Add(2*time.Hour))

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/transactions?symbol=AAPL&asset_type=stock",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	if err := json.Unmarshal(body, &out); err != nil {
		t.Fatalf("decode: %v body=%s", err, body)
	}
	data := out["data"].([]any)
	if len(data) != 2 {
		t.Fatalf("len(data) = %d, want 2", len(data))
	}
	first := data[0].(map[string]any)
	if first["symbol"] != "AAPL" {
		t.Fatalf("symbol = %v, want AAPL", first["symbol"])
	}
	// Sort is executed_at DESC — the dividend row (later) comes first.
	if first["transaction_type"] != "dividend" {
		t.Fatalf("first.transaction_type = %v, want dividend (sort DESC)", first["transaction_type"])
	}

	meta := out["meta"].(map[string]any)
	if meta["has_more"].(bool) {
		t.Fatalf("has_more = true, want false (only 2 rows)")
	}
	if meta["next_cursor"] != nil {
		t.Fatalf("next_cursor = %v, want nil", meta["next_cursor"])
	}
}

func TestListTransactions_EmptyState_Returns200(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet, "/transactions",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	if err := json.Unmarshal(body, &out); err != nil {
		t.Fatalf("decode: %v body=%s", err, body)
	}
	data := out["data"].([]any)
	if len(data) != 0 {
		t.Fatalf("len(data) = %d, want 0 for new user", len(data))
	}
	if out["meta"].(map[string]any)["has_more"].(bool) {
		t.Fatalf("has_more true on empty set")
	}
}

func TestListTransactions_CursorPagination(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	acc := seedAccountForTx(t, uid, "USD")

	base := time.Date(2026, 4, 1, 12, 0, 0, 0, time.UTC)
	for i := 0; i < 5; i++ {
		_ = seedTransaction(t, uid, acc, "AAPL", "stock", "buy", "1", "100", "USD",
			base.Add(time.Duration(i)*time.Hour))
	}

	// Page 1: limit=2 → expect 2 items, has_more=true, non-nil cursor.
	resp, body := doJSON(t, a, fiber.MethodGet, "/transactions?limit=2",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("page1 status = %d, body = %s", resp.StatusCode, body)
	}
	var page1 map[string]any
	_ = json.Unmarshal(body, &page1)
	if len(page1["data"].([]any)) != 2 {
		t.Fatalf("page1 len = %d, want 2", len(page1["data"].([]any)))
	}
	if !page1["meta"].(map[string]any)["has_more"].(bool) {
		t.Fatalf("page1 has_more = false, want true")
	}
	cursor := page1["meta"].(map[string]any)["next_cursor"].(string)
	if cursor == "" {
		t.Fatal("page1 next_cursor empty, want non-empty")
	}

	// Page 2: pass the cursor — expect 2 more items.
	resp, body = doJSON(t, a, fiber.MethodGet,
		"/transactions?limit=2&cursor="+cursor,
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("page2 status = %d, body = %s", resp.StatusCode, body)
	}
	var page2 map[string]any
	_ = json.Unmarshal(body, &page2)
	if len(page2["data"].([]any)) != 2 {
		t.Fatalf("page2 len = %d, want 2", len(page2["data"].([]any)))
	}

	// Sanity: page2 items must not overlap page1.
	p1ids := map[string]bool{}
	for _, it := range page1["data"].([]any) {
		p1ids[it.(map[string]any)["id"].(string)] = true
	}
	for _, it := range page2["data"].([]any) {
		id := it.(map[string]any)["id"].(string)
		if p1ids[id] {
			t.Fatalf("page2 contains page1 id %s — pagination broke", id)
		}
	}
}

func TestListTransactions_MalformedCursor_Returns400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/transactions?cursor=this-is-not-base64-json",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	errMap, _ := out["error"].(map[string]any)
	if errMap == nil || errMap["code"] != "VALIDATION_ERROR" {
		t.Fatalf("code = %v, want VALIDATION_ERROR; body = %s", errMap, body)
	}
}

func TestListTransactions_InvalidAssetType_Returns400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/transactions?asset_type=reit",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400, body = %s", resp.StatusCode, body)
	}
}

func TestListTransactions_DateRangeFilter(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	acc := seedAccountForTx(t, uid, "USD")

	old := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)
	recent := time.Date(2026, 4, 10, 0, 0, 0, 0, time.UTC)
	_ = seedTransaction(t, uid, acc, "AAPL", "stock", "buy", "1", "100", "USD", old)
	_ = seedTransaction(t, uid, acc, "AAPL", "stock", "buy", "1", "100", "USD", recent)

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/transactions?from=2026-01-01T00:00:00Z",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if len(out["data"].([]any)) != 1 {
		t.Fatalf("len = %d, want 1 (only recent tx passes from filter)", len(out["data"].([]any)))
	}
}
