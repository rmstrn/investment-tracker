-- name: ListNotificationsByUser :many
-- Cursor-paginated center listing. Sort is (created_at DESC, id DESC)
-- so freshest rows surface first; read/unread rows both included so
-- the UI can render a "history" tab. Optional unread-only filter via
-- the sqlc.narg — the handler toggles on ?unread_only=true.
SELECT * FROM notifications
WHERE user_id = @user_id
  AND (created_at, id) < (@cursor_ts::timestamptz, @cursor_id::uuid)
  AND (sqlc.narg('unread_only')::boolean IS NOT TRUE OR read_at IS NULL)
ORDER BY created_at DESC, id DESC
LIMIT @row_limit;

-- name: CountUnreadNotifications :one
-- Fast bell-badge query. The unread-partial index
-- idx_notifications_user_unread makes this O(unread) rather than
-- O(all) so a user with thousands of read rows does not pay for
-- them. Capped at 99 in the handler so the UI can render "99+".
SELECT COUNT(*)::int AS total
FROM notifications
WHERE user_id = $1 AND read_at IS NULL;

-- name: MarkNotificationRead :execrows
-- Single-row mark-as-read. Returns affected-row count so the
-- handler can emit 404 when the id is unknown or already belongs
-- to another user.
UPDATE notifications
SET read_at = COALESCE(read_at, now())
WHERE id = $1 AND user_id = $2;

-- name: MarkAllNotificationsRead :execrows
-- Bulk mark-all-as-read. Only flips unread rows so a second call
-- within the same second stays idempotent (no timestamp churn).
UPDATE notifications
SET read_at = now()
WHERE user_id = $1 AND read_at IS NULL;
