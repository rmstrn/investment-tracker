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

-- name: UpsertNotificationPreference :one
-- Per-type upsert so PATCH /me/notification-preferences can send a
-- partial `preferences` map — rows for untouched types stay on
-- defaults.
INSERT INTO notification_preferences (user_id, type, email, push, in_app)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (user_id, type) DO UPDATE
SET email      = EXCLUDED.email,
    push       = EXCLUDED.push,
    in_app     = EXCLUDED.in_app,
    updated_at = now()
RETURNING *;

-- name: UpsertUserDigestPreferences :one
-- Wholesale replace of digest settings. PATCH semantics at the
-- openapi layer: `digest` is replaced when present, omitted when
-- absent — that branching lives in the handler.
INSERT INTO user_digest_preferences (user_id, digest_enabled, digest_weekday, quiet_start, quiet_end)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (user_id) DO UPDATE
SET digest_enabled = EXCLUDED.digest_enabled,
    digest_weekday = EXCLUDED.digest_weekday,
    quiet_start    = EXCLUDED.quiet_start,
    quiet_end      = EXCLUDED.quiet_end,
    updated_at     = now()
RETURNING *;
