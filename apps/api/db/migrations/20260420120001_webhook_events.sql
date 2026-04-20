-- +goose Up
-- +goose StatementBegin

-- =====================================================================
-- webhook_events — idempotency ledger for Clerk + Stripe webhooks.
--
-- Both providers retry aggressively (Stripe: up to 3 days, Clerk/svix:
-- hours) and can replay events that already succeeded if our 200 got
-- lost on the way back. Claiming the `(source, event_id)` row before
-- running any side-effect turns "did I already process this?" into a
-- single atomic INSERT ... ON CONFLICT DO NOTHING RETURNING. If the
-- RETURNING clause yields a row, this process owns the event; if it
-- yields zero rows, another request (or retry) already did the work
-- and we respond 200 immediately without re-dispatching.
--
-- Trade-off accepted for MVP: if the process crashes AFTER the claim
-- but BEFORE finishing the handler's side-effects, the event is marked
-- processed but its effects are incomplete. The provider will retry,
-- see the event as already claimed, and drop it. We rely on the next
-- event of the same type (e.g. the next subscription.updated) to
-- re-assert correct state. Acceptable because (a) Stripe subscription
-- state is eventually consistent on every webhook, and (b) Clerk user
-- lifecycle events are sparse enough that losing one is recoverable
-- by the user re-triggering the action.
--
-- Alternatives considered and rejected for MVP:
--   * Outbox-pattern (side-effects logged into DB in same txn, replayed
--     by worker) — heavier to operate, worthwhile after worker infra
--     lands in TASK_06.
--   * Claim-after-handler — leaves a wider window where a retry could
--     duplicate DB writes before we mark the event processed.
-- =====================================================================
CREATE TABLE webhook_events (
    source       TEXT        NOT NULL CHECK (source IN ('clerk','stripe')),
    event_id     TEXT        NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (source, event_id)
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS webhook_events;
-- +goose StatementEnd
