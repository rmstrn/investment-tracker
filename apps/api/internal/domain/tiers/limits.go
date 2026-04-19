// Package tiers centralises the per-tier limit numbers that gate
// freemium features. Reads live here (GET /me/usage); enforcement
// writes live in the rate-limit / idempotency middleware and are
// expected to import the same table so numbers never drift.
package tiers

import (
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
)

// Limit holds the per-counter tier cap. A nil *int means "unlimited"
// and is rendered as JSON null in UsageCounter.limit per openapi.
type Limit struct {
	AIMessagesDaily   *int
	ConnectedAccounts *int
	InsightsWeekly    *int
}

var (
	freeLimit = Limit{
		AIMessagesDaily:   intp(5),
		ConnectedAccounts: intp(1),
		InsightsWeekly:    intp(3),
	}
	plusLimit = Limit{
		AIMessagesDaily:   intp(50),
		ConnectedAccounts: intp(5),
		InsightsWeekly:    intp(20),
	}
	proLimit = Limit{
		AIMessagesDaily:   nil,
		ConnectedAccounts: nil,
		InsightsWeekly:    nil,
	}
)

// For returns the Limit applicable to a user's subscription tier.
// Unknown tier strings fall back to free — fail-closed.
func For(tier string) Limit {
	switch tier {
	case users.TierPlus:
		return plusLimit
	case users.TierPro:
		return proLimit
	default:
		return freeLimit
	}
}

func intp(v int) *int { return &v }
