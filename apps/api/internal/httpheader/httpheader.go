// Package httpheader is the Go half of the cross-service HTTP
// header name registry. The Python half lives at
// apps/ai/src/ai_service/http_headers.py; both files MUST stay in
// sync for the headers that travel across the Core API ↔ AI
// Service boundary — enforced by the CI check at
// tools/scripts/check-header-symmetry.py.
//
// Sprint C cluster 3a — single source of truth for header names
// used on both sides of the stack. Previously spread across
//   - apps/api/internal/middleware/auth.go         (internalUserIDHeader)
//   - apps/api/internal/middleware/requestlog.go   (requestIDHeader)
//   - apps/api/internal/middleware/idempotency.go  (idempotencyHeader)
//   - apps/ai/src/ai_service/api/middleware.py     (_REQUEST_ID_HEADER)
//   - plus ~10 bare string literals across handlers + tests.
//
// Renaming a cross-service header is now a two-file change
// (httpheader.go + http_headers.py); CI fails loudly on drift.
//
// Go-only informational headers (X-Partial-Portfolio,
// X-FX-Unavailable, X-Clerk-Unavailable, the X-RateLimit-* family,
// …) also live here so every handler imports from one place. They
// aren't part of the cross-service contract — Python doesn't know
// about them — and are marked as such in this file.
package httpheader

// Cross-service headers — MUST stay in sync with
// apps/ai/src/ai_service/http_headers.py. Any rename here needs
// the matching edit there; the check-header-symmetry.py CI step
// fails the build otherwise.
const (
	// UserID carries the authenticated user UUID on internal-token
	// requests (AI Service → Core API reverse channel, Core API
	// → AI Service for tool-use context). Case "X-User-Id" matches
	// Fiber's normalized form and Starlette/FastAPI's canonical
	// header emission — HTTP is case-insensitive but picking one
	// spelling keeps logs + wireshark traces readable.
	UserID = "X-User-Id"

	// RequestID propagates the per-request trace id emitted by
	// middleware.RequestID across every downstream call. Both
	// sides normalize on the all-caps "ID" spelling ("X-Request-ID")
	// — picked because Go already used it and "-ID" is the
	// conventional IANA-style in the RFC drafts.
	RequestID = "X-Request-ID"

	// Authorization is the standard IETF bearer header — listed
	// here only so handler code pulls every header name from one
	// import instead of mixing the package const with
	// fiber.HeaderAuthorization / plain string literals.
	Authorization = "Authorization"
)

// Core-API-only informational headers. Python doesn't read or set
// these today. Grouped here so a handler adding a new signal does
// not coin a new string literal: import from httpheader instead.
//
// When adding a new informational header:
//  1. Add the const here.
//  2. Add it to CORS ExposeHeaders in server/middleware_chain.go.
//  3. Use the const (not a string literal) in the handler.
const (
	// Idempotency-Key is the client-supplied dedup key for
	// mutation requests; reads do not carry it.
	IdempotencyKey = "Idempotency-Key"

	// Rate-limit surface. X-RateLimit-Limit="0" means "unlimited"
	// (set for Pro tier) so clients can detect the no-gate case
	// without parsing tier strings.
	RateLimitLimit     = "X-RateLimit-Limit"
	RateLimitRemaining = "X-RateLimit-Remaining"
	RateLimitReset     = "X-RateLimit-Reset"

	// Availability signals — set to "true" when the handler
	// returns a partial or degraded payload so the client can
	// render a subtle banner without re-parsing the body.
	AsyncUnavailable       = "X-Async-Unavailable"
	PartialPortfolio       = "X-Partial-Portfolio"
	FXUnavailable          = "X-FX-Unavailable"
	FXDate                 = "X-FX-Date"
	ClerkUnavailable       = "X-Clerk-Unavailable"
	SearchProvider         = "X-Search-Provider"
	BenchmarkUnavailable   = "X-Benchmark-Unavailable"
	AnalyticsPartial       = "X-Analytics-Partial"
	WithholdingUnavailable = "X-Withholding-Unavailable"
	TaxAdvisory            = "X-Tax-Advisory"
	ExportPending          = "X-Export-Pending"

	// UpgradeToTier surfaces the target tier on 403
	// TIER_LIMIT_EXCEEDED responses (airatelimit handler).
	UpgradeToTier = "Upgrade-To-Tier"

	// AccelBuffering disables nginx/proxy response buffering for
	// streaming endpoints. Value is "no".
	AccelBuffering = "X-Accel-Buffering"
)

// Webhook-provider headers. Read-only for us — providers sign
// their requests with a header value we verify.
const (
	// StripeSignature is the HMAC header on /billing/webhook.
	StripeSignature = "Stripe-Signature"

	// SvixID is Clerk's canonical idempotency key (the event
	// envelope's `data.id` varies per event type; svix-id does not).
	SvixID = "svix-id"
)
