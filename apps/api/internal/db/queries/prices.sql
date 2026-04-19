-- name: GetPrice :one
SELECT * FROM prices
WHERE symbol = $1 AND asset_type = $2 AND currency = $3;

-- name: GetPricesBatch :many
-- Portfolio calculation fan-out: one round-trip for every unique
-- (symbol, asset_type, currency) in the user's positions.
SELECT * FROM prices
WHERE (symbol, asset_type, currency) IN (
    SELECT UNNEST(@symbols::text[]),
           UNNEST(@asset_types::text[]),
           UNNEST(@currencies::text[])
);

-- name: UpsertPrice :one
INSERT INTO prices (symbol, asset_type, currency, price, as_of, source)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (symbol, asset_type, currency) DO UPDATE
SET price  = EXCLUDED.price,
    as_of  = EXCLUDED.as_of,
    source = EXCLUDED.source
RETURNING *;
