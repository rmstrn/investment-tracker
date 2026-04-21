package webhook_test

// Provider-neutral tests for webhook.Handle. These exercise the
// shared orchestrator — verify → claim → dispatch — with a stub
// Provider so they stay unit-level (no DB, no network). Per-provider
// semantics live in the full integration suite under
// apps/api/internal/handlers/webhook_*_integration_test.go.

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"

	"github.com/gofiber/fiber/v3"
	"github.com/rs/zerolog"

	"github.com/rmstrn/investment-tracker/apps/api/internal/handlers/webhook"
)

// fakeClaimer tracks claims per (source, id) so tests can assert
// replay semantics without a DB.
type fakeClaimer struct {
	mu     sync.Mutex
	seen   map[string]bool
	failOn string // when set, Claim for this id returns an error
}

func (f *fakeClaimer) Claim(_ context.Context, source, id string) (bool, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	key := source + ":" + id
	if id == f.failOn {
		return false, errors.New("claim failed (fake)")
	}
	if f.seen == nil {
		f.seen = map[string]bool{}
	}
	if f.seen[key] {
		return true, nil
	}
	f.seen[key] = true
	return false, nil
}

// fakeProvider lets each test configure Verify behavior and the
// dispatch table. The event handlers record which one fired so
// tests can assert routing.
type fakeProvider struct {
	source     string
	verifyErr  error
	ev         *webhook.VerifiedEvent
	calledWith []string // names of handler keys that fired
	handlers   map[string]webhook.EventHandler
}

func (p *fakeProvider) Source() string { return p.source }

func (p *fakeProvider) Verify(_ []byte, _ http.Header) (*webhook.VerifiedEvent, error) {
	if p.verifyErr != nil {
		return nil, p.verifyErr
	}
	return p.ev, nil
}

func (p *fakeProvider) Dispatch() map[string]webhook.EventHandler {
	return p.handlers
}

func newTestRunner(t *testing.T, p *fakeProvider, claimer *fakeClaimer) *fiber.App {
	t.Helper()
	log := zerolog.New(io.Discard)
	a := fiber.New()
	a.Post("/w", webhook.Handle(&log, claimer, p))
	return a
}

func hit(t *testing.T, a *fiber.App) *http.Response {
	t.Helper()
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/w", strings.NewReader(`{}`))
	req.Header.Set("Content-Type", "application/json")
	resp, err := a.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	return resp
}

// TestHandle_SignatureTamperingReturns400 — a provider whose
// Verify returns an error (signature rejected) MUST 400
// INVALID_SIGNATURE without reaching the claim or dispatch path.
func TestHandle_SignatureTamperingReturns400(t *testing.T) {
	claimer := &fakeClaimer{}
	p := &fakeProvider{
		source:    "test",
		verifyErr: errors.New("bad signature"),
	}
	resp := hit(t, newTestRunner(t, p, claimer))
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Errorf("status = %d, want 400 for bad signature", resp.StatusCode)
	}
	if len(claimer.seen) != 0 {
		t.Errorf("claimer saw %d entries after bad signature, want 0", len(claimer.seen))
	}
}

// TestHandle_MissingEventIDReturns400 — a verified event whose
// canonical idempotency key is empty MUST 400 (we can't claim
// without an ID, and silently accepting would break replay
// semantics).
func TestHandle_MissingEventIDReturns400(t *testing.T) {
	p := &fakeProvider{
		source: "test",
		ev:     &webhook.VerifiedEvent{Type: "x", ID: "", Data: []byte(`{}`)},
	}
	resp := hit(t, newTestRunner(t, p, &fakeClaimer{}))
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Errorf("status = %d, want 400 for missing ID", resp.StatusCode)
	}
}

// TestHandle_IdempotencyReplayReturns200WithoutDispatch — a second
// delivery for the same (source, id) MUST 200 immediately without
// re-firing the event handler. Provider retry semantics depend on
// this (Stripe retries for up to 3 days; Clerk svix retries for
// hours).
func TestHandle_IdempotencyReplayReturns200WithoutDispatch(t *testing.T) {
	claimer := &fakeClaimer{}
	var fired int
	p := &fakeProvider{
		source: "test",
		ev:     &webhook.VerifiedEvent{Type: "user.created", ID: "evt_1", Data: []byte(`{}`)},
		handlers: map[string]webhook.EventHandler{
			"user.created": func(c fiber.Ctx, _ *webhook.VerifiedEvent) error {
				fired++
				return c.SendStatus(fiber.StatusOK)
			},
		},
	}
	a := newTestRunner(t, p, claimer)

	// First delivery — handler fires.
	resp1 := hit(t, a)
	_ = resp1.Body.Close()
	if resp1.StatusCode != fiber.StatusOK {
		t.Fatalf("first delivery status = %d", resp1.StatusCode)
	}
	if fired != 1 {
		t.Errorf("first delivery fired = %d, want 1", fired)
	}

	// Second delivery with same ID — orchestrator short-circuits at
	// the claim check, handler must NOT fire again.
	resp2 := hit(t, a)
	_ = resp2.Body.Close()
	if resp2.StatusCode != fiber.StatusOK {
		t.Errorf("replay status = %d, want 200", resp2.StatusCode)
	}
	if fired != 1 {
		t.Errorf("handler re-fired on replay: fired = %d, want still 1", fired)
	}
}

// TestHandle_ClaimErrorReturns500 — idempotency claim failing (e.g.
// DB down) MUST surface as 500 so the provider retries. A silent
// 200 would drop the event permanently.
func TestHandle_ClaimErrorReturns500(t *testing.T) {
	claimer := &fakeClaimer{failOn: "evt_err"}
	p := &fakeProvider{
		source: "test",
		ev:     &webhook.VerifiedEvent{Type: "x", ID: "evt_err", Data: []byte(`{}`)},
	}
	resp := hit(t, newTestRunner(t, p, claimer))
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusInternalServerError {
		t.Errorf("status = %d, want 500 for claim error", resp.StatusCode)
	}
}

// TestHandle_UnknownEventTypeACKs200 — event types the provider
// doesn't register a handler for are ACK'd with 200 + debug log.
// This prevents dead-letter buildup for types we deliberately
// ignore (Clerk: organization.*, session.*; Stripe: dozens of
// subscription sub-events we don't care about).
func TestHandle_UnknownEventTypeACKs200(t *testing.T) {
	var fired int
	p := &fakeProvider{
		source: "test",
		ev:     &webhook.VerifiedEvent{Type: "nothing.wired", ID: "evt_99", Data: []byte(`{}`)},
		handlers: map[string]webhook.EventHandler{
			"something.else": func(c fiber.Ctx, _ *webhook.VerifiedEvent) error {
				fired++
				return c.SendStatus(fiber.StatusOK)
			},
		},
	}
	resp := hit(t, newTestRunner(t, p, &fakeClaimer{}))
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("status = %d, want 200 for unknown type", resp.StatusCode)
	}
	if fired != 0 {
		t.Errorf("registered handler fired on unknown event: %d", fired)
	}
}

// TestHandle_RouteDispatchesByType — sanity: a known event goes to
// exactly the registered handler, not another one.
func TestHandle_RouteDispatchesByType(t *testing.T) {
	var fired string
	p := &fakeProvider{
		source: "test",
		ev:     &webhook.VerifiedEvent{Type: "user.updated", ID: "evt_2", Data: []byte(`{}`)},
		handlers: map[string]webhook.EventHandler{
			"user.created": func(c fiber.Ctx, _ *webhook.VerifiedEvent) error {
				fired = "created"
				return c.SendStatus(fiber.StatusOK)
			},
			"user.updated": func(c fiber.Ctx, _ *webhook.VerifiedEvent) error {
				fired = "updated"
				return c.SendStatus(fiber.StatusOK)
			},
			"user.deleted": func(c fiber.Ctx, _ *webhook.VerifiedEvent) error {
				fired = "deleted"
				return c.SendStatus(fiber.StatusOK)
			},
		},
	}
	resp := hit(t, newTestRunner(t, p, &fakeClaimer{}))
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("status = %d, want 200", resp.StatusCode)
	}
	if fired != "updated" {
		t.Errorf("fired = %q, want updated (check dispatch routing)", fired)
	}
}
