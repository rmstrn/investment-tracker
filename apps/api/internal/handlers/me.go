package handlers

import (
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/tiers"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// Counter keys used in usage_counters for accounting. The handler keeps
// its own list rather than reaching into internal_ai_usage.go because
// the coupling is one-way: usage reads wouldn't block if the AI usage
// path were ever renamed.
const (
	counterAIMessagesDaily = "ai_messages_daily"
)

// GetMe returns the authenticated user's profile per openapi.yaml User.
// The auth middleware has already loaded the user from the DB, so the
// handler is a shape + serialize.
func GetMe(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		return c.JSON(shapeUser(middleware.UserFromCtx(c)))
	}
}

// GetMyUsage returns the tier caps + live counter values per openapi
// UsageSummary. Three counters are populated:
//
//   - ai_messages_daily — read from usage_counters for today.
//     Incremented by POST /internal/ai/usage (PR B1).
//   - connected_accounts — a gauge, counted live from the accounts
//     table (soft-delete scoped). There is no counter row for this
//     one; it is never reset.
//   - insights_weekly — counted live from the insights table over the
//     current ISO week. The usage_counters increment for this type is
//     scope for PR B3 (insight-generation path does not write here
//     yet); using the insights table directly is authoritative as
//     long as insights are never deleted.
func GetMyUsage(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()
		q := dbgen.New(deps.Pool)

		now := time.Now().UTC()
		today := dateOf(now)

		aiDaily, err := q.SumUsageCounterInRange(ctx, dbgen.SumUsageCounterInRangeParams{
			UserID:        user.ID,
			CounterType:   counterAIMessagesDaily,
			CounterDate:   today,
			CounterDate_2: today,
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to read ai_messages_daily counter"))
		}

		accounts, err := q.CountActiveAccountsByUser(ctx, user.ID)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to count active accounts"))
		}

		insightsWeekly, err := q.CountInsightsByUserSince(ctx, dbgen.CountInsightsByUserSinceParams{
			UserID:      user.ID,
			GeneratedAt: pgtype.Timestamptz{Time: startOfISOWeek(now), Valid: true},
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to count weekly insights"))
		}

		limits := tiers.For(user.SubscriptionTier)

		return c.JSON(fiber.Map{
			"tier": user.SubscriptionTier,
			"counters": fiber.Map{
				"ai_messages_daily":  shapeCounter(int(aiDaily), limits.AIMessagesDaily, endOfDay(now)),
				"connected_accounts": shapeCounter(int(accounts), limits.ConnectedAccounts, nil),
				"insights_weekly":    shapeCounter(int(insightsWeekly), limits.InsightsWeekly, pointerTime(endOfISOWeek(now))),
			},
		})
	}
}

// shapeUser converts the sqlc User row into the openapi User shape.
// stripe_customer_id and deletion_scheduled_at are nullable per spec —
// pass them through as nil when unset.
func shapeUser(u *dbgen.User) fiber.Map {
	var stripeID any
	if u.StripeCustomerID != nil {
		stripeID = *u.StripeCustomerID
	}

	var deletionAt any
	if u.DeletionScheduledAt.Valid {
		deletionAt = u.DeletionScheduledAt.Time.UTC().Format(time.RFC3339)
	}

	return fiber.Map{
		"id":                    u.ID.String(),
		"clerk_user_id":         u.ClerkUserID,
		"email":                 u.Email,
		"display_currency":      u.DisplayCurrency,
		"locale":                u.Locale,
		"subscription_tier":     u.SubscriptionTier,
		"stripe_customer_id":    stripeID,
		"deletion_scheduled_at": deletionAt,
		"created_at":            u.CreatedAt.Time.UTC().Format(time.RFC3339),
		"updated_at":            u.UpdatedAt.Time.UTC().Format(time.RFC3339),
	}
}

// shapeCounter renders a UsageCounter: `used` always an integer,
// `limit` a pointer (null = unlimited), `reset_at` either an RFC3339
// string or null for counters that never reset (connected_accounts).
func shapeCounter(used int, limit *int, resetAt *time.Time) fiber.Map {
	var limitVal any
	if limit != nil {
		limitVal = *limit
	}
	var resetVal any
	if resetAt != nil {
		resetVal = resetAt.UTC().Format(time.RFC3339)
	}
	return fiber.Map{
		"used":     used,
		"limit":    limitVal,
		"reset_at": resetVal,
	}
}

// startOfISOWeek returns the UTC midnight of the Monday of the week
// containing now. Matches the "insights_weekly" rollup window.
func startOfISOWeek(now time.Time) time.Time {
	utc := now.UTC()
	weekday := int(utc.Weekday())
	if weekday == 0 { // Sunday
		weekday = 7
	}
	d := utc.AddDate(0, 0, -(weekday - 1))
	return time.Date(d.Year(), d.Month(), d.Day(), 0, 0, 0, 0, time.UTC)
}

func endOfISOWeek(now time.Time) time.Time {
	return startOfISOWeek(now).AddDate(0, 0, 7)
}

func endOfDay(now time.Time) *time.Time {
	utc := now.UTC()
	t := time.Date(utc.Year(), utc.Month(), utc.Day(), 0, 0, 0, 0, time.UTC).AddDate(0, 0, 1)
	return &t
}

func pointerTime(t time.Time) *time.Time { return &t }

// dateOf wraps a time.Time as a pgtype.Date at midnight UTC so sqlc
// queries taking a counter_date bind cleanly.
func dateOf(t time.Time) pgtype.Date {
	utc := t.UTC()
	return pgtype.Date{
		Time:  time.Date(utc.Year(), utc.Month(), utc.Day(), 0, 0, 0, 0, time.UTC),
		Valid: true,
	}
}
