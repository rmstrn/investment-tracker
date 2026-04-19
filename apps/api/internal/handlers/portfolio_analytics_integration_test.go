//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
)

func TestGetPortfolioAnalytics_HappyPath_Pro(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "pro")

	today := time.Now().UTC()
	// Five daily snapshots so Sharpe/Sortino/Vol/MaxDD all compute.
	// 1000 → 1020 → 980 → 1050 → 1030 → 1080
	for i, v := range []string{"1000", "1020", "980", "1050", "1030", "1080"} {
		seedSnapshot(t, uid, today.AddDate(0, 0, -5+i), v, "1000")
	}

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/analytics?period=3m",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)

	if out["period"] != "3m" {
		t.Fatalf("period = %v", out["period"])
	}
	if _, ok := out["sharpe"].(float64); !ok {
		t.Fatalf("sharpe missing / wrong type: %v", out["sharpe"])
	}
	if _, ok := out["volatility"].(float64); !ok {
		t.Fatalf("volatility missing: %v", out["volatility"])
	}

	maxDD := out["max_drawdown"].(float64)
	if maxDD >= 0 {
		t.Fatalf("max_drawdown = %v, expected signed negative", maxDD)
	}

	uw := out["underwater_series"].([]any)
	if len(uw) != 6 {
		t.Fatalf("underwater len = %d, want 6 (daily at 3m)", len(uw))
	}

	if out["factor_exposure"] != nil || out["style_box"] != nil || out["correlation_matrix"] != nil {
		t.Fatalf("expected null factor/style/corr, got %v / %v / %v",
			out["factor_exposure"], out["style_box"], out["correlation_matrix"])
	}
	if resp.Header.Get("X-Analytics-Partial") != "true" {
		t.Fatalf("missing X-Analytics-Partial header")
	}
}

func TestGetPortfolioAnalytics_FreeTier_403(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/analytics?period=1y",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["error"].(map[string]any)["code"] != "FEATURE_LOCKED" {
		t.Fatalf("code = %v", out["error"])
	}
}

func TestGetPortfolioAnalytics_PlusTier_403(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	// Plus is blocked per spec (Pro-only), unlike /portfolio/performance
	// which Plus unlocks.
	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/analytics?period=1y",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}

func TestGetPortfolioAnalytics_EmptyState_200(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "pro")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/analytics?period=1y",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, want 200 (empty state), body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["sharpe"].(float64) != 0 {
		t.Fatalf("sharpe = %v, want 0 on empty", out["sharpe"])
	}
	if len(out["underwater_series"].([]any)) != 0 {
		t.Fatalf("underwater len = %d, want 0", len(out["underwater_series"].([]any)))
	}
}

func TestGetPortfolioAnalytics_InvalidPeriod_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "pro")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/analytics?period=2y",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}

func TestGetPortfolioAnalytics_DefaultPeriodIs1y(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "pro")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/analytics",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d", resp.StatusCode)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["period"] != "1y" {
		t.Fatalf("default period = %v, want 1y", out["period"])
	}
}
