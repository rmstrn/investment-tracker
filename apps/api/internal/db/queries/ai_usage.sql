-- name: RecordAIUsage :one
-- Written by POST /internal/ai/usage. The id column uses a DB-side
-- default (gen_random_uuid()) — callers do not pass it. conversation_id
-- is nullable for insight_generator / behavioural_coach calls that do
-- not belong to any chat conversation.
INSERT INTO ai_usage (
    user_id, conversation_id, model,
    input_tokens, output_tokens, cost_usd
)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
