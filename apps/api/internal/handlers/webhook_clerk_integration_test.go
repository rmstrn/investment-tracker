//go:build integration

package handlers_test

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	svix "github.com/svix/svix-webhooks/go"
)

// signClerkWebhook produces the three svix headers a valid Clerk
// webhook request must carry. Keyed off testClerkWebhookSecret which
// the handler's verifier is built against in newTestApp.
func signClerkWebhook(t *testing.T, msgID string, body []byte) (svixID, svixTS, sig string) {
	t.Helper()
	wh, err := svix.NewWebhook(testClerkWebhookSecret)
	if err != nil {
		t.Fatalf("svix.NewWebhook: %v", err)
	}
	ts := time.Now().UTC()
	s, err := wh.Sign(msgID, ts, body)
	if err != nil {
		t.Fatalf("svix Sign: %v", err)
	}
	return msgID, strconv.FormatInt(ts.Unix(), 10), s
}

// postClerkWebhook dispatches a Clerk webhook request with the given
// body + msg id. The signature is computed against testClerkWebhookSecret
// when `valid` is true, or against a mismatched secret to exercise
// the 400 path.
func postClerkWebhook(t *testing.T, a *fiber.App, msgID string, body []byte, valid bool) (*http.Response, []byte) {
	t.Helper()
	var svixID, svixTS, sig string
	if valid {
		svixID, svixTS, sig = signClerkWebhook(t, msgID, body)
	} else {
		wh, err := svix.NewWebhook("different-secret-than-the-server")
		if err != nil {
			t.Fatalf("svix.NewWebhook (mismatch): %v", err)
		}
		ts := time.Now().UTC()
		s, err := wh.Sign(msgID, ts, body)
		if err != nil {
			t.Fatalf("svix Sign (mismatch): %v", err)
		}
		svixID, svixTS, sig = msgID, strconv.FormatInt(ts.Unix(), 10), s
	}

	req := httptest.NewRequestWithContext(context.Background(), http.MethodPost, "/auth/webhook", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("svix-id", svixID)
	req.Header.Set("svix-timestamp", svixTS)
	req.Header.Set("svix-signature", sig)

	resp, err := a.Test(req, fiber.TestConfig{Timeout: 10 * time.Second})
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	raw, _ := io.ReadAll(resp.Body)
	_ = resp.Body.Close()
	return resp, raw
}

// clerkEventBody builds a minimal Clerk event envelope for the given
// type. emailID defaults to "email_primary" so primary_email_address_id
// resolves without hard-coding in every test.
func clerkEventBody(eventType, clerkUserID, email string) []byte {
	b, _ := json.Marshal(fiber.Map{
		"type": eventType,
		"data": fiber.Map{
			"id":                       clerkUserID,
			"primary_email_address_id": "email_primary",
			"email_addresses": []fiber.Map{
				{"id": "email_primary", "email_address": email},
			},
		},
	})
	return b
}

func TestClerkWebhook_InvalidSignature_Returns400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	body := clerkEventBody("user.created", "user_invalidsig", "new@test.local")
	resp, raw := postClerkWebhook(t, a, "msg_sig_bad", body, false)

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d (body=%s)", resp.StatusCode, raw)
	}
}

func TestClerkWebhook_UserCreated_CreatesRow(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	body := clerkEventBody("user.created", "user_created_aaa", "aaa@test.local")
	resp, raw := postClerkWebhook(t, a, "msg_created_1", body, true)

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d (body=%s)", resp.StatusCode, raw)
	}

	var email string
	err := testPool.QueryRow(context.Background(),
		`SELECT email FROM users WHERE clerk_user_id = $1`, "user_created_aaa").Scan(&email)
	if err != nil {
		t.Fatalf("user not persisted: %v", err)
	}
	if email != "aaa@test.local" {
		t.Fatalf("email mismatch: got %q", email)
	}
}

func TestClerkWebhook_UserCreated_ReplayIsIdempotent(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	body := clerkEventBody("user.created", "user_replay_bbb", "bbb@test.local")

	// First call — real work.
	resp1, _ := postClerkWebhook(t, a, "msg_replay_1", body, true)
	if resp1.StatusCode != http.StatusOK {
		t.Fatalf("first call: expected 200, got %d", resp1.StatusCode)
	}
	// Second call with the same svix-id (and payload) — claim short-
	// circuits back to 200 without reaching the user-creation path.
	resp2, _ := postClerkWebhook(t, a, "msg_replay_1", body, true)
	if resp2.StatusCode != http.StatusOK {
		t.Fatalf("replay: expected 200, got %d", resp2.StatusCode)
	}

	var rowCount int
	err := testPool.QueryRow(context.Background(),
		`SELECT count(*) FROM webhook_events WHERE source = 'clerk' AND event_id = $1`,
		"msg_replay_1").Scan(&rowCount)
	if err != nil {
		t.Fatalf("webhook_events count: %v", err)
	}
	if rowCount != 1 {
		t.Fatalf("expected 1 ledger row, got %d", rowCount)
	}

	// User row also should be exactly one.
	var userRowCount int
	err = testPool.QueryRow(context.Background(),
		`SELECT count(*) FROM users WHERE clerk_user_id = $1`,
		"user_replay_bbb").Scan(&userRowCount)
	if err != nil {
		t.Fatalf("users count: %v", err)
	}
	if userRowCount != 1 {
		t.Fatalf("expected 1 user row, got %d (replay re-created)", userRowCount)
	}
}

func TestClerkWebhook_UserUpdated_RefreshesEmail(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	// Seed a user in our DB with an old email, as if they logged in
	// before the Clerk webhook fired.
	userID := seedUser(t, "free")
	_, err := testPool.Exec(context.Background(),
		`UPDATE users SET clerk_user_id = $1, email = $2 WHERE id = $3`,
		"user_upd_ccc", "old@test.local", userID)
	if err != nil {
		t.Fatalf("seed update: %v", err)
	}

	body := clerkEventBody("user.updated", "user_upd_ccc", "new@test.local")
	resp, _ := postClerkWebhook(t, a, "msg_upd_1", body, true)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	var got string
	err = testPool.QueryRow(context.Background(),
		`SELECT email FROM users WHERE clerk_user_id = $1`, "user_upd_ccc").Scan(&got)
	if err != nil {
		t.Fatalf("query: %v", err)
	}
	if got != "new@test.local" {
		t.Fatalf("email not refreshed: %q", got)
	}
}

func TestClerkWebhook_UserDeleted_SchedulesDeletion(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	userID := seedUser(t, "free")
	_, err := testPool.Exec(context.Background(),
		`UPDATE users SET clerk_user_id = $1 WHERE id = $2`,
		"user_del_ddd", userID)
	if err != nil {
		t.Fatalf("seed update: %v", err)
	}

	body := clerkEventBody("user.deleted", "user_del_ddd", "")
	resp, _ := postClerkWebhook(t, a, "msg_del_1", body, true)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	var scheduledAt *time.Time
	err = testPool.QueryRow(context.Background(),
		`SELECT deletion_scheduled_at FROM users WHERE id = $1`, userID).Scan(&scheduledAt)
	if err != nil {
		t.Fatalf("query: %v", err)
	}
	if scheduledAt == nil {
		t.Fatalf("deletion_scheduled_at not set after user.deleted")
	}
}

func TestClerkWebhook_UnknownEventType_200NoOp(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	body, _ := json.Marshal(fiber.Map{
		"type": "session.created",
		"data": fiber.Map{"id": "sess_abc"},
	})
	resp, raw := postClerkWebhook(t, a, "msg_unknown_1", body, true)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d (body=%s)", resp.StatusCode, raw)
	}

	// Ledger should still have claimed the event — no-op is still a claim.
	var count int
	err := testPool.QueryRow(context.Background(),
		`SELECT count(*) FROM webhook_events WHERE source = 'clerk' AND event_id = $1`,
		"msg_unknown_1").Scan(&count)
	if err != nil {
		t.Fatalf("count: %v", err)
	}
	if count != 1 {
		t.Fatalf("ledger row missing for unknown event: got %d", count)
	}
}

// simple readability helper for tests that want to assert the body
// matches a JSON fragment; kept local so it does not clash with any
// identically-named helper in other *_integration_test.go files.
func mustReadJSON(t *testing.T, raw []byte) map[string]any {
	t.Helper()
	out := map[string]any{}
	if len(raw) == 0 {
		return out
	}
	if err := json.Unmarshal(raw, &out); err != nil {
		t.Fatalf("json: %v (raw=%s)", err, raw)
	}
	return out
}

var _ = fmt.Sprintf // retain fmt import usable for extensions
var _ = mustReadJSON
