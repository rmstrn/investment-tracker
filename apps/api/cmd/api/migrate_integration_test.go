//go:build integration

// Integration test for the migrate subcommand. Spins up a throwaway
// Postgres via testcontainers, runs the full goose ladder, and asserts
// both happy-path ("up" advances version) and idempotency ("up" twice
// is a no-op). Matches the same harness shape as
// internal/handlers/integration_setup_test.go so contributors see a
// uniform pattern.
//
// Run: `go test -tags integration ./apps/api/cmd/api/...`
package main

import (
	"bytes"
	"context"
	"database/sql"
	"fmt"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
	"github.com/rs/zerolog"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
)

func TestMigrateIntegration_Ladder(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	pgC, err := postgres.Run(ctx,
		"pgvector/pgvector:pg17",
		postgres.WithDatabase("migrate_test"),
		postgres.WithUsername("test"),
		postgres.WithPassword("test"),
		postgres.BasicWaitStrategies(),
		postgres.WithSQLDriver("pgx"),
	)
	if err != nil {
		t.Fatalf("testcontainers pg: %v", err)
	}
	t.Cleanup(func() { _ = pgC.Terminate(context.Background()) })

	url, err := pgC.ConnectionString(ctx, "sslmode=disable")
	if err != nil {
		t.Fatalf("connection string: %v", err)
	}

	// Migrations require pgcrypto — mirror production bootstrap where
	// Neon pre-provisions the extension. We do it once here before the
	// first `up` so goose's first INSERT into goose_db_version works
	// without it.
	{
		db, err := sql.Open("pgx", url)
		if err != nil {
			t.Fatalf("sql.Open: %v", err)
		}
		if _, err := db.ExecContext(ctx, "CREATE EXTENSION IF NOT EXISTS pgcrypto"); err != nil {
			_ = db.Close()
			t.Fatalf("pgcrypto: %v", err)
		}
		_ = db.Close()
	}

	_, thisFile, _, _ := runtime.Caller(0)
	migrationsDir := filepath.Join(filepath.Dir(thisFile), "..", "..", "db", "migrations")

	t.Setenv("DATABASE_URL", url)
	t.Setenv("MIGRATIONS_DIR", migrationsDir)

	log := zerolog.New(&bytes.Buffer{}).With().Timestamp().Logger()
	db, err := sql.Open("pgx", url)
	if err != nil {
		t.Fatalf("sql.Open: %v", err)
	}
	t.Cleanup(func() { _ = db.Close() })

	// Full ladder: up → up (idempotent) → version advanced → status clean.
	if err := execMigrate(ctx, db, migrationsDir, "up", &bytes.Buffer{}, log); err != nil {
		t.Fatalf("first up: %v", err)
	}
	v1, err := goose.GetDBVersionContext(ctx, db)
	if err != nil {
		t.Fatalf("version after first up: %v", err)
	}
	if v1 == 0 {
		t.Fatal("version still 0 after up — no migrations applied")
	}

	// A second up must be a no-op. Any error here means migrations
	// are not idempotent under the configured goose version.
	if err := execMigrate(ctx, db, migrationsDir, "up", &bytes.Buffer{}, log); err != nil {
		t.Fatalf("second up: %v", err)
	}
	v2, err := goose.GetDBVersionContext(ctx, db)
	if err != nil {
		t.Fatalf("version after second up: %v", err)
	}
	if v1 != v2 {
		t.Fatalf("version moved between idempotent ups: %d → %d", v1, v2)
	}

	// Status must enumerate all the migration files without erroring.
	var statusOut bytes.Buffer
	if err := execMigrate(ctx, db, migrationsDir, "status", &statusOut, log); err != nil {
		t.Fatalf("status: %v", err)
	}

	// Version prints to stdout for the runbook.
	var versionOut bytes.Buffer
	if err := execMigrate(ctx, db, migrationsDir, "version", &versionOut, log); err != nil {
		t.Fatalf("version: %v", err)
	}
	wanted := fmt.Sprintf("current version: %d", v1)
	if !strings.Contains(versionOut.String(), wanted) {
		t.Fatalf("version output missing %q; got %q", wanted, versionOut.String())
	}
}

func TestMigrateIntegration_UnreachableDB(t *testing.T) {
	t.Setenv("DATABASE_URL", "postgres://nobody:nobody@127.0.0.1:1/none?sslmode=disable&connect_timeout=1")
	err := runMigrate([]string{"up"}, &bytes.Buffer{}, &bytes.Buffer{})
	if err == nil {
		t.Fatal("expected dial error against unreachable DSN")
	}
	if !strings.Contains(err.Error(), "db ping") {
		t.Fatalf("expected ping error, got %q", err.Error())
	}
}
