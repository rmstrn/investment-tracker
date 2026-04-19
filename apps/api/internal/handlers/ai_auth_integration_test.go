//go:build integration

// Cross-handler integration covering the AI-service auth path: every
// public GET the AI Service relies on, called with a Bearer
// CORE_API_INTERNAL_TOKEN + X-User-Id header, must return 200 and
// non-empty JSON for a minimally-seeded Plus-tier user. If this test
// goes red, the AI Service tool-calling flow is broken.

package handlers_test

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

// seedAIReadFixture inserts the minimum rows every read endpoint needs:
// one Plus-tier user, one account, two positions, three transactions
// (incl. one dividend), one portfolio snapshot, and one price so the
// /market/quote probe hits the DB cleanly.
func seedAIReadFixture(t *testing.T) (userID uuid.UUID) {
	t.Helper()
	ctx := context.Background()

	// Pro tier so the fixture lights up every Plus-gated AND Pro-gated
	// endpoint in one table. Plus-tier handlers (performance, dividends,
	// ai/*) pass transitively because Pro >= Plus; Pro-only ones
	// (analytics, tax) unblock without a second fixture.
	userID = seedUser(t, "pro")
	accID := seedAccountForTx(t, userID, "USD")

	// Two positions. No FX needed — everything USD.
	for i, sym := range []string{"AAPL", "MSFT"} {
		posID := uuid.Must(uuid.NewV7())
		if _, err := testPool.Exec(ctx, `
			INSERT INTO positions (id, user_id, account_id, symbol, asset_type, quantity, avg_cost, currency)
			VALUES ($1, $2, $3, $4, 'stock', $5, $6, 'USD')
		`, posID, userID, accID, sym,
			decimal.NewFromInt(int64(10*(i+1))),
			decimal.NewFromInt(int64(100*(i+1)))); err != nil {
			t.Fatalf("seed position %s: %v", sym, err)
		}
	}

	// Three transactions: 2 buys + 1 dividend. The dividend drives the
	// /portfolio/dividends assertion.
	base := time.Now().UTC().Add(-24 * time.Hour)
	_ = seedTransaction(t, userID, accID, "AAPL", "stock", "buy", "10", "100", "USD", base)
	_ = seedTransaction(t, userID, accID, "MSFT", "stock", "buy", "20", "200", "USD", base.Add(1*time.Hour))
	_ = seedTransaction(t, userID, accID, "AAPL", "stock", "dividend", "10", "0.25", "USD", base.Add(2*time.Hour))

	// One snapshot so /portfolio/performance returns a populated series.
	seedSnapshot(t, userID, time.Now().UTC().AddDate(0, 0, -10), "1000", "1000")
	seedSnapshot(t, userID, time.Now().UTC(), "1100", "1000")

	// One price so /market/quote can respond 200 without hitting a miss.
	seedPrice(t, "AAPL", "stock", "USD", "175.25", time.Now().UTC())

	return userID
}

func TestAIReadEndpoints_InternalAuth_AllOK(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedAIReadFixture(t)

	// Every read endpoint the AI Service calls through tool-use. Each is
	// asserted with internal-auth headers only (no Clerk JWT path); a
	// green pass means the middleware resolves X-User-Id to the seeded
	// user and handlers see them as authenticated.
	endpoints := []struct {
		name string
		path string
	}{
		// B2a — AI-facing reads.
		{"portfolio", "/portfolio"},
		{"positions", "/positions"},
		{"transactions", "/transactions"},
		{"performance", "/portfolio/performance?period=1m&benchmark=SPX"},
		{"quote", "/market/quote?symbol=AAPL&asset_type=stock"},
		{"dividends", "/portfolio/dividends"},
		// B2b — profile + usage + accounts context the AI Service may
		// read for proactive quota gate + persona-aware responses.
		{"me", "/me"},
		{"me_usage", "/me/usage"},
		{"accounts", "/accounts"},
		// B2b — portfolio + market reads for richer tool-use.
		{"history", "/portfolio/history?period=1m"},
		{"allocation", "/portfolio/allocation"},
		{"performance_compare", "/portfolio/performance/compare?period=1m&benchmarks=SPX"},
		{"market_search", "/market/search?q=AAPL"},
		{"fx_rates", "/fx_rates"},
		{"prices", "/prices?symbols=AAPL"},
		// B2b — AI memory: conversations + insights read-through.
		{"ai_conversations", "/ai/conversations"},
		{"ai_insights", "/ai/insights"},
		// B2c — Pro-only quant + tax reads.
		{"analytics", "/portfolio/analytics?period=3m"},
		{"tax", "/portfolio/tax?jurisdiction=US&year=2026"},
		// B3-i — notification-center reads (tier-independent).
		{"notifications", "/notifications"},
		{"unread_count", "/notifications/unread_count"},
	}

	for _, ep := range endpoints {
		t.Run(ep.name, func(t *testing.T) {
			resp, body := doJSON(t, a, fiber.MethodGet, ep.path,
				uid.String(), testSharedInternalToken, nil)
			if resp.StatusCode != http.StatusOK {
				t.Fatalf("%s: status = %d, body = %s", ep.path, resp.StatusCode, body)
			}
			if len(body) == 0 {
				t.Fatalf("%s: empty body", ep.path)
			}
			// Every 2xx response is application/json from this API.
			if ct := resp.Header.Get("Content-Type"); !strings.HasPrefix(ct, "application/json") {
				t.Fatalf("%s: Content-Type = %q", ep.path, ct)
			}
			var parsed map[string]any
			if err := json.Unmarshal(body, &parsed); err != nil {
				t.Fatalf("%s: decode: %v body=%s", ep.path, err, body)
			}
		})
	}
}

// TestAIReadEndpoints_MissingXUserID_Returns401 fences the positive path
// above: the internal-auth middleware must refuse a Bearer-only request
// without X-User-Id even when the token is valid.
func TestAIReadEndpoints_MissingXUserID_Returns401(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	_ = seedAIReadFixture(t)

	resp, body := doJSON(t, a, fiber.MethodGet, "/portfolio",
		"", testSharedInternalToken, nil)
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("status = %d, want 401, body = %s", resp.StatusCode, body)
	}
}

// TestAIReadEndpoints_UnknownUser_Returns401 guards against the
// X-User-Id header naming a user that does not exist. The middleware
// should reject this rather than have the handler 500 on a nil user.
func TestAIReadEndpoints_UnknownUser_Returns401(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	phantom := uuid.Must(uuid.NewV7())
	resp, body := doJSON(t, a, fiber.MethodGet, "/portfolio",
		phantom.String(), testSharedInternalToken, nil)
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("status = %d, want 401 for phantom user, body = %s", resp.StatusCode, body)
	}
}

// nice-to-have: the fixture shape is stable enough that a smoke
// assertion on /transactions body is cheap insurance against silent
// seed drift. Not tested elsewhere.
func TestAIReadEndpoints_TransactionsFixtureShape(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedAIReadFixture(t)

	resp, body := doJSON(t, a, fiber.MethodGet, "/transactions",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}

	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 3 {
		t.Fatalf("fixture drift: %d transactions, want 3", len(data))
	}
	// At least one of the three is the dividend row.
	var dividends int
	for _, it := range data {
		if it.(map[string]any)["transaction_type"] == "dividend" {
			dividends++
		}
	}
	if dividends != 1 {
		t.Fatalf("fixture drift: %d dividend rows, want 1", dividends)
	}
}
