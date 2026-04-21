package server

import (
	"errors"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/adaptor"
	"github.com/prometheus/client_golang/prometheus/promhttp"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/webhookidem"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/handlers"
	"github.com/rmstrn/investment-tracker/apps/api/internal/handlers/webhook"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware/airatelimit"
)

// New builds the Fiber app with the full middleware chain and every
// route registered. Separate from main so tests can construct it
// against an in-memory stack (testcontainers Postgres + miniredis) and
// hit it with app.Test(req).
//
// deps.JWKS must be non-nil — main asserts this at startup. server.New
// no longer fetches it.
func New(deps *app.Deps) (*fiber.App, error) {
	a := fiber.New(fiber.Config{
		AppName:      "investment-tracker-api",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  120 * time.Second,
		ErrorHandler: defaultErrorHandler(deps),
	})

	authCfg := middleware.AuthConfig{
		JWKS:          deps.JWKS,
		UserRepo:      deps.UserRepo,
		Issuer:        "", // strict issuer check lands when /me wires real JWKS end-to-end
		InternalToken: deps.Cfg.CoreAPIInternalToken,
	}

	// Global middleware chain — the ordered list + ordering rules
	// live in middleware_chain.go. Do not a.Use(...) anything
	// inline here; register a ChainEntry in GlobalChain instead so
	// the server_test.go ordering assertion catches drift.
	ApplyGlobalChain(a, deps)

	// Public routes — no auth.
	a.Get("/health", healthHandler(deps))
	// /metrics exposes the prometheus default registry (go_* + process_*
	// collectors out of the box). Fly's [metrics] block scrapes it from
	// the private 6PN network; it is also reachable externally on the
	// same port, which is acceptable for MVP since the surface is pure
	// process telemetry. Custom app metrics (request_duration, pgx pool
	// gauges) are a follow-up — see TECH_DEBT.md.
	a.Get("/metrics", adaptor.HTTPHandler(promhttp.Handler()))
	// Glossary (openapi `security: []`) is public so UI tooltips
	// work pre-login and from unauthenticated marketing pages.
	a.Get("/glossary", handlers.ListGlossaryTerms(deps))
	a.Get("/glossary/:slug", handlers.GetGlossaryTerm(deps))

	// Webhooks — public (openapi `security: []`). Authentication is
	// per-request via signature verification (svix for Clerk,
	// Stripe-Signature for Stripe) and idempotency via the shared
	// webhook_events ledger. Auth/idempotency middleware from the
	// user-facing group would be counter-productive here — we do not
	// issue Idempotency-Keys to providers, and the Clerk JWT
	// verifier does not recognise webhook payloads.
	//
	// Every provider plugs into the same webhook.Handle orchestrator
	// which owns verify → claim → dispatch. Adding a third provider
	// (e.g. SnapTrade under TD-046) is three lines here plus the
	// Provider impl in internal/handlers/webhook/.
	claimer := webhookidem.NewPool(deps.Pool)
	clerkProv := webhook.NewClerkProvider(deps, deps.Cfg.ClerkWebhookSecret)
	stripeProv := webhook.NewStripeProvider(deps, deps.Cfg.StripeWebhookSecret,
		webhook.BuildPriceToTier(deps.Cfg.StripePricePlus, deps.Cfg.StripePricePro))
	a.Post("/auth/webhook", webhook.Handle(&deps.Log, claimer, clerkProv))
	a.Post("/billing/webhook", webhook.Handle(&deps.Log, claimer, stripeProv))

	// Authenticated API surface. Routes are registered per PR:
	//   PR B1: /internal/ai/usage (internal-only)
	//   PR B2: public read handlers
	//   PR B3: mutations + webhooks
	registerAuthenticated(a, deps, authCfg)

	return a, nil
}

// registerAuthenticated mounts everything behind Auth. Split out so the
// group setup is one place.
func registerAuthenticated(a *fiber.App, deps *app.Deps, authCfg middleware.AuthConfig) {
	api := a.Group("", middleware.Auth(authCfg))

	// /internal/* routes live on Auth but gate further via
	// RequireInternalAuth — a valid Clerk user must not be able to
	// write to these endpoints.
	internalGroup := api.Group("/internal", middleware.RequireInternalAuth())
	internalGroup.Post("/ai/usage", handlers.InternalAIUsage(deps))

	// Public read-only API surface. Rate-limit runs in Passthrough
	// mode: counters + headers without a 429 gate (reads are cheap;
	// the real gate is on mutating routes in PR B3).
	reads := api.Group("",
		middleware.RateLimit(middleware.RateLimitConfig{
			Cache:       deps.Cache,
			Key:         "reads",
			Limit:       600, // per-minute counter for observability
			Window:      time.Minute,
			Passthrough: true,
		}),
	)
	reads.Get("/portfolio", handlers.GetPortfolio(deps))
	reads.Get("/positions", handlers.ListPositions(deps))
	reads.Get("/transactions", handlers.ListTransactions(deps))
	reads.Get("/portfolio/performance", handlers.GetPortfolioPerformance(deps))
	reads.Get("/market/quote", handlers.GetMarketQuote(deps))
	reads.Get("/portfolio/dividends", handlers.ListDividends(deps))
	reads.Get("/me", handlers.GetMe(deps))
	reads.Get("/me/usage", handlers.GetMyUsage(deps))
	reads.Get("/me/paywalls", handlers.ListMyPaywalls(deps))
	reads.Get("/me/sessions", handlers.ListMySessions(deps))
	reads.Get("/me/notification-preferences", handlers.GetMyNotificationPreferences(deps))
	reads.Get("/accounts", handlers.ListAccounts(deps))
	reads.Get("/accounts/:id", handlers.GetAccount(deps))
	reads.Get("/accounts/:id/status", handlers.GetAccountStatus(deps))
	reads.Get("/positions/:id", handlers.GetPosition(deps))
	reads.Get("/positions/:id/transactions", handlers.ListPositionTransactions(deps))
	reads.Get("/transactions/:id", handlers.GetTransaction(deps))
	reads.Get("/portfolio/history", handlers.GetPortfolioHistory(deps))
	reads.Get("/portfolio/allocation", handlers.GetPortfolioAllocation(deps))
	reads.Get("/portfolio/performance/compare", handlers.ComparePortfolioPerformance(deps))
	reads.Get("/market/search", handlers.SearchMarket(deps))
	reads.Get("/market/history", handlers.GetMarketHistory(deps))
	reads.Get("/fx_rates", handlers.ListFxRates(deps))
	reads.Get("/prices", handlers.ListPrices(deps))
	reads.Get("/ai/conversations", handlers.ListAIConversations(deps))
	reads.Get("/ai/conversations/:id", handlers.GetAIConversation(deps))
	reads.Get("/ai/insights", handlers.ListInsights(deps))
	reads.Get("/portfolio/analytics", handlers.GetPortfolioAnalytics(deps))
	reads.Get("/portfolio/tax", handlers.GetPortfolioTax(deps))
	reads.Get("/notifications", handlers.ListNotifications(deps))
	reads.Get("/notifications/unread_count", handlers.GetUnreadNotificationCount(deps))
	reads.Get("/exports/:id", handlers.GetExport(deps))
	// Scope-cut reads (see TD-056 / TD-057 / TD-058 / TD-059).
	// Pattern: empty-state-200 when the payload can be truthfully empty
	// (2FA status: "not enrolled"); 501 NOT_IMPLEMENTED when an empty
	// response would misrepresent real data (GDPR export, tax export,
	// billing CRUD).
	reads.Get("/me/2fa", handlers.GetTwoFactorStatus(deps))
	reads.Get("/me/export", handlers.ExportMe(deps))
	reads.Get("/portfolio/tax/export", handlers.GetPortfolioTaxExport(deps))
	reads.Get("/billing/subscription", handlers.GetBillingSubscription(deps))
	reads.Get("/billing/invoices", handlers.ListBillingInvoices(deps))

	// Mutations group: Idempotency middleware + write-side rate-limit
	// (real 429 gate, not passthrough). Idempotency takes the
	// request-collapsing SETNX lock added in B3-i; callers that send
	// the same Idempotency-Key replay within 24h and collapse on the
	// in-flight branch with 409 IDEMPOTENCY_IN_PROGRESS.
	mutations := api.Group("",
		middleware.RateLimit(middleware.RateLimitConfig{
			Cache:  deps.Cache,
			Key:    "mutations",
			Limit:  120,
			Window: time.Minute,
		}),
		middleware.Idempotency(middleware.IdempotencyConfig{Cache: deps.Cache}),
	)
	// Accounts mutations.
	mutations.Post("/accounts", handlers.CreateAccount(deps))
	mutations.Patch("/accounts/:id", handlers.UpdateAccount(deps))
	mutations.Delete("/accounts/:id", handlers.DeleteAccount(deps))
	mutations.Post("/accounts/:id/sync", handlers.SyncAccount(deps))
	mutations.Post("/accounts/:id/reconnect", handlers.ReconnectAccount(deps))
	mutations.Post("/accounts/:id/pause", handlers.PauseAccount(deps))
	mutations.Post("/accounts/:id/resume", handlers.ResumeAccount(deps))
	// Transactions mutations.
	mutations.Post("/transactions", handlers.CreateTransaction(deps))
	mutations.Patch("/transactions/:id", handlers.UpdateTransaction(deps))
	mutations.Delete("/transactions/:id", handlers.DeleteTransaction(deps))
	// /me data mutations.
	mutations.Patch("/me", handlers.UpdateMe(deps))
	mutations.Delete("/me", handlers.DeleteMe(deps))
	mutations.Post("/me/paywalls/:trigger/dismiss", handlers.DismissPaywall(deps))
	mutations.Post("/me/undo-deletion", handlers.UndoDeletion(deps))
	mutations.Patch("/me/notification-preferences", handlers.UpdateNotificationPreferences(deps))
	// Notifications mutations.
	mutations.Post("/notifications/:id/read", handlers.MarkNotificationRead(deps))
	mutations.Post("/notifications/read_all", handlers.MarkAllNotificationsRead(deps))
	// Exports.
	mutations.Post("/exports", handlers.CreateExport(deps))
	// Scope-cut mutations — 501 NOT_IMPLEMENTED stubs, see
	// me_clerk_proxy.go (TD-056) and billing.go (TD-057).
	mutations.Post("/me/2fa/enroll", handlers.Enroll2FA(deps))
	mutations.Post("/me/2fa/verify", handlers.Verify2FA(deps))
	mutations.Post("/me/2fa/disable", handlers.Disable2FA(deps))
	mutations.Post("/me/2fa/backup-codes/regenerate", handlers.RegenerateBackupCodes(deps))
	// Static path registered first so fiber's router matches
	// /me/sessions/others before falling through to the :id parametric.
	mutations.Delete("/me/sessions/others", handlers.RevokeOtherSessions(deps))
	mutations.Delete("/me/sessions/:id", handlers.RevokeSession(deps))
	mutations.Post("/billing/checkout", handlers.CreateBillingCheckout(deps))
	mutations.Post("/billing/portal", handlers.CreateBillingPortal(deps))
	mutations.Post("/billing/cancellation-feedback", handlers.SubmitCancellationFeedback(deps))

	// AI conversation lifecycle (no rate-limit gate — chat counts
	// in airatelimit; create/delete are admin-style ops).
	mutations.Post("/ai/conversations", handlers.CreateAIConversation(deps))
	mutations.Delete("/ai/conversations/:id", handlers.DeleteAIConversation(deps))
	// AI insight bookkeeping (also outside airatelimit — only the
	// LLM-cost surface goes through the daily counter).
	mutations.Post("/ai/insights/:id/dismiss", handlers.DismissInsight(deps))
	mutations.Post("/ai/insights/:id/viewed", handlers.MarkInsightViewed(deps))

	// AI cost-incurring endpoints — every call hits the daily
	// AIMessagesDaily counter via airatelimit before reaching the
	// handler (which then forwards to AI Service via deps.AI).
	aiMutations := mutations.Group("",
		airatelimit.New(deps),
	)
	aiMutations.Post("/ai/insights/generate", handlers.GenerateInsightsHandler(deps))
	// /ai/chat + /ai/chat/stream — both hit the same daily counter;
	// the stream variant additionally finishes through
	// SendStreamWriter, which the Idempotency middleware treats as
	// non-cacheable (see middleware/idempotency.go text/event-stream
	// skip branch — collapse-only semantics per AC #4).
	aiMutations.Post("/ai/chat", handlers.AIChatSync(deps))
	aiMutations.Post("/ai/chat/stream", handlers.AIChatStream(deps))
}

func healthHandler(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "api",
			"env":     deps.Cfg.Env,
			"time":    time.Now().UTC().Format(time.RFC3339),
		})
	}
}

// defaultErrorHandler is the fallback when a handler returns a bare
// error instead of going through errs.Respond. Produces the same
// envelope shape so clients never see a raw Fiber error page.
func defaultErrorHandler(deps *app.Deps) fiber.ErrorHandler {
	return func(c fiber.Ctx, err error) error {
		code := http.StatusInternalServerError
		var fe *fiber.Error
		if errors.As(err, &fe) {
			code = fe.Code
		}
		deps.Log.Error().Err(err).Int("status", code).Str("path", c.Path()).Msg("unhandled error")
		return errs.Respond(c, "", errs.Wrap(err, code, http.StatusText(code), err.Error()))
	}
}
