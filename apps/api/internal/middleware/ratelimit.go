package middleware

import (
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// RateLimitConfig tunes a single rate-limit middleware instance. Most
// routes want one bucket each; endpoints that share semantics (e.g. all
// transaction writes) can share a bucket by reusing the same Key.
type RateLimitConfig struct {
	Cache  *cache.Client
	Key    string        // bucket name, e.g. "portfolio" or "ai.chat"
	Limit  int           // max requests per window per user
	Window time.Duration // sliding-ish window

	// Passthrough disables the 429 gate while keeping the counter and
	// the X-RateLimit-* headers. Used on GET routes where we want
	// observability (per-user request rate in Redis) without the gate
	// (reads are cheap and we size GET limits conservatively). Zero
	// value (false) means the usual behaviour: gate on breach.
	Passthrough bool
}

// RateLimit enforces a per-user counter in Redis. X-RateLimit-* headers
// are set on every response (success or 429) per openapi.yaml conventions.
//
// Must come AFTER Auth in the chain — the user ID is read from locals.
//
// cfg.Passthrough skips the 429 gate while still counting — use this on
// read-only (GET) routes.
func RateLimit(cfg RateLimitConfig) fiber.Handler {
	if cfg.Cache == nil {
		panic("middleware.RateLimit: Cache is required")
	}
	if cfg.Limit <= 0 || cfg.Window <= 0 {
		panic("middleware.RateLimit: Limit and Window must be positive")
	}

	return func(c fiber.Ctx) error {
		u, ok := c.Locals(LocalsUser).(*users.User)
		if !ok || u == nil {
			return errs.Respond(c, requestID(c), errs.ErrUnauthenticated)
		}

		redisKey := fmt.Sprintf("rl:%s:%s", cfg.Key, u.ID)

		count, err := cfg.Cache.IncrWithTTL(c.Context(), redisKey, cfg.Window)
		if err != nil {
			// Fail open on Redis outage — we do not want the whole API to
			// drop when the rate limiter breaks. Logged at the caller via
			// request logging middleware when that lands.
			return c.Next()
		}

		remaining := cfg.Limit - int(count)
		if remaining < 0 {
			remaining = 0
		}

		c.Set("X-RateLimit-Limit", strconv.Itoa(cfg.Limit))
		c.Set("X-RateLimit-Remaining", strconv.Itoa(remaining))
		c.Set("X-RateLimit-Reset", strconv.FormatInt(time.Now().Add(cfg.Window).Unix(), 10))

		if !cfg.Passthrough && count > int64(cfg.Limit) {
			return errs.Respond(c, requestID(c),
				errs.ErrRateLimit.WithDetails(map[string]any{
					"limit":  cfg.Limit,
					"window": cfg.Window.String(),
				}))
		}
		return c.Next()
	}
}
