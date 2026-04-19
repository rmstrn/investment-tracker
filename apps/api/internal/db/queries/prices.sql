-- name: GetPrice :one
SELECT * FROM prices
WHERE symbol = $1 AND asset_type = $2 AND currency = $3;

-- name: GetLatestPrice :one
-- Single-quote lookup that is currency-agnostic on input — the
-- MarketQuote API does not require callers to pick a currency.
-- Preference: USD (the market's reporting currency), then most recent
-- by as_of so stale cross-listings are deprioritised.
SELECT * FROM prices
WHERE symbol = $1 AND asset_type = $2
ORDER BY
    CASE currency WHEN 'USD' THEN 0 ELSE 1 END,
    as_of DESC
LIMIT 1;

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
