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

func seedSnapshotWithAllocation(t *testing.T, userID uuid.UUID, date time.Time, alloc, byAsset, byCur string) {
	t.Helper()
	id := uuid.Must(uuid.NewV7())
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO portfolio_snapshots (
			id, user_id, snapshot_date, base_currency,
			total_value_base, total_cost_base,
			allocation, by_asset_type, by_currency
		) VALUES ($1, $2, $3, 'USD', $4, $5, $6::jsonb, $7::jsonb, $8::jsonb)
	`, id, userID, pgtype.Date{Time: date, Valid: true},
		decimal.NewFromInt(1000), decimal.NewFromInt(1000),
		alloc, byAsset, byCur)
	if err != nil {
		t.Fatalf("seed snapshot: %v", err)
	}
}

func TestGetPortfolioAllocation_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	seedSnapshotWithAllocation(t, uid, time.Now().UTC(),
		`{"AAPL":0.6,"BTC":0.4}`,
		`{"stock":0.6,"crypto":0.4}`,
		`{"USD":1.0}`)

	resp, body := doJSON(t, a, fiber.MethodGet, "/portfolio/allocation",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	bySymbol := out["by_symbol"].(map[string]any)
	if bySymbol["AAPL"].(float64) != 0.6 {
		t.Fatalf("AAPL fraction = %v", bySymbol["AAPL"])
	}
	if out["by_currency"].(map[string]any)["USD"].(float64) != 1.0 {
		t.Fatalf("USD fraction wrong")
	}
}

func TestGetPortfolioAllocation_EmptyState(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet, "/portfolio/allocation",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d (empty must be 200)", resp.StatusCode)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	for _, k := range []string{"by_symbol", "by_asset_type", "by_currency"} {
		m := out[k].(map[string]any)
		if len(m) != 0 {
			t.Fatalf("%s = %v, want empty", k, m)
		}
	}
}
