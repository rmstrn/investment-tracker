// Core API entry point.
//
// Responsibilities wired here: config loading, logger initialisation,
// Fiber application construction, and graceful shutdown on SIGINT/SIGTERM.
//
// Every other concern (DB pool, Redis, Clerk auth, handlers) is introduced
// in later PR A commits. This file stays small — it only orchestrates.
package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/rs/zerolog"

	"github.com/rmstrn/investment-tracker/apps/api/internal/config"
	"github.com/rmstrn/investment-tracker/apps/api/internal/logger"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		// Logger not ready yet — write a structured line to stderr so we are
		// readable in the same format even in this bootstrap window.
		boot := zerolog.New(os.Stderr).
			With().Timestamp().Str("service", "api").Logger()
		boot.Fatal().Err(err).Msg("config load failed")
	}

	log := logger.New(logger.Options{
		Env:     cfg.Env,
		Level:   cfg.LogLevel,
		Format:  cfg.LogFormat,
		Service: "api",
	})

	app := buildApp(log, cfg)

	startAndWait(app, log, cfg)
}

// buildApp assembles the Fiber app with system-level routes only. Business
// routes are registered in subsequent commits.
func buildApp(log zerolog.Logger, cfg *config.Config) *fiber.App {
	app := fiber.New(fiber.Config{
		AppName:      "investment-tracker-api",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  120 * time.Second,
		ErrorHandler: func(c fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			var fe *fiber.Error
			if errors.As(err, &fe) {
				code = fe.Code
			}
			log.Error().Err(err).Int("status", code).Str("path", c.Path()).Msg("request failed")
			return c.Status(code).JSON(fiber.Map{
				"error": fiber.Map{
					"code":    http.StatusText(code),
					"message": err.Error(),
				},
			})
		},
	})

	app.Get("/health", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "api",
			"env":     cfg.Env,
			"time":    time.Now().UTC().Format(time.RFC3339),
		})
	})

	return app
}

func startAndWait(app *fiber.App, log zerolog.Logger, cfg *config.Config) {
	serverErrs := make(chan error, 1)
	go func() {
		log.Info().Str("addr", cfg.ListenAddr).Msg("api listening")
		if err := app.Listen(cfg.ListenAddr); err != nil {
			serverErrs <- err
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case sig := <-quit:
		log.Info().Str("signal", sig.String()).Msg("shutdown initiated")
	case err := <-serverErrs:
		log.Fatal().Err(err).Msg("server crashed")
	}

	ctx, cancel := context.WithTimeout(context.Background(), cfg.ShutdownTimeout)
	err := app.ShutdownWithContext(ctx)
	cancel()

	if err != nil {
		log.Error().Err(err).Msg("graceful shutdown failed")
		os.Exit(1)
	}

	log.Info().Msg("api stopped")
}
