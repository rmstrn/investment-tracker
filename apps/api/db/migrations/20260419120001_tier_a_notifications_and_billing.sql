-- +goose Up
-- +goose StatementBegin

-- =====================================================================
-- TASK_03_UPDATE Tier A — freemium, notifications, retention feedback
--
-- Backs endpoints added in openapi.yaml for design brief v1.1 §13 + §16:
--   * /notifications, /notifications/{id}/read, /notifications/read_all,
--     /notifications/unread_count
--   * /me/notification-preferences (GET/PATCH)
--   * /billing/cancellation-feedback
--   * /me/paywalls, /me/paywalls/{trigger}/dismiss — reuses the existing
--     usage_counters table with counter_type='paywall_dismissed_{trigger}'.
--     No new table for those.
--
-- Conventions unchanged: UUIDv7 generated app-side (no DEFAULT), money
-- columns are NUMERIC(30,10), timestamps are TIMESTAMPTZ in UTC.
-- =====================================================================

-- ---------------------------------------------------------------------
-- notifications — in-app notification center
-- ---------------------------------------------------------------------
CREATE TABLE notifications (
    id           UUID PRIMARY KEY,
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type         TEXT NOT NULL
                   CHECK (type IN (
                       'insight_generated',
                       'sync_completed',
                       'sync_failed',
                       'dividend_paid',
                       'price_alert',
                       'billing_event'
                   )),
    title        TEXT NOT NULL,
    body         TEXT NOT NULL,
    data         JSONB NOT NULL DEFAULT '{}'::jsonb,
    deep_link    TEXT,
    read_at      TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Active bell-badge query: count unread for current user.
CREATE INDEX idx_notifications_user_unread
    ON notifications(user_id, created_at DESC)
    WHERE read_at IS NULL;

-- Center listing: newest first, any read state.
CREATE INDEX idx_notifications_user_time
    ON notifications(user_id, created_at DESC);

-- ---------------------------------------------------------------------
-- notification_preferences — per-type channel matrix (§16.3)
-- Separate row per (user, type). Missing rows default to all channels ON.
-- ---------------------------------------------------------------------
CREATE TABLE notification_preferences (
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type         TEXT NOT NULL
                   CHECK (type IN (
                       'insight_generated',
                       'sync_completed',
                       'sync_failed',
                       'dividend_paid',
                       'price_alert',
                       'billing_event'
                   )),
    email        BOOLEAN NOT NULL DEFAULT TRUE,
    push         BOOLEAN NOT NULL DEFAULT TRUE,
    in_app       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (user_id, type)
);

-- ---------------------------------------------------------------------
-- user_digest_preferences — weekly digest + quiet hours (§16.3)
-- One row per user; symmetrical with notification_preferences.
-- ---------------------------------------------------------------------
CREATE TABLE user_digest_preferences (
    user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    digest_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
    digest_weekday    SMALLINT NOT NULL DEFAULT 1
                        CHECK (digest_weekday BETWEEN 0 AND 6),  -- 0 = Monday (ISO)
    quiet_start       TIME,
    quiet_end         TIME,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- cancellation_feedback — retention modal captures (§13.8)
-- Analytics-only, does NOT cancel the Stripe subscription.
-- ---------------------------------------------------------------------
CREATE TABLE cancellation_feedback (
    id                        UUID PRIMARY KEY,
    user_id                   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason                    TEXT NOT NULL
                                CHECK (reason IN (
                                    'not_using_enough',
                                    'too_expensive',
                                    'missing_feature',
                                    'other'
                                )),
    free_text                 TEXT,
    counter_offer_accepted    BOOLEAN NOT NULL DEFAULT FALSE,
    stripe_subscription_id    TEXT,
    created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cancellation_feedback_user_time
    ON cancellation_feedback(user_id, created_at DESC);

-- Aggregations across all users (reason frequency). Useful for PM dashboards.
CREATE INDEX idx_cancellation_feedback_reason_time
    ON cancellation_feedback(reason, created_at DESC);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_cancellation_feedback_reason_time;
DROP INDEX IF EXISTS idx_cancellation_feedback_user_time;
DROP TABLE IF EXISTS cancellation_feedback;
DROP TABLE IF EXISTS user_digest_preferences;
DROP TABLE IF EXISTS notification_preferences;
DROP INDEX IF EXISTS idx_notifications_user_time;
DROP INDEX IF EXISTS idx_notifications_user_unread;
DROP TABLE IF EXISTS notifications;
-- +goose StatementEnd
