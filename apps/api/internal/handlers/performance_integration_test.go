//go:build integration

package handlers_test

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/shopspring/decimal"
)

func seedSnapshot(t *testing.T, userID uuid.UUID, date time.Time, totalValue, totalCost string) {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO portfolio_snapshots (
			id, user_id, snapshot_date, base_currency,
			total_value_base, total_cost_base,
			allocation, by_asset_type, by_currency
		) VALUES ($1, $2, $3, 'USD', $4, $5, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb)
	`, id, userID, pgtype.Date{Time: date, Valid: true},
		decimal.RequireFromString(totalValue), decimal.RequireFromString(totalCost))
	if err != nil {
		t.Fatalf("seed snapshot: %v", err)
	}
}

func TestGetPerformance_HappyPath_Plus(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	today := time.Now().UTC()
	seedSnapshot(t, uid, today.AddDate(0, 0, -20), "1000", "1000")
	seedSnapshot(t, uid, today.AddDate(0, 0, -10), "1100", "1000")
	seedSnapshot(t, uid, today, "1200", "1000")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/performance?period=1m&benchmark=SPX",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	if err := json.Unmarshal(body, &out); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if out["period"] != "1m" || out["benchmark"] != "SPX" {
		t.Fatalf("echoed params wrong: %v", out)
	}
	// portfolio_return_percent = (1200-1000)/1000 = 0.20 over the period.
	pr := out["portfolio_return_percent"].(float64)
	if pr < 0.19 || pr > 0.21 {
		t.Fatalf("portfolio_return_percent = %v, want ~0.20", pr)
	}
	if out["benchmark_return_percent"] != nil {
		t.Fatalf("benchmark_return_percent = %v, want nil (TD-020)", out["benchmark_return_percent"])
	}
	if out["alpha_percent"] != nil {
		t.Fatalf("alpha_percent = %v, want nil (TD-020)", out["alpha_percent"])
	}
	series := out["series"].([]any)
	if len(series) != 3 {
		t.Fatalf("len(series) = %d, want 3", len(series))
	}
	if resp.Header.Get("X-Benchmark-Unavailable") != "true" {
		t.Fatalf("missing X-Benchmark-Unavailable header")
	}
}

func TestGetPerformance_FreeTier_Returns403(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/performance?period=1m&benchmark=SPX",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("status = %d, want 403, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	errMap := out["error"].(map[string]any)
	if errMap["code"] != "FEATURE_LOCKED" {
		t.Fatalf("code = %v, want FEATURE_LOCKED", errMap["code"])
	}
}

func TestGetPerformance_EmptyState_Returns200(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/performance?period=1m&benchmark=SPX",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, want 200 (empty state), body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["portfolio_return_percent"].(float64) != 0.0 {
		t.Fatalf("portfolio_return_percent = %v, want 0.0 for user with no snapshots", out["portfolio_return_percent"])
	}
	if len(out["series"].([]any)) != 0 {
		t.Fatalf("len(series) = %d, want 0 for empty user", len(out["series"].([]any)))
	}
}

func TestGetPerformance_InvalidPeriod_Returns400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/performance?period=1w&benchmark=SPX",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400, body = %s", resp.StatusCode, body)
	}
}

func TestGetPerformance_InvalidBenchmark_Returns400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/performance?period=1m&benchmark=NDX",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400, body = %s", resp.StatusCode, body)
	}
}
