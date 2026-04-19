package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// paywallCounterPrefix is the wire contract with the `POST
// /me/paywalls/{trigger}/dismiss` endpoint (PR B3): dismissals are
// bucketed on usage_counters.counter_type = `paywall_dismissed_<trigger>`.
const paywallCounterPrefix = "paywall_dismissed_"

// ListMyPaywalls returns the authenticated user's active soft-paywall
// dismissals for the current UTC day per openapi.yaml
// PaywallDismissalList. Dismissals live on the shared usage_counters
// table (counter_type = `paywall_dismissed_<trigger>`) and expire at
// UTC midnight — the handler reads today's bucket only.
func ListMyPaywalls(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		today := dateOf(time.Now().UTC())
		rows, err := dbgen.New(deps.Pool).ListUsageCountersInRange(ctx, dbgen.ListUsageCountersInRangeParams{
			UserID:        user.ID,
			CounterDate:   today,
			CounterDate_2: today,
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list paywall dismissals"))
		}

		resetAt := endOfDay(time.Now().UTC()).UTC().Format(time.RFC3339)
		items := make([]fiber.Map, 0, len(rows))
		for _, r := range rows {
			if !strings.HasPrefix(r.CounterType, paywallCounterPrefix) {
				continue
			}
			trigger := strings.TrimPrefix(r.CounterType, paywallCounterPrefix)
			items = append(items, fiber.Map{
				"trigger":      trigger,
				"dismissed_on": dateString(r.CounterDate),
				"reset_at":     resetAt,
			})
		}

		return c.JSON(fiber.Map{"data": items})
	}
}

// dateString renders a pgtype.Date as YYYY-MM-DD for the JSON
// `dismissed_on` field. A non-valid date (never happens for an
// existing row) falls back to today in UTC.
func dateString(d pgtype.Date) string {
	if !d.Valid {
		return time.Now().UTC().Format("2006-01-02")
	}
	return d.Time.UTC().Format("2006-01-02")
}
