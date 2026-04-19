package middleware

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// idempotencyHeader is the canonical name clients send per openapi.yaml.
const idempotencyHeader = "Idempotency-Key"

// lockTTL bounds the request-collapsing SETNX window. A real handler
// that takes longer than this shouldn't be idempotency-locked anyway;
// 30s covers every mutation in the current surface with generous
// headroom.
const lockTTL = 30 * time.Second

// IdempotencyConfig carries the Redis client. TTL is fixed at 24h by the
// API contract; we surface it here only for tests.
type IdempotencyConfig struct {
	Cache *cache.Client
	TTL   time.Duration // defaults to 24h when zero
}

// idempotentEntry is what we serialise to Redis for replay. Keep small and
// JSON-friendly — Redis is the hot path.
type idempotentEntry struct {
	BodyHash string            `json:"body_hash"`
	Status   int               `json:"status"`
	Headers  map[string]string `json:"headers"`
	Body     []byte            `json:"body"`
}

// Idempotency replays a cached response when the same user sends the same
// Idempotency-Key within 24 hours. The header is OPTIONAL — requests
// without it pass through unchanged.
//
// Conflict detection: if the key was seen but the request body differs
// (hash mismatch), we return 409 IDEMPOTENCY_KEY_CONFLICT per the spec.
//
// Must come AFTER Auth in the chain; without a user we cannot namespace
// keys.
//
// Concurrent-replay collapse (closes TD-011): before the handler runs
// we SETNX a short-lived lock key (30s). A second request with the
// same (user, method, path, key) while the first is still in flight
// returns 409 IDEMPOTENCY_IN_PROGRESS instead of racing the handler
// and corrupting the cached entry. The lock is released as soon as
// the outer handler returns — the 24h response cache takes over for
// subsequent retries, so clients only see IDEMPOTENCY_IN_PROGRESS
// during the genuine execution window.
func Idempotency(cfg IdempotencyConfig) fiber.Handler {
	if cfg.Cache == nil {
		panic("middleware.Idempotency: Cache is required")
	}
	ttl := cfg.TTL
	if ttl <= 0 {
		ttl = 24 * time.Hour
	}

	return func(c fiber.Ctx) error {
		method := strings.ToUpper(c.Method())
		if method != fiber.MethodPost &&
			method != fiber.MethodPatch &&
			method != fiber.MethodDelete {
			return c.Next()
		}

		key := c.Get(idempotencyHeader)
		if key == "" {
			return c.Next()
		}

		u, ok := c.Locals(LocalsUser).(*users.User)
		if !ok || u == nil {
			return errs.Respond(c, requestID(c), errs.ErrUnauthenticated)
		}

		body := c.Body()
		bodyHashSum := sha256.Sum256(body)
		bodyHash := hex.EncodeToString(bodyHashSum[:])

		// Namespace: user_id | method | path | hashed key. Hashing the
		// caller-provided key keeps its length predictable and avoids
		// accidental Redis-key character issues.
		keyHashSum := sha256.Sum256([]byte(key))
		redisKey := fmt.Sprintf("idem:%s:%s:%s:%s",
			u.ID, method, c.Path(), hex.EncodeToString(keyHashSum[:]))

		if raw, found, err := cfg.Cache.Get(c.Context(), redisKey); err == nil && found {
			var entry idempotentEntry
			if err := json.Unmarshal([]byte(raw), &entry); err == nil {
				if entry.BodyHash != bodyHash {
					return errs.Respond(c, requestID(c), errs.ErrIdempotencyConflict)
				}
				for hk, hv := range entry.Headers {
					c.Set(hk, hv)
				}
				c.Set("Idempotent-Replayed", "true")
				c.Status(entry.Status)
				return c.Send(entry.Body)
			}
		}

		lockKey := redisKey + ":lock"
		acquired, err := cfg.Cache.SetNX(c.Context(), lockKey, "1", lockTTL)
		if err != nil {
			// Redis flapped — fail open to the handler. The 24h response
			// cache still protects against cross-request duplication;
			// concurrent-replay collapse is a nice-to-have, not a
			// correctness requirement.
			acquired = true
		}
		if !acquired {
			return errs.Respond(c, requestID(c), errs.ErrIdempotencyInProgress)
		}
		defer func() { _ = cfg.Cache.Del(c.Context(), lockKey) }()

		if err := c.Next(); err != nil {
			return err
		}

		status := c.Response().StatusCode()
		respBody := append([]byte(nil), c.Response().Body()...)

		// Capture a conservative set of response headers: content-type and
		// rate-limit headers. Copying everything risks caching sensitive
		// or per-connection headers (Set-Cookie, Date) that should not be
		// replayed verbatim.
		headers := map[string]string{}
		if ct := string(c.Response().Header.ContentType()); ct != "" {
			headers[fiber.HeaderContentType] = ct
		}
		for _, h := range []string{"X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"} {
			if v := c.Get(h); v != "" {
				headers[h] = v
			}
		}

		payload, err := json.Marshal(idempotentEntry{
			BodyHash: bodyHash,
			Status:   status,
			Headers:  headers,
			Body:     respBody,
		})
		if err != nil {
			return nil // logged by outer middleware; don't fail the actual request
		}
		_ = cfg.Cache.Set(c.Context(), redisKey, string(payload), ttl)
		return nil
	}
}
