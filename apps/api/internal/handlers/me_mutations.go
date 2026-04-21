package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/hibiken/asynq"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/asynqpub"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/handlers/httputil"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// validPaywallTriggers matches the openapi PaywallTriggerKind enum.
var validPaywallTriggers = map[string]struct{}{
	"ai_messages_daily": {}, "insights_weekly": {},
	"connected_accounts": {}, "pro_feature": {},
}

// quietHoursPattern enforces the openapi HH:mm regex on digest
// quiet-hours fields.
var quietHoursPattern = regexp.MustCompile(`^[0-2][0-9]:[0-5][0-9]$`)

// ---------- PATCH /me ----------

// UpdateMe partially updates the authenticated user's profile
// (display_currency + locale per openapi UserUpdateRequest). Uses
// the existing UpdateUserProfile sqlc query with narg passthroughs.
// updateMeRequest is the openapi UserUpdateRequest shape. Both
// fields are pointer/nullable so PATCH semantics distinguish
// "omitted" (keep current) from "cleared" — though display_currency
// should never be cleared, validation below rejects empty strings.
type updateMeRequest struct {
	DisplayCurrency *string `json:"display_currency"`
	Locale          *string `json:"locale"`
}

func UpdateMe(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		req, coded := httputil.BindJSONOptional[updateMeRequest](c)
		if coded != nil {
			return errs.Respond(c, reqID, coded)
		}

		if req.DisplayCurrency != nil {
			trimmed := strings.ToUpper(strings.TrimSpace(*req.DisplayCurrency))
			if len(trimmed) != 3 {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "display_currency must be an ISO 4217 three-letter code"))
			}
			req.DisplayCurrency = &trimmed
		}

		row, err := dbgen.New(deps.Pool).UpdateUserProfile(ctx, dbgen.UpdateUserProfileParams{
			ID:              user.ID,
			DisplayCurrency: req.DisplayCurrency,
			Locale:          req.Locale,
			Email:           nil, // email comes from Clerk webhooks, not self-update
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to update profile"))
		}
		return c.JSON(shapeUser(&row))
	}
}

// ---------- DELETE /me ----------

// DeleteMe flags the user as pending deletion (sets
// deletion_scheduled_at) and enqueues a hard_delete_user task with a
// 7-day delay per the openapi description. Response is 202 Accepted
// with no body.
//
// TD-041 tracks the worker-side hard-delete consumer in TASK_06.
// The worker MUST re-check users.deletion_scheduled_at before
// purging — POST /me/undo-deletion clears it, and our publisher
// does not call asynq.Cancel on the pending task (TD-045). With
// the re-check guard, an undone deletion simply no-ops the task.
func DeleteMe(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		if _, err := dbgen.New(deps.Pool).MarkUserDeletionRequested(ctx, user.ID); err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to schedule deletion"))
		}

		if !deps.Asynq.Enabled() {
			c.Set("X-Async-Unavailable", "true")
		}
		if _, qerr := deps.Asynq.Enqueue(ctx, asynqpub.TaskHardDeleteUser,
			asynqpub.HardDeleteUserPayload{UserID: user.ID.String()},
			asynq.ProcessIn(asynqpub.HardDeleteGracePeriod)); qerr != nil {
			deps.Log.Warn().Err(qerr).Str("user_id", user.ID.String()).
				Msg("hard_delete_user enqueue failed — deletion_scheduled_at still set; retry on next user action")
		}

		return c.SendStatus(http.StatusAccepted)
	}
}

// ---------- POST /me/paywalls/{trigger}/dismiss ----------

// DismissPaywall records a per-day dismissal for the given trigger
// via the shared usage_counters table. Idempotent on (user, trigger,
// day) — the IncrementUsageCounter UPSERT just bumps the counter,
// which ListMyPaywalls interprets as "dismissed today" regardless
// of the count. Response shape matches openapi PaywallDismissal.
func DismissPaywall(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		trigger := strings.ToLower(strings.TrimSpace(c.Params("trigger")))
		if _, ok := validPaywallTriggers[trigger]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "trigger must be one of ai_messages_daily, insights_weekly, connected_accounts, pro_feature"))
		}

		now := time.Now().UTC()
		if _, err := dbgen.New(deps.Pool).IncrementUsageCounter(ctx, dbgen.IncrementUsageCounterParams{
			UserID:      user.ID,
			CounterType: paywallCounterPrefix + trigger,
			CounterDate: dateOf(now),
		}); err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to record dismissal"))
		}

		resetAt := endOfDay(now).UTC().Format(time.RFC3339)
		return c.JSON(fiber.Map{
			"trigger":      trigger,
			"dismissed_on": now.Format("2006-01-02"),
			"reset_at":     resetAt,
		})
	}
}

// ---------- POST /me/undo-deletion ----------

// UndoDeletion clears users.deletion_scheduled_at so the pending
// hard_delete_user task no-ops when the worker's re-check runs
// (TD-045). 200 OK on success; if the user never initiated
// deletion the UPDATE is a harmless no-op and we still return 200
// with the current user row so clients get a stable shape.
func UndoDeletion(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		row, err := dbgen.New(deps.Pool).UndoUserDeletion(ctx, user.ID)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to undo deletion"))
		}
		return c.JSON(shapeUser(&row))
	}
}

// ---------- PATCH /me/notification-preferences ----------

// UpdateNotificationPreferences does per-type upserts on the
// preferences map and a wholesale replace on digest. Both fields
// are optional; callers typically PATCH a single type at a time
// when a user toggles a channel switch.
func UpdateNotificationPreferences(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		var req struct {
			Preferences map[string]struct {
				Email *bool `json:"email"`
				Push  *bool `json:"push"`
				InApp *bool `json:"in_app"`
			} `json:"preferences"`
			Digest *struct {
				Enabled    *bool   `json:"enabled"`
				Weekday    *int    `json:"weekday"`
				QuietStart *string `json:"quiet_start"`
				QuietEnd   *string `json:"quiet_end"`
			} `json:"digest"`
		}
		if err := json.Unmarshal(c.Body(), &req); err != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid JSON body"))
		}

		q := dbgen.New(deps.Pool)

		for typ, p := range req.Preferences {
			if !isValidNotificationType(typ) {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "unknown notification type "+typ))
			}
			if _, err := q.UpsertNotificationPreference(ctx, dbgen.UpsertNotificationPreferenceParams{
				UserID: user.ID,
				Type:   typ,
				Email:  boolOrDefault(p.Email, true),
				Push:   boolOrDefault(p.Push, true),
				InApp:  boolOrDefault(p.InApp, true),
			}); err != nil {
				return errs.Respond(c, reqID,
					errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", fmt.Sprintf("failed to upsert pref %s", typ)))
			}
		}

		if req.Digest != nil {
			if req.Digest.Weekday != nil && (*req.Digest.Weekday < 0 || *req.Digest.Weekday > 6) {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "digest.weekday must be between 0 and 6"))
			}
			if req.Digest.QuietStart != nil && !quietHoursPattern.MatchString(*req.Digest.QuietStart) {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "quiet_start must match HH:mm"))
			}
			if req.Digest.QuietEnd != nil && !quietHoursPattern.MatchString(*req.Digest.QuietEnd) {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "quiet_end must match HH:mm"))
			}

			enabled := boolOrDefault(req.Digest.Enabled, true)
			weekday := 0
			if req.Digest.Weekday != nil {
				weekday = *req.Digest.Weekday
			}
			params := dbgen.UpsertUserDigestPreferencesParams{
				UserID:        user.ID,
				DigestEnabled: enabled,
				DigestWeekday: int16(weekday),
			}
			if req.Digest.QuietStart != nil {
				params.QuietStart = parseQuietHours(*req.Digest.QuietStart)
			}
			if req.Digest.QuietEnd != nil {
				params.QuietEnd = parseQuietHours(*req.Digest.QuietEnd)
			}
			if _, err := q.UpsertUserDigestPreferences(ctx, params); err != nil {
				return errs.Respond(c, reqID,
					errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to upsert digest"))
			}
		}

		// Echo the current shape. Reuse the GET handler's projection
		// so PATCH and GET share byte-for-byte response shapes.
		prefRows, err := q.ListNotificationPreferencesByUser(ctx, user.ID)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list prefs post-patch"))
		}
		digest, err := q.GetUserDigestPreferences(ctx, user.ID)
		digestAvailable := err == nil
		if err != nil && !errors.Is(err, pgx.ErrNoRows) {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load digest post-patch"))
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

// ---------- helpers ----------

func isValidNotificationType(t string) bool {
	for _, v := range allNotificationTypes {
		if v == t {
			return true
		}
	}
	return false
}

// boolOrDefault returns *p when non-nil, else d. All current call
// sites pass d=true (defaults in the openapi NotificationChannel +
// NotificationDigest schemas); the parameter stays here as a
// generalisation rather than inlined `!= false` so a future
// default-off channel flips one line instead of a whole branch.
//
//nolint:unparam // d always true today; see comment above
func boolOrDefault(p *bool, d bool) bool {
	if p == nil {
		return d
	}
	return *p
}

// parseQuietHours converts "HH:mm" to pgtype.Time at UTC midnight +
// the given offset. Pattern is pre-validated so split+atoi is safe.
func parseQuietHours(s string) pgtype.Time {
	var hh, mm int
	_, _ = fmt.Sscanf(s, "%02d:%02d", &hh, &mm)
	microseconds := int64(hh)*3600_000_000 + int64(mm)*60_000_000
	return pgtype.Time{Microseconds: microseconds, Valid: true}
}
