//go:build integration

package handlers_test

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
)

func TestComparePerformance_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	today := time.Now().UTC()
	seedSnapshot(t, uid, today.AddDate(0, 0, -20), "1000", "1000")
	seedSnapshot(t, uid, today.AddDate(0, 0, -10), "1100", "1000")
	seedSnapshot(t, uid, today, "1200", "1000")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/performance/compare?period=1m&benchmarks=SPX,QQQ",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)

	if out["period"] != "1m" {
		t.Fatalf("period = %v", out["period"])
	}
	pr := out["portfolio_return_percent"].(float64)
	if pr < 0.19 || pr > 0.21 {
		t.Fatalf("portfolio_return_percent = %v, want ~0.20", pr)
	}
	benchmarks := out["benchmarks"].([]any)
	if len(benchmarks) != 2 {
		t.Fatalf("benchmarks len = %d, want 2", len(benchmarks))
	}
	for _, b := range benchmarks {
		bm := b.(map[string]any)
		if bm["benchmark_return_percent"] != nil {
			t.Fatalf("expected null benchmark return until TD-020, got %v", bm["benchmark_return_percent"])
		}
		if bm["alpha_percent"] != nil {
			t.Fatalf("expected null alpha until TD-020, got %v", bm["alpha_percent"])
		}
	}
	if resp.Header.Get("X-Benchmark-Unavailable") != "true" {
		t.Fatalf("missing X-Benchmark-Unavailable header")
	}
	stats := out["stats"].(map[string]any)
	if _, ok := stats["avg_return_percent"]; !ok {
		t.Fatalf("missing avg_return_percent in stats")
	}
}

func TestComparePerformance_FreeTier_403(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/performance/compare?period=1m&benchmarks=SPX",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("status = %d, want 403, body = %s", resp.StatusCode, body)
	}
}

func TestComparePerformance_TooManyBenchmarks_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/performance/compare?period=1m&benchmarks=SPX,QQQ,ACWI,BTC",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}

func TestComparePerformance_MissingBenchmarks_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/performance/compare?period=1m",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}
