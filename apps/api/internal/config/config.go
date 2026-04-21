// Package config holds runtime configuration loaded from environment variables.
//
// Secrets live in Doppler / Fly.io secrets in every non-local environment.
// `.env.example` at the repo root documents the full surface.
package config

import (
	"fmt"
	"time"

	"github.com/kelseyhightower/envconfig"
)

// Config is the full runtime configuration for the API process.
//
// Required fields without a default cause Load() to fail at startup rather
// than at first use — we want missing secrets to surface before the server
// starts serving traffic.
type Config struct {
	// ── Server ──────────────────────────────────────────────────────
	ListenAddr      string        `envconfig:"API_LISTEN_ADDR" default:":8090"`
	Env             string        `envconfig:"ENV" default:"development"`
	ShutdownTimeout time.Duration `envconfig:"SHUTDOWN_TIMEOUT" default:"15s"`
	// AllowedOrigins is the exact-match CORS allowlist fed to the
	// Fiber CORS middleware. envconfig splits the CSV env var on
	// commas; browsers reject wildcard origins paired with
	// AllowCredentials=true so we never ship `*` here. Populate via
	// Doppler in stg/prd with the public web origin (and any preview
	// host) — trailing slashes will fail the origin match.
	AllowedOrigins []string `envconfig:"ALLOWED_ORIGINS" default:"http://localhost:3000"`

	// ── Observability ───────────────────────────────────────────────
	LogLevel  string `envconfig:"LOG_LEVEL" default:"info"`
	LogFormat string `envconfig:"LOG_FORMAT" default:""` // "json" or "console"; auto-picked from Env when empty
	SentryDSN string `envconfig:"SENTRY_DSN"`

	// ── Data stores ─────────────────────────────────────────────────
	DatabaseURL string `envconfig:"DATABASE_URL" required:"true"`
	RedisURL    string `envconfig:"REDIS_URL" required:"true"`

	// ── Auth (Clerk) ────────────────────────────────────────────────
	ClerkSecretKey     string `envconfig:"CLERK_SECRET_KEY" required:"true"`
	ClerkJWKSURL       string `envconfig:"CLERK_JWKS_URL" required:"true"`
	ClerkWebhookSecret string `envconfig:"CLERK_WEBHOOK_SECRET" required:"true"`

	// ── Billing (Stripe) ────────────────────────────────────────────
	StripeSecretKey     string `envconfig:"STRIPE_SECRET_KEY" required:"true"`
	StripeWebhookSecret string `envconfig:"STRIPE_WEBHOOK_SECRET" required:"true"`
	// StripePricePlus / StripePricePro map the Stripe `price_id` on an
	// incoming subscription event to our internal tier string. Unset on
	// local dev and early staging — in that case the Stripe webhook
	// logs `stripe_webhook_unknown_price` at WARN and leaves
	// users.subscription_tier unchanged (fail-open). Populated from the
	// prod Stripe product catalog once billing goes live (TD-057).
	StripePricePlus string `envconfig:"STRIPE_PRICE_PLUS"`
	StripePricePro  string `envconfig:"STRIPE_PRICE_PRO"`

	// ── AI service ──────────────────────────────────────────────────
	// AIServiceToken: Core → AI direction (chat stream, insights, etc.)
	// CoreAPIInternalToken: AI → Core direction (tool-use reverse channel
	// that lets the AI Service query /portfolio and friends).
	AIServiceURL         string `envconfig:"AI_SERVICE_URL" default:"http://localhost:8000"`
	AIServiceToken       string `envconfig:"AI_SERVICE_TOKEN" required:"true"`
	CoreAPIInternalToken string `envconfig:"CORE_API_INTERNAL_TOKEN" required:"true"`

	// ── Market data ─────────────────────────────────────────────────
	PolygonAPIKey   string `envconfig:"POLYGON_API_KEY" required:"true"`
	CoinGeckoAPIKey string `envconfig:"COINGECKO_API_KEY"` // optional — free tier works without

	// ── Broker aggregation ──────────────────────────────────────────
	// TODO(TD-046): re-require when SnapTrade client lands. Today no
	// provider client consumes these; handler accounts_mutations.go
	// rejects aggregator/api account types at request time with a
	// 400. Marking required:"true" here boot-fails prod on empty
	// secrets for a feature that is not yet wired — silent bomb.
	SnapTradeClientID    string `envconfig:"SNAPTRADE_CLIENT_ID" default:""`
	SnapTradeConsumerKey string `envconfig:"SNAPTRADE_CONSUMER_KEY" default:""`

	// ── Encryption ──────────────────────────────────────────────────
	// 32-byte AES-256 key, base64-encoded. See internal/crypto/envelope.go.
	EncryptionKEK string `envconfig:"ENCRYPTION_KEK" required:"true"`
}

// IsProduction reports whether we are running in the prod environment.
func (c Config) IsProduction() bool { return c.Env == "production" }

// IsDevelopment reports whether we are running in local dev or tests.
func (c Config) IsDevelopment() bool { return c.Env == "development" || c.Env == "test" }

// Load reads configuration from the process environment.
//
// Missing required fields cause Load to return an error — the caller should
// log it and exit non-zero so orchestrators do not keep restarting a process
// that will never serve.
func Load() (*Config, error) {
	var cfg Config
	if err := envconfig.Process("", &cfg); err != nil {
		return nil, fmt.Errorf("config: %w", err)
	}
	return &cfg, nil
}
