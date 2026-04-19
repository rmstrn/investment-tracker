package users_test

import (
	"testing"

	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
)

func TestHasTier(t *testing.T) {
	cases := []struct {
		name     string
		tier     string
		required string
		want     bool
	}{
		{"free meets free", users.TierFree, users.TierFree, true},
		{"free below plus", users.TierFree, users.TierPlus, false},
		{"free below pro", users.TierFree, users.TierPro, false},
		{"plus meets free", users.TierPlus, users.TierFree, true},
		{"plus meets plus", users.TierPlus, users.TierPlus, true},
		{"plus below pro", users.TierPlus, users.TierPro, false},
		{"pro meets all", users.TierPro, users.TierFree, true},
		{"pro meets plus", users.TierPro, users.TierPlus, true},
		{"pro meets pro", users.TierPro, users.TierPro, true},
		{"unknown required fails closed", users.TierPro, "enterprise", false},
		{"unknown have fails closed", "mystery", users.TierFree, false},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			u := &dbgen.User{SubscriptionTier: tc.tier}
			if got := users.HasTier(u, tc.required); got != tc.want {
				t.Fatalf("HasTier(%q, %q) = %v, want %v", tc.tier, tc.required, got, tc.want)
			}
		})
	}
}
