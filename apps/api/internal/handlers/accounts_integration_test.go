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
)

func seedAccountFull(t *testing.T, userID uuid.UUID, displayName, syncStatus string, lastSync *time.Time) uuid.UUID {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	var lastSyncTS pgtype.Timestamptz
	if lastSync != nil {
		lastSyncTS = pgtype.Timestamptz{Time: *lastSync, Valid: true}
	}
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO accounts (id, user_id, broker_name, display_name, account_type, connection_type, base_currency, sync_status, last_synced_at)
		VALUES ($1, $2, 'manual', $3, 'manual', 'manual', 'USD', $4, $5)
	`, id, userID, displayName, syncStatus, lastSyncTS)
	if err != nil {
		t.Fatalf("seed account: %v", err)
	}
	return id
}

func TestListAccounts_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	now := time.Now().UTC()
	_ = seedAccountFull(t, uid, "IBKR", "ok", &now)
	_ = seedAccountFull(t, uid, "Coinbase", "pending", nil)

	resp, body := doJSON(t, a, fiber.MethodGet, "/accounts",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 2 {
		t.Fatalf("len = %d, want 2", len(data))
	}
	first := data[0].(map[string]any)
	// Sensitive fields must NEVER serialise.
	if _, present := first["credentials_encrypted"]; present {
		t.Fatal("credentials_encrypted leaked into response")
	}
}

func TestListAccounts_OnlyOwnedRows(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	other := seedUser(t, "free")
	_ = seedAccountFull(t, uid, "Mine", "ok", nil)
	_ = seedAccountFull(t, other, "NotMine", "ok", nil)

	resp, body := doJSON(t, a, fiber.MethodGet, "/accounts",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d", resp.StatusCode)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if len(out["data"].([]any)) != 1 {
		t.Fatalf("len = %d, want 1 (other user's account must not leak)", len(out["data"].([]any)))
	}
}

func TestGetAccount_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	accID := seedAccountFull(t, uid, "IBKR", "ok", nil)

	resp, body := doJSON(t, a, fiber.MethodGet, "/accounts/"+accID.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["id"] != accID.String() {
		t.Fatalf("id = %v", out["id"])
	}
	if out["display_name"] != "IBKR" {
		t.Fatalf("display_name = %v", out["display_name"])
	}
}

func TestGetAccount_NotFound(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	phantom := uuid.Must(uuid.NewV7())

	resp, body := doJSON(t, a, fiber.MethodGet, "/accounts/"+phantom.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}

func TestGetAccount_OtherUsersAccount_404(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	other := seedUser(t, "free")
	otherAcc := seedAccountFull(t, other, "NotMine", "ok", nil)

	resp, body := doJSON(t, a, fiber.MethodGet, "/accounts/"+otherAcc.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("cross-user access status = %d, want 404", resp.StatusCode)
	}
	_ = body
}

func TestGetAccountStatus_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")
	now := time.Now().UTC()
	accID := seedAccountFull(t, uid, "IBKR", "ok", &now)

	resp, body := doJSON(t, a, fiber.MethodGet, "/accounts/"+accID.String()+"/status",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["sync_status"] != "ok" {
		t.Fatalf("sync_status = %v", out["sync_status"])
	}
	if out["last_synced_at"] == nil {
		t.Fatal("last_synced_at unexpectedly nil after seeding non-nil")
	}
	if out["next_sync_at"] != nil {
		t.Fatalf("next_sync_at should be nil pre-B3, got %v", out["next_sync_at"])
	}
}
