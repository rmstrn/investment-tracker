package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// Billing CRUD stubs (TD-057).
//
// `/billing/webhook` is fully implemented in B3-iii — the endpoints
// below are the client-facing side of the Stripe integration and
// depend on a live product/price catalog plus a persisted
// stripe_customer_id link. That infrastructure (Stripe product IDs,
// real checkout flow, Customer Portal config) lands after PR C so
// staging can exercise the webhook against a real Stripe test
// environment first. Until then every endpoint here returns 501.
//
// When the deferred slice lands, these stubs get their real bodies
// and TD-057 closes. `/billing/webhook` stays untouched.

// GetBillingSubscription returns the caller's current subscription
// state. Stub — will read from users.subscription_tier once the
// billing slice lands (TD-057).
func GetBillingSubscription(deps *app.Deps) fiber.Handler {
	return notImplementedBilling("billing subscription read")
}

// CreateBillingCheckout opens a Stripe Checkout Session. Stub —
// requires prod Stripe price catalog (TD-057).
func CreateBillingCheckout(deps *app.Deps) fiber.Handler {
	return notImplementedBilling("checkout session")
}

// CreateBillingPortal issues a Stripe Billing Portal link. Stub —
// requires prod Customer Portal config (TD-057).
func CreateBillingPortal(deps *app.Deps) fiber.Handler {
	return notImplementedBilling("billing portal")
}

// ListBillingInvoices lists past invoices. Stub — requires Stripe
// client wiring (TD-057).
func ListBillingInvoices(deps *app.Deps) fiber.Handler {
	return notImplementedBilling("billing invoices list")
}

// SubmitCancellationFeedback records a cancellation survey answer.
// Stub — requires the cancellation_feedback table and UI flow
// (TD-057).
func SubmitCancellationFeedback(deps *app.Deps) fiber.Handler {
	return notImplementedBilling("cancellation feedback")
}

func notImplementedBilling(feature string) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		return errs.Respond(c, reqID,
			errs.New(http.StatusNotImplemented, "NOT_IMPLEMENTED",
				feature+" lands in the billing CRUD slice (TD-057); /billing/webhook is live"))
	}
}
