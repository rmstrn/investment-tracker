//go:build integration

// Integration tests for POST /internal/ai/usage.
//
// Spins up a throwaway Postgres via testcontainers-go, applies the
// migrations with goose, seeds a user, and hits the real Fiber app.
// Docker is required; CI runs this target only on Linux runners.
//
// Run locally:
//
//	go test -tags integration ./internal/handlers/...
package handlers_test

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/jackc/pgx/v5/stdlib" // database/sql driver for goose
	"github.com/pressly/goose/v3"
	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog"
	"github.com/testcontainers/testcontainers-go/modules/postgres"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	"github.com/rmstrn/investment-tracker/apps/api/internal/config"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/handlers"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

const integrationInternalToken = "integration-shared-secret-placeholder-32b"

// testFixture holds everything a single test case uses. Built once per
// TestMain-wrapped suite; individual tests clean rows between runs via
// TRUNCATE rather than paying the container-start tax N times.
type testFixture struct {
	pool  *pgxpool.Pool
	cache *cache.Client
	app   *fiber.App
}

func setupFixture(t *testing.T) *testFixture {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	t.Cleanup(cancel)

	pgContainer, err := postgres.Run(ctx,
		"pgvector/pgvector:pg17",
		postgres.WithDatabase("investment_test"),
		postgres.WithUsername("test"),
		postgres.WithPassword("test"),
		postgres.BasicWaitStrategies(),
		postgres.WithSQLDriver("pgx"),
	)
	if err != nil {
		t.Fatalf("start postgres: %v", err)
	}
	t.Cleanup(func() { _ = pgContainer.Terminate(ctx) })

	// Enable pgcrypto for gen_random_uuid() (migration 006 relies on it).
	// Production boots it via tools/scripts/postgres-init.sql; in this
	// container we set it up inline.
	url, err := pgContainer.ConnectionString(ctx, "sslmode=disable")
	if err != nil {
		t.Fatalf("conn string: %v", err)
	}

	db, err := sql.Open("pgx", url)
	if err != nil {
		t.Fatalf("open db: %v", err)
	}
	if _, err := db.ExecContext(ctx, "CREATE EXTENSION IF NOT EXISTS pgcrypto"); err != nil {
		t.Fatalf("pgcrypto: %v", err)
	}
	if err := applyMigrations(db); err != nil {
		t.Fatalf("migrations: %v", err)
	}
	_ = db.Close()

	pool, err := pgxpool.New(ctx, url)
	if err != nil {
		t.Fatalf("pgx pool: %v", err)
	}
	t.Cleanup(pool.Close)

	mr := miniredis.RunT(t)
	ch := cache.NewFromRDB(redis.NewClient(&redis.Options{Addr: mr.Addr()}))

	log := zerolog.New(nil).Level(zerolog.Disabled)
	deps := &app.Deps{
		Cfg: &config.Config{
			Env:                  "test",
			CoreAPIInternalToken: integrationInternalToken,
		},
		Log:      log,
		Pool:     pool,
		Cache:    ch,
		UserRepo: users.NewRepo(pool),
	}

	// Build a minimal app by hand rather than via server.New — that path
	// hits Clerk JWKS, which these integration tests do not need.
	a := fiber.New()
	a.Use(middleware.RequestID())
	a.Use(middleware.Auth(middleware.AuthConfig{
		UserRepo:      deps.UserRepo,
		InternalToken: integrationInternalToken,
	}))
	a.Post("/internal/ai/usage",
		middleware.RequireInternalAuth(),
		handlers.InternalAIUsage(deps),
	)

	tlog := zerolog.New(nil).Level(zerolog.Disabled)
	deps.Log = tlog

	return &testFixture{pool: pool, cache: ch, app: a}
}

// applyMigrations runs goose up against the given DB using the real
// migration files. Resolves the path relative to this test file so it
// works regardless of CWD.
func applyMigrations(db *sql.DB) error {
	_, thisFile, _, _ := runtime.Caller(0)
	migrationsDir := filepath.Join(filepath.Dir(thisFile), "..", "..", "db", "migrations")
	goose.SetBaseFS(nil)
	if err := goose.SetDialect("postgres"); err != nil {
		return err
	}
	return goose.Up(db, migrationsDir)
}

func seedUser(t *testing.T, pool *pgxpool.Pool) uuid.UUID {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	_, err := pool.Exec(context.Background(), `
		INSERT INTO users (id, clerk_user_id, email)
		VALUES ($1, $2, $3)
	`, id, "clerk_"+id.String(), id.String()+"@example.com")
	if err != nil {
		t.Fatalf("seed user: %v", err)
	}
	return id
}

// TestMain gate — the integration suite needs Docker; skip if it's not
// available rather than failing.
func TestMain(m *testing.M) {
	// testcontainers-go itself returns a clean error if Docker is
	// missing; we just let that surface.
	m.Run()
}

// ------------------------------- tests -------------------------------

func TestInternalAIUsage_HappyPath(t *testing.T) {
	fx := setupFixture(t)
	uid := seedUser(t, fx.pool)

	body := map[string]any{
		"user_id":       uid.String(),
		"model":         "claude-sonnet-4-6",
		"input_tokens":  120,
		"output_tokens": 340,
		"cost_usd":      "0.012345",
	}
	resp := postJSON(t, fx.app, uid.String(), integrationInternalToken, body)
	if resp.StatusCode != fiber.StatusAccepted {
		t.Fatalf("status = %d, want 202", resp.StatusCode)
	}

	// Verify both writes landed.
	q := dbgen.New(fx.pool)
	var count int
	err := fx.pool.QueryRow(context.Background(),
		`SELECT count(*) FROM ai_usage WHERE user_id = $1`, uid,
	).Scan(&count)
	if err != nil || count != 1 {
		t.Fatalf("ai_usage count = %d (err=%v), want 1", count, err)
	}
	var counterVal int
	if err := fx.pool.QueryRow(context.Background(),
		`SELECT count FROM usage_counters WHERE user_id = $1 AND counter_type = $2`,
		uid, handlers.AIUsageCounterType,
	).Scan(&counterVal); err != nil {
		t.Fatalf("read counter: %v", err)
	}
	if counterVal != 1 {
		t.Fatalf("counter = %d, want 1 after single call", counterVal)
	}
	_ = q
}

func TestInternalAIUsage_ClerkJWTCallerRejected(t *testing.T) {
	// "Bearer someJWT" where the bearer is not the internal token:
	// falls through to Clerk branch (JWKS nil in fixture) and 401.
	fx := setupFixture(t)
	uid := seedUser(t, fx.pool)
	resp := postJSONWithToken(t, fx.app, uid.String(), "totally-not-the-internal-token",
		map[string]any{
			"user_id": uid.String(), "model": "claude-sonnet-4-6",
			"input_tokens": 1, "output_tokens": 1, "cost_usd": "0.001",
		})
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401", resp.StatusCode)
	}
}

func TestInternalAIUsage_UserIDHeaderMismatch(t *testing.T) {
	fx := setupFixture(t)
	uid := seedUser(t, fx.pool)
	other := uuid.Must(uuid.NewV7()) // well-formed but different

	body := map[string]any{
		"user_id":       other.String(),
		"model":         "claude-sonnet-4-6",
		"input_tokens":  1,
		"output_tokens": 1,
		"cost_usd":      "0.001",
	}
	resp := postJSON(t, fx.app, uid.String(), integrationInternalToken, body)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
}

func TestInternalAIUsage_DuplicateDeliveryWritesTwice(t *testing.T) {
	// Fire-and-forget semantics — MVP explicitly allows this. Verify the
	// handler does not error, and that both rows land plus the counter
	// reaches 2.
	fx := setupFixture(t)
	uid := seedUser(t, fx.pool)

	body := map[string]any{
		"user_id":       uid.String(),
		"model":         "claude-haiku-4-5-20251001",
		"input_tokens":  10,
		"output_tokens": 20,
		"cost_usd":      "0.000100",
	}
	for i := 0; i < 2; i++ {
		resp := postJSON(t, fx.app, uid.String(), integrationInternalToken, body)
		if resp.StatusCode != fiber.StatusAccepted {
			t.Fatalf("call %d status = %d, want 202", i, resp.StatusCode)
		}
	}

	var rowCount int
	if err := fx.pool.QueryRow(context.Background(),
		`SELECT count(*) FROM ai_usage WHERE user_id = $1`, uid,
	).Scan(&rowCount); err != nil {
		t.Fatalf("count: %v", err)
	}
	if rowCount != 2 {
		t.Fatalf("ai_usage rows = %d, want 2", rowCount)
	}

	var counterCount int
	if err := fx.pool.QueryRow(context.Background(),
		`SELECT count FROM usage_counters WHERE user_id = $1 AND counter_type = $2`,
		uid, handlers.AIUsageCounterType,
	).Scan(&counterCount); err != nil {
		t.Fatalf("counter: %v", err)
	}
	if counterCount != 2 {
		t.Fatalf("counter = %d, want 2", counterCount)
	}
}

func TestInternalAIUsage_NonExistentUserFailsAtAuth(t *testing.T) {
	// Valid token + well-formed UUID in X-User-Id but not seeded → the
	// auth middleware returns 401 before the handler ever runs.
	fx := setupFixture(t)
	ghost := uuid.Must(uuid.NewV7()).String()
	resp := postJSON(t, fx.app, ghost, integrationInternalToken, map[string]any{
		"user_id": ghost, "model": "claude-sonnet-4-6",
		"input_tokens": 1, "output_tokens": 1, "cost_usd": "0.001",
	})
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401 (unknown user)", resp.StatusCode)
	}
}

// --------------------------- tiny helpers ---------------------------

func postJSON(t *testing.T, a *fiber.App, xUserID, token string, body map[string]any) *http.Response {
	return postJSONWithToken(t, a, xUserID, token, body)
}

func postJSONWithToken(t *testing.T, a *fiber.App, xUserID, token string, body map[string]any) *http.Response {
	t.Helper()
	raw, _ := json.Marshal(body)
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/internal/ai/usage",
		strings.NewReader(string(raw)))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("X-User-Id", xUserID)

	resp, err := a.Test(req, fiber.TestConfig{Timeout: 10 * time.Second})
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	return resp
}

// used indirectly in tests that read counters as pgtype.Date — kept for
// reuse by PR B2's /me/usage tests.
func todayPGDate() pgtype.Date {
	return pgtype.Date{Time: time.Now().UTC(), Valid: true}
}
