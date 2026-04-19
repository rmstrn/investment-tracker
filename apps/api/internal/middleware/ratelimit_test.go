package middleware_test

import (
	"net/http/httptest"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"

	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

func buildTestApp(t *testing.T) (*fiber.App, *miniredis.Miniredis, *cache.Client) {
	t.Helper()
	mr := miniredis.RunT(t)
	rdb := redis.NewClient(&redis.Options{Addr: mr.Addr()})
	c := cache.NewFromRDB(rdb)
	app := fiber.New()
	return app, mr, c
}

func injectUser(app *fiber.App, userID uuid.UUID) {
	app.Use(func(c fiber.Ctx) error {
		c.Locals(middleware.LocalsUser, &dbgen.User{ID: userID, SubscriptionTier: "free"})
		return c.Next()
	})
}

func TestRateLimit_AllowsUnderLimit(t *testing.T) {
	app, _, ch := buildTestApp(t)
	injectUser(app, uuid.Must(uuid.NewV7()))
	app.Use(middleware.RateLimit(middleware.RateLimitConfig{
		Cache: ch, Key: "test", Limit: 3, Window: time.Minute,
	}))
	app.Get("/", func(c fiber.Ctx) error { return c.SendString("ok") })

	for i := 1; i <= 3; i++ {
		req := httptest.NewRequest(fiber.MethodGet, "/", nil)
		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("request %d: %v", i, err)
		}
		if resp.StatusCode != fiber.StatusOK {
			t.Fatalf("request %d: expected 200, got %d", i, resp.StatusCode)
		}
		if got := resp.Header.Get("X-RateLimit-Limit"); got != "3" {
			t.Fatalf("request %d: X-RateLimit-Limit = %q, want 3", i, got)
		}
	}
}

func TestRateLimit_Rejects429OverLimit(t *testing.T) {
	app, _, ch := buildTestApp(t)
	injectUser(app, uuid.Must(uuid.NewV7()))
	app.Use(middleware.RateLimit(middleware.RateLimitConfig{
		Cache: ch, Key: "test", Limit: 2, Window: time.Minute,
	}))
	app.Get("/", func(c fiber.Ctx) error { return c.SendString("ok") })

	// Burn two, then hit the limit.
	for i := 0; i < 2; i++ {
		req := httptest.NewRequest(fiber.MethodGet, "/", nil)
		_, _ = app.Test(req)
	}
	req := httptest.NewRequest(fiber.MethodGet, "/", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}
	if resp.StatusCode != fiber.StatusTooManyRequests {
		t.Fatalf("expected 429, got %d", resp.StatusCode)
	}
	if got := resp.Header.Get("X-RateLimit-Remaining"); got != "0" {
		t.Fatalf("X-RateLimit-Remaining = %q, want 0", got)
	}
}

func TestRateLimit_ScopedPerUser(t *testing.T) {
	app, _, ch := buildTestApp(t)
	userA := uuid.Must(uuid.NewV7())
	userB := uuid.Must(uuid.NewV7())

	// Toggle between two users on each request via a query-string trick.
	app.Use(func(c fiber.Ctx) error {
		id := userA
		if c.Query("u") == "b" {
			id = userB
		}
		c.Locals(middleware.LocalsUser, &dbgen.User{ID: id, SubscriptionTier: "free"})
		return c.Next()
	})
	app.Use(middleware.RateLimit(middleware.RateLimitConfig{
		Cache: ch, Key: "test", Limit: 1, Window: time.Minute,
	}))
	app.Get("/x", func(c fiber.Ctx) error { return c.SendString("ok") })

	// user A hits the limit
	_, _ = app.Test(httptest.NewRequest(fiber.MethodGet, "/x?u=a", nil))
	resp, _ := app.Test(httptest.NewRequest(fiber.MethodGet, "/x?u=a", nil))
	if resp.StatusCode != fiber.StatusTooManyRequests {
		t.Fatalf("user A second call: expected 429, got %d", resp.StatusCode)
	}
	// user B is fresh
	resp, _ = app.Test(httptest.NewRequest(fiber.MethodGet, "/x?u=b", nil))
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("user B first call: expected 200, got %d", resp.StatusCode)
	}
}
