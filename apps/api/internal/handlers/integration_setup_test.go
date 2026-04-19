//go:build integration

// Shared integration-test harness for the handlers package.
//
// One Postgres container + one miniredis are booted at TestMain and
// reused across every *_integration_test.go in the package. Per-test
// isolation comes from resetDB(t), which TRUNCATEs every user-owned
// table with RESTART IDENTITY CASCADE before the test runs.
//
// Writing a new integration test:
//
//  1. Put it in a file named *_integration_test.go under internal/handlers.
//  2. Start with `resetDB(t)` so the data slate is clean.
//  3. Seed fixtures via `seedUser(t, tier)` / direct SQL against
//     testPool. Never `TestMain` or start containers in your file.
//  4. Build the app via `newTestApp(t)` which wires dual-mode auth
//     with the shared secret "integration-token" and an injected Clerk
//     JWKS stub suitable for test-only use.
//  5. Hit endpoints with `doJSON(t, app, method, path, userID, token, body)`.
//
// Running:
//
//	go test -tags integration ./internal/handlers/...
package handlers_test

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/jackc/pgx/v5/stdlib" // database/sql driver for goose
	"github.com/pressly/goose/v3"
	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog"
	"github.com/testcontainers/testcontainers-go/modules/postgres"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	"github.com/rmstrn/investment-tracker/apps/api/internal/config"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/handlers"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// testSharedInternalToken is the "known" shared secret the harness
// configures on every test app. Callers set it on requests via the
// Authorization: Bearer header.
const testSharedInternalToken = "integration-shared-secret-placeholder-32b"

// Package-level handles set by TestMain. Access them by calling
// resetDB(t) first — that also doubles as a "I need the shared state"
// assertion since it nil-checks testPool.
var (
	testPool  *pgxpool.Pool
	testCache *cache.Client
)

// TestMain owns the container lifecycle. It runs once per package
// invocation — per-test cleanup is the resetDB helper.
func TestMain(m *testing.M) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	pgC, err := postgres.Run(ctx,
		"pgvector/pgvector:pg17",
		postgres.WithDatabase("investment_test"),
		postgres.WithUsername("test"),
		postgres.WithPassword("test"),
		postgres.BasicWaitStrategies(),
		postgres.WithSQLDriver("pgx"),
	)
	if err != nil {
		panic(fmt.Errorf("testcontainers pg: %w", err))
	}
	defer func() { _ = pgC.Terminate(context.Background()) }()

	url, err := pgC.ConnectionString(ctx, "sslmode=disable")
	if err != nil {
		panic(err)
	}

	if err := bootstrapDB(ctx, url); err != nil {
		panic(err)
	}

	pool, err := pgxpool.New(ctx, url)
	if err != nil {
		panic(err)
	}
	defer pool.Close()
	testPool = pool

	mr, err := miniredis.Run()
	if err != nil {
		panic(err)
	}
	defer mr.Close()
	testCache = cache.NewFromRDB(redis.NewClient(&redis.Options{Addr: mr.Addr()}))

	os.Exit(m.Run())
}

// bootstrapDB runs the pgcrypto extension + every goose migration.
// Uses database/sql (stdlib pgx driver) because goose needs a *sql.DB.
func bootstrapDB(ctx context.Context, url string) error {
	db, err := sql.Open("pgx", url)
	if err != nil {
		return fmt.Errorf("sql open: %w", err)
	}
	defer db.Close()

	if _, err := db.ExecContext(ctx, "CREATE EXTENSION IF NOT EXISTS pgcrypto"); err != nil {
		return fmt.Errorf("pgcrypto: %w", err)
	}
	_, thisFile, _, _ := runtime.Caller(0)
	migrationsDir := filepath.Join(filepath.Dir(thisFile), "..", "..", "db", "migrations")
	if err := goose.SetDialect("postgres"); err != nil {
		return fmt.Errorf("goose dialect: %w", err)
	}
	if err := goose.Up(db, migrationsDir); err != nil {
		return fmt.Errorf("goose up: %w", err)
	}
	return nil
}

// resetDB truncates every user-owned table so tests see a clean slate.
// Called at the top of each test. Preserves tables whose content is
// static seed data (e.g. glossary_terms).
func resetDB(t *testing.T) {
	t.Helper()
	if testPool == nil {
		t.Fatal("testPool not ready — resetDB called before TestMain?")
	}
	// Ordered so CASCADE handles the FK graph; the explicit list makes
	// the intent clear and avoids dropping rows we do want kept (like
	// glossary_terms, which is seeded by a dedicated migration).
	_, err := testPool.Exec(context.Background(), `
		TRUNCATE TABLE
			ai_usage, ai_messages, ai_conversations,
			idempotency_keys, audit_log,
			export_jobs, cancellation_feedback,
			notifications, notification_preferences, user_digest_preferences,
			insights, usage_counters,
			portfolio_snapshots, positions, transactions,
			prices, fx_rates,
			accounts,
			users
		RESTART IDENTITY CASCADE
	`)
	if err != nil {
		t.Fatalf("resetDB: %v", err)
	}
}

// seedUser inserts one user and returns its id. tier is one of
// "free" / "plus" / "pro".
func seedUser(t *testing.T, tier string) uuid.UUID {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO users (id, clerk_user_id, email, subscription_tier)
		VALUES ($1, $2, $3, $4)
	`, id, "clerk_"+id.String(), id.String()+"@test.local", tier)
	if err != nil {
		t.Fatalf("seedUser: %v", err)
	}
	return id
}

// newTestApp builds a Fiber app wired to the shared Postgres + Redis
// with dual-mode auth. The Clerk JWKS stays nil — tests in this
// package exercise the internal-auth path; a future JWKS-backed harness
// can sit next to this helper when PR B3 adds Clerk-path integration
// tests.
func newTestApp(t *testing.T) *fiber.App {
	t.Helper()
	deps := &app.Deps{
		Cfg: &config.Config{
			Env:                  "test",
			CoreAPIInternalToken: testSharedInternalToken,
		},
		Log:      zerolog.New(io.Discard),
		Pool:     testPool,
		Cache:    testCache,
		UserRepo: users.NewRepo(testPool),
	}

	a := fiber.New()
	a.Use(middleware.RequestID())
	a.Use(middleware.Auth(middleware.AuthConfig{
		UserRepo:      deps.UserRepo,
		InternalToken: testSharedInternalToken,
	}))
	a.Post("/internal/ai/usage",
		middleware.RequireInternalAuth(),
		handlers.InternalAIUsage(deps),
	)
	return a
}

// doJSON is the call-shape wrapper used by every integration test.
// Returns the parsed response along with the decoded body (as JSON
// when Content-Type is application/json; raw bytes otherwise).
func doJSON(
	t *testing.T,
	a *fiber.App,
	method, path, xUserID, token string,
	body any,
) (*http.Response, []byte) {
	t.Helper()
	var rdr io.Reader
	if body != nil {
		raw, err := json.Marshal(body)
		if err != nil {
			t.Fatalf("marshal body: %v", err)
		}
		rdr = strings.NewReader(string(raw))
	}
	req := httptest.NewRequestWithContext(t.Context(), method, path, rdr)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	if xUserID != "" {
		req.Header.Set("X-User-Id", xUserID)
	}
	resp, err := a.Test(req, fiber.TestConfig{Timeout: 10 * time.Second})
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	raw, _ := io.ReadAll(resp.Body)
	_ = resp.Body.Close()
	return resp, raw
}
