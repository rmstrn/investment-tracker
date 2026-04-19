-- name: CountInsightsByUserSince :one
-- Weekly-window count of insights the Core has generated for this user.
-- Feeds the `insights_weekly` counter on GET /me/usage: the
-- usage_counters table would need an incrementer wired from the
-- insight-generation path (PR B3 scope), so until then the gauge is
-- computed on the fly from the insights table itself — authoritative
-- as long as insights are never deleted.
SELECT COUNT(*)::int AS total
FROM insights
WHERE user_id = $1 AND generated_at >= $2;

-- name: ListInsightsByUser :many
-- Feeds GET /ai/insights. Cursor pagination by (generated_at, id) so
-- the ordering matches the rest of the API. Optional since-filter
-- (sqlc.narg) keeps the same query handy if a caller ever wants to
-- poll for fresh rows.
SELECT * FROM insights
WHERE user_id = @user_id
  AND (generated_at, id) < (@cursor_ts::timestamptz, @cursor_id::uuid)
  AND (sqlc.narg('since_ts')::timestamptz IS NULL OR generated_at >= sqlc.narg('since_ts')::timestamptz)
ORDER BY generated_at DESC, id DESC
LIMIT @row_limit;
