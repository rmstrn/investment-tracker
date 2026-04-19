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

-- name: InsertInsight :one
-- Persists one AI-generated insight. id is uuid v7 from app side;
-- generated_at defaults to now() so the worker / handler does not
-- need to thread a timestamp.
INSERT INTO insights (id, user_id, insight_type, title, body, severity, data)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: MarkInsightDismissed :execrows
-- POST /ai/insights/{id}/dismiss. Idempotent — a second dismiss
-- keeps the first dismissed_at via COALESCE so audit trail stays
-- truthful.
UPDATE insights
SET dismissed_at = COALESCE(dismissed_at, now())
WHERE id = $1 AND user_id = $2;

-- name: MarkInsightViewed :execrows
-- POST /ai/insights/{id}/viewed. Same COALESCE-idempotent rule
-- as dismiss.
UPDATE insights
SET viewed_at = COALESCE(viewed_at, now())
WHERE id = $1 AND user_id = $2;

-- name: ListInsightsByUser :many
-- Feeds GET /ai/insights. Cursor pagination by (generated_at, id) so
-- the ordering matches the rest of the API.
--
-- include_dismissed controls the dismissed_at filter: when the narg
-- IS NULL we default to active-only (dismissed_at IS NULL); when the
-- caller passes a non-null value we surface dismissed rows too. A
-- boolean narg for "include or exclude" would be cleaner but sqlc's
-- narg layer only round-trips nullable scalars, so a sentinel text
-- ("include"/NULL) does the job without a bool helper.
SELECT * FROM insights
WHERE user_id = @user_id
  AND (generated_at, id) < (@cursor_ts::timestamptz, @cursor_id::uuid)
  AND (sqlc.narg('since_ts')::timestamptz IS NULL OR generated_at >= sqlc.narg('since_ts')::timestamptz)
  AND (sqlc.narg('include_dismissed')::text IS NOT NULL OR dismissed_at IS NULL)
ORDER BY generated_at DESC, id DESC
LIMIT @row_limit;
