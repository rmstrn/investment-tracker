package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/hibiken/asynq"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/asynqpub"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/webhookidem"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// ClerkWebhookVerifier is the narrow surface the handler depends on
// so tests can inject a stub without holding a real svix secret. The
// default implementation in NewClerkWebhookVerifier wraps
// github.com/svix/svix-webhooks/go.
type ClerkWebhookVerifier interface {
	Verify(payload []byte, headers http.Header) error
}

// ClerkWebhookDeps gathers everything the handler needs beyond Deps.
// Keeping claimer + verifier explicit lets tests wire stubs; in main
// both are constructed once during server assembly.
type ClerkWebhookDeps struct {
	Claimer  webhookidem.Claimer
	Verifier ClerkWebhookVerifier
}

// ClerkWebhook handles POST /auth/webhook — svix-signed Clerk events
// for the user lifecycle. Supported types: user.created, user.updated,
// user.deleted. Unknown types are ACK-ed (200) and logged.
//
// Flow: (1) Verify svix signature against CLERK_WEBHOOK_SECRET before
// touching DB — invalid sig → 400, never claimed. (2) Parse envelope
// type + data. (3) Claim (source='clerk', event_id=svix-id) atomically;
// replay → 200 immediately. (4) Dispatch to the per-type handler, which
// is responsible for its own error -> HTTP status mapping. On DB errors
// returns 5xx so svix retries.
//
// Idempotency trade-off: claim lives in a separate implicit txn from
// the side-effects. A process crash between claim and effect leaves
// the event marked processed but incomplete. See the migration file
// header for the rationale for accepting this in MVP.
func ClerkWebhook(deps *app.Deps, wh ClerkWebhookDeps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		ctx := c.Context()
		body := c.Body()

		headers := copyFiberHeaders(c)
		if err := wh.Verifier.Verify(body, headers); err != nil {
			deps.Log.Warn().Err(err).Str("request_id", reqID).
				Msg("clerk_webhook_invalid_signature")
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "INVALID_SIGNATURE", "svix signature verification failed"))
		}

		var envelope struct {
			Type string          `json:"type"`
			Data json.RawMessage `json:"data"`
		}
		if err := json.Unmarshal(body, &envelope); err != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid clerk event payload"))
		}

		// svix-id is the canonical idempotency key — Clerk's event `data.id`
		// can change shape per event type (user.id vs session.id etc.).
		eventID := string(c.RequestCtx().Request.Header.Peek("svix-id"))
		if eventID == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "missing svix-id header"))
		}

		alreadyProcessed, err := wh.Claimer.Claim(ctx, webhookidem.SourceClerk, eventID)
		if err != nil {
			deps.Log.Error().Err(err).Str("request_id", reqID).Str("svix_id", eventID).
				Msg("clerk_webhook_claim_failed")
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "idempotency claim failed"))
		}
		if alreadyProcessed {
			deps.Log.Debug().Str("svix_id", eventID).Str("type", envelope.Type).
				Msg("clerk_webhook_replay")
			return c.SendStatus(http.StatusOK)
		}

		switch envelope.Type {
		case "user.created":
			return handleClerkUserCreated(c, deps, reqID, envelope.Data)
		case "user.updated":
			return handleClerkUserUpdated(c, deps, reqID, envelope.Data)
		case "user.deleted":
			return handleClerkUserDeleted(c, deps, reqID, envelope.Data)
		default:
			// Unsupported event — ACK and log. Clerk will not retry a 2xx,
			// so this prevents dead-letter buildup for event types the app
			// deliberately ignores (organization.*, session.*, etc.).
			deps.Log.Debug().Str("type", envelope.Type).Str("svix_id", eventID).
				Msg("clerk_webhook_event_ignored")
			return c.SendStatus(http.StatusOK)
		}
	}
}

// copyFiberHeaders materialises the request headers into a go
// net/http.Header so the svix SDK can read them without knowing
// about fasthttp.
func copyFiberHeaders(c fiber.Ctx) http.Header {
	h := http.Header{}
	for key, value := range c.RequestCtx().Request.Header.All() {
		h.Add(string(key), string(value))
	}
	return h
}

// clerkUserEventData is the subset of Clerk's user payload we actually
// read. Other fields (first_name, profile_image_url, …) are ignored —
// we only sync identity + lifecycle flags.
type clerkUserEventData struct {
	ID             string `json:"id"`
	PrimaryEmailID string `json:"primary_email_address_id"`
	EmailAddresses []struct {
		ID           string `json:"id"`
		EmailAddress string `json:"email_address"`
	} `json:"email_addresses"`
	Deleted bool `json:"deleted"`
}

// primaryEmail returns the Clerk-designated primary email address if
// present. Falls back to the first entry when primary_email_address_id
// is missing, and to an empty string when the user has no addresses.
func (d *clerkUserEventData) primaryEmail() string {
	for _, e := range d.EmailAddresses {
		if e.ID == d.PrimaryEmailID {
			return e.EmailAddress
		}
	}
	if len(d.EmailAddresses) > 0 {
		return d.EmailAddresses[0].EmailAddress
	}
	return ""
}

// handleClerkUserCreated upserts a local user row mirroring the Clerk
// identity. If the user already exists (first API call via Clerk JWT
// races the webhook), this is a no-op at repository level.
func handleClerkUserCreated(c fiber.Ctx, deps *app.Deps, reqID string, raw json.RawMessage) error {
	var data clerkUserEventData
	if err := json.Unmarshal(raw, &data); err != nil {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid clerk user.created payload"))
	}
	if data.ID == "" {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "missing user id in clerk event"))
	}

	repo := users.NewRepo(deps.Pool)
	if _, err := repo.GetOrCreateByClerkID(c.Context(), data.ID, data.primaryEmail()); err != nil {
		deps.Log.Error().Err(err).Str("request_id", reqID).Str("clerk_user_id", data.ID).
			Msg("clerk_webhook_user_created_failed")
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to create user"))
	}
	deps.Log.Info().Str("clerk_user_id", data.ID).Msg("clerk_webhook_user_created")
	return c.SendStatus(http.StatusOK)
}

// handleClerkUserUpdated refreshes the local user's email when Clerk
// reports a change. The JWT claim also carries email, but Clerk
// guarantees the webhook fires on every change — the auth middleware's
// user row may lag behind a fresh address until the next request.
//
// No-op when the local row does not exist (webhook raced the first
// JWT request); Clerk will send events in order so a later user.updated
// on an unknown local user means we already missed user.created — we
// could create here, but GetOrCreate semantics would silently mask the
// missed event. Prefer explicit log + 200 so ops can see the gap.
func handleClerkUserUpdated(c fiber.Ctx, deps *app.Deps, reqID string, raw json.RawMessage) error {
	var data clerkUserEventData
	if err := json.Unmarshal(raw, &data); err != nil {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid clerk user.updated payload"))
	}
	if data.ID == "" {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "missing user id in clerk event"))
	}

	existing, err := users.NewRepo(deps.Pool).GetByClerkID(c.Context(), data.ID)
	if err != nil {
		if errors.Is(err, users.ErrNotFound) {
			deps.Log.Warn().Str("clerk_user_id", data.ID).
				Msg("clerk_webhook_user_updated_unknown_user")
			return c.SendStatus(http.StatusOK)
		}
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load user"))
	}

	email := data.primaryEmail()
	var emailArg *string
	if email != "" && email != existing.Email {
		emailArg = &email
	}
	if emailArg == nil {
		// Nothing we care about changed — still 200.
		return c.SendStatus(http.StatusOK)
	}

	if _, err := dbgen.New(deps.Pool).UpdateUserProfile(c.Context(), dbgen.UpdateUserProfileParams{
		ID:              existing.ID,
		DisplayCurrency: nil,
		Locale:          nil,
		Email:           emailArg,
	}); err != nil {
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to update user"))
	}
	deps.Log.Info().Str("clerk_user_id", data.ID).Msg("clerk_webhook_user_updated")
	return c.SendStatus(http.StatusOK)
}

// handleClerkUserDeleted detaches the local user: sets
// deletion_scheduled_at and enqueues the hard-delete task with the
// 7-day grace window, matching the DELETE /me path. Preserves the
// re-check guard expected by the TASK_06 consumer (TD-045) — if the
// user re-signs in during the window and clears deletion_scheduled_at,
// the worker MUST no-op.
func handleClerkUserDeleted(c fiber.Ctx, deps *app.Deps, reqID string, raw json.RawMessage) error {
	var data clerkUserEventData
	if err := json.Unmarshal(raw, &data); err != nil {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid clerk user.deleted payload"))
	}
	if data.ID == "" {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "missing user id in clerk event"))
	}

	existing, err := users.NewRepo(deps.Pool).GetByClerkID(c.Context(), data.ID)
	if err != nil {
		if errors.Is(err, users.ErrNotFound) {
			deps.Log.Info().Str("clerk_user_id", data.ID).
				Msg("clerk_webhook_user_deleted_unknown_user")
			return c.SendStatus(http.StatusOK)
		}
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load user"))
	}

	if _, err := dbgen.New(deps.Pool).MarkUserDeletionRequested(c.Context(), existing.ID); err != nil {
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to schedule deletion"))
	}

	enqueueHardDelete(c.Context(), deps, existing.ID.String())

	deps.Log.Info().Str("clerk_user_id", data.ID).Str("user_id", existing.ID.String()).
		Msg("clerk_webhook_user_deleted")
	return c.SendStatus(http.StatusOK)
}

// enqueueHardDelete publishes the delayed hard-delete task. Mirrors
// DeleteMe: a nil/disabled publisher is logged but does not fail the
// webhook — deletion_scheduled_at is still set and the worker picks
// the row up when asynq comes online.
func enqueueHardDelete(ctx context.Context, deps *app.Deps, userID string) {
	if _, err := deps.Asynq.Enqueue(ctx, asynqpub.TaskHardDeleteUser,
		asynqpub.HardDeleteUserPayload{UserID: userID},
		asynq.ProcessIn(asynqpub.HardDeleteGracePeriod)); err != nil {
		deps.Log.Warn().Err(err).Str("user_id", userID).
			Msg("hard_delete_user enqueue failed from clerk webhook")
	}
}
