package handlers

import (
	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
)

// ListMySessions returns the authenticated user's active Clerk
// sessions per openapi.yaml UserSession[]. Clerk is the authority —
// sessions have no local table.
//
// Scope-cut (TD-027): the Clerk Backend SDK client is not yet wired
// into app.Deps (only the JWKS for token verification is). Until it
// lands, the handler returns an empty list with a 200 so UIs that
// probe this endpoint don't crash on a 501 — per the empty-state-200
// rule — and an X-Clerk-Unavailable header signals the scope-cut.
// The companion DELETE endpoints (/me/sessions/{id},
// /me/sessions/others) are PR B3 scope and share the same dependency.
//
// openapi.yaml notably does NOT define a GET /me/sessions/{id}
// detail endpoint — only a DELETE — so no detail handler lives here.
func ListMySessions(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		c.Set("X-Clerk-Unavailable", "true")
		return c.JSON(fiber.Map{"data": []any{}})
	}
}
