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
		req := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/create", strings.NewReader(`{"x":1}`))
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
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/create", body)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Idempotency-Key", "abc-123")
	if _, err := app.Test(req); err != nil {
		t.Fatalf("first: %v", err)
	}

	// Repeat same key + same body
	req2 := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/create", strings.NewReader(`{"x":1}`))
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

	req1 := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/create", strings.NewReader(`{"x":1}`))
	req1.Header.Set("Content-Type", "application/json")
	req1.Header.Set("Idempotency-Key", "conflict-key")
	if _, err := app.Test(req1); err != nil {
		t.Fatalf("first: %v", err)
	}

	req2 := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/create", strings.NewReader(`{"x":999}`))
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
		req := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/create", strings.NewReader(`{}`))
		req.Header.Set("Idempotency-Key", "ttl-key")
		if _, err := app2.Test(req); err != nil {
			t.Fatalf("req %d: %v", i, err)
		}
	}

	// Fast-forward miniredis past the TTL.
	mr.FastForward(500 * time.Millisecond)

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/create", strings.NewReader(`{}`))
	req.Header.Set("Idempotency-Key", "ttl-key")
	if _, err := app2.Test(req); err != nil {
		t.Fatalf("post-ttl: %v", err)
	}
	if got := atomic.LoadInt64(calls); got != 2 {
		// First one runs; second one replays; third runs again after TTL expires.
		t.Fatalf("handler calls = %d, want 2 (run + replay + run-after-expire)", got)
	}
}

// buildBlockingIdemApp spins up an app whose POST /create blocks
// until the test releases it via the returned channel. Used to drive
// real concurrent-replay races against the SETNX lock.
func buildBlockingIdemApp(t *testing.T) (*fiber.App, *cache.Client, chan struct{}, *int64) {
	t.Helper()
	mr := miniredis.RunT(t)
	rdb := redis.NewClient(&redis.Options{Addr: mr.Addr()})
	ch := cache.NewFromRDB(rdb)

	app := fiber.New()
	fixedUser := uuid.Must(uuid.NewV7())
	app.Use(func(c fiber.Ctx) error {
		c.Locals(middleware.LocalsUser, &dbgen.User{ID: fixedUser})
		return c.Next()
	})
	app.Use(middleware.Idempotency(middleware.IdempotencyConfig{Cache: ch}))

	release := make(chan struct{})
	var calls int64
	app.Post("/create", func(c fiber.Ctx) error {
		atomic.AddInt64(&calls, 1)
		<-release
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": "42"})
	})
	return app, ch, release, &calls
}

func TestIdempotency_ConcurrentReplay_Returns409InProgress(t *testing.T) {
	app, _, release, calls := buildBlockingIdemApp(t)

	firstDone := make(chan int)
	go func() {
		req := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/create", strings.NewReader(`{"x":1}`))
		req.Header.Set("Idempotency-Key", "concurrent-key")
		resp, err := app.Test(req, fiber.TestConfig{Timeout: 5 * time.Second})
		if err != nil {
			t.Errorf("first: %v", err)
			firstDone <- 0
			return
		}
		firstDone <- resp.StatusCode
	}()

	// Wait until the first handler is genuinely in flight (i.e. past
	// the SETNX). Spin on the call counter so we don't race the
	// scheduler; miniredis is in-process so SETNX is microseconds.
	deadline := time.Now().Add(2 * time.Second)
	for atomic.LoadInt64(calls) == 0 {
		if time.Now().After(deadline) {
			t.Fatal("first handler never entered")
		}
		time.Sleep(5 * time.Millisecond)
	}

	// Second request while first is blocked — must 409 IDEMPOTENCY_IN_PROGRESS.
	req2 := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/create", strings.NewReader(`{"x":1}`))
	req2.Header.Set("Idempotency-Key", "concurrent-key")
	resp2, err := app.Test(req2, fiber.TestConfig{Timeout: 2 * time.Second})
	if err != nil {
		t.Fatalf("second: %v", err)
	}
	if resp2.StatusCode != fiber.StatusConflict {
		body, _ := io.ReadAll(resp2.Body)
		t.Fatalf("second status = %d, want 409; body = %s", resp2.StatusCode, body)
	}
	body, _ := io.ReadAll(resp2.Body)
	if !strings.Contains(string(body), "IDEMPOTENCY_IN_PROGRESS") {
		t.Fatalf("expected IDEMPOTENCY_IN_PROGRESS, got %s", body)
	}

	// Release the first handler and verify it completes 201.
	close(release)
	if code := <-firstDone; code != fiber.StatusCreated {
		t.Fatalf("first status = %d, want 201", code)
	}
	if got := atomic.LoadInt64(calls); got != 1 {
		t.Fatalf("handler calls = %d, want 1 (second should have been blocked before entering handler)", got)
	}
}

func TestIdempotency_LockReleasedAfterCompletion(t *testing.T) {
	// Sequential same-key same-body after completion must REPLAY the
	// cached response (from the 24h store), not return IDEMPOTENCY_IN_PROGRESS.
	app, _, _, calls := buildIdemApp(t)

	for i := 0; i < 2; i++ {
		req := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/create", strings.NewReader(`{"x":1}`))
		req.Header.Set("Idempotency-Key", "seq-key")
		resp, err := app.Test(req, fiber.TestConfig{Timeout: 2 * time.Second})
		if err != nil {
			t.Fatalf("req %d: %v", i, err)
		}
		if resp.StatusCode != fiber.StatusCreated {
			t.Fatalf("req %d status = %d, want 201", i, resp.StatusCode)
		}
	}
	if got := atomic.LoadInt64(calls); got != 1 {
		t.Fatalf("handler calls = %d, want 1 (lock released → second is pure replay)", got)
	}
}
