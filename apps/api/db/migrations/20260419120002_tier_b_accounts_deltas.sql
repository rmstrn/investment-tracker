-- +goose Up
-- +goose StatementBegin

-- =====================================================================
-- TASK_03_UPDATE Tier B — account state deltas
--
-- Backs endpoints added in openapi.yaml for design brief v1.1 §18:
--   * POST /accounts/{id}/reconnect, /pause, /resume
--   * Account.is_included_in_portfolio (§18.1 "Include in portfolio" toggle)
--   * SyncState += 'paused' (§18.2)
--
-- The pause/resume/reconnect actions themselves land in TASK_04 (handlers).
-- This migration only prepares the schema contract.
-- =====================================================================

-- ---------------------------------------------------------------------
-- accounts — add is_included_in_portfolio
-- DEFAULT TRUE backfills every existing row to "included"; NOT NULL then
-- enforces the invariant going forward.
-- ---------------------------------------------------------------------
ALTER TABLE accounts
    ADD COLUMN is_included_in_portfolio BOOLEAN NOT NULL DEFAULT TRUE;

-- ---------------------------------------------------------------------
-- accounts.sync_status CHECK constraint — extend with 'paused'
-- Postgres cannot ALTER a CHECK in place; DROP + ADD under the same name.
-- ---------------------------------------------------------------------
ALTER TABLE accounts
    DROP CONSTRAINT accounts_sync_status_check;

ALTER TABLE accounts
    ADD CONSTRAINT accounts_sync_status_check
    CHECK (sync_status IN ('pending','syncing','ok','error','paused'));

-- ---------------------------------------------------------------------
-- Partial index for live aggregations: only accounts that feed portfolio
-- calculations. Speeds up /portfolio, /positions which always filter
-- `WHERE deleted_at IS NULL AND is_included_in_portfolio = TRUE`.
-- ---------------------------------------------------------------------
CREATE INDEX idx_accounts_user_portfolio
    ON accounts(user_id)
    WHERE deleted_at IS NULL AND is_included_in_portfolio = TRUE;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP INDEX IF EXISTS idx_accounts_user_portfolio;

-- Revert CHECK constraint to the original enum (dropping 'paused').
-- If any row is in sync_status='paused' at rollback time, this will fail —
-- the operator must flip those rows to 'pending' first. That is intentional:
-- silent loss of state is worse than a deliberate manual fixup.
ALTER TABLE accounts
    DROP CONSTRAINT accounts_sync_status_check;

ALTER TABLE accounts
    ADD CONSTRAINT accounts_sync_status_check
    CHECK (sync_status IN ('pending','syncing','ok','error'));

ALTER TABLE accounts
    DROP COLUMN IF EXISTS is_included_in_portfolio;

-- +goose StatementEnd
