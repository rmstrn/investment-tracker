//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

func TestGetTransaction_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	acc := seedAccountForTx(t, uid, "USD")
	txID := seedTransaction(t, uid, acc, "AAPL", "stock", "buy", "10", "100", "USD",
		time.Date(2026, 4, 1, 12, 0, 0, 0, time.UTC))

	resp, body := doJSON(t, a, fiber.MethodGet, "/transactions/"+txID.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["id"] != txID.String() {
		t.Fatalf("id = %v", out["id"])
	}
	if out["symbol"] != "AAPL" {
		t.Fatalf("symbol = %v", out["symbol"])
	}
}

func TestGetTransaction_NotFound(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	phantom := uuid.Must(uuid.NewV7())

	resp, body := doJSON(t, a, fiber.MethodGet, "/transactions/"+phantom.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}

func TestGetTransaction_OtherUsersTx_404(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	other := seedUser(t, "free")
	otherAcc := seedAccountForTx(t, other, "USD")
	otherTx := seedTransaction(t, other, otherAcc, "AAPL", "stock", "buy", "1", "1", "USD",
		time.Date(2026, 4, 1, 0, 0, 0, 0, time.UTC))

	resp, body := doJSON(t, a, fiber.MethodGet, "/transactions/"+otherTx.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, want 404 for cross-user, body = %s", resp.StatusCode, body)
	}
}
