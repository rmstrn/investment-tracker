// Package airatelimit gates AI Chat + insight-generation endpoints
// on the per-user daily counter declared in tiers.Limit.AIMessagesDaily.
//
// Wire order: must come AFTER auth (reads user from locals) and
// BEFORE the handler that calls AI Service. The middleware:
//
//  1. Reads tiers.Limit for the authenticated user's tier.
//  2. Returns 403 TIER_LIMIT_EXCEEDED + Upgrade-To-Tier header if
//     AIChatEnabled is false (forward-compat — false for nobody in
//     MVP, but the handler-side branch ships ready).
//  3. Skips the counter entirely for unlimited tiers (cap = nil).
//  4. Atomic INCR + EXPIRE via cache.EvalIncrWithTTL. The TTL is
//     seconds-until-next-UTC-midnight so the bucket aligns with the
//     daily-window contract.
//  5. Sets X-RateLimit-* headers on every response (success or 429).
//  6. Returns 429 RATE_LIMIT_EXCEEDED when post-INCR count > cap.
//
// Reserve-then-commit (Sprint C 2b — TD-052 closure):
//
// The counter is "reserved" optimistically via INCR so concurrent
// requests can't race past the cap, but a reservation that does not
// lead to a committed AI message is refunded via DECR. Three refund
// branches:
//   - Rejected at the cap check (post-INCR count > cap) → DECR +
//     429. Prevents the Sprint B overcount where a rejected 6th
//     attempt stuck the counter at 6.
//   - c.Next() returned a non-nil error (handler never wrote a
//     response, most commonly upstream AI auth / 5xx) → DECR.
//   - c.Next() wrote a non-2xx status (upstream failed after the
//     handler took over, ownership 404, validation 400, …) → DECR.
//   - Streaming 2xx responses are committed even if they drop
//     mid-stream. Once the client received a 200 + first bytes the
//     AI Service has already spent tokens; the billing ledger in
//     persistTurn is the authoritative record there.
package airatelimit

import (
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/tiers"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// CounterType is the usage_counters / Redis suffix that ties this
// gate to the same daily bucket /me/usage reports + the existing
// /internal/ai/usage POST writes to.
const CounterType = "ai_messages_daily"

// New returns the middleware. Constructed once during server.New so
// closures capture deps and the middleware itself stays allocation-
// free per request.
func New(deps *app.Deps) fiber.Handler {
	if deps.Cache == nil {
		panic("airatelimit: deps.Cache is required")
	}
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		if user == nil {
			return errs.Respond(c, reqID, errs.ErrUnauthenticated)
		}

		limit := tiers.For(user.SubscriptionTier)

		// Feature flag — 403 when the tier explicitly disables AI chat.
		// Dead path in MVP; ready for a future Free-no-AI variant.
		if !limit.AIChatEnabled {
			c.Set("Upgrade-To-Tier", "plus")
			return errs.Respond(c, reqID,
				errs.ErrTierLimitExceeded.WithDetails(map[string]any{
					"feature": "ai_chat",
				}))
		}

		// Unlimited (Pro). No counter at all — emit informational
		// "Limit: 0" so clients can detect the unlimited case
		// without parsing tier strings, and skip the INCR cost.
		if limit.AIMessagesDaily == nil {
			c.Set("X-RateLimit-Limit", "0")
			return c.Next()
		}

		cap := *limit.AIMessagesDaily
		now := time.Now().UTC()
		ttl := secondsUntilNextUTCMidnight(now)
		key := fmt.Sprintf("airl:%s:%s", CounterType, user.ID)

		// Reserve: INCR first so concurrent requests can't both
		// observe "under cap" and race past it. The commit decision
		// happens after c.Next() — a rejected or failed attempt
		// refunds the bump via DECR below.
		count, err := deps.Cache.EvalIncrWithTTL(c.Context(), key, ttl)
		if err != nil {
			// Fail open on Redis flap — the AI Service has its own
			// budget enforcement (record_ai_usage path); we would
			// rather under-gate than 503 when Redis hiccups.
			deps.Log.Warn().Err(err).Str("user_id", user.ID.String()).
				Msg("airatelimit: redis eval failed; failing open")
			return c.Next()
		}

		remaining := cap - int(count)
		if remaining < 0 {
			remaining = 0
		}
		c.Set("X-RateLimit-Limit", strconv.Itoa(cap))
		c.Set("X-RateLimit-Remaining", strconv.Itoa(remaining))
		c.Set("X-RateLimit-Reset", strconv.FormatInt(now.Add(ttl).Unix(), 10))

		if int(count) > cap {
			// Rejected attempt — refund the INCR so a burst of 429s
			// does not permanently stick the bucket past the cap.
			// Best-effort: a Redis hiccup here leaves the counter
			// high by 1, which is the pre-Sprint-C behavior.
			refund(c, deps, key, user.ID.String(), "cap_exceeded")
			return errs.Respond(c, reqID,
				errs.ErrRateLimit.WithDetails(map[string]any{
					"limit":      cap,
					"window":     "1d",
					"reset_unix": now.Add(ttl).Unix(),
					"counter":    CounterType,
				}))
		}
		nextErr := c.Next()
		// Commit or refund. A nil error + 2xx status is a committed
		// AI turn and the bucket stays bumped. Anything else —
		// handler returned an error, or handler wrote a 4xx/5xx —
		// refunds the reservation.
		status := c.Response().StatusCode()
		if nextErr != nil || status < 200 || status >= 300 {
			refund(c, deps, key, user.ID.String(), fmt.Sprintf("status=%d", status))
		}
		return nextErr
	}
}

// refund decrements the daily counter to roll back a reservation
// that did not lead to a committed AI message. Logs on failure but
// never surfaces the DECR error — the client already got their
// response (either 429 or the downstream 4xx/5xx) and we must not
// mutate that outcome.
func refund(c fiber.Ctx, deps *app.Deps, key, userID, reason string) {
	if _, err := deps.Cache.Decr(c.Context(), key); err != nil {
		deps.Log.Warn().Err(err).
			Str("user_id", userID).
			Str("reason", reason).
			Msg("airatelimit: decr refund failed; counter may be over by 1")
	}
}

// secondsUntilNextUTCMidnight returns the duration to 00:00 UTC of
// the next day. Used as the EXPIRE for the daily counter so the
// bucket resets cleanly at the same instant /me/usage reports do.
func secondsUntilNextUTCMidnight(now time.Time) time.Duration {
	tomorrow := time.Date(now.Year(), now.Month(), now.Day()+1, 0, 0, 0, 0, time.UTC)
	return tomorrow.Sub(now)
}

// requestIDFromLocals mirrors the helper in handlers/. Keeping a
// local copy avoids a circular import middleware ↔ handlers.
func requestIDFromLocals(c fiber.Ctx) string {
	if v, ok := c.Locals("request_id").(string); ok {
		return v
	}
	return ""
}
