package config

import (
	"testing"
)

// Minimal required-secret surface to satisfy envconfig.Process in a test
// that wants to assert the *non-required* fields default cleanly. Kept as
// a package-level fixture so individual tests stay readable.
var requiredEnv = map[string]string{
	"DATABASE_URL":            "postgres://t/t",
	"REDIS_URL":               "redis://t",
	"CLERK_SECRET_KEY":        "sk_test_x",
	"CLERK_JWKS_URL":          "https://clerk.test/.well-known/jwks.json",
	"CLERK_WEBHOOK_SECRET":    "whsec_x",
	"STRIPE_SECRET_KEY":       "sk_test_stripe",
	"STRIPE_WEBHOOK_SECRET":   "whsec_stripe",
	"AI_SERVICE_TOKEN":        "t",
	"CORE_API_INTERNAL_TOKEN": "t",
	"POLYGON_API_KEY":         "t",
	"ENCRYPTION_KEK":          "base64fakekek",
}

// TestLoad_SnapTradeOptional is the regression test for the silent bomb
// closed in the 2026-04-21 hygiene sprint: marking SNAPTRADE_CLIENT_ID /
// SNAPTRADE_CONSUMER_KEY as `required:"true"` caused envconfig.Process to
// fail at boot on every env where TD-046 broker integrations are not yet
// provisioned (i.e. every env today). We want Load to succeed when those
// two vars are unset.
func TestLoad_SnapTradeOptional(t *testing.T) {
	for k, v := range requiredEnv {
		t.Setenv(k, v)
	}
	// Deliberately do NOT set SNAPTRADE_CLIENT_ID / SNAPTRADE_CONSUMER_KEY.

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() errored with SnapTrade unset: %v", err)
	}
	if cfg.SnapTradeClientID != "" {
		t.Errorf("SnapTradeClientID = %q, want empty", cfg.SnapTradeClientID)
	}
	if cfg.SnapTradeConsumerKey != "" {
		t.Errorf("SnapTradeConsumerKey = %q, want empty", cfg.SnapTradeConsumerKey)
	}
}
