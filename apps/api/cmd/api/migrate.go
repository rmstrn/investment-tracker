// Migration subcommand for the Core API binary.
//
// Invoked as `./api migrate <cmd>` where <cmd> is one of up/status/version.
// Fly.io calls it via release_command on every deploy so the schema is
// always advanced before any new machine accepts traffic; contributors
// run it locally (`make run-migrate` or `go run ./cmd/api migrate up`).
//
// Only DATABASE_URL is required from the environment — everything else
// that config.Load demands (Clerk, Stripe, Polygon, …) is irrelevant to
// a DDL-only migration and would needlessly couple the subcommand to
// secrets that do not gate it.
package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"io"
	"os"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib" // database/sql driver for goose
	"github.com/pressly/goose/v3"
	"github.com/rs/zerolog"
)

const migrateUsage = `usage: api migrate <command>

Commands:
  up       apply all pending migrations
  status   print the pending/applied state (read-only)
  version  print the currently-applied migration version

Environment:
  DATABASE_URL    required — Postgres DSN
  MIGRATIONS_DIR  optional — default "db/migrations"
`

// errMigrateUsage is returned when args are malformed; main translates
// this to exit 2 and prints the usage text. Kept as a typed error so
// tests can assert on it without string matching.
var errMigrateUsage = errors.New("migrate: usage")

// migrateTimeout bounds a single migrate invocation. Long enough for
// any forward-only DDL migration we plan to ship at MVP scale; shorter
// than Fly's 5-minute release_command ceiling so we fail explicitly
// rather than get killed by the orchestrator.
const migrateTimeout = 4 * time.Minute

// runMigrate is the CLI entry point. It owns env lookup, DB dial, and
// signalling back to main via an error. The heavy lifting is in
// execMigrate so tests can drive it with an injected *sql.DB without
// touching os.Args or os.Getenv.
func runMigrate(args []string, stdout, stderr io.Writer) error {
	if len(args) == 0 {
		_, _ = fmt.Fprint(stderr, migrateUsage)
		return errMigrateUsage
	}
	cmd := args[0]
	switch cmd {
	case "up", "status", "version":
	default:
		_, _ = fmt.Fprint(stderr, migrateUsage)
		return fmt.Errorf("%w: unknown command %q", errMigrateUsage, cmd)
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return errors.New("migrate: DATABASE_URL is required")
	}
	dir := os.Getenv("MIGRATIONS_DIR")
	if dir == "" {
		dir = "db/migrations"
	}

	log := zerolog.New(stderr).
		With().Timestamp().Str("service", "api").Str("subcommand", "migrate").Logger()

	ctx, cancel := context.WithTimeout(context.Background(), migrateTimeout)
	defer cancel()

	db, err := sql.Open("pgx", dbURL)
	if err != nil {
		return fmt.Errorf("migrate: sql.Open: %w", err)
	}
	defer func() { _ = db.Close() }()

	if err := db.PingContext(ctx); err != nil {
		return fmt.Errorf("migrate: db ping: %w", err)
	}

	return execMigrate(ctx, db, dir, cmd, stdout, log)
}

// execMigrate runs a single goose command against an already-open *sql.DB.
// Extracted so integration tests can exercise the actual goose plumbing
// without duplicating the env/dial shell.
func execMigrate(ctx context.Context, db *sql.DB, dir, cmd string, stdout io.Writer, log zerolog.Logger) error {
	if err := goose.SetDialect("postgres"); err != nil {
		return fmt.Errorf("migrate: goose dialect: %w", err)
	}

	start := time.Now()
	switch cmd {
	case "up":
		log.Info().Str("dir", dir).Msg("migrate up starting")
		if err := goose.UpContext(ctx, db, dir); err != nil {
			return fmt.Errorf("migrate: up: %w", err)
		}
	case "status":
		if err := goose.StatusContext(ctx, db, dir); err != nil {
			return fmt.Errorf("migrate: status: %w", err)
		}
	case "version":
		v, err := goose.GetDBVersionContext(ctx, db)
		if err != nil {
			return fmt.Errorf("migrate: version: %w", err)
		}
		_, _ = fmt.Fprintf(stdout, "current version: %d\n", v)
	}
	log.Info().Str("cmd", cmd).Dur("took", time.Since(start)).Msg("migrate done")
	return nil
}
