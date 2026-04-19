-- name: ListPositionsByUser :many
-- Drives the portfolio calculator. Returns every current holding across
-- accounts; grouping into totals happens in Go, not SQL.
SELECT * FROM positions WHERE user_id = $1 ORDER BY symbol ASC;

-- name: GetPositionByID :one
-- User-scoped single position lookup. Powers GET /positions/{id}.
-- Cross-user access surfaces as ErrNoRows → handler 404.
SELECT * FROM positions WHERE id = $1 AND user_id = $2;

-- name: UpsertPosition :one
INSERT INTO positions (
    id, user_id, account_id, symbol, asset_type, quantity, avg_cost, currency
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (user_id, account_id, symbol) DO UPDATE
SET quantity           = EXCLUDED.quantity,
    avg_cost           = EXCLUDED.avg_cost,
    currency           = EXCLUDED.currency,
    last_calculated_at = now()
RETURNING *;
