-- name: GetLatestFXRate :one
SELECT * FROM fx_rates
WHERE base_currency = $1 AND quote_currency = $2
ORDER BY as_of DESC
LIMIT 1;

-- name: GetFXRateOnDate :one
SELECT * FROM fx_rates
WHERE base_currency = $1 AND quote_currency = $2 AND as_of = $3;

-- name: UpsertFXRate :one
INSERT INTO fx_rates (base_currency, quote_currency, rate, as_of, source)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (base_currency, quote_currency, as_of) DO UPDATE
SET rate   = EXCLUDED.rate,
    source = EXCLUDED.source
RETURNING *;
