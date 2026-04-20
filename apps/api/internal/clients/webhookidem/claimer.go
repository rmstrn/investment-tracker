// Package webhookidem implements the idempotency-claim pattern shared
// by Clerk and Stripe webhook handlers.
//
// Provider retries (Stripe up to 3 days, Clerk via svix for hours)
// mean the same `event_id` can arrive multiple times. Every handler
// calls Claim() as its very first side-effect; on already-processed
// replays it returns 200 without re-running the handler. The claim
// itself is an atomic INSERT ... ON CONFLICT DO NOTHING RETURNING
// against webhook_events (source, event_id).
//
// See apps/api/db/migrations/20260420120001_webhook_events.sql for
// the schema rationale and the crash-window trade-off.
package webhookidem

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
)

// Source labels are constants so typos fail at compile time rather
// than silently producing a divergent ledger row.
const (
	SourceClerk  = "clerk"
	SourceStripe = "stripe"
)

// Claimer is the surface handlers depend on. A pool-backed default is
// constructed via NewPool(); tests that do not want a live PG can
// supply a fake.
type Claimer interface {
	Claim(ctx context.Context, source, eventID string) (alreadyProcessed bool, err error)
}

// PoolClaimer runs the claim against a pgx pool using the sqlc-
// generated query. Safe for concurrent use.
type PoolClaimer struct {
	pool *pgxpool.Pool
}

// NewPool builds a Claimer backed by a pgx pool.
func NewPool(pool *pgxpool.Pool) *PoolClaimer {
	return &PoolClaimer{pool: pool}
}

// Claim attempts to insert (source, event_id) into webhook_events.
// Returns (true, nil) when the row already existed — the caller should
// short-circuit to 200. Returns (false, nil) when the claim is fresh
// and the caller owns the dispatch. A non-nil error means the check
// itself failed (connection, constraint violation other than the PK)
// and the caller should return 5xx so the provider retries.
func (c *PoolClaimer) Claim(ctx context.Context, source, eventID string) (bool, error) {
	if source == "" || eventID == "" {
		return false, fmt.Errorf("webhookidem: source and event_id are required")
	}
	_, err := dbgen.New(c.pool).ClaimWebhookEvent(ctx, dbgen.ClaimWebhookEventParams{
		Source:  source,
		EventID: eventID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		return true, nil
	}
	if err != nil {
		return false, fmt.Errorf("webhookidem: claim: %w", err)
	}
	return false, nil
}
