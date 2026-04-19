//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

func TestCreateTransaction_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	acc := seedAccountForTx(t, uid, "USD")

	body := map[string]any{
		"account_id":       acc.String(),
		"symbol":           "AAPL",
		"asset_type":       "stock",
		"transaction_type": "buy",
		"quantity":         "10",
		"price":            "150",
		"currency":         "USD",
		"executed_at":      "2026-04-19T12:00:00Z",
		"notes":            "initial buy",
	}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/transactions",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["symbol"] != "AAPL" {
		t.Fatalf("symbol = %v", out["symbol"])
	}
	if out["source"] != "manual" {
		t.Fatalf("source = %v, want manual (POST is always manual)", out["source"])
	}
}

func TestCreateTransaction_DuplicateFingerprint_409(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	acc := seedAccountForTx(t, uid, "USD")

	body := map[string]any{
		"account_id":       acc.String(),
		"symbol":           "AAPL",
		"asset_type":       "stock",
		"transaction_type": "buy",
		"quantity":         "10",
		"price":            "150",
		"currency":         "USD",
		"executed_at":      "2026-04-19T12:00:00Z",
	}
	resp, _ := doJSON(t, a, fiber.MethodPost, "/transactions",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("first status = %d", resp.StatusCode)
	}

	// Second post of the identical payload → 409 DUPLICATE_TRANSACTION.
	resp, raw := doJSON(t, a, fiber.MethodPost, "/transactions",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusConflict {
		t.Fatalf("status = %d, want 409, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["error"].(map[string]any)["code"] != "DUPLICATE_TRANSACTION" {
		t.Fatalf("code = %v", out["error"])
	}
}

func TestCreateTransaction_AccountBelongsToOtherUser_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	other := seedUser(t, "free")
	otherAcc := seedAccountForTx(t, other, "USD")

	body := map[string]any{
		"account_id":       otherAcc.String(),
		"symbol":           "AAPL",
		"asset_type":       "stock",
		"transaction_type": "buy",
		"quantity":         "10",
		"price":            "150",
		"currency":         "USD",
		"executed_at":      "2026-04-19T12:00:00Z",
	}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/transactions",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400 (cross-user account), body = %s", resp.StatusCode, raw)
	}
}

func TestUpdateTransaction_Manual_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	acc := seedAccountForTx(t, uid, "USD")

	// Post a manual tx first.
	postBody := map[string]any{
		"account_id":       acc.String(),
		"symbol":           "AAPL",
		"asset_type":       "stock",
		"transaction_type": "buy",
		"quantity":         "10",
		"price":            "150",
		"currency":         "USD",
		"executed_at":      "2026-04-19T12:00:00Z",
	}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/transactions",
		uid.String(), testSharedInternalToken, postBody)
	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("post status = %d", resp.StatusCode)
	}
	var posted map[string]any
	_ = json.Unmarshal(raw, &posted)
	txID := posted["id"].(string)

	// Patch the quantity.
	patchBody := map[string]any{"quantity": "12"}
	resp, raw = doJSON(t, a, fiber.MethodPatch, "/transactions/"+txID,
		uid.String(), testSharedInternalToken, patchBody)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("patch status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["quantity"].(string)[:2] != "12" {
		t.Fatalf("quantity = %v, want 12*", out["quantity"])
	}
}

func TestUpdateTransaction_NonManual_403(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	acc := seedAccountForTx(t, uid, "USD")
	// seedTransaction from B2a inserts with source='manual' by default.
	// To test the 403 path we seed an api-sourced row directly.
	txID := uuid.Must(uuid.NewV7())
	executedAt := time.Date(2026, 4, 19, 12, 0, 0, 0, time.UTC)
	_, err := testPool.Exec(t.Context(), `
		INSERT INTO transactions (
			id, user_id, account_id, symbol, asset_type, transaction_type,
			quantity, price, currency, fee, executed_at, source, fingerprint
		) VALUES ($1, $2, $3, 'AAPL', 'stock', 'buy', 10, 150, 'USD', 0, $4, 'api', $5)
	`, txID, uid, acc, executedAt, "fp-"+txID.String())
	if err != nil {
		t.Fatalf("seed api tx: %v", err)
	}

	resp, raw := doJSON(t, a, fiber.MethodPatch, "/transactions/"+txID.String(),
		uid.String(), testSharedInternalToken, map[string]any{"quantity": "12"})
	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("status = %d, want 403 (api-sourced immutable), body = %s", resp.StatusCode, raw)
	}
}

func TestUpdateTransaction_NotFound(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	phantom := uuid.Must(uuid.NewV7())

	resp, _ := doJSON(t, a, fiber.MethodPatch, "/transactions/"+phantom.String(),
		uid.String(), testSharedInternalToken, map[string]any{"quantity": "1"})
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, want 404", resp.StatusCode)
	}
}

func TestDeleteTransaction_Manual_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	acc := seedAccountForTx(t, uid, "USD")

	body := map[string]any{
		"account_id":       acc.String(),
		"symbol":           "AAPL",
		"asset_type":       "stock",
		"transaction_type": "buy",
		"quantity":         "10",
		"price":            "150",
		"currency":         "USD",
		"executed_at":      "2026-04-19T12:00:00Z",
	}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/transactions",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("post status = %d", resp.StatusCode)
	}
	var posted map[string]any
	_ = json.Unmarshal(raw, &posted)
	txID := posted["id"].(string)

	resp, _ = doJSON(t, a, fiber.MethodDelete, "/transactions/"+txID,
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNoContent {
		t.Fatalf("delete status = %d, want 204", resp.StatusCode)
	}

	// Subsequent GET → 404.
	resp, _ = doJSON(t, a, fiber.MethodGet, "/transactions/"+txID,
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("post-delete GET = %d, want 404", resp.StatusCode)
	}
}

func TestDeleteTransaction_NonManual_403(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	acc := seedAccountForTx(t, uid, "USD")

	txID := uuid.Must(uuid.NewV7())
	_, err := testPool.Exec(t.Context(), `
		INSERT INTO transactions (
			id, user_id, account_id, symbol, asset_type, transaction_type,
			quantity, price, currency, fee, executed_at, source, fingerprint
		) VALUES ($1, $2, $3, 'AAPL', 'stock', 'buy', 10, 150, 'USD', 0, '2026-04-19T12:00:00Z'::timestamptz, 'aggregator', $4)
	`, txID, uid, acc, "fp-"+txID.String())
	if err != nil {
		t.Fatalf("seed aggregator tx: %v", err)
	}

	resp, raw := doJSON(t, a, fiber.MethodDelete, "/transactions/"+txID.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("status = %d, want 403, body = %s", resp.StatusCode, raw)
	}
}
