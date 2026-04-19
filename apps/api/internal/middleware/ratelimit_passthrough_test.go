package middleware_test

import (
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"

	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

func TestRateLimit_PassthroughDoesNotGate(t *testing.T) {
	app, ch := buildTestApp(t)
	uid := uuid.Must(uuid.NewV7())
	app.Use(func(c fiber.Ctx) error {
		c.Locals(middleware.LocalsUser, &dbgen.User{ID: uid, SubscriptionTier: "free"})
		return c.Next()
	})
	app.Use(middleware.RateLimit(middleware.RateLimitConfig{
		Cache: ch, Key: "getbucket", Limit: 2, Window: time.Minute,
		Passthrough: true,
	}))
	app.Get("/", func(c fiber.Ctx) error { return c.SendString("ok") })

	// Five requests against a limit of two — all succeed because
	// Passthrough=true.
	for i := 1; i <= 5; i++ {
		req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/", nil)
		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("req %d: %v", i, err)
		}
		if resp.StatusCode != fiber.StatusOK {
			t.Fatalf("req %d: status = %d, want 200 (passthrough mode)", i, resp.StatusCode)
		}
	}
}

func TestRateLimit_PassthroughStillSetsHeaders(t *testing.T) {
	app, ch := buildTestApp(t)
	uid := uuid.Must(uuid.NewV7())
	app.Use(func(c fiber.Ctx) error {
		c.Locals(middleware.LocalsUser, &dbgen.User{ID: uid, SubscriptionTier: "free"})
		return c.Next()
	})
	app.Use(middleware.RateLimit(middleware.RateLimitConfig{
		Cache: ch, Key: "getbucket", Limit: 10, Window: time.Minute,
		Passthrough: true,
	}))
	app.Get("/", func(c fiber.Ctx) error { return c.SendString("ok") })

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("req: %v", err)
	}
	if got := resp.Header.Get("X-RateLimit-Limit"); got != "10" {
		t.Fatalf("X-RateLimit-Limit = %q, want 10", got)
	}
	if resp.Header.Get("X-RateLimit-Remaining") == "" {
		t.Fatalf("X-RateLimit-Remaining missing on passthrough response")
	}
}

func TestIdempotency_GETPassesThrough(t *testing.T) {
	// Explicit regression guard for the RFC 9110 semantics: GETs do
	// not use Idempotency-Key, but a handler that sits behind the
	// middleware must not 400 (or 409) on a GET without the header.
	app, _, ch, _ := buildIdemApp(t)
	app.Get("/ping", func(c fiber.Ctx) error { return c.SendString("ok") })
	_ = ch

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/ping", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("req: %v", err)
	}
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, want 200 — idempotency middleware must be a no-op on GET", resp.StatusCode)
	}
}
