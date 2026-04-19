-- +goose Up
-- +goose StatementBegin

-- =====================================================================
-- TASK_03_UPDATE Tier C — export jobs + deletion grace period
--
-- Backs endpoints added in openapi.yaml for design brief v1.1 §15.5 + §17.4:
--   * POST /exports, GET /exports/{id}
--   * POST /me/undo-deletion (reads users.deletion_scheduled_at)
--
-- 2FA / sessions are Clerk-proxied — no local tables created for them.
-- =====================================================================

-- ---------------------------------------------------------------------
-- users.deletion_scheduled_at — 7-day grace window before hard-delete
-- (§17.4). NULL means the account is live; non-null means the hard-delete
-- worker will pick it up at `deletion_scheduled_at + interval '7 days'`.
-- ---------------------------------------------------------------------
ALTER TABLE users
    ADD COLUMN deletion_scheduled_at TIMESTAMPTZ;

-- Worker scan: "find users whose grace period expired".
CREATE INDEX idx_users_deletion_pending
    ON users(deletion_scheduled_at)
    WHERE deletion_scheduled_at IS NOT NULL;

-- ---------------------------------------------------------------------
-- export_jobs — async CSV exports (§15.5)
-- ---------------------------------------------------------------------
CREATE TABLE export_jobs (
    id             UUID PRIMARY KEY,
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource       TEXT NOT NULL
                     CHECK (resource IN ('transactions','positions','snapshots','dividends')),
    format         TEXT NOT NULL
                     CHECK (format IN ('csv')),
    filters        JSONB NOT NULL DEFAULT '{}'::jsonb,
    status         TEXT NOT NULL DEFAULT 'queued'
                     CHECK (status IN ('queued','running','done','failed')),
    row_count      INTEGER,
    result_url     TEXT,        -- pre-signed; expires 24h after completed_at
    error          TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at   TIMESTAMPTZ
);

-- User-facing polling: "my recent jobs newest first".
CREATE INDEX idx_export_jobs_user_time
    ON export_jobs(user_id, created_at DESC);

-- Worker pickup: "next queued job".
CREATE INDEX idx_export_jobs_status_queued
    ON export_jobs(created_at)
    WHERE status = 'queued';

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_export_jobs_status_queued;
DROP INDEX IF EXISTS idx_export_jobs_user_time;
DROP TABLE IF EXISTS export_jobs;

DROP INDEX IF EXISTS idx_users_deletion_pending;
ALTER TABLE users DROP COLUMN IF EXISTS deletion_scheduled_at;
-- +goose StatementEnd
