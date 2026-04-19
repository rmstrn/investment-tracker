package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// DismissInsight sets dismissed_at on one insight. Idempotent —
// the underlying UPDATE COALESCEs so a second dismiss preserves
// the original timestamp. Cross-user / unknown id → 404.
func DismissInsight(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, perr := uuid.Parse(c.Params("id"))
		if perr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid insight id"))
		}

		affected, err := dbgen.New(deps.Pool).MarkInsightDismissed(ctx, dbgen.MarkInsightDismissedParams{
			ID:     id,
			UserID: user.ID,
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to dismiss insight"))
		}
		if affected == 0 {
			return errs.Respond(c, reqID, errs.ErrNotFound)
		}
		return c.SendStatus(http.StatusNoContent)
	}
}

// MarkInsightViewed sets viewed_at on one insight. Same idempotent
// + cross-user-404 rules as DismissInsight.
func MarkInsightViewed(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, perr := uuid.Parse(c.Params("id"))
		if perr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid insight id"))
		}

		affected, err := dbgen.New(deps.Pool).MarkInsightViewed(ctx, dbgen.MarkInsightViewedParams{
			ID:     id,
			UserID: user.ID,
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to mark viewed"))
		}
		if affected == 0 {
			return errs.Respond(c, reqID, errs.ErrNotFound)
		}
		return c.SendStatus(http.StatusNoContent)
	}
}
