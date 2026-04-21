package tiers_test

// Matrix tests for the per-tier Limit table. These pin the exact
// numbers + flags so a silent edit to freeLimit/plusLimit/proLimit
// that changes the freemium contract fails loudly.
//
// Two sections below mirror the two axes documented on Limit:
//   - Counters (nil = unlimited).
//   - Feature flags (bool — true = unlocked).

import (
	"testing"

	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/tiers"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
)

func TestFor_TierCounterMatrix(t *testing.T) {
	// Counters use *int so nil means unlimited. A nil test case
	// here means "expect nil"; non-nil cases assert exact value.
	cases := []struct {
		tier              string
		aiMessagesDaily   *int
		connectedAccounts *int
		insightsWeekly    *int
	}{
		{users.TierFree, intPtr(5), intPtr(1), intPtr(3)},
		{users.TierPlus, intPtr(50), intPtr(5), intPtr(20)},
		{users.TierPro, nil, nil, nil},
	}
	for _, tc := range cases {
		t.Run(tc.tier, func(t *testing.T) {
			got := tiers.For(tc.tier)
			assertCounter(t, "AIMessagesDaily", got.AIMessagesDaily, tc.aiMessagesDaily)
			assertCounter(t, "ConnectedAccounts", got.ConnectedAccounts, tc.connectedAccounts)
			assertCounter(t, "InsightsWeekly", got.InsightsWeekly, tc.insightsWeekly)
		})
	}
}

func TestFor_TierFlagMatrix(t *testing.T) {
	// Flags: true = tier unlocks the feature.
	cases := []struct {
		tier              string
		advancedAnalytics bool
		taxReports        bool
		aiChatEnabled     bool
		csvExport         bool
	}{
		{users.TierFree, false, false, true, false},
		{users.TierPlus, false, false, true, true},
		{users.TierPro, true, true, true, true},
	}
	for _, tc := range cases {
		t.Run(tc.tier, func(t *testing.T) {
			got := tiers.For(tc.tier)
			assertFlag(t, "AdvancedAnalytics", got.AdvancedAnalytics, tc.advancedAnalytics)
			assertFlag(t, "TaxReports", got.TaxReports, tc.taxReports)
			assertFlag(t, "AIChatEnabled", got.AIChatEnabled, tc.aiChatEnabled)
			assertFlag(t, "CSVExport", got.CSVExport, tc.csvExport)
		})
	}
}

// TestFor_UnknownTierFallsBackToFree covers the fail-closed branch
// in For() — any subscription_tier string not in the known set
// yields the free limits, not a panic or a generous default.
func TestFor_UnknownTierFallsBackToFree(t *testing.T) {
	got := tiers.For("enterprise-super-duper")
	want := tiers.For(users.TierFree)
	if got.AIMessagesDaily == nil || want.AIMessagesDaily == nil {
		t.Fatalf("nil AIMessagesDaily on free/fallback — regression?")
	}
	if *got.AIMessagesDaily != *want.AIMessagesDaily {
		t.Errorf("fallback AIMessagesDaily = %d, want %d", *got.AIMessagesDaily, *want.AIMessagesDaily)
	}
	if got.CSVExport != want.CSVExport {
		t.Errorf("fallback CSVExport = %v, want %v (free)", got.CSVExport, want.CSVExport)
	}
}

func assertCounter(t *testing.T, name string, got, want *int) {
	t.Helper()
	switch {
	case want == nil && got == nil:
		return
	case want == nil:
		t.Errorf("%s = %d, want nil (unlimited)", name, *got)
	case got == nil:
		t.Errorf("%s = nil (unlimited), want %d", name, *want)
	case *got != *want:
		t.Errorf("%s = %d, want %d", name, *got, *want)
	}
}

func assertFlag(t *testing.T, name string, got, want bool) {
	t.Helper()
	if got != want {
		t.Errorf("%s = %v, want %v", name, got, want)
	}
}

func intPtr(v int) *int { return &v }
