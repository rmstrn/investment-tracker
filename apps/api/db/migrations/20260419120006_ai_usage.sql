-- +goose Up
-- +goose StatementBegin

-- =====================================================================
-- ai_usage — per-call telemetry for AI Service token spend
--
-- Written by Core API via POST /internal/ai/usage (fire-and-forget from
-- the AI Service). Feeds two things:
--   * billing analytics (sum of cost_usd per user / period)
--   * future Stripe metered billing (aggregation job reads this table)
--
-- Per-call metadata that `ai_messages.tokens_used INTEGER` cannot hold:
-- model id, input/output split, cost, and the fact that insights / coach
-- calls have no conversation_id.
--
-- Duplicate delivery is accepted for MVP — the AI Service is
-- fire-and-forget, and occasional double-count on daily counters costs
-- less than an idempotency key on a trusted internal path. If it starts
-- to bite, add (conversation_id, request_fingerprint) UNIQUE + ON
-- CONFLICT DO NOTHING in a follow-up.
-- =====================================================================
CREATE TABLE ai_usage (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE SET NULL,
    model           TEXT NOT NULL,
    input_tokens    INTEGER NOT NULL CHECK (input_tokens >= 0),
    output_tokens   INTEGER NOT NULL CHECK (output_tokens >= 0),
    cost_usd        NUMERIC(10, 6) NOT NULL CHECK (cost_usd >= 0),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Per-user reads: "my usage this week / month".
CREATE INDEX idx_ai_usage_user_time ON ai_usage(user_id, created_at DESC);

-- System-wide aggregates: "total cost today across all users", anomaly
-- alerts, Sentry health checks. Small, pays off in the first billing
-- dashboard.
CREATE INDEX idx_ai_usage_created ON ai_usage(created_at DESC);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_ai_usage_created;
DROP INDEX IF EXISTS idx_ai_usage_user_time;
DROP TABLE IF EXISTS ai_usage;
-- +goose StatementEnd
