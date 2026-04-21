package webhook

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	stripe "github.com/stripe/stripe-go/v82"
	stripewebhook "github.com/stripe/stripe-go/v82/webhook"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/webhookidem"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// Supported Stripe event types. Others are ACK-ed with 200 + a
// debug log (handled by the orchestrator in webhook.go) so our
// `events_received_total` metric can tell "unhandled" apart from
// "dropped because unknown".
const (
	stripeEventSubscriptionCreated  = "customer.subscription.created"
	stripeEventSubscriptionUpdated  = "customer.subscription.updated"
	stripeEventSubscriptionDeleted  = "customer.subscription.deleted"
	stripeEventInvoicePaymentFailed = "invoice.payment_failed"
)

// stripeMetadataUserIDKey is the metadata key that /billing/checkout
// (TD-057) MUST set on the CheckoutSession so we can back-reference
// the user when the subscription event arrives before
// stripe_customer_id is linked.
const stripeMetadataUserIDKey = "user_id"

// StripeVerifier is the narrow surface the provider depends on.
// Production path wraps stripe-go's webhook.ConstructEvent; tests
// can inject a stub that returns a pre-built event.
type StripeVerifier interface {
	Construct(payload []byte, sigHeader string) (stripe.Event, error)
}

// stripeSDKVerifier wraps webhook.ConstructEvent so tests can swap
// in a stub without holding a real webhook secret. We do not touch
// the package-level stripe.Key — that field is used only for
// outbound API calls (TD-057) and staying off it keeps tests free
// of global state.
type stripeSDKVerifier struct{ secret string }

func (v *stripeSDKVerifier) Construct(payload []byte, sigHeader string) (stripe.Event, error) {
	return stripewebhook.ConstructEvent(payload, sigHeader, v.secret)
}

// NewStripeVerifier returns the production verifier.
func NewStripeVerifier(secret string) StripeVerifier {
	return &stripeSDKVerifier{secret: secret}
}

// StripeProvider implements Provider for Stripe webhooks
// (POST /billing/webhook). PriceToTier is the map from Stripe
// price_id to our subscription_tier string, built from config. An
// unknown price_id logs a warning and leaves the existing tier
// untouched (fail-open), as agreed with PO to avoid 72h retry
// storms on config drift.
type StripeProvider struct {
	deps        *app.Deps
	verifier    StripeVerifier
	priceToTier map[string]string
}

// NewStripeProvider builds a provider wired to the given deps,
// webhook secret, and price-id-to-tier map (see BuildPriceToTier).
func NewStripeProvider(deps *app.Deps, secret string, priceToTier map[string]string) *StripeProvider {
	return &StripeProvider{
		deps:        deps,
		verifier:    NewStripeVerifier(secret),
		priceToTier: priceToTier,
	}
}

// NewStripeProviderWithVerifier is the seam for tests that want to
// inject a pre-built verifier stub.
func NewStripeProviderWithVerifier(
	deps *app.Deps, v StripeVerifier, priceToTier map[string]string,
) *StripeProvider {
	return &StripeProvider{deps: deps, verifier: v, priceToTier: priceToTier}
}

// BuildPriceToTier assembles the configured price_id → tier map.
// Empty values are skipped so dev/staging without a Stripe catalog
// still boots; the webhook falls through to warn-on-unknown.
func BuildPriceToTier(pricePlus, pricePro string) map[string]string {
	m := map[string]string{}
	if pricePlus != "" {
		m[pricePlus] = users.TierPlus
	}
	if pricePro != "" {
		m[pricePro] = users.TierPro
	}
	return m
}

// Source satisfies Provider.
func (p *StripeProvider) Source() string { return webhookidem.SourceStripe }

// Verify runs stripe-go's ConstructEvent and wraps the resulting
// Event into a VerifiedEvent. The canonical idempotency key is
// Event.ID.
//
// The stripe.Event carries its own Data.Raw payload, which we
// propagate into VerifiedEvent.Data — handlers json.Unmarshal that
// into stripe.Subscription / stripe.Invoice as needed.
func (p *StripeProvider) Verify(body []byte, headers http.Header) (*VerifiedEvent, error) {
	event, err := p.verifier.Construct(body, headers.Get("Stripe-Signature"))
	if err != nil {
		return nil, err
	}
	return &VerifiedEvent{Type: string(event.Type), ID: event.ID, Data: event.Data.Raw}, nil
}

// Dispatch wires the event-type → handler table. The two upsert
// events share a handler (created and updated have identical
// semantics once we have the current state of the subscription).
func (p *StripeProvider) Dispatch() map[string]EventHandler {
	return map[string]EventHandler{
		stripeEventSubscriptionCreated:  p.handleSubscriptionUpsert,
		stripeEventSubscriptionUpdated:  p.handleSubscriptionUpsert,
		stripeEventSubscriptionDeleted:  p.handleSubscriptionDeleted,
		stripeEventInvoicePaymentFailed: p.handleInvoicePaymentFailed,
	}
}

// handleSubscriptionUpsert processes subscription.created/updated.
// Tier is looked up from the configured price_id map; an unknown
// price_id yields warn + skip (tier unchanged). Non-entitling
// statuses (incomplete etc.) also skip; a second event fires when
// entitled.
func (p *StripeProvider) handleSubscriptionUpsert(c fiber.Ctx, ev *VerifiedEvent) error {
	reqID := requestIDFromLocals(c)
	var sub stripe.Subscription
	if err := json.Unmarshal(ev.Data, &sub); err != nil {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid subscription payload"))
	}
	user, err := p.resolveUser(c.Context(), &sub)
	if err != nil {
		if errors.Is(err, errStripeUserUnresolved) {
			p.deps.Log.Warn().
				Str("event_id", ev.ID).
				Str("stripe_customer_id", stripeCustomerID(&sub)).
				Str("subscription_id", sub.ID).
				Msg("stripe_webhook_user_unresolved")
			return c.SendStatus(http.StatusOK)
		}
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load user"))
	}

	// Only 'active' and 'trialing' grant entitlements. Others either
	// wait for payment (incomplete) or are terminal (canceled,
	// unpaid) — subscription.deleted handles terminal downgrade.
	if sub.Status != stripe.SubscriptionStatusActive && sub.Status != stripe.SubscriptionStatusTrialing {
		p.deps.Log.Debug().
			Str("event_id", ev.ID).
			Str("subscription_id", sub.ID).
			Str("status", string(sub.Status)).
			Msg("stripe_webhook_subscription_non_entitling_status")
		return c.SendStatus(http.StatusOK)
	}

	priceID := primaryPriceID(&sub)
	if priceID == "" {
		p.deps.Log.Warn().
			Str("event_id", ev.ID).
			Str("subscription_id", sub.ID).
			Msg("stripe_webhook_subscription_without_price")
		return c.SendStatus(http.StatusOK)
	}
	tier, ok := p.priceToTier[priceID]
	if !ok {
		p.deps.Log.Warn().
			Str("event_id", ev.ID).
			Str("subscription_id", sub.ID).
			Str("price_id", priceID).
			Str("stripe_customer_id", stripeCustomerID(&sub)).
			Msg("stripe_webhook_unknown_price")
		return c.SendStatus(http.StatusOK)
	}

	customerID := stripeCustomerID(&sub)
	var customerIDArg *string
	if customerID != "" && (user.StripeCustomerID == nil || *user.StripeCustomerID != customerID) {
		customerIDArg = &customerID
	}

	if _, err := dbgen.New(p.deps.Pool).UpdateUserSubscription(c.Context(), dbgen.UpdateUserSubscriptionParams{
		ID:               user.ID,
		SubscriptionTier: tier,
		StripeCustomerID: customerIDArg,
	}); err != nil {
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to update subscription"))
	}
	p.deps.Log.Info().
		Str("event_id", ev.ID).
		Str("user_id", user.ID.String()).
		Str("tier", tier).
		Msg("stripe_webhook_subscription_applied")
	return c.SendStatus(http.StatusOK)
}

// handleSubscriptionDeleted downgrades the user to the free tier.
// Runs on both the customer-initiated cancel-at-period-end flow once
// the period actually ends and on immediate cancellations.
func (p *StripeProvider) handleSubscriptionDeleted(c fiber.Ctx, ev *VerifiedEvent) error {
	reqID := requestIDFromLocals(c)
	var sub stripe.Subscription
	if err := json.Unmarshal(ev.Data, &sub); err != nil {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid subscription payload"))
	}
	user, err := p.resolveUser(c.Context(), &sub)
	if err != nil {
		if errors.Is(err, errStripeUserUnresolved) {
			p.deps.Log.Warn().
				Str("event_id", ev.ID).
				Str("stripe_customer_id", stripeCustomerID(&sub)).
				Msg("stripe_webhook_user_unresolved")
			return c.SendStatus(http.StatusOK)
		}
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load user"))
	}

	// keep customer_id on cancel — resubscribe flow relies on
	// existing Stripe customer record (no PII risk, and a fresh
	// customer id on every cancel/resub cycle breaks Stripe's
	// reporting + the billing portal link that TD-057 ships).
	if _, err := dbgen.New(p.deps.Pool).UpdateUserSubscription(c.Context(), dbgen.UpdateUserSubscriptionParams{
		ID:               user.ID,
		SubscriptionTier: users.TierFree,
		StripeCustomerID: nil,
	}); err != nil {
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to downgrade subscription"))
	}
	p.deps.Log.Info().
		Str("event_id", ev.ID).
		Str("user_id", user.ID.String()).
		Msg("stripe_webhook_subscription_cancelled")
	return c.SendStatus(http.StatusOK)
}

// handleInvoicePaymentFailed logs the failure; user-facing
// notification (email + in-app) will ride the notifications
// pipeline once the notifications worker lands — for MVP we ack
// 200 + metric.
func (p *StripeProvider) handleInvoicePaymentFailed(c fiber.Ctx, ev *VerifiedEvent) error {
	reqID := requestIDFromLocals(c)
	var inv stripe.Invoice
	if err := json.Unmarshal(ev.Data, &inv); err != nil {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid invoice payload"))
	}
	customerID := ""
	if inv.Customer != nil {
		customerID = inv.Customer.ID
	}
	p.deps.Log.Warn().
		Str("event_id", ev.ID).
		Str("invoice_id", inv.ID).
		Str("stripe_customer_id", customerID).
		Int64("amount_due_cents", inv.AmountDue).
		Msg("stripe_webhook_invoice_payment_failed")
	return c.SendStatus(http.StatusOK)
}

// errStripeUserUnresolved signals that we received a valid Stripe
// event but could not locate the corresponding user in our DB.
// Common causes: /billing/checkout not yet shipped (TD-057) so
// stripe_customer_id has never been linked; or test-clock events
// mis-routed. Caller translates to warn + 200.
var errStripeUserUnresolved = errors.New("stripe user unresolved")

// resolveUser finds the local user for a Stripe subscription.
// Priority: (1) users.stripe_customer_id = sub.customer,
// (2) metadata "user_id" on the subscription. Returns
// errStripeUserUnresolved if neither resolves.
func (p *StripeProvider) resolveUser(ctx context.Context, sub *stripe.Subscription) (*dbgen.User, error) {
	customerID := stripeCustomerID(sub)
	q := dbgen.New(p.deps.Pool)

	if customerID != "" {
		row, err := q.GetUserByStripeCustomerID(ctx, &customerID)
		if err == nil {
			return &row, nil
		}
		if !errors.Is(err, pgx.ErrNoRows) {
			return nil, err
		}
	}

	if idStr, ok := sub.Metadata[stripeMetadataUserIDKey]; ok && idStr != "" {
		uid, err := uuid.Parse(idStr)
		if err == nil {
			row, err := q.GetUserByID(ctx, uid)
			if err == nil {
				return &row, nil
			}
			if !errors.Is(err, pgx.ErrNoRows) {
				return nil, err
			}
		}
	}

	return nil, errStripeUserUnresolved
}

// stripeCustomerID extracts the Customer ID from either the
// embedded Customer struct (when Stripe expanded the field) or the
// raw string ID (the default, unexpanded case).
func stripeCustomerID(sub *stripe.Subscription) string {
	if sub.Customer == nil {
		return ""
	}
	return sub.Customer.ID
}

// primaryPriceID returns the price ID of the first subscription
// item. MVP assumption: one item per subscription (single product
// catalog). Multi-item subscriptions would require per-item tier
// logic, tracked under TD-057.
func primaryPriceID(sub *stripe.Subscription) string {
	if sub.Items == nil {
		return ""
	}
	for _, item := range sub.Items.Data {
		if item == nil || item.Price == nil {
			continue
		}
		return item.Price.ID
	}
	return ""
}
