package server

import (
	"errors"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/handlers"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
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

	// Chain order matters: RequestID first (so errs.Respond has it even
	// on auth failure), RequestLog second (so it logs auth outcomes),
	// Auth third (so handlers see authenticated user).
	a.Use(middleware.RequestID())
	a.Use(middleware.RequestLog(deps.Log))

	// Public routes — no auth.
	a.Get("/health", healthHandler(deps))

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
