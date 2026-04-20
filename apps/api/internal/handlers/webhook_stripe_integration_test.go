//go:build integration

package handlers_test

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/stripe/stripe-go/v82/webhook"
)

// stripeEventBody wraps a subscription/invoice object into the full
// Stripe event envelope.
func stripeEventBody(eventID, eventType string, object any) []byte {
	b, _ := json.Marshal(map[string]any{
		"id":   eventID,
		"type": eventType,
		"data": map[string]any{"object": object},
	})
	return b
}

// signStripeWebhook computes the Stripe-Signature header value using
// the SDK's test signer. When validSecret is false we sign with a
// different secret than the server's, which is what the 400-path
// tests exercise.
func signStripeWebhook(t *testing.T, body []byte, validSecret bool) string {
	t.Helper()
	secret := testStripeWebhookSecret
	if !validSecret {
		secret = "different-secret-than-the-server"
	}
	signed := webhook.GenerateTestSignedPayload(&webhook.UnsignedPayload{
		Payload:   body,
		Secret:    secret,
		Timestamp: time.Now(),
	})
	return signed.Header
}

func postStripeWebhook(t *testing.T, a *fiber.App, body []byte, validSecret bool) (*http.Response, []byte) {
	t.Helper()
	req := httptest.NewRequestWithContext(context.Background(), http.MethodPost, "/billing/webhook", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Stripe-Signature", signStripeWebhook(t, body, validSecret))

	resp, err := a.Test(req, fiber.TestConfig{Timeout: 10 * time.Second})
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	raw, _ := io.ReadAll(resp.Body)
	_ = resp.Body.Close()
	return resp, raw
}

// subscriptionObject builds a minimal subscription JSON object
// suitable for the webhook body. Customer is serialised as a bare
// string ID — stripe-go handles both shapes on unmarshal.
func subscriptionObject(subID, customerID, priceID, status string) map[string]any {
	return map[string]any{
		"id":       subID,
		"customer": customerID,
		"status":   status,
		"items": map[string]any{
			"data": []map[string]any{
				{"price": map[string]any{"id": priceID}},
			},
		},
		"metadata": map[string]string{},
	}
}

func TestStripeWebhook_InvalidSignature_Returns400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	body := stripeEventBody("evt_sig_bad", "customer.subscription.created",
		subscriptionObject("sub_bad", "cus_bad", testStripePricePlus, "active"))
	resp, raw := postStripeWebhook(t, a, body, false)

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d (body=%s)", resp.StatusCode, raw)
	}
}

func TestStripeWebhook_SubscriptionCreated_UpgradesTier(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	userID := seedUser(t, "free")
	// Pre-link the stripe customer so the webhook can resolve us.
	_, err := testPool.Exec(context.Background(),
		`UPDATE users SET stripe_customer_id = $1 WHERE id = $2`,
		"cus_up_1", userID)
	if err != nil {
		t.Fatalf("seed: %v", err)
	}

	body := stripeEventBody("evt_sub_new_1", "customer.subscription.created",
		subscriptionObject("sub_up_1", "cus_up_1", testStripePricePlus, "active"))
	resp, raw := postStripeWebhook(t, a, body, true)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d (body=%s)", resp.StatusCode, raw)
	}

	var tier string
	err = testPool.QueryRow(context.Background(),
		`SELECT subscription_tier FROM users WHERE id = $1`, userID).Scan(&tier)
	if err != nil {
		t.Fatalf("query: %v", err)
	}
	if tier != "plus" {
		t.Fatalf("tier after plus price: got %q, want plus", tier)
	}
}

func TestStripeWebhook_SubscriptionUpdated_ChangesTier(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	userID := seedUser(t, "plus")
	_, err := testPool.Exec(context.Background(),
		`UPDATE users SET stripe_customer_id = $1 WHERE id = $2`,
		"cus_up_2", userID)
	if err != nil {
		t.Fatalf("seed: %v", err)
	}

	body := stripeEventBody("evt_sub_upd_1", "customer.subscription.updated",
		subscriptionObject("sub_up_2", "cus_up_2", testStripePricePro, "active"))
	resp, _ := postStripeWebhook(t, a, body, true)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	var tier string
	err = testPool.QueryRow(context.Background(),
		`SELECT subscription_tier FROM users WHERE id = $1`, userID).Scan(&tier)
	if err != nil {
		t.Fatalf("query: %v", err)
	}
	if tier != "pro" {
		t.Fatalf("tier after pro price: got %q, want pro", tier)
	}
}

func TestStripeWebhook_SubscriptionDeleted_DowngradesToFree(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	userID := seedUser(t, "pro")
	_, err := testPool.Exec(context.Background(),
		`UPDATE users SET stripe_customer_id = $1 WHERE id = $2`,
		"cus_del_1", userID)
	if err != nil {
		t.Fatalf("seed: %v", err)
	}

	body := stripeEventBody("evt_sub_del_1", "customer.subscription.deleted",
		subscriptionObject("sub_del_1", "cus_del_1", testStripePricePro, "canceled"))
	resp, _ := postStripeWebhook(t, a, body, true)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	var tier string
	err = testPool.QueryRow(context.Background(),
		`SELECT subscription_tier FROM users WHERE id = $1`, userID).Scan(&tier)
	if err != nil {
		t.Fatalf("query: %v", err)
	}
	if tier != "free" {
		t.Fatalf("tier after deletion: got %q, want free", tier)
	}
}

func TestStripeWebhook_UnknownPrice_WarnsAndSkips(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	userID := seedUser(t, "free")
	_, err := testPool.Exec(context.Background(),
		`UPDATE users SET stripe_customer_id = $1 WHERE id = $2`,
		"cus_unknown_1", userID)
	if err != nil {
		t.Fatalf("seed: %v", err)
	}

	body := stripeEventBody("evt_unk_1", "customer.subscription.updated",
		subscriptionObject("sub_unk_1", "cus_unknown_1", "price_not_in_catalog", "active"))
	resp, _ := postStripeWebhook(t, a, body, true)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	var tier string
	err = testPool.QueryRow(context.Background(),
		`SELECT subscription_tier FROM users WHERE id = $1`, userID).Scan(&tier)
	if err != nil {
		t.Fatalf("query: %v", err)
	}
	if tier != "free" {
		t.Fatalf("tier changed on unknown price: got %q, want free (unchanged)", tier)
	}
}

func TestStripeWebhook_UserUnresolved_200NoOp(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	body := stripeEventBody("evt_nousr_1", "customer.subscription.created",
		subscriptionObject("sub_nousr_1", "cus_never_linked", testStripePricePlus, "active"))
	resp, _ := postStripeWebhook(t, a, body, true)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	var rowCount int
	err := testPool.QueryRow(context.Background(),
		`SELECT count(*) FROM webhook_events WHERE source = 'stripe' AND event_id = $1`,
		"evt_nousr_1").Scan(&rowCount)
	if err != nil {
		t.Fatalf("count: %v", err)
	}
	if rowCount != 1 {
		t.Fatalf("unresolved event should still claim idempotency: got %d", rowCount)
	}
}

func TestStripeWebhook_Replay_NoSecondMutation(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	userID := seedUser(t, "free")
	_, err := testPool.Exec(context.Background(),
		`UPDATE users SET stripe_customer_id = $1 WHERE id = $2`,
		"cus_replay_1", userID)
	if err != nil {
		t.Fatalf("seed: %v", err)
	}

	body := stripeEventBody("evt_replay_1", "customer.subscription.created",
		subscriptionObject("sub_replay_1", "cus_replay_1", testStripePricePlus, "active"))
	resp1, _ := postStripeWebhook(t, a, body, true)
	if resp1.StatusCode != http.StatusOK {
		t.Fatalf("first: got %d", resp1.StatusCode)
	}
	// Now downgrade in-DB to simulate "if the replay ran, it would upgrade
	// again from free → plus". If the handler is idempotent we stay on free.
	if _, err := testPool.Exec(context.Background(),
		`UPDATE users SET subscription_tier = 'free' WHERE id = $1`, userID); err != nil {
		t.Fatalf("downgrade: %v", err)
	}

	resp2, _ := postStripeWebhook(t, a, body, true)
	if resp2.StatusCode != http.StatusOK {
		t.Fatalf("replay: got %d", resp2.StatusCode)
	}

	var tier string
	err = testPool.QueryRow(context.Background(),
		`SELECT subscription_tier FROM users WHERE id = $1`, userID).Scan(&tier)
	if err != nil {
		t.Fatalf("query: %v", err)
	}
	if tier != "free" {
		t.Fatalf("replay re-applied tier change: got %q, want free", tier)
	}
}

func TestStripeWebhook_InvoicePaymentFailed_200(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	body := stripeEventBody("evt_inv_fail_1", "invoice.payment_failed", map[string]any{
		"id":         "in_fail_1",
		"customer":   "cus_fail_1",
		"amount_due": 999,
	})
	resp, _ := postStripeWebhook(t, a, body, true)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}
}

func TestStripeWebhook_UnknownEventType_200NoOp(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	body := stripeEventBody("evt_unknown_type_1", "product.created", map[string]any{
		"id": "prod_x",
	})
	resp, _ := postStripeWebhook(t, a, body, true)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}
}

func TestStripeWebhook_SubscriptionResolveByMetadata(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	userID := seedUser(t, "free")
	// Do NOT pre-link stripe_customer_id — force metadata fallback.

	sub := subscriptionObject("sub_meta_1", "cus_meta_1", testStripePricePlus, "active")
	sub["metadata"] = map[string]string{"user_id": userID.String()}

	body := stripeEventBody("evt_meta_1", "customer.subscription.created", sub)
	resp, _ := postStripeWebhook(t, a, body, true)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	var tier string
	var stripeID *string
	err := testPool.QueryRow(context.Background(),
		`SELECT subscription_tier, stripe_customer_id FROM users WHERE id = $1`, userID).Scan(&tier, &stripeID)
	if err != nil {
		t.Fatalf("query: %v", err)
	}
	if tier != "plus" {
		t.Fatalf("tier: got %q, want plus", tier)
	}
	if stripeID == nil || *stripeID != "cus_meta_1" {
		t.Fatalf("stripe_customer_id not persisted via metadata fallback: %v", stripeID)
	}
}
