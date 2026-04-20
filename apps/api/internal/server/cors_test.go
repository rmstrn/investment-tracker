package server

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

// buildCORSTestApp mirrors the CORS wiring from server.New() without
// dragging in the full app.Deps surface. The unit under test is the
// middleware config — route contents are irrelevant, so we stub a
// single GET that just replies 200.
func buildCORSTestApp(origins []string) *fiber.App {
	a := fiber.New()
	a.Use(cors.New(cors.Config{
		AllowOrigins: origins,
		AllowMethods: []string{
			fiber.MethodGet, fiber.MethodPost, fiber.MethodPut,
			fiber.MethodPatch, fiber.MethodDelete, fiber.MethodOptions,
		},
		AllowHeaders: []string{
			fiber.HeaderAuthorization, fiber.HeaderContentType,
			"X-User-Id", "Idempotency-Key", "X-Request-ID",
		},
		ExposeHeaders: []string{
			"X-Request-ID",
			"X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset",
			"X-Async-Unavailable",
		},
		AllowCredentials: true,
		MaxAge:           int((24 * time.Hour).Seconds()),
	}))
	a.Get("/portfolio", func(c fiber.Ctx) error { return c.SendStatus(http.StatusOK) })
	return a
}

func TestCORS_PreflightAllowedOrigin(t *testing.T) {
	a := buildCORSTestApp([]string{"https://staging.investment-tracker.app"})

	req := httptest.NewRequestWithContext(t.Context(), http.MethodOptions, "/portfolio", nil)
	req.Header.Set("Origin", "https://staging.investment-tracker.app")
	req.Header.Set("Access-Control-Request-Method", "GET")

	resp, err := a.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("status: want 204, got %d", resp.StatusCode)
	}
	if got := resp.Header.Get("Access-Control-Allow-Origin"); got != "https://staging.investment-tracker.app" {
		t.Fatalf("Access-Control-Allow-Origin: want exact origin, got %q", got)
	}
	if got := resp.Header.Get("Access-Control-Allow-Credentials"); got != "true" {
		t.Fatalf("Access-Control-Allow-Credentials: want true, got %q", got)
	}
	if got := resp.Header.Get("Access-Control-Max-Age"); got != "86400" {
		t.Fatalf("Access-Control-Max-Age: want 86400, got %q", got)
	}
}

func TestCORS_PreflightDisallowedOrigin(t *testing.T) {
	a := buildCORSTestApp([]string{"https://staging.investment-tracker.app"})

	req := httptest.NewRequestWithContext(t.Context(), http.MethodOptions, "/portfolio", nil)
	req.Header.Set("Origin", "https://evil.example.com")
	req.Header.Set("Access-Control-Request-Method", "GET")

	resp, err := a.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer resp.Body.Close()
	// Fiber CORS still answers 204 on preflight, but omits the
	// Allow-Origin header — which is what the browser uses to veto
	// the actual request.
	if got := resp.Header.Get("Access-Control-Allow-Origin"); got != "" {
		t.Fatalf("Access-Control-Allow-Origin: want empty for disallowed origin, got %q", got)
	}
	if got := resp.Header.Get("Access-Control-Allow-Credentials"); got != "" {
		t.Fatalf("Access-Control-Allow-Credentials: want empty for disallowed origin, got %q", got)
	}
}
