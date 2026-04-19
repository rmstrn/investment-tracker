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

-- name: UpdateManualTransaction :one
-- Partial update scoped to manual-sourced rows only. API / aggregator
-- rows are immutable by policy (§15.5). Handler layer returns 403
-- when the caller hits this on a non-manual row — at the SQL level
-- we simply filter and a non-manual row yields ErrNoRows, which the
-- handler maps to 403 by re-checking source via GetTransactionByID.
UPDATE transactions
SET quantity    = COALESCE(sqlc.narg('quantity'),    quantity),
    price       = COALESCE(sqlc.narg('price'),       price),
    fee         = COALESCE(sqlc.narg('fee'),         fee),
    executed_at = COALESCE(sqlc.narg('executed_at'), executed_at),
    notes       = COALESCE(sqlc.narg('notes'),       notes),
    manually_edited = TRUE
WHERE id = @id
  AND user_id = @user_id
  AND source = 'manual'
RETURNING *;

-- name: DeleteManualTransaction :execrows
-- Manual-only hard delete. Returns affected-row count so the handler
-- can distinguish missing / non-manual / other-user from success.
DELETE FROM transactions
WHERE id = $1 AND user_id = $2 AND source = 'manual';

-- name: ListTransactionsByUser :many
-- Cursor pagination by (executed_at, id) — descending. Clients pass the
-- last seen values as $2/$3; first page passes far-future / NULL.
SELECT * FROM transactions
WHERE user_id = $1
  AND (executed_at, id) < ($2, $3)
ORDER BY executed_at DESC, id DESC
LIMIT $4;

-- name: ListTransactionsFiltered :many
-- Flexible list-transactions with optional filters. Uses sqlc.narg so
-- any combination can be NULL → "no filter on this column". Cursor
-- pagination via (executed_at, id) descending.
--
-- Explicit casts on @cursor_ts / @cursor_id are required — without
-- them sqlc cannot infer the element types of the row tuple and
-- generates pgtype.Timestamptz for @cursor_id (UUID column), breaking
-- bind marshalling. Same pattern should be applied if
-- ListTransactionsByUser is ever wired to a handler.
SELECT * FROM transactions
WHERE user_id = @user_id
  AND (executed_at, id) < (@cursor_ts::timestamptz, @cursor_id::uuid)
  AND (sqlc.narg('account_id')::uuid       IS NULL OR account_id       = sqlc.narg('account_id')::uuid)
  AND (sqlc.narg('symbol')::text           IS NULL OR symbol           = sqlc.narg('symbol')::text)
  AND (sqlc.narg('asset_type')::text       IS NULL OR asset_type       = sqlc.narg('asset_type')::text)
  AND (sqlc.narg('transaction_type')::text IS NULL OR transaction_type = sqlc.narg('transaction_type')::text)
  AND (sqlc.narg('from_ts')::timestamptz   IS NULL OR executed_at      >= sqlc.narg('from_ts')::timestamptz)
  AND (sqlc.narg('to_ts')::timestamptz     IS NULL OR executed_at      <= sqlc.narg('to_ts')::timestamptz)
ORDER BY executed_at DESC, id DESC
LIMIT @row_limit;

-- name: ListAllTransactionsByUser :many
-- Full unbounded ledger for the tax-report builder. FIFO lot-matching
-- needs every historical transaction to reconstruct cost basis, so
-- no cursor / no LIMIT. Called only by GET /portfolio/tax — the
-- usual list endpoints use the filtered / cursor variants.
SELECT * FROM transactions
WHERE user_id = $1
ORDER BY executed_at ASC, id ASC;

-- name: ListTransactionsByPosition :many
-- Powers GET /positions/{id}/transactions. positions are materialised
-- views keyed by (user_id, account_id, symbol) — there is no FK from
-- transactions to a position id, so we join on those three fields.
-- Cursor pagination matches the rest of the API (executed_at DESC,
-- id DESC).
SELECT t.* FROM transactions t
JOIN positions p ON p.user_id = t.user_id
                 AND p.account_id = t.account_id
                 AND p.symbol = t.symbol
WHERE p.id = @position_id
  AND p.user_id = @user_id
  AND (t.executed_at, t.id) < (@cursor_ts::timestamptz, @cursor_id::uuid)
ORDER BY t.executed_at DESC, t.id DESC
LIMIT @row_limit;

-- name: ListDividendTransactions :many
-- Historical dividend feed for /portfolio/dividends. Filters by user +
-- transaction_type='dividend' and honours cursor + optional date range.
-- A dedicated dividends / corporate_actions table does not yet exist
-- (TD-022); paid dividends live in the transactions ledger today.
SELECT * FROM transactions
WHERE user_id = @user_id
  AND transaction_type = 'dividend'
  AND (executed_at, id) < (@cursor_ts::timestamptz, @cursor_id::uuid)
  AND (sqlc.narg('from_ts')::timestamptz IS NULL OR executed_at >= sqlc.narg('from_ts')::timestamptz)
  AND (sqlc.narg('to_ts')::timestamptz   IS NULL OR executed_at <= sqlc.narg('to_ts')::timestamptz)
ORDER BY executed_at DESC, id DESC
LIMIT @row_limit;
