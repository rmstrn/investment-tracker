-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserByClerkID :one
SELECT * FROM users WHERE clerk_user_id = $1;

-- name: CreateUser :one
INSERT INTO users (
    id, clerk_user_id, email, display_currency, locale,
    subscription_tier, stripe_customer_id
)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: UpdateUserProfile :one
UPDATE users
SET display_currency = COALESCE(sqlc.narg('display_currency'), display_currency),
    locale           = COALESCE(sqlc.narg('locale'),           locale),
    email            = COALESCE(sqlc.narg('email'),            email),
    updated_at       = now()
WHERE id = $1
RETURNING *;

-- name: UpdateUserSubscription :one
-- Called by the Stripe webhook path. Idempotent: same payload replayed
-- yields the same row.
UPDATE users
SET subscription_tier  = $2,
    stripe_customer_id = COALESCE($3, stripe_customer_id),
    updated_at         = now()
WHERE id = $1
RETURNING *;

-- name: MarkUserDeletionRequested :one
-- Soft-deletion start: flags the user. A worker hard-deletes later.
UPDATE users
SET deletion_requested_at = COALESCE(deletion_requested_at, now()),
    updated_at            = now()
WHERE id = $1
RETURNING *;

-- name: UndoUserDeletion :one
UPDATE users
SET deletion_requested_at = NULL,
    updated_at            = now()
WHERE id = $1
RETURNING *;
