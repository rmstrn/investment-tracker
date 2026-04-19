-- name: ListNotificationPreferencesByUser :many
-- Per-type channel settings. Missing rows default to all channels on
-- (handler rule, see openapi NotificationPreferences.preferences).
SELECT * FROM notification_preferences
WHERE user_id = $1
ORDER BY type;

-- name: GetUserDigestPreferences :one
-- Single digest row per user. pgx.ErrNoRows → handler uses defaults
-- (digest enabled, weekday = Monday, no quiet hours).
SELECT * FROM user_digest_preferences
WHERE user_id = $1;
