package middleware_test

import (
	"io"
	"net/http/httptest"
	"strings"
	"sync/atomic"
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

func buildIdemApp(t *testing.T) (*fiber.App, *miniredis.Miniredis, *cache.Client, *int64) {
	t.Helper()
	mr := miniredis.RunT(t)
	rdb := redis.NewClient(&redis.Options{Addr: mr.Addr()})
	ch := cache.NewFromRDB(rdb)
	app := fiber.New()
	fixedUser := uuid.Must(uuid.NewV7()) // stable across requests in this app
	app.Use(func(c fiber.Ctx) error {
		c.Locals(middleware.LocalsUser, &dbgen.User{ID: fixedUser})
		return c.Next()
	})
	app.Use(middleware.Idempotency(middleware.IdempotencyConfig{Cache: ch}))

	var handlerCalls int64
	app.Post("/create", func(c fiber.Ctx) error {
		atomic.AddInt64(&handlerCalls, 1)
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": "42"})
	})
	return app, mr, ch, &handlerCalls
}

func TestIdempotency_PassthroughWhenNoKey(t *testing.T) {
	app, _, _, calls := buildIdemApp(t)

	for i := 0; i < 3; i++ {
		req := httptest.NewRequest(fiber.MethodPost, "/create", strings.NewReader(`{"x":1}`))
		req.Header.Set("Content-Type", "application/json")
		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("req %d: %v", i, err)
		}
		if resp.StatusCode != fiber.StatusCreated {
			t.Fatalf("req %d: status %d", i, resp.StatusCode)
		}
	}
	if got := atomic.LoadInt64(calls); got != 3 {
		t.Fatalf("handler calls = %d, want 3 (no idempotency header → no dedup)", got)
	}
}

func TestIdempotency_ReplaysSameKeySameBody(t *testing.T) {
	app, _, _, calls := buildIdemApp(t)

	body := strings.NewReader(`{"x":1}`)
	req := httptest.NewRequest(fiber.MethodPost, "/create", body)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Idempotency-Key", "abc-123")
	if _, err := app.Test(req); err != nil {
		t.Fatalf("first: %v", err)
	}

	// Repeat same key + same body
	req2 := httptest.NewRequest(fiber.MethodPost, "/create", strings.NewReader(`{"x":1}`))
	req2.Header.Set("Content-Type", "application/json")
	req2.Header.Set("Idempotency-Key", "abc-123")
	resp, err := app.Test(req2)
	if err != nil {
		t.Fatalf("second: %v", err)
	}
	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("replay status = %d, want 201", resp.StatusCode)
	}
	if resp.Header.Get("Idempotent-Replayed") != "true" {
		t.Fatalf("missing Idempotent-Replayed header")
	}
	if got := atomic.LoadInt64(calls); got != 1 {
		t.Fatalf("handler calls = %d, want 1 (second call should replay)", got)
	}
	readBody, _ := io.ReadAll(resp.Body)
	if !strings.Contains(string(readBody), `"id"`) {
		t.Fatalf("replay body does not match original: %q", readBody)
	}
}

func TestIdempotency_ConflictOnSameKeyDifferentBody(t *testing.T) {
	app, _, _, _ := buildIdemApp(t)

	req1 := httptest.NewRequest(fiber.MethodPost, "/create", strings.NewReader(`{"x":1}`))
	req1.Header.Set("Content-Type", "application/json")
	req1.Header.Set("Idempotency-Key", "conflict-key")
	if _, err := app.Test(req1); err != nil {
		t.Fatalf("first: %v", err)
	}

	req2 := httptest.NewRequest(fiber.MethodPost, "/create", strings.NewReader(`{"x":999}`))
	req2.Header.Set("Content-Type", "application/json")
	req2.Header.Set("Idempotency-Key", "conflict-key")
	resp, err := app.Test(req2)
	if err != nil {
		t.Fatalf("second: %v", err)
	}
	if resp.StatusCode != fiber.StatusConflict {
		t.Fatalf("expected 409, got %d", resp.StatusCode)
	}
}

func TestIdempotency_TTLExpires(t *testing.T) {
	_, mr, ch, calls := buildIdemApp(t)

	// Override app to use a very short TTL via a dedicated middleware
	// instance bound to the same cache.
	app2 := fiber.New()
	app2.Use(func(c fiber.Ctx) error {
		c.Locals(middleware.LocalsUser, &dbgen.User{ID: uuid.MustParse("00000000-0000-0000-0000-000000000001")})
		return c.Next()
	})
	app2.Use(middleware.Idempotency(middleware.IdempotencyConfig{Cache: ch, TTL: 100 * time.Millisecond}))
	app2.Post("/create", func(c fiber.Ctx) error {
		atomic.AddInt64(calls, 1)
		return c.SendStatus(fiber.StatusCreated)
	})

	for i := 0; i < 2; i++ {
		req := httptest.NewRequest(fiber.MethodPost, "/create", strings.NewReader(`{}`))
		req.Header.Set("Idempotency-Key", "ttl-key")
		if _, err := app2.Test(req); err != nil {
			t.Fatalf("req %d: %v", i, err)
		}
	}

	// Fast-forward miniredis past the TTL.
	mr.FastForward(500 * time.Millisecond)

	req := httptest.NewRequest(fiber.MethodPost, "/create", strings.NewReader(`{}`))
	req.Header.Set("Idempotency-Key", "ttl-key")
	if _, err := app2.Test(req); err != nil {
		t.Fatalf("post-ttl: %v", err)
	}
	if got := atomic.LoadInt64(calls); got != 2 {
		// First one runs; second one replays; third runs again after TTL expires.
		t.Fatalf("handler calls = %d, want 2 (run + replay + run-after-expire)", got)
	}
}
