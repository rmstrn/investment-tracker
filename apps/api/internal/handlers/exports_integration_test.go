//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

func TestCreateExport_HappyPath_Plus(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	body := map[string]any{"resource": "transactions", "format": "csv"}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/exports",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusAccepted {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	if resp.Header.Get("X-Export-Pending") != "true" {
		t.Fatalf("missing X-Export-Pending header")
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["resource"] != "transactions" {
		t.Fatalf("resource = %v", out["resource"])
	}
	if out["status"] != "queued" {
		t.Fatalf("status = %v, want queued", out["status"])
	}
	if out["result_url"] != nil {
		t.Fatalf("result_url = %v, want nil pre-worker (TD-039)", out["result_url"])
	}
}

func TestCreateExport_FreeTier_403(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	body := map[string]any{"resource": "transactions", "format": "csv"}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/exports",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	// TD-R047: the error must be the canonical tier-upgrade code,
	// not a generic forbidden. Client UIs key on FEATURE_LOCKED to
	// render the upgrade CTA.
	var env map[string]any
	if err := json.Unmarshal(raw, &env); err != nil {
		t.Fatalf("decode error envelope: %v", err)
	}
	errMap, ok := env["error"].(map[string]any)
	if !ok {
		t.Fatalf("missing error envelope: %s", raw)
	}
	if errMap["code"] != "FEATURE_LOCKED" {
		t.Errorf("code = %v, want FEATURE_LOCKED (free-tier upgrade gate)", errMap["code"])
	}
}

// TestCreateExport_HappyPath_Pro mirrors TestCreateExport_HappyPath_Plus
// but on the Pro tier — proves the explicit CSVExport flag matrix
// grants Pro the same access as Plus rather than accidentally
// leaving Pro out when the heuristic was replaced (TD-R047).
func TestCreateExport_HappyPath_Pro(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "pro")

	body := map[string]any{"resource": "snapshots", "format": "csv"}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/exports",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusAccepted {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, raw)
	}
	if resp.Header.Get("X-Export-Pending") != "true" {
		t.Fatalf("missing X-Export-Pending header")
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["resource"] != "snapshots" {
		t.Fatalf("resource = %v", out["resource"])
	}
	if out["status"] != "queued" {
		t.Fatalf("status = %v, want queued", out["status"])
	}
}

func TestCreateExport_InvalidResource_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	body := map[string]any{"resource": "users", "format": "csv"}
	resp, _ := doJSON(t, a, fiber.MethodPost, "/exports",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
}

func TestGetExport_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	// Create one first.
	body := map[string]any{"resource": "positions", "format": "csv"}
	resp, raw := doJSON(t, a, fiber.MethodPost, "/exports",
		uid.String(), testSharedInternalToken, body)
	if resp.StatusCode != fiber.StatusAccepted {
		t.Fatalf("create status = %d", resp.StatusCode)
	}
	var created map[string]any
	_ = json.Unmarshal(raw, &created)
	exportID := created["id"].(string)

	// Poll it.
	resp, raw = doJSON(t, a, fiber.MethodGet, "/exports/"+exportID,
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("get status = %d, body = %s", resp.StatusCode, raw)
	}
	var out map[string]any
	_ = json.Unmarshal(raw, &out)
	if out["status"] != "queued" {
		t.Fatalf("status = %v, want queued (worker not in-band, TD-039)", out["status"])
	}
}

func TestGetExport_NotFound(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")
	phantom := uuid.Must(uuid.NewV7())

	resp, _ := doJSON(t, a, fiber.MethodGet, "/exports/"+phantom.String(),
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, want 404", resp.StatusCode)
	}
}
