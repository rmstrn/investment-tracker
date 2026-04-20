package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// Clerk Management API proxy stubs (TD-056).
//
// The 2FA and session-revocation surfaces in openapi.yaml live here
// as scope-cut handlers. Reaching real Clerk state requires the Clerk
// Backend SDK in app.Deps — only the JWKS verifier is wired today.
// Until TD-056 lands, reads follow the same empty-state-200 rule that
// ListMySessions uses (UIs should degrade, not crash), and mutations
// return 501 NOT_IMPLEMENTED so clients can surface an honest error.
//
// Pair: TD-027 (original Clerk SDK gap) — TD-056 is its expansion to
// the full 2FA + session-mutation surface.

// GetTwoFactorStatus is the paired read for the 2FA enrol/verify flow.
// With no Clerk SDK we can only truthfully report "not enrolled" — an
// accurate representation for every MVP user because the enrol
// endpoint below is 501. The emitted header signals the scope-cut so
// clients can differentiate "user opted out" from "server can't see".
func GetTwoFactorStatus(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		c.Set("X-Clerk-Unavailable", "true")
		return c.JSON(fiber.Map{
			"enabled":      false,
			"backup_codes": fiber.Map{"remaining": 0},
		})
	}
}

// Enroll2FA — stub, returns 501 NOT_IMPLEMENTED (TD-056).
func Enroll2FA(deps *app.Deps) fiber.Handler {
	return notImplementedClerkProxy("2FA enrolment")
}

// Verify2FA — stub, returns 501 NOT_IMPLEMENTED (TD-056).
func Verify2FA(deps *app.Deps) fiber.Handler {
	return notImplementedClerkProxy("2FA verification")
}

// Disable2FA — stub, returns 501 NOT_IMPLEMENTED (TD-056).
func Disable2FA(deps *app.Deps) fiber.Handler {
	return notImplementedClerkProxy("2FA disable")
}

// RegenerateBackupCodes — stub, returns 501 NOT_IMPLEMENTED (TD-056).
func RegenerateBackupCodes(deps *app.Deps) fiber.Handler {
	return notImplementedClerkProxy("backup-codes regeneration")
}

// RevokeSession — stub for DELETE /me/sessions/{id} (TD-056).
func RevokeSession(deps *app.Deps) fiber.Handler {
	return notImplementedClerkProxy("session revocation")
}

// RevokeOtherSessions — stub for DELETE /me/sessions/others (TD-056).
func RevokeOtherSessions(deps *app.Deps) fiber.Handler {
	return notImplementedClerkProxy("session revocation")
}

func notImplementedClerkProxy(feature string) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		c.Set("X-Clerk-Unavailable", "true")
		return errs.Respond(c, reqID,
			errs.New(http.StatusNotImplemented, "NOT_IMPLEMENTED",
				feature+" requires the Clerk Management SDK (TD-056); not wired in B3-iii"))
	}
}
