package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// GetPortfolioAllocation returns the latest snapshot's allocation
// breakdown per openapi.yaml PortfolioAllocationResponse. The three
// JSONB columns on portfolio_snapshots already hold the exact map
// shape the spec wants — handler is a JSON-passthrough.
//
// Empty state (no snapshot yet) returns 200 with three empty maps,
// not 404 — empty allocation is valid for a brand-new account.
func GetPortfolioAllocation(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		row, err := dbgen.New(deps.Pool).GetLatestSnapshotByUser(ctx, user.ID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return c.JSON(fiber.Map{
					"by_symbol":     fiber.Map{},
					"by_asset_type": fiber.Map{},
					"by_currency":   fiber.Map{},
				})
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load snapshot"))
		}

		return c.JSON(fiber.Map{
			"by_symbol":     decodeAllocationJSON(row.Allocation),
			"by_asset_type": decodeAllocationJSON(row.ByAssetType),
			"by_currency":   decodeAllocationJSON(row.ByCurrency),
		})
	}
}

// decodeAllocationJSON parses a portfolio_snapshots JSONB column. A
// malformed payload yields an empty map rather than a 500 — the
// snapshot worker is the canonical writer and a corrupt row would be
// a data-quality bug that this handler should not amplify into a
// user-facing error.
func decodeAllocationJSON(raw []byte) fiber.Map {
	if len(raw) == 0 {
		return fiber.Map{}
	}
	var out fiber.Map
	if err := json.Unmarshal(raw, &out); err != nil {
		return fiber.Map{}
	}
	return out
}
