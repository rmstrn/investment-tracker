//go:build integration

package handlers_test

import (
	"encoding/json"
	"strconv"
	"testing"
	"time"

	"github.com/gofiber/fiber/v3"
)

func TestGetPortfolioTax_HappyPath_Pro_US(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "pro")
	acc := seedAccountForTx(t, uid, "USD")

	// Buy 10 @ 100 last year, sell 10 @ 150 this year → +500 gain.
	_ = seedTransaction(t, uid, acc, "AAPL", "stock", "buy", "10", "100", "USD",
		time.Date(2025, 6, 1, 0, 0, 0, 0, time.UTC))
	_ = seedTransaction(t, uid, acc, "AAPL", "stock", "sell", "10", "150", "USD",
		time.Date(2026, 3, 1, 0, 0, 0, 0, time.UTC))
	// One dividend to populate dividends_received.
	_ = seedTransaction(t, uid, acc, "MSFT", "stock", "dividend", "5", "0.60", "USD",
		time.Date(2026, 4, 1, 0, 0, 0, 0, time.UTC))

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/tax?jurisdiction=US&year=2026",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)

	if out["jurisdiction"] != "US" || out["year"].(float64) != 2026 {
		t.Fatalf("envelope wrong: %v", out)
	}

	gains, _ := strconv.ParseFloat(out["realized_gains"].(string), 64)
	if gains < 499.99 || gains > 500.01 {
		t.Fatalf("realized_gains = %v, want ~500", gains)
	}
	div, _ := strconv.ParseFloat(out["dividends_received"].(string), 64)
	if div < 2.99 || div > 3.01 {
		t.Fatalf("dividends_received = %v, want ~3.0", div)
	}
	if out["withholding_tax"] != nil {
		t.Fatalf("withholding_tax = %v, want nil (TD-031)", out["withholding_tax"])
	}
	if resp.Header.Get("X-Withholding-Unavailable") != "true" {
		t.Fatalf("missing X-Withholding-Unavailable header")
	}
	// Legal disclaimer signal — UI must render "not tax advice" before totals.
	if resp.Header.Get("X-Tax-Advisory") != "mvp-estimate" {
		t.Fatalf("missing X-Tax-Advisory header — UI disclaimer compliance")
	}
	// US net = gains - losses = 500.
	taxable, _ := strconv.ParseFloat(out["estimated_taxable_income"].(string), 64)
	if taxable < 499.99 || taxable > 500.01 {
		t.Fatalf("US taxable = %v, want ~500", taxable)
	}

	txs := out["transactions"].([]any)
	if len(txs) != 2 { // 1 realized_gain + 1 dividend
		t.Fatalf("txs = %d, want 2", len(txs))
	}
}

func TestGetPortfolioTax_DE_SparerPauschbetrag(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "pro")
	acc := seedAccountForTx(t, uid, "EUR")

	_ = seedTransaction(t, uid, acc, "SAP.DE", "stock", "buy", "10", "100", "EUR",
		time.Date(2025, 6, 1, 0, 0, 0, 0, time.UTC))
	_ = seedTransaction(t, uid, acc, "SAP.DE", "stock", "sell", "10", "220", "EUR",
		time.Date(2026, 3, 1, 0, 0, 0, 0, time.UTC))

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/tax?jurisdiction=DE&year=2026",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	// Gain 1200 - 1000 allowance = 200 taxable.
	taxable, _ := strconv.ParseFloat(out["estimated_taxable_income"].(string), 64)
	if taxable < 199.99 || taxable > 200.01 {
		t.Fatalf("DE taxable = %v, want ~200 (1200 - 1000 Sparer-Pauschbetrag)", taxable)
	}
}

func TestGetPortfolioTax_FreeTier_403(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "free")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/tax?jurisdiction=US&year=2026",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}

func TestGetPortfolioTax_PlusTier_403(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "plus")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/tax?jurisdiction=US&year=2026",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("status = %d, body = %s (Plus must be 403 — Pro-only)", resp.StatusCode, body)
	}
}

func TestGetPortfolioTax_UnsupportedJurisdiction_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "pro")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/tax?jurisdiction=FR&year=2026",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	errMap := out["error"].(map[string]any)
	if errMap["code"] != "JURISDICTION_NOT_SUPPORTED" {
		t.Fatalf("code = %v, want JURISDICTION_NOT_SUPPORTED", errMap["code"])
	}
	details := errMap["details"].(map[string]any)
	supported := details["supported_jurisdictions"].([]any)
	if len(supported) != 2 {
		t.Fatalf("supported = %v, want [US, DE]", supported)
	}
}

func TestGetPortfolioTax_MissingYear_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "pro")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/tax?jurisdiction=US",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}

func TestGetPortfolioTax_InvalidYear_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "pro")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/tax?jurisdiction=US&year=1999",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s (year must be >= 2000)", resp.StatusCode, body)
	}
}

func TestGetPortfolioTax_EmptyState_200(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)
	uid := seedUser(t, "pro")

	resp, body := doJSON(t, a, fiber.MethodGet,
		"/portfolio/tax?jurisdiction=US&year=2026",
		uid.String(), testSharedInternalToken, nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, want 200 for empty ledger, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["realized_gains"].(string)[:1] != "0" {
		t.Fatalf("realized_gains = %v, want 0*", out["realized_gains"])
	}
	if len(out["transactions"].([]any)) != 0 {
		t.Fatalf("txs = %d, want 0", len(out["transactions"].([]any)))
	}
}
