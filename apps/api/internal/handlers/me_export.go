package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// ExportMe is the GDPR data-export bundle for the authenticated user
// (GET /me/export, UserExportBundle schema). Tracked as TD-058 —
// aggregating every per-user table into a single signed JSON is a
// standalone slice and is deliberately deferred from B3-iii. Returning
// an empty bundle would misrepresent user data so the stub is 501.
func ExportMe(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		return errs.Respond(c, reqID,
			errs.New(http.StatusNotImplemented, "NOT_IMPLEMENTED",
				"GDPR data export is not yet implemented (TD-058)"))
	}
}
