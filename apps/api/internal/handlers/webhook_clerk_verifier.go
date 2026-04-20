package handlers

import (
	"errors"
	"net/http"

	svix "github.com/svix/svix-webhooks/go"
)

// svixVerifier adapts the svix SDK's Webhook type to the narrow
// ClerkWebhookVerifier interface the handler depends on.
type svixVerifier struct {
	wh *svix.Webhook
}

func (v *svixVerifier) Verify(payload []byte, headers http.Header) error {
	return v.wh.Verify(payload, headers)
}

// rejectAllVerifier is the fallback when no Clerk webhook secret is
// configured. Every request is rejected — safer than quietly
// accepting unauthenticated payloads. main() makes this fail-fast in
// production by marking the env var required; the stub is for test
// harnesses that instantiate server.New without the secret.
type rejectAllVerifier struct {
	reason string
}

func (v *rejectAllVerifier) Verify(_ []byte, _ http.Header) error {
	return errors.New("webhook verifier not configured: " + v.reason)
}

// NewClerkWebhookVerifier builds a production verifier from the Clerk
// webhook signing secret. The secret is an svix-style `whsec_...`
// string issued via Clerk's dashboard → Webhooks page. An empty or
// malformed secret yields a reject-all verifier so server.New can
// boot in dev/test without handing out unauthenticated 200s.
func NewClerkWebhookVerifier(secret string) ClerkWebhookVerifier {
	if secret == "" {
		return &rejectAllVerifier{reason: "empty CLERK_WEBHOOK_SECRET"}
	}
	wh, err := svix.NewWebhook(secret)
	if err != nil {
		return &rejectAllVerifier{reason: err.Error()}
	}
	return &svixVerifier{wh: wh}
}
