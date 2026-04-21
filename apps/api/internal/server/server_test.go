package server_test

// Unit tests for the Fiber app assembled by server.New.
//
// These intentionally avoid the //go:build integration gate so they
// run on every `go test ./...`. They cover the public routes
// (/health, /metrics) and the middleware-chain ordering guarantees
// that TD-091 exposed — when persist logic sits outside the request
// path, the chain-ordering story is all that tells you whether the
// middleware bag was even exercised.
//
// The chain under test (server.go:44-77):
//
//   RequestID   →   RequestLog   →   CORS   →   (route handlers / Auth group)
//
// Postgres is not wired in — deps.Pool is nil, which is safe because
// every endpoint hit by these tests is public (no DB read path) or
// short-circuits before reaching a DB call (auth-required routes
// bounce at middleware.Auth). Redis is a miniredis stub because
// airatelimit.New panics on a nil Cache at construction time.

import (
	"context"
	"io"
	"net/http/httptest"
	"testing"

	"github.com/alicebob/miniredis/v2"
	"github.com/gofiber/fiber/v3"
	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/aiservice"
	"github.com/rmstrn/investment-tracker/apps/api/internal/config"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/server"
)

func buildApp(t *testing.T) *fiber.App {
	t.Helper()
	mr := miniredis.RunT(t)
	rdb := redis.NewClient(&redis.Options{Addr: mr.Addr()})
	t.Cleanup(func() { _ = rdb.Close() })
	deps := &app.Deps{
		Cfg: &config.Config{
			Env:                  "test",
			AllowedOrigins:       []string{"http://allowed.test"},
			CoreAPIInternalToken: "test-internal-token",
			AIServiceURL:         "http://localhost:65535",
			AIServiceToken:       "t",
		},
		Log:      zerolog.New(io.Discard),
		Pool:     nil, // no DB routes exercised in this file
		Cache:    cache.NewFromRDB(rdb),
		UserRepo: users.NewRepo(nil),
		JWKS:     nil, // auth middleware falls through to internal-token path
		AI:       aiservice.New("http://localhost:65535", "t"),
	}
	a, err := server.New(deps)
	if err != nil {
		t.Fatalf("server.New: %v", err)
	}
	return a
}

func TestServerNew_BuildsWithoutError(t *testing.T) {
	a := buildApp(t)
	if a == nil {
		t.Fatal("server.New returned nil app with nil error")
	}
}

func TestHealth_Returns200WithServiceMetadata(t *testing.T) {
	a := buildApp(t)
	req := httptest.NewRequestWithContext(context.Background(), fiber.MethodGet, "/health", nil)
	resp, err := a.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("status = %d, want 200", resp.StatusCode)
	}
	body, _ := io.ReadAll(resp.Body)
	_ = resp.Body.Close()
	for _, want := range []string{`"status":"ok"`, `"service":"api"`, `"env":"test"`} {
		if !contains(body, want) {
			t.Errorf("body missing %q\nbody: %s", want, body)
		}
	}
}

func TestMetrics_ReturnsPrometheusFormat(t *testing.T) {
	a := buildApp(t)
	req := httptest.NewRequestWithContext(context.Background(), fiber.MethodGet, "/metrics", nil)
	resp, err := a.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("status = %d, want 200", resp.StatusCode)
	}
	// Prometheus text exposition: Content-Type varies by content
	// negotiation. Both `text/plain` and the explicit
	// `application/openmetrics-text` satisfy the Fly scraper; we only
	// assert the response actually carries one of the expected
	// go_* collectors so drift shows up if the handler is replaced.
	body, _ := io.ReadAll(resp.Body)
	_ = resp.Body.Close()
	if !contains(body, "go_goroutines") {
		t.Errorf("response body does not contain go_goroutines collector\nbody head: %.200s", body)
	}
}

// TestRequestIDMiddleware_FirstInChain asserts that RequestID is
// wired before handlers run — a public route's response must carry
// the header populated by the middleware. This is the structural
// guard against someone moving RequestID further down the chain and
// breaking request_id correlation across services (see TD-062).
func TestRequestIDMiddleware_FirstInChain(t *testing.T) {
	a := buildApp(t)
	req := httptest.NewRequestWithContext(context.Background(), fiber.MethodGet, "/health", nil)
	resp, err := a.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if got := resp.Header.Get("X-Request-Id"); got == "" {
		t.Error("response missing X-Request-Id header — middleware.RequestID not in chain or not before handlers")
	}
}

// TestCORS_AllowlistedOrigin_EmitsACAOHeader confirms the CORS
// middleware runs and echoes the allowlisted origin. Tests the
// positive path in server.go:57-77 AllowOrigins list.
func TestCORS_AllowlistedOrigin_EmitsACAOHeader(t *testing.T) {
	a := buildApp(t)
	req := httptest.NewRequestWithContext(context.Background(), fiber.MethodGet, "/health", nil)
	req.Header.Set("Origin", "http://allowed.test")
	resp, err := a.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if got := resp.Header.Get("Access-Control-Allow-Origin"); got != "http://allowed.test" {
		t.Errorf("Access-Control-Allow-Origin = %q, want \"http://allowed.test\"", got)
	}
}

// TestCORS_DisallowedOrigin_OmitsACAOHeader confirms the middleware
// does NOT blanket-allow unknown origins. Browsers treat missing
// ACAO as a CORS failure, which is the desired behavior.
func TestCORS_DisallowedOrigin_OmitsACAOHeader(t *testing.T) {
	a := buildApp(t)
	req := httptest.NewRequestWithContext(context.Background(), fiber.MethodGet, "/health", nil)
	req.Header.Set("Origin", "http://evil.test")
	resp, err := a.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if got := resp.Header.Get("Access-Control-Allow-Origin"); got != "" {
		t.Errorf("Access-Control-Allow-Origin = %q, want empty for disallowed origin", got)
	}
}

// TestAuth_MissingTokenOnProtectedRoute_Returns401 asserts Auth
// middleware is actually mounted on the protected group. A route
// under api.Group("", middleware.Auth(authCfg)) must reject
// unauthenticated requests even when no token is presented —
// confirms the middleware.Auth wire-up in registerAuthenticated
// (server.go:125) is in place.
func TestAuth_MissingTokenOnProtectedRoute_Returns401(t *testing.T) {
	a := buildApp(t)
	req := httptest.NewRequestWithContext(context.Background(), fiber.MethodGet, "/me", nil)
	resp, err := a.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Errorf("status = %d, want 401 for /me without auth", resp.StatusCode)
	}
}

// TestCORSPreflight_ShortCircuitsBeforeAuth asserts an OPTIONS
// request to a protected route succeeds without credentials —
// proves CORS runs before Auth in the chain. If CORS were after
// Auth, the preflight would 401 and the browser would never send
// the real request.
func TestCORSPreflight_ShortCircuitsBeforeAuth(t *testing.T) {
	a := buildApp(t)
	req := httptest.NewRequestWithContext(context.Background(), fiber.MethodOptions, "/me", nil)
	req.Header.Set("Origin", "http://allowed.test")
	req.Header.Set("Access-Control-Request-Method", "GET")
	req.Header.Set("Access-Control-Request-Headers", "Authorization,Content-Type")
	resp, err := a.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	// Fiber's CORS responds 204 No Content (or 200, depending on
	// v3 release) — both are "preflight accepted". Anything
	// 4xx/5xx would mean CORS didn't short-circuit before Auth.
	if resp.StatusCode >= 400 {
		t.Errorf("preflight status = %d, want 2xx", resp.StatusCode)
	}
	if got := resp.Header.Get("Access-Control-Allow-Origin"); got != "http://allowed.test" {
		t.Errorf("preflight ACAO = %q, want http://allowed.test", got)
	}
}

// TestRoutesRegistered_CanonicalSet is a lightweight golden list
// of route paths that must exist on the app. It guards against an
// accidental `a.Get("/foo", ...)` being dropped during a refactor;
// if a future change removes one of these, the test shows exactly
// which path disappeared. Methods + params are not asserted here —
// that granularity lives in per-handler integration tests.
func TestRoutesRegistered_CanonicalSet(t *testing.T) {
	a := buildApp(t)
	routes := a.GetRoutes()
	paths := make(map[string]struct{}, len(routes))
	for _, r := range routes {
		paths[r.Path] = struct{}{}
	}
	// Small spot-check set — one route per major router group so
	// the test catches a whole group going missing without
	// requiring maintenance on every handler add.
	canonical := []string{
		"/health",
		"/metrics",
		"/glossary",
		"/auth/webhook",
		"/billing/webhook",
		"/me",
		"/portfolio",
		"/positions",
		"/ai/conversations",
		"/ai/chat/stream",
	}
	for _, p := range canonical {
		if _, ok := paths[p]; !ok {
			t.Errorf("canonical route %s not registered", p)
		}
	}
}

func contains(haystack []byte, needle string) bool {
	n := []byte(needle)
	for i := 0; i+len(n) <= len(haystack); i++ {
		if string(haystack[i:i+len(n)]) == needle {
			return true
		}
	}
	return false
}
