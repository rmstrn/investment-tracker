// Package middleware holds Fiber middleware for cross-cutting concerns:
// auth, rate limit, idempotency, request-ID, and structured request logs.
package middleware

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"

	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// Locals keys. Using typed string aliases rather than bare strings so
// handlers that reach into c.Locals get compile-time help.
type localsKey string

const (
	LocalsUser      localsKey = "auth.user"
	LocalsClaims    localsKey = "auth.claims"
	LocalsRequestID localsKey = "request_id"
)

// ClerkClaims is the subset of Clerk's ID-token claims we rely on. Clerk's
// JWT template can be configured to include additional fields; we only
// mandate `sub`.
type ClerkClaims struct {
	jwt.RegisteredClaims
	Email     string `json:"email,omitempty"`
	SessionID string `json:"sid,omitempty"`
	OrgID     string `json:"org_id,omitempty"`
}

// AuthConfig carries the dependencies the middleware needs.
type AuthConfig struct {
	JWKS     keyfunc.Keyfunc
	UserRepo *users.Repo
	// Issuer is the expected `iss` claim — Clerk sets this to the
	// frontend API host (e.g. https://clerk.<yourapp>.com). Empty means
	// skip the check (dev only).
	Issuer string
}

// NewJWKS builds a keyfunc for the given JWKS URL with sensible refresh
// semantics: auto-refresh on key miss, periodic resync every hour.
func NewJWKS(ctx context.Context, jwksURL string) (keyfunc.Keyfunc, error) {
	k, err := keyfunc.NewDefaultCtx(ctx, []string{jwksURL})
	if err != nil {
		return nil, fmt.Errorf("jwks: %w", err)
	}
	return k, nil
}

// Auth returns a Fiber middleware that validates a Clerk JWT on every
// incoming request. On success, the User is attached to c.Locals under
// LocalsUser; the claims are attached under LocalsClaims.
func Auth(cfg AuthConfig) fiber.Handler {
	return func(c fiber.Ctx) error {
		token, ok := extractBearer(c)
		if !ok {
			return errs.Respond(c, requestID(c), errs.ErrUnauthenticated)
		}

		claims := &ClerkClaims{}
		parsed, err := jwt.ParseWithClaims(token, claims, cfg.JWKS.Keyfunc,
			jwt.WithValidMethods([]string{"RS256", "RS384", "RS512"}),
			jwt.WithExpirationRequired(),
			jwt.WithLeeway(30*time.Second),
		)
		if err != nil || !parsed.Valid {
			return errs.Respond(c, requestID(c), errs.ErrInvalidToken)
		}

		if cfg.Issuer != "" && claims.Issuer != cfg.Issuer {
			return errs.Respond(c, requestID(c), errs.ErrInvalidToken)
		}

		if claims.Subject == "" {
			return errs.Respond(c, requestID(c), errs.ErrInvalidToken)
		}

		user, err := cfg.UserRepo.GetOrCreateByClerkID(c.Context(), claims.Subject, claims.Email)
		if err != nil {
			if errors.Is(err, users.ErrNotFound) {
				return errs.Respond(c, requestID(c), errs.ErrUnauthenticated)
			}
			return errs.Respond(c, requestID(c),
				errs.Wrap(err, 500, "INTERNAL_ERROR", "User lookup failed"))
		}

		c.Locals(LocalsUser, user)
		c.Locals(LocalsClaims, claims)
		return c.Next()
	}
}

// RequireTier returns a middleware that rejects requests whose user does
// not meet the given tier. Must come AFTER Auth in the chain.
func RequireTier(required string) fiber.Handler {
	return func(c fiber.Ctx) error {
		u, ok := c.Locals(LocalsUser).(*users.User)
		if !ok || u == nil {
			return errs.Respond(c, requestID(c), errs.ErrUnauthenticated)
		}
		if !users.HasTier(u, required) {
			return errs.Respond(c, requestID(c),
				errs.ErrTierLimitExceeded.WithDetails(map[string]any{
					"required_tier": required,
					"upgrade_url":   "/pricing",
				}))
		}
		return c.Next()
	}
}

// UserFromCtx returns the authenticated user attached to the Fiber ctx.
// Panics if called from a handler that is not behind Auth — that is a
// programmer error, not a runtime condition.
func UserFromCtx(c fiber.Ctx) *users.User {
	u, ok := c.Locals(LocalsUser).(*users.User)
	if !ok || u == nil {
		panic("middleware: no authenticated user on context — missing Auth middleware?")
	}
	return u
}

func extractBearer(c fiber.Ctx) (string, bool) {
	h := c.Get(fiber.HeaderAuthorization)
	if h == "" {
		return "", false
	}
	const prefix = "Bearer "
	if !strings.HasPrefix(h, prefix) {
		return "", false
	}
	tok := strings.TrimSpace(h[len(prefix):])
	if tok == "" {
		return "", false
	}
	return tok, true
}

func requestID(c fiber.Ctx) string {
	if id, ok := c.Locals(LocalsRequestID).(string); ok {
		return id
	}
	return ""
}
