-- +goose Up
-- +goose StatementBegin

-- =====================================================================
-- Investment Tracker — indexes
-- Kept in a separate migration so schema migrations stay readable and
-- index tuning can be iterated without touching table DDL.
-- =====================================================================

-- users ---------------------------------------------------------------
CREATE INDEX idx_users_stripe_customer
    ON users(stripe_customer_id)
    WHERE stripe_customer_id IS NOT NULL;

-- accounts ------------------------------------------------------------
-- Live accounts only. Every "list my accounts" query filters on
-- deleted_at IS NULL; matching predicate keeps the index tight.
CREATE INDEX idx_accounts_user_active
    ON accounts(user_id)
    WHERE deleted_at IS NULL;

CREATE INDEX idx_accounts_user_all
    ON accounts(user_id);

CREATE INDEX idx_accounts_external
    ON accounts(broker_name, external_account_id)
    WHERE external_account_id IS NOT NULL;

-- transactions --------------------------------------------------------
-- Dedup fingerprint is per-user (same trade can exist across users).
CREATE UNIQUE INDEX idx_txn_fingerprint
    ON transactions(user_id, fingerprint);

CREATE INDEX idx_txn_user_time
    ON transactions(user_id, executed_at DESC);

CREATE INDEX idx_txn_account
    ON transactions(account_id);

CREATE INDEX idx_txn_user_symbol
    ON transactions(user_id, symbol, executed_at DESC);

-- positions -----------------------------------------------------------
CREATE UNIQUE INDEX idx_pos_unique
    ON positions(user_id, account_id, symbol);

CREATE INDEX idx_pos_user
    ON positions(user_id);

-- portfolio_snapshots -------------------------------------------------
CREATE UNIQUE INDEX idx_snap_unique
    ON portfolio_snapshots(user_id, snapshot_date);

CREATE INDEX idx_snap_user_desc
    ON portfolio_snapshots(user_id, snapshot_date DESC);

-- prices --------------------------------------------------------------
CREATE INDEX idx_prices_symbol_time
    ON prices(symbol, as_of DESC);

-- fx_rates ------------------------------------------------------------
CREATE INDEX idx_fx_pair_time
    ON fx_rates(base_currency, quote_currency, as_of DESC);

-- ai_conversations / ai_messages --------------------------------------
CREATE INDEX idx_ai_conv_user_time
    ON ai_conversations(user_id, updated_at DESC);

CREATE INDEX idx_ai_msg_conv_time
    ON ai_messages(conversation_id, created_at ASC);

-- insights ------------------------------------------------------------
-- Active insights only — every dashboard query filters out dismissed.
CREATE INDEX idx_insights_user_active
    ON insights(user_id, generated_at DESC)
    WHERE dismissed_at IS NULL;

CREATE INDEX idx_insights_user_all
    ON insights(user_id, generated_at DESC);

-- usage_counters ------------------------------------------------------
-- PK already covers (user_id, counter_type, counter_date); extra index
-- for daily aggregation scans.
CREATE INDEX idx_usage_date
    ON usage_counters(counter_date);

-- audit_log -----------------------------------------------------------
CREATE INDEX idx_audit_user_time
    ON audit_log(user_id, created_at DESC);

CREATE INDEX idx_audit_action_time
    ON audit_log(action, created_at DESC);

-- idempotency_keys ----------------------------------------------------
-- TTL-style janitor query: DELETE WHERE created_at < now() - '24 hours'.
CREATE INDEX idx_idem_created
    ON idempotency_keys(created_at);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_idem_created;
DROP INDEX IF EXISTS idx_audit_action_time;
DROP INDEX IF EXISTS idx_audit_user_time;
DROP INDEX IF EXISTS idx_usage_date;
DROP INDEX IF EXISTS idx_insights_user_all;
DROP INDEX IF EXISTS idx_insights_user_active;
DROP INDEX IF EXISTS idx_ai_msg_conv_time;
DROP INDEX IF EXISTS idx_ai_conv_user_time;
DROP INDEX IF EXISTS idx_fx_pair_time;
DROP INDEX IF EXISTS idx_prices_symbol_time;
DROP INDEX IF EXISTS idx_snap_user_desc;
DROP INDEX IF EXISTS idx_snap_unique;
DROP INDEX IF EXISTS idx_pos_user;
DROP INDEX IF EXISTS idx_pos_unique;
DROP INDEX IF EXISTS idx_txn_user_symbol;
DROP INDEX IF EXISTS idx_txn_account;
DROP INDEX IF EXISTS idx_txn_user_time;
DROP INDEX IF EXISTS idx_txn_fingerprint;
DROP INDEX IF EXISTS idx_accounts_external;
DROP INDEX IF EXISTS idx_accounts_user_all;
DROP INDEX IF EXISTS idx_accounts_user_active;
DROP INDEX IF EXISTS idx_users_stripe_customer;
-- +goose StatementEnd
