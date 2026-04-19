-- name: GetLatestFXRate :one
SELECT * FROM fx_rates
WHERE base_currency = $1 AND quote_currency = $2
ORDER BY as_of DESC
LIMIT 1;

-- name: ListLatestFXRates :many
-- Latest cached rate per (base, quote) pair. Optional filters on
-- base / quote narrow the set; as_of is deferred to the handler
-- because a specific-date variant reuses GetFXRateOnDate.
SELECT DISTINCT ON (base_currency, quote_currency)
    base_currency, quote_currency, rate, as_of, source
FROM fx_rates
WHERE (sqlc.narg('base')::text  IS NULL OR base_currency  = sqlc.narg('base')::text)
  AND (sqlc.narg('quote')::text IS NULL OR quote_currency = sqlc.narg('quote')::text)
ORDER BY base_currency, quote_currency, as_of DESC;

-- name: ListFXRatesOnDate :many
-- All cached rates at a specific historical date, filtered by
-- base/quote if given.
SELECT base_currency, quote_currency, rate, as_of, source
FROM fx_rates
WHERE as_of = @as_of
  AND (sqlc.narg('base')::text  IS NULL OR base_currency  = sqlc.narg('base')::text)
  AND (sqlc.narg('quote')::text IS NULL OR quote_currency = sqlc.narg('quote')::text)
ORDER BY base_currency, quote_currency;

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
