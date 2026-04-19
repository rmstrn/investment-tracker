package server

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/MicahParks/keyfunc/v3"
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
func New(ctx context.Context, deps *app.Deps) (*fiber.App, error) {
	app := fiber.New(fiber.Config{
		AppName:      "investment-tracker-api",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  120 * time.Second,
		ErrorHandler: defaultErrorHandler(deps),
	})

	jwks, err := middleware.NewJWKS(ctx, deps.Cfg.ClerkJWKSURL)
	if err != nil {
		return nil, err
	}

	authCfg := middleware.AuthConfig{
		JWKS:          jwks,
		UserRepo:      deps.UserRepo,
		Issuer:        "", // strict issuer check lands in PR B2 when /me wires real JWKS
		InternalToken: deps.Cfg.CoreAPIInternalToken,
	}

	// Chain order matters: RequestID first (so errs.Respond has it even
	// on auth failure), RequestLog second (so it logs auth outcomes),
	// Auth third (so handlers see authenticated user).
	app.Use(middleware.RequestID())
	app.Use(middleware.RequestLog(deps.Log))

	// Public routes — no auth.
	app.Get("/health", healthHandler(deps))

	// Authenticated API surface. Routes are registered per PR:
	//   PR B1: /internal/ai/usage (internal-only)
	//   PR B2: public read handlers
	//   PR B3: mutations + webhooks
	registerAuthenticated(app, deps, authCfg, jwks)

	return app, nil
}

// registerAuthenticated mounts everything behind Auth. Split out so the
// group setup is one place.
func registerAuthenticated(
	app *fiber.App,
	deps *app.Deps,
	authCfg middleware.AuthConfig,
	_ keyfunc.Keyfunc,
) {
	api := app.Group("", middleware.Auth(authCfg))

	// /internal/* routes live on Auth but gate further via
	// RequireInternalAuth — a valid Clerk user must not be able to
	// write to these endpoints.
	internalGroup := api.Group("/internal", middleware.RequireInternalAuth())
	internalGroup.Post("/ai/usage", handlers.InternalAIUsage(deps))
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
