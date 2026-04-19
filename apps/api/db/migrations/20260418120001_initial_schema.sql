-- +goose Up
-- +goose StatementBegin

-- =====================================================================
-- Investment Tracker — initial schema
-- Source of truth: docs/02_ARCHITECTURE.md + tools/openapi/openapi.yaml
--
-- Conventions
--   * All UUIDs are generated app-side as UUIDv7 (Go: uuid.NewV7(),
--     Python: uuid_utils.uuid7()). No DEFAULT gen_random_uuid() — we want
--     monotonic-by-time ids and single generation policy.
--   * Money columns use NUMERIC(30, 10) — 20 integer digits, 10 fractional.
--     Enough for every mainstream asset including 18-decimal tokens
--     rounded to 10dp at the edge.
--   * Timestamps are TIMESTAMPTZ in UTC. created_at/updated_at default to
--     now(); updated_at is bumped by the application (no trigger — keeps
--     migrations portable).
--   * Soft delete lives on accounts.deleted_at. Transactions never
--     soft-delete — manual rows are edited in place, API rows are
--     immutable.
-- =====================================================================

-- ---------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id                    UUID PRIMARY KEY,
    clerk_user_id         TEXT NOT NULL,
    email                 TEXT NOT NULL,
    display_currency      CHAR(3) NOT NULL DEFAULT 'USD',
    locale                TEXT NOT NULL DEFAULT 'en',
    subscription_tier     TEXT NOT NULL DEFAULT 'free'
                            CHECK (subscription_tier IN ('free','plus','pro')),
    stripe_customer_id    TEXT,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT users_clerk_user_id_key UNIQUE (clerk_user_id)
);

-- ---------------------------------------------------------------------
-- accounts
-- ---------------------------------------------------------------------
CREATE TABLE accounts (
    id                       UUID PRIMARY KEY,
    user_id                  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    broker_name              TEXT NOT NULL,
    display_name             TEXT NOT NULL,
    account_type             TEXT NOT NULL
                               CHECK (account_type IN ('broker','crypto','manual')),
    connection_type          TEXT NOT NULL
                               CHECK (connection_type IN ('api','aggregator','import','manual')),
    external_account_id      TEXT,
    credentials_encrypted    BYTEA,                 -- envelope-encrypted; KEK in KMS
    credentials_kek_id       TEXT,                  -- id of the KEK used (for rotation)
    base_currency            CHAR(3) NOT NULL,
    last_synced_at           TIMESTAMPTZ,
    sync_status              TEXT NOT NULL DEFAULT 'pending'
                               CHECK (sync_status IN ('pending','syncing','ok','error')),
    sync_error               TEXT,
    deleted_at               TIMESTAMPTZ,           -- soft delete
    created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- transactions — immutable ledger
-- ---------------------------------------------------------------------
CREATE TABLE transactions (
    id                  UUID PRIMARY KEY,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id          UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

    -- What
    symbol              TEXT NOT NULL,
    asset_type          TEXT NOT NULL
                           CHECK (asset_type IN ('stock','etf','crypto')),
    transaction_type    TEXT NOT NULL
                           CHECK (transaction_type IN (
                               'buy','sell','dividend','split',
                               'transfer_in','transfer_out','fee'
                           )),

    -- How much
    quantity            NUMERIC(30, 10) NOT NULL,
    price               NUMERIC(30, 10),            -- NULL for splits
    currency            CHAR(3) NOT NULL,
    fee                 NUMERIC(30, 10) NOT NULL DEFAULT 0,

    -- When
    executed_at         TIMESTAMPTZ NOT NULL,

    -- Where from
    source              TEXT NOT NULL
                           CHECK (source IN ('manual','api','aggregator','import')),
    source_details      JSONB,
    fingerprint         TEXT NOT NULL,

    -- Meta
    notes               TEXT,
    manually_edited     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- positions — materialised current holdings
-- ---------------------------------------------------------------------
CREATE TABLE positions (
    id                    UUID PRIMARY KEY,
    user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id            UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    symbol                TEXT NOT NULL,
    asset_type            TEXT NOT NULL
                            CHECK (asset_type IN ('stock','etf','crypto')),

    quantity              NUMERIC(30, 10) NOT NULL,
    avg_cost              NUMERIC(30, 10),
    currency              CHAR(3) NOT NULL,

    last_calculated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- portfolio_snapshots — daily value series
-- Stores values in base currency; display conversion happens at read time
-- via fx_rates. base_currency is USD today but kept as a column so we can
-- switch baseline in the future without another migration.
-- ---------------------------------------------------------------------
CREATE TABLE portfolio_snapshots (
    id                  UUID PRIMARY KEY,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    snapshot_date       DATE NOT NULL,

    base_currency       CHAR(3) NOT NULL DEFAULT 'USD',
    total_value_base    NUMERIC(30, 10) NOT NULL,
    total_cost_base     NUMERIC(30, 10) NOT NULL,

    allocation          JSONB NOT NULL,  -- { "AAPL": 0.15, "BTC": 0.25, ... }
    by_asset_type       JSONB NOT NULL,  -- { "stock": 0.60, "crypto": 0.40 }
    by_currency         JSONB NOT NULL,  -- { "USD": 0.70, "EUR": 0.30 }

    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- prices — latest quote cache
-- Composite PK; Redis hot-cache sits in front with TTL 60s.
-- ---------------------------------------------------------------------
CREATE TABLE prices (
    symbol         TEXT NOT NULL,
    asset_type     TEXT NOT NULL
                     CHECK (asset_type IN ('stock','etf','crypto')),
    currency       CHAR(3) NOT NULL,
    price          NUMERIC(30, 10) NOT NULL,
    as_of          TIMESTAMPTZ NOT NULL,
    source         TEXT NOT NULL,

    PRIMARY KEY (symbol, asset_type, currency)
);

-- ---------------------------------------------------------------------
-- fx_rates — historical and current FX
-- ---------------------------------------------------------------------
CREATE TABLE fx_rates (
    base_currency     CHAR(3) NOT NULL,
    quote_currency    CHAR(3) NOT NULL,
    rate              NUMERIC(20, 10) NOT NULL,
    as_of             DATE NOT NULL,
    source            TEXT NOT NULL,

    PRIMARY KEY (base_currency, quote_currency, as_of)
);

-- ---------------------------------------------------------------------
-- ai_conversations / ai_messages
-- ---------------------------------------------------------------------
CREATE TABLE ai_conversations (
    id           UUID PRIMARY KEY,
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ai_messages (
    id                 UUID PRIMARY KEY,
    conversation_id    UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role               TEXT NOT NULL
                         CHECK (role IN ('user','assistant','tool')),
    content            JSONB NOT NULL,  -- array of AIMessageContent blocks
    tokens_used        INTEGER,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- insights — proactive AI insights
-- ---------------------------------------------------------------------
CREATE TABLE insights (
    id               UUID PRIMARY KEY,
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    insight_type     TEXT NOT NULL,
    title            TEXT NOT NULL,
    body             TEXT NOT NULL,
    severity         TEXT NOT NULL DEFAULT 'info'
                       CHECK (severity IN ('info','warning','critical')),
    data             JSONB,
    generated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    viewed_at        TIMESTAMPTZ,
    dismissed_at     TIMESTAMPTZ
);

-- ---------------------------------------------------------------------
-- usage_counters — free-tier accounting
-- ---------------------------------------------------------------------
CREATE TABLE usage_counters (
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    counter_type    TEXT NOT NULL,
    counter_date    DATE NOT NULL,
    count           INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (user_id, counter_type, counter_date)
);

-- ---------------------------------------------------------------------
-- audit_log — sensitive actions
-- ---------------------------------------------------------------------
CREATE TABLE audit_log (
    id            BIGSERIAL PRIMARY KEY,
    user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    action        TEXT NOT NULL,
    metadata      JSONB,
    ip_address    INET,
    user_agent    TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- idempotency_keys — server-side replay store for Idempotency-Key header
-- TTL 24h is enforced by a periodic worker (DELETE WHERE created_at < now()-1 day).
-- ---------------------------------------------------------------------
CREATE TABLE idempotency_keys (
    key                TEXT NOT NULL,
    user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    method             TEXT NOT NULL,
    path               TEXT NOT NULL,
    request_hash       TEXT NOT NULL,   -- sha256 of body; replay only if identical
    response_status    INTEGER NOT NULL,
    response_headers   JSONB NOT NULL,
    response_body      BYTEA NOT NULL,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (user_id, key, method, path)
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS idempotency_keys;
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS usage_counters;
DROP TABLE IF EXISTS insights;
DROP TABLE IF EXISTS ai_messages;
DROP TABLE IF EXISTS ai_conversations;
DROP TABLE IF EXISTS fx_rates;
DROP TABLE IF EXISTS prices;
DROP TABLE IF EXISTS portfolio_snapshots;
DROP TABLE IF EXISTS positions;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
