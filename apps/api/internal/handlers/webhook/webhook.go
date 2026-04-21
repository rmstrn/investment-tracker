// Package webhook hosts the provider-neutral pieces of incoming
// webhook handling — signature verification, idempotency claim, and
// event-type dispatch — alongside concrete Provider implementations
// for each upstream (Clerk in clerk.go, Stripe in stripe.go).
//
// Adding a third provider (SnapTrade under TD-046, future Plaid) is
// a three-step job:
//  1. Implement Provider (Source + Verify + Dispatch) in a new file
//     under this package.
//  2. Register it in server.go with webhook.Handle(log, claimer, p).
//  3. Write integration tests that sign real payloads against the
//     provider's verifier stub and hit the route end-to-end.
//
// No copy-paste of the shared flow is needed — that lives here.
package webhook

import (
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/rs/zerolog"

	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/webhookidem"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// VerifiedEvent is the provider-neutral shape the orchestrator hands
// to event handlers once signature verification + envelope parsing
// have succeeded. Data carries the raw per-event payload (Clerk's
// `data` field; Stripe's `event.Data.Raw`); handlers unmarshal it
// into the specific shape they need.
type VerifiedEvent struct {
	// Type is the provider-specific event-type discriminator used to
	// route to the right handler (e.g. "user.created",
	// "customer.subscription.created").
	Type string

	// ID is the canonical idempotency key for this event. Each
	// provider picks the value that uniquely identifies a delivery
	// attempt (svix-id header for Clerk; Event.ID for Stripe).
	ID string

	// Data is the raw event payload — already pulled out of the
	// provider's outer envelope. Handlers json.Unmarshal this into
	// their own typed struct.
	Data []byte
}

// EventHandler is the per-event-type handler signature. Handlers
// own their DB access + logging via closures captured at Provider
// construction time; the orchestrator stays out of that scope.
type EventHandler func(c fiber.Ctx, ev *VerifiedEvent) error

// Provider is the plugin surface for one webhook source. Every
// method runs in-request:
//   - Source returns the webhookidem source label (stable string;
//     matches webhookidem.Source* constants).
//   - Verify checks the request signature against the body + headers
//     and extracts a VerifiedEvent. A non-nil error bounces to 400
//     INVALID_SIGNATURE.
//   - Dispatch returns the routing table from event.Type → handler.
//     Unknown types fall through to a default 200 ACK in Handle.
type Provider interface {
	Source() string
	Verify(body []byte, headers http.Header) (*VerifiedEvent, error)
	Dispatch() map[string]EventHandler
}

// Handle is the shared orchestrator. Flow:
//
//  1. Read body + headers, run p.Verify — invalid sig → 400.
//  2. Require a non-empty event ID (provider returned it via the
//     VerifiedEvent). Missing ID → 400; idempotency would be broken.
//  3. Claim (source, eventID) via the shared webhookidem.Claimer.
//     DB error → 500 so the provider retries. Already-processed →
//     200 immediately (replay).
//  4. Look up the handler in p.Dispatch(). Unknown type → debug log
//     + 200 (we don't want a provider retry storm for event types we
//     deliberately ignore).
//
// The logger is passed explicitly (not from provider-internal state)
// so the same logger wires every webhook without hunting through
// provider impls.
func Handle(log *zerolog.Logger, claimer webhookidem.Claimer, p Provider) fiber.Handler {
	table := p.Dispatch()
	source := p.Source()
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		body := c.Body()
		headers := copyFiberHeaders(c)

		ev, err := p.Verify(body, headers)
		if err != nil {
			log.Warn().Err(err).
				Str("source", source).
				Str("request_id", reqID).
				Msg("webhook_invalid_signature")
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "INVALID_SIGNATURE",
					"signature verification failed"))
		}
		if ev == nil || ev.ID == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR",
					"webhook event missing id"))
		}

		alreadyProcessed, err := claimer.Claim(c.Context(), source, ev.ID)
		if err != nil {
			log.Error().Err(err).
				Str("source", source).
				Str("event_id", ev.ID).
				Str("request_id", reqID).
				Msg("webhook_claim_failed")
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR",
					"idempotency claim failed"))
		}
		if alreadyProcessed {
			log.Debug().
				Str("source", source).
				Str("event_id", ev.ID).
				Str("type", ev.Type).
				Msg("webhook_replay")
			return c.SendStatus(http.StatusOK)
		}

		if h, ok := table[ev.Type]; ok {
			return h(c, ev)
		}
		log.Debug().
			Str("source", source).
			Str("event_id", ev.ID).
			Str("type", ev.Type).
			Msg("webhook_event_ignored")
		return c.SendStatus(http.StatusOK)
	}
}

// copyFiberHeaders materialises the fiber-stored request headers into
// a net/http.Header so SDKs written against stdlib (svix, stripe-go)
// can read them without knowing about fasthttp.
func copyFiberHeaders(c fiber.Ctx) http.Header {
	h := http.Header{}
	for key, value := range c.RequestCtx().Request.Header.All() {
		h.Add(string(key), string(value))
	}
	return h
}

// requestIDFromLocals pulls the request_id that middleware.RequestID
// stamped. Mirrors the helper in package handlers so this package
// does not need to import it.
func requestIDFromLocals(c fiber.Ctx) string {
	if v, ok := c.Locals("request_id").(string); ok {
		return v
	}
	return ""
}
