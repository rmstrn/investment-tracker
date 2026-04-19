-- name: GetLatestSnapshotByUser :one
SELECT * FROM portfolio_snapshots
WHERE user_id = $1
ORDER BY snapshot_date DESC
LIMIT 1;

-- name: ListSnapshotsByUserSince :many
-- Drives the /portfolio/history endpoint. $2 is the inclusive start date.
SELECT * FROM portfolio_snapshots
WHERE user_id = $1 AND snapshot_date >= $2
ORDER BY snapshot_date ASC;

-- name: UpsertPortfolioSnapshot :one
INSERT INTO portfolio_snapshots (
    id, user_id, snapshot_date, base_currency,
    total_value_base, total_cost_base,
    allocation, by_asset_type, by_currency
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT (user_id, snapshot_date) DO UPDATE
SET total_value_base = EXCLUDED.total_value_base,
    total_cost_base  = EXCLUDED.total_cost_base,
    allocation       = EXCLUDED.allocation,
    by_asset_type    = EXCLUDED.by_asset_type,
    by_currency      = EXCLUDED.by_currency
RETURNING *;
