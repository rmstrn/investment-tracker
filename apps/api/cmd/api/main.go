// Core API entry point.
//
// Responsibilities: load config, init logger + Sentry, build the pgx
// pool and Redis client, assemble Deps, build the Fiber app via
// internal/server.New, listen, and gracefully shut down on SIGINT /
// SIGTERM.
//
// Everything specific to a single route lives in handlers; this file
// is the wiring sheet.
package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v3"
	"github.com/rs/zerolog"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	"github.com/rmstrn/investment-tracker/apps/api/internal/config"
	"github.com/rmstrn/investment-tracker/apps/api/internal/db"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/logger"
	"github.com/rmstrn/investment-tracker/apps/api/internal/server"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
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

	initSentry(cfg, log)
	defer sentry.Flush(2 * time.Second)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	pool, err := db.NewPool(ctx, db.DefaultPoolConfig(cfg.DatabaseURL))
	if err != nil {
		log.Fatal().Err(err).Msg("db pool init failed")
	}
	defer pool.Close()

	rcache, err := cache.New(ctx, cfg.RedisURL)
	if err != nil {
		log.Fatal().Err(err).Msg("redis init failed")
	}
	defer func() { _ = rcache.Close() }()

	deps := &app.Deps{
		Cfg:      cfg,
		Log:      log,
		Pool:     pool,
		Cache:    rcache,
		UserRepo: users.NewRepo(pool),
	}

	app, err := server.New(ctx, deps)
	if err != nil {
		log.Fatal().Err(err).Msg("server build failed")
	}

	startAndWait(ctx, app, log, cfg)
}

// initSentry wires Sentry SDK when a DSN is present. A missing DSN is a
// valid dev configuration — local runs should not need a Sentry project.
func initSentry(cfg *config.Config, log zerolog.Logger) {
	if cfg.SentryDSN == "" {
		log.Info().Msg("sentry disabled (no DSN)")
		return
	}
	err := sentry.Init(sentry.ClientOptions{
		Dsn:              cfg.SentryDSN,
		Environment:      cfg.Env,
		AttachStacktrace: true,
		// Sample rate 100% until we see volume — PR B3 tunes this per env.
		TracesSampleRate: 1.0,
	})
	if err != nil {
		log.Error().Err(err).Msg("sentry init failed — continuing without it")
		return
	}
	log.Info().Str("env", cfg.Env).Msg("sentry initialised")
}

func startAndWait(ctx context.Context, app *fiber.App, log zerolog.Logger, cfg *config.Config) {
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
	case <-ctx.Done():
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), cfg.ShutdownTimeout)
	err := app.ShutdownWithContext(shutdownCtx)
	cancel()

	if err != nil {
		log.Error().Err(err).Msg("graceful shutdown failed")
		os.Exit(1)
	}
	log.Info().Msg("api stopped")
}
