package server

// The global middleware chain. One canonical ordered list that
// every request (public + authenticated) passes through. Auth is
// NOT in this list — it is mounted on the authenticated route
// group inside registerAuthenticated so public routes (/health,
// /metrics, /glossary, /auth/webhook, /billing/webhook) are
// reachable without credentials.
//
// Ordering rules, captured once here instead of scattered across
// inline a.Use(...) comments in server.go:
//
//   1. RequestID must run first so every downstream middleware
//      (including RequestLog) can stamp / read the request_id
//      locals. Without this, errs.Respond on auth failures would
//      log "" as the request_id and cross-service tracing breaks.
//
//   2. RequestLog sits second so it observes every request
//      outcome, including those that bounce at CORS or Auth.
//
//   3. CORS runs after RequestID/RequestLog so preflight requests
//      carry a request-id and show up in logs, and before Auth so
//      that OPTIONS preflight short-circuits with 204 instead of
//      being rejected as unauthenticated. Origins outside
//      AllowedOrigins simply receive no ACAO header, which the
//      browser treats as a CORS failure.
//
// Reordering this list is the only way to change the global
// pipeline. The server_test.go chain-ordering assertion parses
// ChainNames() so drift forces the reader to this file.

import (
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/httpheader"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// ChainEntry is one middleware in the global chain. Name is purely
// diagnostic (used by ordering-assertion tests); Build returns the
// actual fiber.Handler constructed lazily against deps, so
// each entry has access to the full dep bag without either a
// global or a big-interface parameter list.
type ChainEntry struct {
	Name  string
	Build func(deps *app.Deps) fiber.Handler
}

// GlobalChain is the canonical ordered list of middleware applied
// to every request. See the package doc above for the ordering
// rationale per position.
var GlobalChain = []ChainEntry{
	{
		Name:  "RequestID",
		Build: func(_ *app.Deps) fiber.Handler { return middleware.RequestID() },
	},
	{
		Name:  "RequestLog",
		Build: func(d *app.Deps) fiber.Handler { return middleware.RequestLog(d.Log) },
	},
	{
		Name:  "CORS",
		Build: buildCORS,
	},
}

// ApplyGlobalChain mounts GlobalChain in order onto the app. Called
// once during server.New; no other a.Use(...) calls should exist in
// server.go — if you find yourself wanting one, add a ChainEntry
// here instead.
func ApplyGlobalChain(a *fiber.App, deps *app.Deps) {
	for _, entry := range GlobalChain {
		a.Use(entry.Build(deps))
	}
}

// ChainNames returns the ordered middleware names. The
// server_test.go chain-ordering test uses this as a golden list to
// detect accidental reorderings — a refactor that shuffles the
// slice above will trip that test.
func ChainNames() []string {
	out := make([]string, len(GlobalChain))
	for i, e := range GlobalChain {
		out[i] = e.Name
	}
	return out
}

// buildCORS configures Fiber's CORS middleware from deps.Cfg. The
// ExposeHeaders list is long-ish because any server-emitted
// informational header (X-Async-Unavailable, X-RateLimit-*, etc.)
// needs to be readable from the fetch() response on cross-origin
// Vercel previews + localhost-dev; Safari otherwise drops them.
func buildCORS(deps *app.Deps) fiber.Handler {
	return cors.New(cors.Config{
		AllowOrigins: deps.Cfg.AllowedOrigins,
		AllowMethods: []string{
			fiber.MethodGet, fiber.MethodPost, fiber.MethodPut,
			fiber.MethodPatch, fiber.MethodDelete, fiber.MethodOptions,
		},
		AllowHeaders: []string{
			fiber.HeaderAuthorization, fiber.HeaderContentType,
			httpheader.UserID, httpheader.IdempotencyKey, httpheader.RequestID,
		},
		ExposeHeaders: []string{
			httpheader.RequestID,
			httpheader.RateLimitLimit, httpheader.RateLimitRemaining, httpheader.RateLimitReset,
			httpheader.AsyncUnavailable,
			httpheader.PartialPortfolio, httpheader.FXUnavailable, httpheader.ClerkUnavailable,
			httpheader.SearchProvider, httpheader.BenchmarkUnavailable, httpheader.AnalyticsPartial,
			httpheader.WithholdingUnavailable, httpheader.TaxAdvisory, httpheader.ExportPending,
		},
		AllowCredentials: true,
		MaxAge:           int((24 * time.Hour).Seconds()),
	})
}
