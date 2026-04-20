package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// GetPortfolioTaxExport is the downloadable tax package endpoint
// (GET /portfolio/tax/export). Distinct from GetPortfolioTax — that
// handler returns JSON; this one would materialise a CSV/PDF bundle
// via the export-job queue. Tracked as TD-059 since it needs the
// export-job worker (overlapping with TD-039) plus jurisdiction-
// specific rendering templates.
func GetPortfolioTaxExport(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		return errs.Respond(c, reqID,
			errs.New(http.StatusNotImplemented, "NOT_IMPLEMENTED",
				"tax export bundle is not yet implemented (TD-059)"))
	}
}
