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

-- name: SumUsageCounterInRange :one
-- Aggregate a counter for (user, counter_type) across [from, to]
-- inclusive. Used by GET /me/usage — daily counters pass from=to=today,
-- weekly counters pass from=monday, to=today. Returns 0 when no rows
-- exist so the handler never has to nil-check.
SELECT COALESCE(SUM(count), 0)::int AS total
FROM usage_counters
WHERE user_id = $1
  AND counter_type = $2
  AND counter_date >= $3
  AND counter_date <= $4;

-- name: ListUsageCountersInRange :many
-- Detail variant returning every (counter_type, date, count) row. Used
-- by GET /me/paywalls to enumerate the distinct triggers a user has
-- dismissed today. Returns rows in (counter_type, counter_date)
-- ascending order so dedup downstream is trivial.
SELECT * FROM usage_counters
WHERE user_id = $1
  AND counter_date >= $2
  AND counter_date <= $3
ORDER BY counter_type, counter_date;
