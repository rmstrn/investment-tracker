-- name: GetAccountByID :one
-- Scoped by user_id to enforce ownership at the query layer.
SELECT * FROM accounts WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL;

-- name: ListAccountsByUser :many
SELECT * FROM accounts
WHERE user_id = $1 AND deleted_at IS NULL
ORDER BY created_at ASC;

-- name: CreateAccount :one
INSERT INTO accounts (
    id, user_id, broker_name, display_name, account_type,
    connection_type, external_account_id, credentials_encrypted,
    credentials_kek_id, base_currency, sync_status
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING *;

-- name: UpdateAccountSyncStatus :one
UPDATE accounts
SET sync_status    = $2,
    sync_error     = $3,
    last_synced_at = CASE WHEN $2 = 'ok' THEN now() ELSE last_synced_at END,
    updated_at     = now()
WHERE id = $1
RETURNING *;

-- name: SoftDeleteAccount :one
UPDATE accounts
SET deleted_at = now(),
    updated_at = now()
WHERE id = $1 AND user_id = $2
RETURNING *;
