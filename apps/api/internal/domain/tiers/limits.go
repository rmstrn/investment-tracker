// Package tiers centralises the per-tier limit numbers that gate
// freemium features. Reads live here (GET /me/usage); enforcement
// writes live in the rate-limit / idempotency middleware and are
// expected to import the same table so numbers never drift.
package tiers

import (
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
)

// Limit holds the per-counter tier cap + feature flags. A nil *int
// means "unlimited" (rendered as JSON null in UsageCounter.limit per
// openapi). Bool flags are true when the tier unlocks a feature.
//
// Flags vs counters: a counter ("how many things can you do per
// period") maps to a UsageCounter + quota enforcement; a feature
// flag ("can you use this endpoint at all") maps to a 403
// FEATURE_LOCKED gate. Keep the two axes separate so
// middleware/handler gating reads naturally.
type Limit struct {
	// Counters.
	AIMessagesDaily   *int
	ConnectedAccounts *int
	InsightsWeekly    *int
	// Feature flags.
	AdvancedAnalytics bool // unlocks GET /portfolio/analytics
	TaxReports        bool // unlocks GET /portfolio/tax (+ /tax/export in PR B3)
	AIChatEnabled     bool // unlocks /ai/chat + /ai/chat/stream + /ai/insights/generate
}

var (
	freeLimit = Limit{
		AIMessagesDaily:   intp(5),
		ConnectedAccounts: intp(1),
		InsightsWeekly:    intp(3),
		AIChatEnabled:     true, // MVP: all tiers can chat, capped by AIMessagesDaily.
	}
	plusLimit = Limit{
		AIMessagesDaily:   intp(50),
		ConnectedAccounts: intp(5),
		InsightsWeekly:    intp(20),
		AIChatEnabled:     true,
	}
	proLimit = Limit{
		AIMessagesDaily:   nil,
		ConnectedAccounts: nil,
		InsightsWeekly:    nil,
		AdvancedAnalytics: true,
		TaxReports:        true,
		AIChatEnabled:     true,
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
