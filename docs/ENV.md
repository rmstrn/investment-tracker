# Environment variable registry

This is the authoritative list of environment variables across the
investment-tracker backend stack. Adding, renaming, or removing any
secret or config var goes here first; the infrastructure declares
them via `ops/secrets.keys.yaml` and the language-specific config
modules (`apps/api/internal/config/config.go`,
`apps/ai/src/ai_service/config.py`) read them per convention.

Sprint C 3b established this file as the single source of truth so
the historic drift between Go (`CoreAPIInternalToken`) / env
(`CORE_API_INTERNAL_TOKEN`) / Python (`core_api_internal_token`) no
longer forces the reader to chase three files to answer "what is
this value?".

## Naming conventions

**Env var**: `UPPER_SNAKE_CASE`. Always. This is the wire contract
with Doppler, Fly.io secrets, GitHub Actions, `.env*` files, and
container orchestrators — nobody else knows about our struct-field
names.

**Go field**: `PascalCase`, matching the env var when capitalized
(`CORE_API_INTERNAL_TOKEN` ↔ `CoreAPIInternalToken`). Declared with
`envconfig:"CORE_API_INTERNAL_TOKEN"` tag. The `envconfig` library
derives the env name from the field name when no tag is present,
but an explicit tag is required for every required secret so the
wire name is greppable.

**Python field**: `lower_snake_case`, matching the env var when
lower-cased (`CORE_API_INTERNAL_TOKEN` ↔ `core_api_internal_token`).
Declared with `Field(alias="CORE_API_INTERNAL_TOKEN")`, or
`Field(validation_alias=AliasChoices(...))` for vars with legacy
aliases.

These three casings are *not drift* — each is idiomatic per
language. The drift this registry prevents is the (historical,
now-fixed) mismatch where Core API's `AI_SERVICE_TOKEN` and AI
Service's `INTERNAL_API_TOKEN` were ops-coupled but lexically
unrelated; the CI could not catch a rotation that updated one but
not the other.

## Registry

Grouped by concern. Secrets marked **[secret]** must be provisioned
via Doppler / Fly secrets in staging + prod; plain config values
(ports, URLs, log level) live in `.env.example` / fly.toml.

### Server

| Env var | Go field | Python field | Default | Notes |
|---------|----------|--------------|---------|-------|
| `ENV` | `Env` | — | `development` | `development` / `test` / `staging` / `production` |
| `API_LISTEN_ADDR` | `ListenAddr` | — | `:8090` | Core API bind address |
| `AI_LISTEN_HOST` | — | `host` | `0.0.0.0` | AI Service bind |
| `AI_LISTEN_PORT` | — | `port` | `8000` | AI Service bind |
| `ENVIRONMENT` | — | `environment` | `development` | AI Service equivalent of `ENV` |
| `SHUTDOWN_TIMEOUT` | `ShutdownTimeout` | — | `15s` | Graceful drain window |
| `ALLOWED_ORIGINS` | `AllowedOrigins` | — | `http://localhost:3000` | CORS allowlist, CSV |

### Observability

| Env var | Go field | Python field | Default | Notes |
|---------|----------|--------------|---------|-------|
| `LOG_LEVEL` | `LogLevel` | `log_level` | `info` | Shared contract |
| `LOG_FORMAT` | `LogFormat` | — | `""` | `json` / `console`; auto-pick from env when blank |
| `SENTRY_DSN` **[secret]** | `SentryDSN` | `sentry_dsn` | empty | No DSN = Sentry disabled (OK for dev) |
| `SENTRY_TRACES_SAMPLE_RATE` | — | `sentry_traces_sample_rate` | `0.1` | AI Service only; Go has its own tuning TBD |
| `POSTHOG_API_KEY` **[secret]** | — | `posthog_api_key` | empty | AI Service only |
| `POSTHOG_HOST` | — | `posthog_host` | `https://us.i.posthog.com` | |

### Data stores

| Env var | Go field | Python field | Default | Notes |
|---------|----------|--------------|---------|-------|
| `DATABASE_URL` **[secret]** | `DatabaseURL` | — | dev-only default | Shared with AI Service |
| `REDIS_URL` **[secret]** | `RedisURL` | — | dev-only default | Rate-limit bucket + idempotency locks |

### Auth (Clerk)

| Env var | Go field | Python field | Default | Notes |
|---------|----------|--------------|---------|-------|
| `CLERK_SECRET_KEY` **[secret]** | `ClerkSecretKey` | — | required | Clerk SDK init |
| `CLERK_JWKS_URL` **[secret]** | `ClerkJWKSURL` | — | required | JWT verification key set |
| `CLERK_WEBHOOK_SECRET` **[secret]** | `ClerkWebhookSecret` | — | required | svix-style `whsec_*` |

### Billing (Stripe)

| Env var | Go field | Python field | Default | Notes |
|---------|----------|--------------|---------|-------|
| `STRIPE_SECRET_KEY` **[secret]** | `StripeSecretKey` | — | required | `sk_*` |
| `STRIPE_WEBHOOK_SECRET` **[secret]** | `StripeWebhookSecret` | — | required | `whsec_*` |
| `STRIPE_PRICE_PLUS` | `StripePricePlus` | — | empty (OK) | `price_*` id; blank → warn-on-unknown-price path |
| `STRIPE_PRICE_PRO` | `StripePricePro` | — | empty (OK) | `price_*` id |

### Cross-service auth (Core API ↔ AI Service)

Two separate bearer tokens, one per direction:

| Env var | Purpose | Go field | Python field | Notes |
|---------|---------|----------|--------------|-------|
| `AI_SERVICE_URL` | Core → AI base URL | `AIServiceURL` | — | |
| `AI_SERVICE_TOKEN` **[secret]** | Core → AI bearer | `AIServiceToken` | `internal_api_token` | Python accepts legacy `INTERNAL_API_TOKEN` alias too — see § deprecated. |
| `CORE_API_URL` | AI → Core base URL | — | `core_api_url` | |
| `CORE_API_INTERNAL_TOKEN` **[secret]** | AI → Core bearer (reverse channel) | `CoreAPIInternalToken` | `core_api_internal_token` | Both sides agree on env name + meaning since day one. |

### Market data

| Env var | Go field | Python field | Default | Notes |
|---------|----------|--------------|---------|-------|
| `POLYGON_API_KEY` **[secret]** | `PolygonAPIKey` | — | required | Stock prices |
| `COINGECKO_API_KEY` | `CoinGeckoAPIKey` | — | empty (OK) | Free tier works without |

### Broker aggregation (TD-046)

Relaxed to `default:""` in Sprint A — provider clients not yet
wired, so prod deploy must not boot-fail on empty values. Re-require
when TD-046 lands.

| Env var | Go field | Python field | Default | Notes |
|---------|----------|--------------|---------|-------|
| `SNAPTRADE_CLIENT_ID` **[secret]** | `SnapTradeClientID` | — | empty (OK today) | TD-046 |
| `SNAPTRADE_CONSUMER_KEY` **[secret]** | `SnapTradeConsumerKey` | — | empty (OK today) | TD-046 |

### Encryption

| Env var | Go field | Python field | Default | Notes |
|---------|----------|--------------|---------|-------|
| `ENCRYPTION_KEK` **[secret]** | `EncryptionKEK` | — | required | 32-byte AES-256, base64. Dev only — prod will move to KMS (TD-060) |

### LLM (AI Service only)

| Env var | Python field | Default | Notes |
|---------|--------------|---------|-------|
| `ANTHROPIC_API_KEY` **[secret]** | `anthropic_api_key` | empty | Required in prod |
| `ANTHROPIC_MODEL_SONNET` | `anthropic_model_sonnet` | `claude-sonnet-4-6` | Project-pinned |
| `ANTHROPIC_MODEL_HAIKU` | `anthropic_model_haiku` | `claude-haiku-4-5-20251001` | |
| `ANTHROPIC_MODEL_OPUS` | `anthropic_model_opus` | `claude-opus-4-6` | |
| `ANTHROPIC_MAX_CONCURRENT` | `anthropic_max_concurrent` | `10` | Per-process semaphore |
| `ANTHROPIC_TIMEOUT_SECONDS` | `anthropic_timeout_seconds` | `60.0` | |
| `ANTHROPIC_MAX_RETRIES` | `anthropic_max_retries` | `2` | |

## Deprecated names (backwards-compat window)

Old names still accepted at runtime with no warning; scheduled for
removal post-alpha. Update Doppler / `.env*` to the canonical name
before then.

- **`INTERNAL_API_TOKEN`** → `AI_SERVICE_TOKEN`. AI Service
  `internal_api_token` field reads both via
  `validation_alias=AliasChoices("AI_SERVICE_TOKEN",
  "INTERNAL_API_TOKEN")`. `AI_SERVICE_TOKEN` wins when both are
  set. Remove alias when no remaining env carries only the legacy
  name.

## Adding a new env var

1. Decide the canonical `UPPER_SNAKE_CASE` name and document it
   in this registry (commit **first**, before the code change, so
   reviewers see intent).
2. Add it to `ops/secrets.keys.yaml` if secret-backed.
3. Wire it into whichever `config` module reads it
   (`apps/api/internal/config/config.go`,
   `apps/ai/src/ai_service/config.py`). Follow the
   PascalCase / lower_snake_case field conventions above.
4. Add a line to `apps/api/.env.example` and/or
   `apps/ai/.env.example` with the default (or a `REPLACE_ME`
   stub for secrets).
5. Never ship empty-string defaults for secrets unless the field
   is documented as optional (e.g. `POSTHOG_API_KEY`).

## See also

- `ops/secrets.keys.yaml` — the infra-side required-secret manifest
- `apps/api/.env.example`, `apps/ai/.env.example` — copy-paste starters for local dev
- `docs/BACKEND_HEALTH_2026-04-21.md` § 5 smell #11 — original write-up of the InternalToken drift
