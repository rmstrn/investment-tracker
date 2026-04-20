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
	"errors"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v3"
	"github.com/rs/zerolog"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/aiservice"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/asynqpub"
	"github.com/rmstrn/investment-tracker/apps/api/internal/config"
	"github.com/rmstrn/investment-tracker/apps/api/internal/db"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/logger"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
	"github.com/rmstrn/investment-tracker/apps/api/internal/server"
)

// main is intentionally tiny — run() owns the error path so defers
// (pool.Close, Sentry flush, ctx cancel) always fire before process
// exit. main just converts an error to a non-zero status.
//
// Subcommand dispatch: `api migrate <up|status|version>` branches
// before config.Load — migrations only need DATABASE_URL and must be
// runnable before every machine-level secret is provisioned.
func main() {
	if len(os.Args) > 1 && os.Args[1] == "migrate" {
		if err := runMigrate(os.Args[2:], os.Stdout, os.Stderr); err != nil {
			boot := zerolog.New(os.Stderr).
				With().Timestamp().Str("service", "api").Str("subcommand", "migrate").Logger()
			boot.Error().Err(err).Msg("migrate exit")
			if errors.Is(err, errMigrateUsage) {
				os.Exit(2)
			}
			os.Exit(1)
		}
		return
	}
	if err := run(); err != nil {
		// Fall-back to a bootstrap stderr logger when run() failed before
		// the real logger was built.
		boot := zerolog.New(os.Stderr).
			With().Timestamp().Str("service", "api").Logger()
		boot.Error().Err(err).Msg("api exit")
		os.Exit(1)
	}
}

func run() error {
	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("config: %w", err)
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
		return fmt.Errorf("db pool: %w", err)
	}
	defer pool.Close()

	rcache, err := cache.New(ctx, cfg.RedisURL)
	if err != nil {
		return fmt.Errorf("redis: %w", err)
	}
	defer func() { _ = rcache.Close() }()

	// asynq publisher reuses the same Redis as the cache — keeps the
	// boot-time dependency surface tight; if a future deployment
	// wants a separate broker Redis, split the config var.
	asynqPub, err := asynqpub.New(cfg.RedisURL, log)
	if err != nil {
		return fmt.Errorf("asynq publisher: %w", err)
	}
	defer func() { _ = asynqPub.Close() }()

	// Clerk JWKS is fetched once at boot. Both a fetch error and a
	// nil-without-error result are startup failures: a silent nil here
	// would let every Clerk-authenticated request 401 against a
	// running-but-broken server, which is the opposite of fail-fast.
	jwks, err := middleware.NewJWKS(ctx, cfg.ClerkJWKSURL)
	if err != nil {
		return fmt.Errorf("clerk jwks fetch: %w", err)
	}
	if jwks == nil {
		return errors.New("clerk jwks: nil without error — check CLERK_JWKS_URL")
	}

	// AI Service client. baseURL + bearer token come from config;
	// the client itself does not allocate connections until first
	// call so no boot-time check beyond non-empty config is needed.
	aiClient := aiservice.New(cfg.AIServiceURL, cfg.AIServiceToken)

	deps := &app.Deps{
		Cfg:      cfg,
		Log:      log,
		Pool:     pool,
		Cache:    rcache,
		UserRepo: users.NewRepo(pool),
		JWKS:     jwks,
		Asynq:    asynqPub,
		AI:       aiClient,
	}

	a, err := server.New(deps)
	if err != nil {
		return fmt.Errorf("server build: %w", err)
	}

	return startAndWait(ctx, a, log, cfg)
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

func startAndWait(ctx context.Context, a *fiber.App, log zerolog.Logger, cfg *config.Config) error {
	serverErrs := make(chan error, 1)
	go func() {
		log.Info().Str("addr", cfg.ListenAddr).Msg("api listening")
		if err := a.Listen(cfg.ListenAddr); err != nil {
			serverErrs <- err
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case sig := <-quit:
		log.Info().Str("signal", sig.String()).Msg("shutdown initiated")
	case err := <-serverErrs:
		return fmt.Errorf("server crashed: %w", err)
	case <-ctx.Done():
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), cfg.ShutdownTimeout)
	defer cancel()
	if err := a.ShutdownWithContext(shutdownCtx); err != nil {
		return fmt.Errorf("graceful shutdown: %w", err)
	}
	log.Info().Msg("api stopped")
	return nil
}
