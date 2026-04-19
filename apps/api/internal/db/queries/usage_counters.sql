-- name: IncrementUsageCounter :one
-- Atomic UPSERT: create the day's counter at 1, or +1 if it already
-- exists. Used by POST /internal/ai/usage (counter_type =
-- 'ai_messages_daily'). PR B3 paywall-dismissal counters will reuse
-- this same query.
INSERT INTO usage_counters (user_id, counter_type, counter_date, count)
VALUES ($1, $2, $3, 1)
ON CONFLICT (user_id, counter_type, counter_date) DO UPDATE
SET count = usage_counters.count + 1
RETURNING *;
