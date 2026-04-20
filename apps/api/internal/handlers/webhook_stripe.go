package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	stripe "github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/webhook"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/webhookidem"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// Supported Stripe event types. Others are ACK-ed with 200 + a debug
// log so our `events_received_total` metric can tell "unhandled" apart
// from "dropped because unknown".
const (
	stripeEventSubscriptionCreated  = "customer.subscription.created"
	stripeEventSubscriptionUpdated  = "customer.subscription.updated"
	stripeEventSubscriptionDeleted  = "customer.subscription.deleted"
	stripeEventInvoicePaymentFailed = "invoice.payment_failed"
)

// Metadata key that /billing/checkout (TD-057) MUST set on the
// CheckoutSession so we can back-reference the user when the
// subscription event arrives before stripe_customer_id is linked.
const stripeMetadataUserIDKey = "user_id"

// StripeWebhookVerifier is the narrow surface the handler depends on.
// Production path wraps stripe-go's webhook.ConstructEvent; tests can
// inject a stub that returns a pre-built event.
type StripeWebhookVerifier interface {
	Construct(payload []byte, sigHeader string) (stripe.Event, error)
}

// stripeSDKVerifier wraps webhook.ConstructEvent so tests can swap in
// a stub without holding a real webhook secret.
type stripeSDKVerifier struct {
	secret string
}

// Construct runs ConstructEvent with the configured secret. We do not
// touch the package-level stripe.Key — that field is used only for
// outbound API calls (not implemented in B3-iii; TD-057) and staying
// off it keeps tests free of global state.
func (v *stripeSDKVerifier) Construct(payload []byte, sigHeader string) (stripe.Event, error) {
	return webhook.ConstructEvent(payload, sigHeader, v.secret)
}

// NewStripeWebhookVerifier returns the production verifier.
func NewStripeWebhookVerifier(secret string) StripeWebhookVerifier {
	return &stripeSDKVerifier{secret: secret}
}

// StripeWebhookDeps gathers handler-specific dependencies. PriceToTier
// is the map from Stripe price_id to our subscription_tier string,
// built from config. Nil values are permitted — an unknown price_id
// logs a warning and leaves the existing tier untouched (fail-open),
// as agreed with PO to avoid 72h retry storms on config drift.
type StripeWebhookDeps struct {
	Claimer     webhookidem.Claimer
	Verifier    StripeWebhookVerifier
	PriceToTier map[string]string
}

// BuildPriceToTier assembles the configured price_id → tier map. Empty
// values are skipped so dev/staging without a Stripe catalog still
// boots; the webhook falls through to warn-on-unknown.
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

// StripeWebhook handles POST /billing/webhook. Flow mirrors the Clerk
// handler: verify first, parse envelope, claim idempotency, dispatch.
// On dispatch errors we return 5xx so Stripe retries.
func StripeWebhook(deps *app.Deps, wh StripeWebhookDeps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		ctx := c.Context()
		body := c.Body()

		sigHeader := string(c.RequestCtx().Request.Header.Peek("Stripe-Signature"))
		event, err := wh.Verifier.Construct(body, sigHeader)
		if err != nil {
			deps.Log.Warn().Err(err).Str("request_id", reqID).
				Msg("stripe_webhook_invalid_signature")
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "INVALID_SIGNATURE", "stripe signature verification failed"))
		}

		if event.ID == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "stripe event missing id"))
		}

		alreadyProcessed, err := wh.Claimer.Claim(ctx, webhookidem.SourceStripe, event.ID)
		if err != nil {
			deps.Log.Error().Err(err).Str("request_id", reqID).Str("event_id", event.ID).
				Msg("stripe_webhook_claim_failed")
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "idempotency claim failed"))
		}
		if alreadyProcessed {
			deps.Log.Debug().Str("event_id", event.ID).Str("type", string(event.Type)).
				Msg("stripe_webhook_replay")
			return c.SendStatus(http.StatusOK)
		}

		switch string(event.Type) {
		case stripeEventSubscriptionCreated, stripeEventSubscriptionUpdated:
			return handleStripeSubscriptionUpsert(c, deps, wh, reqID, &event)
		case stripeEventSubscriptionDeleted:
			return handleStripeSubscriptionDeleted(c, deps, reqID, &event)
		case stripeEventInvoicePaymentFailed:
			return handleStripeInvoicePaymentFailed(c, deps, reqID, &event)
		default:
			deps.Log.Debug().Str("type", string(event.Type)).Str("event_id", event.ID).
				Msg("stripe_webhook_event_ignored")
			return c.SendStatus(http.StatusOK)
		}
	}
}

// handleStripeSubscriptionUpsert processes customer.subscription.created
// and .updated. Tier is looked up from the configured price_id map;
// an unknown price_id yields a warn + skip (tier unchanged). Status
// values that indicate the subscription is not yet entitled (incomplete
// etc.) also skip the tier write — they'll fire a second event when
// entitled.
func handleStripeSubscriptionUpsert(
	c fiber.Ctx, deps *app.Deps, wh StripeWebhookDeps, reqID string, event *stripe.Event,
) error {
	var sub stripe.Subscription
	if err := json.Unmarshal(event.Data.Raw, &sub); err != nil {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid subscription payload"))
	}

	user, err := resolveStripeUser(c.Context(), deps, &sub)
	if err != nil {
		if errors.Is(err, errStripeUserUnresolved) {
			deps.Log.Warn().
				Str("event_id", event.ID).
				Str("stripe_customer_id", stripeCustomerID(&sub)).
				Str("subscription_id", sub.ID).
				Msg("stripe_webhook_user_unresolved")
			return c.SendStatus(http.StatusOK)
		}
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load user"))
	}

	// Only 'active' and 'trialing' grant entitlements. Other statuses
	// either wait for payment (incomplete) or are terminal (canceled,
	// unpaid) — subscription.deleted handles terminal downgrade.
	if sub.Status != stripe.SubscriptionStatusActive && sub.Status != stripe.SubscriptionStatusTrialing {
		deps.Log.Debug().
			Str("event_id", event.ID).
			Str("subscription_id", sub.ID).
			Str("status", string(sub.Status)).
			Msg("stripe_webhook_subscription_non_entitling_status")
		return c.SendStatus(http.StatusOK)
	}

	priceID := primaryPriceID(&sub)
	if priceID == "" {
		deps.Log.Warn().
			Str("event_id", event.ID).
			Str("subscription_id", sub.ID).
			Msg("stripe_webhook_subscription_without_price")
		return c.SendStatus(http.StatusOK)
	}

	tier, ok := wh.PriceToTier[priceID]
	if !ok {
		deps.Log.Warn().
			Str("event_id", event.ID).
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

	// UpdateUserSubscription preserves stripe_customer_id on nil via
	// COALESCE; same principle applies on the deleted path below —
	// keep customer_id on cancel so a resubscribe flow can reuse the
	// existing Stripe customer record instead of creating a new one.
	if _, err := dbgen.New(deps.Pool).UpdateUserSubscription(c.Context(), dbgen.UpdateUserSubscriptionParams{
		ID:               user.ID,
		SubscriptionTier: tier,
		StripeCustomerID: customerIDArg,
	}); err != nil {
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to update subscription"))
	}
	deps.Log.Info().
		Str("event_id", event.ID).
		Str("user_id", user.ID.String()).
		Str("tier", tier).
		Msg("stripe_webhook_subscription_applied")
	return c.SendStatus(http.StatusOK)
}

// handleStripeSubscriptionDeleted downgrades the user to the free tier.
// Runs on both the customer-initiated cancel-at-period-end flow once the
// period actually ends and on immediate cancellations.
func handleStripeSubscriptionDeleted(
	c fiber.Ctx, deps *app.Deps, reqID string, event *stripe.Event,
) error {
	var sub stripe.Subscription
	if err := json.Unmarshal(event.Data.Raw, &sub); err != nil {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid subscription payload"))
	}

	user, err := resolveStripeUser(c.Context(), deps, &sub)
	if err != nil {
		if errors.Is(err, errStripeUserUnresolved) {
			deps.Log.Warn().
				Str("event_id", event.ID).
				Str("stripe_customer_id", stripeCustomerID(&sub)).
				Msg("stripe_webhook_user_unresolved")
			return c.SendStatus(http.StatusOK)
		}
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load user"))
	}

	// keep customer_id on cancel — resubscribe flow relies on existing
	// Stripe customer record (no PII risk, and a fresh customer id on
	// every cancel/resub cycle breaks Stripe's reporting + the billing
	// portal link that TD-057 ships).
	if _, err := dbgen.New(deps.Pool).UpdateUserSubscription(c.Context(), dbgen.UpdateUserSubscriptionParams{
		ID:               user.ID,
		SubscriptionTier: users.TierFree,
		StripeCustomerID: nil,
	}); err != nil {
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to downgrade subscription"))
	}
	deps.Log.Info().
		Str("event_id", event.ID).
		Str("user_id", user.ID.String()).
		Msg("stripe_webhook_subscription_cancelled")
	return c.SendStatus(http.StatusOK)
}

// handleStripeInvoicePaymentFailed logs the failure; user-facing
// notification (email + in-app) will ride the notifications pipeline
// once the notifications worker lands — for MVP we ack 200 + metric.
func handleStripeInvoicePaymentFailed(
	c fiber.Ctx, deps *app.Deps, reqID string, event *stripe.Event,
) error {
	var inv stripe.Invoice
	if err := json.Unmarshal(event.Data.Raw, &inv); err != nil {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid invoice payload"))
	}
	customerID := ""
	if inv.Customer != nil {
		customerID = inv.Customer.ID
	}
	deps.Log.Warn().
		Str("event_id", event.ID).
		Str("invoice_id", inv.ID).
		Str("stripe_customer_id", customerID).
		Int64("amount_due_cents", inv.AmountDue).
		Msg("stripe_webhook_invoice_payment_failed")
	return c.SendStatus(http.StatusOK)
}

// errStripeUserUnresolved signals that we received a valid Stripe
// event but could not locate the corresponding user in our DB. Common
// causes: /billing/checkout not yet shipped (TD-057) so
// stripe_customer_id has never been linked; or test-clock events
// mis-routed. Caller translates to warn + 200.
var errStripeUserUnresolved = errors.New("stripe user unresolved")

// resolveStripeUser finds the local user for a Stripe subscription.
// Priority: (1) users.stripe_customer_id = sub.customer, (2) metadata
// "user_id" on the subscription. Returns errStripeUserUnresolved if
// neither resolves.
func resolveStripeUser(
	ctx context.Context, deps *app.Deps, sub *stripe.Subscription,
) (*dbgen.User, error) {
	customerID := stripeCustomerID(sub)
	q := dbgen.New(deps.Pool)

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

// stripeCustomerID extracts the Customer ID from either the embedded
// Customer struct (when Stripe expanded the field) or the raw string
// ID (the default, unexpanded case).
func stripeCustomerID(sub *stripe.Subscription) string {
	if sub.Customer == nil {
		return ""
	}
	return sub.Customer.ID
}

// primaryPriceID returns the price ID of the first subscription item.
// MVP assumption: one item per subscription (single product catalog).
// Multi-item subscriptions would require per-item tier logic, tracked
// under TD-057.
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
