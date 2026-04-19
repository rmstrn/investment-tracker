// Package users holds the user aggregate: persistence, tier logic, and
// the GetOrCreateByClerkID path used by the auth middleware.
package users

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
)

// User is the domain representation — thin wrapper so we can evolve without
// leaking pgtype / dbgen shapes into handlers.
type User = dbgen.User

// Tier values — must match the CHECK constraint on users.subscription_tier.
const (
	TierFree = "free"
	TierPlus = "plus"
	TierPro  = "pro"
)

// HasTier reports whether u's subscription covers at least `required`.
// Ordering: free < plus < pro. Invalid tier strings return false.
func HasTier(u *User, required string) bool {
	rank := map[string]int{TierFree: 0, TierPlus: 1, TierPro: 2}
	have, haveOK := rank[u.SubscriptionTier]
	need, needOK := rank[required]
	if !haveOK || !needOK {
		return false
	}
	return have >= need
}

// Repo persists users.
type Repo struct {
	q *dbgen.Queries
}

// NewRepo builds a Repo bound to a pgx pool.
func NewRepo(pool *pgxpool.Pool) *Repo {
	return &Repo{q: dbgen.New(pool)}
}

// GetByClerkID returns the user for a Clerk ID, or ErrNotFound.
func (r *Repo) GetByClerkID(ctx context.Context, clerkUserID string) (*User, error) {
	row, err := r.q.GetUserByClerkID(ctx, clerkUserID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("users: get by clerk id: %w", err)
	}
	return &row, nil
}

// GetByID returns the user for a UUID, or ErrNotFound. Used by the
// internal-auth middleware path where the caller has authenticated via
// a shared-secret bearer token and identifies the user via X-User-Id
// instead of a Clerk JWT.
func (r *Repo) GetByID(ctx context.Context, id uuid.UUID) (*User, error) {
	row, err := r.q.GetUserByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("users: get by id: %w", err)
	}
	return &row, nil
}

// GetOrCreateByClerkID returns the existing user or creates a skeleton
// record. Email is populated from the JWT when the Clerk webhook has not
// yet fired. The webhook update path is handled elsewhere.
func (r *Repo) GetOrCreateByClerkID(ctx context.Context, clerkUserID, email string) (*User, error) {
	row, err := r.q.GetUserByClerkID(ctx, clerkUserID)
	if err == nil {
		return &row, nil
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, fmt.Errorf("users: lookup: %w", err)
	}

	// Create a skeleton — email may be empty if the ID token omitted it.
	id, err := uuid.NewV7()
	if err != nil {
		return nil, fmt.Errorf("users: uuid: %w", err)
	}

	// Set default display currency and locale; Clerk webhook can update.
	created, err := r.q.CreateUser(ctx, dbgen.CreateUserParams{
		ID:               id,
		ClerkUserID:      clerkUserID,
		Email:            email,
		DisplayCurrency:  "USD",
		Locale:           "en",
		SubscriptionTier: TierFree,
		StripeCustomerID: nil,
	})
	if err != nil {
		// Another concurrent request may have created the user; retry lookup.
		if again, lookupErr := r.q.GetUserByClerkID(ctx, clerkUserID); lookupErr == nil {
			return &again, nil
		}
		return nil, fmt.Errorf("users: create: %w", err)
	}
	return &created, nil
}

// ErrNotFound is returned when a user lookup finds no row.
var ErrNotFound = errors.New("users: not found")
