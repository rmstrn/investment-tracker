package webhook

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/hibiken/asynq"
	svix "github.com/svix/svix-webhooks/go"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/asynqpub"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/webhookidem"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// ClerkVerifier is the narrow surface the provider depends on so
// tests can inject a stub without holding a real svix secret. The
// default impl in NewClerkVerifier wraps svix-webhooks/go.
type ClerkVerifier interface {
	Verify(payload []byte, headers http.Header) error
}

// ClerkProvider implements Provider for Clerk webhooks
// (POST /auth/webhook). Owns a reference to deps for DB + logging
// inside event handlers.
type ClerkProvider struct {
	deps     *app.Deps
	verifier ClerkVerifier
}

// NewClerkProvider builds a provider wired to the given deps and
// webhook secret. An empty or malformed secret yields a reject-all
// verifier so server.New can boot in dev/test without handing out
// unauthenticated 200s; main() enforces non-empty via env.
func NewClerkProvider(deps *app.Deps, secret string) *ClerkProvider {
	return &ClerkProvider{
		deps:     deps,
		verifier: NewClerkVerifier(secret),
	}
}

// NewClerkProviderWithVerifier is the seam for tests that want to
// inject a pre-built verifier stub (e.g. a constant-accept verifier
// paired with a hand-signed payload).
func NewClerkProviderWithVerifier(deps *app.Deps, v ClerkVerifier) *ClerkProvider {
	return &ClerkProvider{deps: deps, verifier: v}
}

// Source satisfies Provider.
func (p *ClerkProvider) Source() string { return webhookidem.SourceClerk }

// Verify runs the svix signature check and parses the envelope.
// The svix-id header is the canonical idempotency key (Clerk's
// event payload `id` can change shape per event type).
func (p *ClerkProvider) Verify(body []byte, headers http.Header) (*VerifiedEvent, error) {
	if err := p.verifier.Verify(body, headers); err != nil {
		return nil, err
	}
	var envelope struct {
		Type string          `json:"type"`
		Data json.RawMessage `json:"data"`
	}
	if err := json.Unmarshal(body, &envelope); err != nil {
		return nil, errors.New("invalid clerk event payload")
	}
	eventID := headers.Get("svix-id")
	return &VerifiedEvent{Type: envelope.Type, ID: eventID, Data: envelope.Data}, nil
}

// Dispatch wires the event-type → handler table. Only
// user-lifecycle events are handled today; organization.*,
// session.*, and other types fall through to Handle's 200-ACK path.
func (p *ClerkProvider) Dispatch() map[string]EventHandler {
	return map[string]EventHandler{
		"user.created": p.handleUserCreated,
		"user.updated": p.handleUserUpdated,
		"user.deleted": p.handleUserDeleted,
	}
}

// clerkUserEventData is the subset of Clerk's user payload we
// actually read. Other fields (first_name, profile_image_url, …)
// are ignored — we only sync identity + lifecycle flags.
type clerkUserEventData struct {
	ID             string `json:"id"`
	PrimaryEmailID string `json:"primary_email_address_id"`
	EmailAddresses []struct {
		ID           string `json:"id"`
		EmailAddress string `json:"email_address"`
	} `json:"email_addresses"`
	Deleted bool `json:"deleted"`
}

// primaryEmail returns the Clerk-designated primary email address
// if present. Falls back to the first entry when
// primary_email_address_id is missing, and to an empty string when
// the user has no addresses.
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

// handleUserCreated upserts a local user row mirroring the Clerk
// identity. If the user already exists (first API call via Clerk
// JWT races the webhook), this is a no-op at repository level.
func (p *ClerkProvider) handleUserCreated(c fiber.Ctx, ev *VerifiedEvent) error {
	reqID := requestIDFromLocals(c)
	var data clerkUserEventData
	if err := json.Unmarshal(ev.Data, &data); err != nil {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid clerk user.created payload"))
	}
	if data.ID == "" {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "missing user id in clerk event"))
	}
	repo := users.NewRepo(p.deps.Pool)
	if _, err := repo.GetOrCreateByClerkID(c.Context(), data.ID, data.primaryEmail()); err != nil {
		p.deps.Log.Error().Err(err).
			Str("request_id", reqID).
			Str("clerk_user_id", data.ID).
			Msg("clerk_webhook_user_created_failed")
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to create user"))
	}
	p.deps.Log.Info().Str("clerk_user_id", data.ID).Msg("clerk_webhook_user_created")
	return c.SendStatus(http.StatusOK)
}

// handleUserUpdated refreshes the local user's email when Clerk
// reports a change. The JWT claim also carries email, but Clerk
// guarantees the webhook fires on every change — the auth
// middleware's user row may lag behind a fresh address until the
// next request.
//
// No-op when the local row does not exist (webhook raced the first
// JWT request); Clerk sends events in order so a later user.updated
// on an unknown local user means we already missed user.created —
// we could create here, but GetOrCreate semantics would silently
// mask the missed event. Prefer explicit log + 200 so ops can see
// the gap.
func (p *ClerkProvider) handleUserUpdated(c fiber.Ctx, ev *VerifiedEvent) error {
	reqID := requestIDFromLocals(c)
	var data clerkUserEventData
	if err := json.Unmarshal(ev.Data, &data); err != nil {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid clerk user.updated payload"))
	}
	if data.ID == "" {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "missing user id in clerk event"))
	}
	existing, err := users.NewRepo(p.deps.Pool).GetByClerkID(c.Context(), data.ID)
	if err != nil {
		if errors.Is(err, users.ErrNotFound) {
			p.deps.Log.Warn().Str("clerk_user_id", data.ID).
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
		return c.SendStatus(http.StatusOK)
	}
	if _, err := dbgen.New(p.deps.Pool).UpdateUserProfile(c.Context(), dbgen.UpdateUserProfileParams{
		ID:              existing.ID,
		DisplayCurrency: nil,
		Locale:          nil,
		Email:           emailArg,
	}); err != nil {
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to update user"))
	}
	p.deps.Log.Info().Str("clerk_user_id", data.ID).Msg("clerk_webhook_user_updated")
	return c.SendStatus(http.StatusOK)
}

// handleUserDeleted detaches the local user: sets
// deletion_scheduled_at and enqueues the hard-delete task with the
// 7-day grace window, matching the DELETE /me path. Preserves the
// re-check guard expected by the TASK_06 consumer (TD-045) — if the
// user re-signs in during the window and clears
// deletion_scheduled_at, the worker MUST no-op.
func (p *ClerkProvider) handleUserDeleted(c fiber.Ctx, ev *VerifiedEvent) error {
	reqID := requestIDFromLocals(c)
	var data clerkUserEventData
	if err := json.Unmarshal(ev.Data, &data); err != nil {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid clerk user.deleted payload"))
	}
	if data.ID == "" {
		return errs.Respond(c, reqID,
			errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "missing user id in clerk event"))
	}
	existing, err := users.NewRepo(p.deps.Pool).GetByClerkID(c.Context(), data.ID)
	if err != nil {
		if errors.Is(err, users.ErrNotFound) {
			p.deps.Log.Info().Str("clerk_user_id", data.ID).
				Msg("clerk_webhook_user_deleted_unknown_user")
			return c.SendStatus(http.StatusOK)
		}
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load user"))
	}
	if _, err := dbgen.New(p.deps.Pool).MarkUserDeletionRequested(c.Context(), existing.ID); err != nil {
		return errs.Respond(c, reqID,
			errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to schedule deletion"))
	}
	p.enqueueHardDelete(c.Context(), existing.ID.String())
	p.deps.Log.Info().
		Str("clerk_user_id", data.ID).
		Str("user_id", existing.ID.String()).
		Msg("clerk_webhook_user_deleted")
	return c.SendStatus(http.StatusOK)
}

// enqueueHardDelete publishes the delayed hard-delete task. Mirrors
// DeleteMe: a nil/disabled publisher is logged but does not fail
// the webhook — deletion_scheduled_at is still set and the worker
// picks the row up when asynq comes online.
func (p *ClerkProvider) enqueueHardDelete(ctx context.Context, userID string) {
	if _, err := p.deps.Asynq.Enqueue(ctx, asynqpub.TaskHardDeleteUser,
		asynqpub.HardDeleteUserPayload{UserID: userID},
		asynq.ProcessIn(asynqpub.HardDeleteGracePeriod)); err != nil {
		p.deps.Log.Warn().Err(err).Str("user_id", userID).
			Msg("hard_delete_user enqueue failed from clerk webhook")
	}
}

// ---------- verifier impls ----------

// svixVerifier adapts the svix SDK's Webhook type to the narrow
// ClerkVerifier interface.
type svixVerifier struct {
	wh *svix.Webhook
}

func (v *svixVerifier) Verify(payload []byte, headers http.Header) error {
	return v.wh.Verify(payload, headers)
}

// rejectAllVerifier is the fallback when no Clerk webhook secret is
// configured. Every request is rejected — safer than quietly
// accepting unauthenticated payloads.
type rejectAllVerifier struct {
	reason string
}

func (v *rejectAllVerifier) Verify(_ []byte, _ http.Header) error {
	return errors.New("webhook verifier not configured: " + v.reason)
}

// NewClerkVerifier builds a production verifier from the Clerk
// webhook signing secret. The secret is an svix-style `whsec_...`
// string issued via Clerk's dashboard → Webhooks page. An empty or
// malformed secret yields a reject-all verifier so server.New can
// boot in dev/test without handing out unauthenticated 200s.
func NewClerkVerifier(secret string) ClerkVerifier {
	if secret == "" {
		return &rejectAllVerifier{reason: "empty CLERK_WEBHOOK_SECRET"}
	}
	wh, err := svix.NewWebhook(secret)
	if err != nil {
		return &rejectAllVerifier{reason: err.Error()}
	}
	return &svixVerifier{wh: wh}
}
