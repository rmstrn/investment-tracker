package handlers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// allNotificationTypes is the set of keys the openapi contract
// requires the `preferences` map to always surface. Missing rows
// default to all-channels-on, same default as the DB schema column
// DEFAULT TRUE.
var allNotificationTypes = []string{
	"insight_generated", "sync_completed", "sync_failed",
	"dividend_paid", "price_alert", "billing_event",
}

// GetMyNotificationPreferences returns the authenticated user's
// per-type channel settings + digest preferences per openapi.yaml
// NotificationPreferences. Missing per-type rows default to all
// channels on (matches the DB DEFAULT TRUE + contract doc-string);
// a missing digest row yields enabled=true / weekday=0 (Monday) with
// no quiet hours.
func GetMyNotificationPreferences(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()
		q := dbgen.New(deps.Pool)

		prefRows, err := q.ListNotificationPreferencesByUser(ctx, user.ID)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list notification prefs"))
		}

		digest, err := q.GetUserDigestPreferences(ctx, user.ID)
		digestAvailable := err == nil
		if err != nil && !errors.Is(err, pgx.ErrNoRows) {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load digest prefs"))
		}

		preferences := make(fiber.Map, len(allNotificationTypes))
		for _, t := range allNotificationTypes {
			preferences[t] = fiber.Map{"email": true, "push": true, "in_app": true}
		}
		for _, r := range prefRows {
			preferences[r.Type] = fiber.Map{
				"email":  r.Email,
				"push":   r.Push,
				"in_app": r.InApp,
			}
		}

		return c.JSON(fiber.Map{
			"preferences": preferences,
			"digest":      shapeDigest(digest, digestAvailable),
		})
	}
}

func shapeDigest(d dbgen.UserDigestPreference, available bool) fiber.Map {
	if !available {
		return fiber.Map{
			"enabled":     true,
			"weekday":     0, // Monday
			"quiet_start": nil,
			"quiet_end":   nil,
		}
	}
	return fiber.Map{
		"enabled":     d.DigestEnabled,
		"weekday":     int(d.DigestWeekday),
		"quiet_start": timeOfDayString(d.QuietStart),
		"quiet_end":   timeOfDayString(d.QuietEnd),
	}
}

// timeOfDayString formats a pgtype.Time as "HH:mm" per openapi
// pattern. Returns nil (JSON null) when the value is NULL.
func timeOfDayString(t pgtype.Time) any {
	if !t.Valid {
		return nil
	}
	totalMinutes := t.Microseconds / 60_000_000
	hours := totalMinutes / 60
	minutes := totalMinutes % 60
	return fmt.Sprintf("%02d:%02d", hours, minutes)
}
