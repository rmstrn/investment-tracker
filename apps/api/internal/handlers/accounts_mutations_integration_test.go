//go:build integration

package handlers_test

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

func TestCreateAccount_Manual_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	body := map[string]any{
		"connection_type": "manual",
		"display_name":    "My Manual Account",
		"base_currency":   "USD",
	}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/accounts",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	acc := out["account"].(map[string]any)
	if acc["display_name"] != "My Manual Account" {
		t.Fatalf("display_name = %v", acc["display_name"])
	}
	if acc["sync_status"] != "ok" {
		t.Fatalf("sync_status = %v, want ok for manual", acc["sync_status"])
	}
	if out["connect_url"] != nil {
		t.Fatalf("connect_url = %v, want nil for manual", out["connect_url"])
	}
}

func TestCreateAccount_Aggregator_501(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	body := map[string]any{
		"connection_type": "aggregator",
		"broker_name":     "interactive_brokers",
		"display_name":    "IBKR",
		"base_currency":   "USD",
	}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/accounts",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusNotImplemented {
		t.Fatalf("status = %d, want 501 (aggregator stub, TD-046), body = %s", resp.StatusCode, raw)
	}
}

func TestCreateAccount_MissingDisplayName_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	body := map[string]any{"connection_type": "manual"}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/accounts",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
}

func TestUpdateAccount_DisplayName(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	accID := seedAccountFull(t, uid, "Old Name", "ok", nil)

	body := map[string]any{"display_name": "New Name"}
	resp, raw := doJSON(t, a, fiber.MethodPatch, "/accounts/"+accID.String(),
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["display_name"] != "New Name" {
		t.Fatalf("display_name = %v", out["display_name"])
	}
}

func TestUpdateAccount_IsIncludedToggle(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	accID := seedAccountFull(t, uid, "Keep", "ok", nil)

	body := map[string]any{"is_included_in_portfolio": false}
	resp, raw := doJSON(t, a, fiber.MethodPatch, "/accounts/"+accID.String(),
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["is_included_in_portfolio"] != false {
		t.Fatalf("is_included_in_portfolio = %v, want false", out["is_included_in_portfolio"])
	}
}

func TestDeleteAccount_SoftDelete(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	accID := seedAccountFull(t, uid, "Bye", "ok", nil)

	resp, _ := doJSON(t, a, fiber.MethodDelete, "/accounts/"+accID.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNoContent {
		t.Fatalf("status = %d, want 204", resp.StatusCode)
	}

	// Subsequent GET must 404 (soft-delete filter on GetAccountByID).
	resp2, _ := doJSON(t, a, fiber.MethodGet, "/accounts/"+accID.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp2.StatusCode != fiber.StatusNotFound {
		t.Fatalf("post-delete GET status = %d, want 404", resp2.StatusCode)
	}
}

func TestDeleteAccount_CrossUser_404(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	other := seedUser(t, "free")
	otherAcc := seedAccountFull(t, other, "NotMine", "ok", nil)

	resp, _ := doJSON(t, a, fiber.MethodDelete, "/accounts/"+otherAcc.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("cross-user delete status = %d, want 404", resp.StatusCode)
	}
}

func TestSyncAccount_Returns202(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	accID := seedAccountFull(t, uid, "Sync", "ok", nil)

	resp, raw := doJSON(t, a, fiber.MethodPost, "/accounts/"+accID.String()+"/sync",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusAccepted {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["account_id"] != accID.String() {
		t.Fatalf("account_id = %v", out["account_id"])
	}
}

func TestReconnectAccount_Returns202(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	accID := seedAccountFull(t, uid, "Recon", "ok", nil)

	resp, _ := doJSON(t, a, fiber.MethodPost, "/accounts/"+accID.String()+"/reconnect",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusAccepted {
		t.Fatalf("status = %d", resp.StatusCode)
	}
}

func TestPauseAndResume_FlipsSyncStatus(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	accID := seedAccountFull(t, uid, "PausableA", "ok", nil)

	resp, raw := doJSON(t, a, fiber.MethodPost, "/accounts/"+accID.String()+"/pause",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("pause status = %d, body = %s", resp.StatusCode, raw)
	}
	var paused map[string]any
	_ = json.Unmarshal(raw, &paused)
	if paused["sync_status"] != "paused" {
		t.Fatalf("sync_status after pause = %v, want paused", paused["sync_status"])
	}

	resp, raw = doJSON(t, a, fiber.MethodPost, "/accounts/"+accID.String()+"/resume",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("resume status = %d, body = %s", resp.StatusCode, raw)
	}
	var resumed map[string]any
	_ = json.Unmarshal(raw, &resumed)
	if resumed["sync_status"] != "pending" {
		t.Fatalf("sync_status after resume = %v, want pending", resumed["sync_status"])
	}
}

// seedUsersInTestDB is a lightweight sanity that resetDB truly clears
// the accounts table between sub-tests — run it via a scratch context
// so a failure here narrows future test-stability bugs fast.
func TestMutationSmoke_ResetDBClearsAccounts(t *testing.T) {
	resetDB(t)
	uid := seedUser(t, "free")
	_ = seedAccountFull(t, uid, "X", "ok", nil)

	resetDB(t)

	var count int
	if err := testPool.QueryRow(context.Background(),
		"SELECT COUNT(*)::int FROM accounts").Scan(&count); err != nil {
		t.Fatalf("count: %v", err)
	}
	if count != 0 {
		t.Fatalf("accounts count = %d after resetDB, want 0", count)
	}
	_ = uuid.Nil // keep import warm in case the test grows
}
