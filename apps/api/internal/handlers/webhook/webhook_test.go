package webhook

// Unit-level coverage for the webhook helpers that do not touch the
// database or network. Integration coverage of the full request
// path lives in apps/api/internal/handlers/webhook_*_integration_test.go
// (behind the `integration` build tag, docker-gated) — those hit the
// route via HTTP and therefore keep working unchanged across this
// Sprint C refactor.

import (
	"encoding/json"
	"testing"

	stripe "github.com/stripe/stripe-go/v82"
)

func TestBuildPriceToTier_BothSet(t *testing.T) {
	m := BuildPriceToTier("price_plus", "price_pro")
	if got := m["price_plus"]; got != "plus" {
		t.Errorf("plus mapping: got %q, want plus", got)
	}
	if got := m["price_pro"]; got != "pro" {
		t.Errorf("pro mapping: got %q, want pro", got)
	}
	if len(m) != 2 {
		t.Errorf("unexpected map size: %d", len(m))
	}
}

func TestBuildPriceToTier_EmptyEntriesSkipped(t *testing.T) {
	m := BuildPriceToTier("", "price_only_pro")
	if _, ok := m[""]; ok {
		t.Errorf("empty string became a key")
	}
	if got := m["price_only_pro"]; got != "pro" {
		t.Errorf("pro: got %q, want pro", got)
	}
	if len(m) != 1 {
		t.Errorf("unexpected map size: %d", len(m))
	}
}

func TestPrimaryPriceID_HappyPath(t *testing.T) {
	sub := &stripe.Subscription{
		Items: &stripe.SubscriptionItemList{
			Data: []*stripe.SubscriptionItem{
				{Price: &stripe.Price{ID: "price_alpha"}},
			},
		},
	}
	if got := primaryPriceID(sub); got != "price_alpha" {
		t.Errorf("got %q, want price_alpha", got)
	}
}

func TestPrimaryPriceID_EmptyReturnsEmpty(t *testing.T) {
	sub := &stripe.Subscription{}
	if got := primaryPriceID(sub); got != "" {
		t.Errorf("got %q, want empty", got)
	}
}

func TestPrimaryPriceID_SkipsNilEntries(t *testing.T) {
	sub := &stripe.Subscription{
		Items: &stripe.SubscriptionItemList{
			Data: []*stripe.SubscriptionItem{
				nil,
				{Price: nil},
				{Price: &stripe.Price{ID: "price_real"}},
			},
		},
	}
	if got := primaryPriceID(sub); got != "price_real" {
		t.Errorf("got %q, want price_real", got)
	}
}

func TestStripeCustomerID_FromEmbedded(t *testing.T) {
	sub := &stripe.Subscription{Customer: &stripe.Customer{ID: "cus_xyz"}}
	if got := stripeCustomerID(sub); got != "cus_xyz" {
		t.Errorf("got %q, want cus_xyz", got)
	}
}

func TestStripeCustomerID_NilCustomer(t *testing.T) {
	sub := &stripe.Subscription{}
	if got := stripeCustomerID(sub); got != "" {
		t.Errorf("got %q, want empty", got)
	}
}

func TestClerkUserEventDataPrimaryEmail(t *testing.T) {
	tests := []struct {
		name string
		data string
		want string
	}{
		{
			name: "primary match",
			data: `{"primary_email_address_id":"em_2","email_addresses":[{"id":"em_1","email_address":"a@x"},{"id":"em_2","email_address":"b@x"}]}`,
			want: "b@x",
		},
		{
			name: "primary missing falls back to first",
			data: `{"primary_email_address_id":"em_unknown","email_addresses":[{"id":"em_1","email_address":"a@x"}]}`,
			want: "a@x",
		},
		{
			name: "no addresses returns empty",
			data: `{"primary_email_address_id":"em_1","email_addresses":[]}`,
			want: "",
		},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			var d clerkUserEventData
			if err := json.Unmarshal([]byte(tc.data), &d); err != nil {
				t.Fatalf("unmarshal: %v", err)
			}
			if got := d.primaryEmail(); got != tc.want {
				t.Errorf("primaryEmail: got %q, want %q", got, tc.want)
			}
		})
	}
}

func TestRejectAllVerifier_AlwaysErrors(t *testing.T) {
	v := NewClerkVerifier("")
	if err := v.Verify([]byte("anything"), nil); err == nil {
		t.Fatalf("reject-all verifier accepted empty input")
	}
}
