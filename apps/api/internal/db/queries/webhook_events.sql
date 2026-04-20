-- name: ClaimWebhookEvent :one
-- Atomic idempotency claim. Returns the row's processed_at when this
-- call is the first to see (source, event_id); returns pgx.ErrNoRows
-- when another call / retry has already claimed it. Handlers MUST call
-- this BEFORE any side-effect and short-circuit to 200 on ErrNoRows.
INSERT INTO webhook_events (source, event_id)
VALUES ($1, $2)
ON CONFLICT (source, event_id) DO NOTHING
RETURNING processed_at;
