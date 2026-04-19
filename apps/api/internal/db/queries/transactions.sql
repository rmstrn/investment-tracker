-- name: InsertTransaction :one
-- Fingerprint-based dedup: ON CONFLICT DO NOTHING on the (user_id, fingerprint)
-- unique index. Callers must treat (pgx.ErrNoRows) as "duplicate skipped".
INSERT INTO transactions (
    id, user_id, account_id, symbol, asset_type, transaction_type,
    quantity, price, currency, fee, executed_at,
    source, source_details, fingerprint, notes
)
VALUES (
    $1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11,
    $12, $13, $14, $15
)
ON CONFLICT (user_id, fingerprint) DO NOTHING
RETURNING *;

-- name: GetTransactionByID :one
SELECT * FROM transactions WHERE id = $1 AND user_id = $2;

-- name: ListTransactionsByUser :many
-- Cursor pagination by (executed_at, id) — descending. Clients pass the
-- last seen values as $2/$3; first page passes far-future / NULL.
SELECT * FROM transactions
WHERE user_id = $1
  AND (executed_at, id) < ($2, $3)
ORDER BY executed_at DESC, id DESC
LIMIT $4;
