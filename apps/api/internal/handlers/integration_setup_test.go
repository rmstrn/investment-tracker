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
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/aiservice"
	"github.com/rmstrn/investment-tracker/apps/api/internal/config"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/server"
)

// testSharedInternalToken is the "known" shared secret the harness
// configures on every test app. Callers set it on requests via the
// Authorization: Bearer header.
const testSharedInternalToken = "integration-shared-secret-placeholder-32b"

// Webhook-related fixtures. Tests sign their synthetic payloads with
// these same secrets so server.New's real verifiers accept them.
//
// testClerkWebhookSecret is the `whsec_<base64>` shape Clerk issues in
// production — exercising NewWebhook's base64-decode path rather than
// the NewWebhookRaw fallback, so a prod-secret regression would be
// caught here rather than post-deploy. The raw key bytes are
// `some_32byte_raw_key_for_tests_ok` (32 ASCII bytes). The
// `gitleaks:allow` comment tells the secret scanner this is a
// placeholder — there is no real Clerk/Stripe endpoint keyed with it.
const (
	testClerkWebhookSecret  = "whsec_c29tZV8zMmJ5dGVfcmF3X2tleV9mb3JfdGVzdHNfb2s=" // gitleaks:allow — test placeholder, no real endpoint
	testStripeWebhookSecret = "whsec_integration_stripe_placeholder_secret"        // gitleaks:allow — test placeholder, no real endpoint
	testStripePricePlus     = "price_integration_plus"
	testStripePricePro      = "price_integration_pro"
)

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
			webhook_events,
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

// newTestApp builds the same Fiber app server.New produces, but with
// JWKS left nil. The auth middleware's nil-JWKS guard turns any
// Clerk-path attempt into 401, which is fine — these tests exercise
// the internal-bearer path. A JWKS-backed variant lands next to this
// helper when PR B3 adds webhooks + Clerk-path integration coverage.
func newTestApp(t *testing.T) *fiber.App {
	t.Helper()
	return newTestAppWithAI(t, "http://localhost:65535", "test-token")
}

// newTestAppWithAI is the same as newTestApp but plugs a custom
// AI Service base URL + token into deps.AI. Tests that need to
// exercise AI Service-bound handlers (POST /ai/insights/generate,
// /ai/chat, /ai/chat/stream) point this at an httptest.Server stub.
func newTestAppWithAI(t *testing.T, aiURL, aiToken string) *fiber.App {
	t.Helper()
	deps := &app.Deps{
		Cfg: &config.Config{
			Env:                  "test",
			CoreAPIInternalToken: testSharedInternalToken,
			AIServiceURL:         aiURL,
			AIServiceToken:       aiToken,
			// Webhook tests sign their payloads with these exact
			// values to exercise the verifiers end-to-end. Clerk
			// uses the prod `whsec_<base64>` shape — tests share the
			// same NewWebhook path production will use.
			ClerkWebhookSecret:  testClerkWebhookSecret,
			StripeWebhookSecret: testStripeWebhookSecret,
			StripePricePlus:     testStripePricePlus,
			StripePricePro:      testStripePricePro,
		},
		Log:      zerolog.New(io.Discard),
		Pool:     testPool,
		Cache:    testCache,
		UserRepo: users.NewRepo(testPool),
		JWKS:     nil, // deliberately: tests take the internal-auth path
		AI:       aiservice.New(aiURL, aiToken),
	}
	a, err := server.New(deps)
	if err != nil {
		t.Fatalf("server.New: %v", err)
	}
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
