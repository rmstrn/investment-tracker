// Package middleware holds Fiber middleware for cross-cutting concerns:
// auth, rate limit, idempotency, request-ID, and structured request logs.
package middleware

import (
	"context"
	"crypto/subtle"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/httpheader"
)

// Locals keys. Using typed string aliases rather than bare strings so
// handlers that reach into c.Locals get compile-time help.
type localsKey string

const (
	LocalsUser      localsKey = "auth.user"
	LocalsClaims    localsKey = "auth.claims"
	LocalsAuthMode  localsKey = "auth.mode"
	LocalsRequestID localsKey = "request_id"
)

// AuthMode values set on c.Locals(LocalsAuthMode). Handlers that are
// internal-only (POST /internal/ai/usage) gate on AuthModeInternal;
// everything else accepts both.
const (
	AuthModeClerk    = "clerk"
	AuthModeInternal = "internal"
)

// internalUserIDHeader aliases the cross-service header constant
// defined in package httpheader. Kept as a local name so existing
// call sites in this file (and tests that reach into them) keep
// reading with no rename churn; the canonical value now lives in
// one place across Go + Python.
const internalUserIDHeader = httpheader.UserID

// ClerkClaims is the subset of Clerk's ID-token claims we rely on. Clerk's
// JWT template can be configured to include additional fields; we only
// mandate `sub`.
type ClerkClaims struct {
	jwt.RegisteredClaims
	Email     string `json:"email,omitempty"`
	SessionID string `json:"sid,omitempty"`
	OrgID     string `json:"org_id,omitempty"`
}

// UserLookup is the narrow surface the auth middleware needs from the
// user repository. *users.Repo already satisfies it; tests pass a stub.
type UserLookup interface {
	GetByID(ctx context.Context, id uuid.UUID) (*users.User, error)
	GetOrCreateByClerkID(ctx context.Context, clerkID, email string) (*users.User, error)
}

// AuthConfig carries the dependencies the middleware needs.
type AuthConfig struct {
	JWKS     keyfunc.Keyfunc
	UserRepo UserLookup
	// Issuer is the expected `iss` claim — Clerk sets this to the
	// frontend API host (e.g. https://clerk.<yourapp>.com). Empty means
	// skip the check (dev only).
	Issuer string
	// InternalToken is the shared secret that identifies callers as
	// "internal" (AI Service calling Core API on a user's behalf). When
	// the Authorization bearer matches this value via constant-time
	// compare AND X-User-Id is present, the middleware skips Clerk JWT
	// validation and loads the user by UUID. Empty disables the path
	// (Clerk-only operation).
	InternalToken string
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

// Auth returns a Fiber middleware that authenticates every incoming
// request. Two modes are supported:
//
//   - Internal: Authorization: Bearer <InternalToken> + X-User-Id: <uuid>.
//     If the bearer matches cfg.InternalToken (constant-time) AND the
//     header is a valid UUID of an existing user, the request proceeds
//     with LocalsAuthMode=AuthModeInternal and LocalsUser set. No JWT is
//     parsed. This is the AI Service → Core API reverse channel.
//   - Clerk: Authorization: Bearer <JWT>. The JWT is validated via
//     JWKS, issuer and expiration are enforced, and the user is
//     loaded (or created on first sight) via GetOrCreateByClerkID.
//     LocalsAuthMode=AuthModeClerk, LocalsClaims also set.
//
// Order: internal first. A bearer that does not match the internal
// secret falls through to Clerk cleanly — the Clerk parser rejects a
// non-JWT string with ErrInvalidToken, which we translate to 401.
func Auth(cfg AuthConfig) fiber.Handler {
	return func(c fiber.Ctx) error {
		token, ok := extractBearer(c)
		if !ok {
			return errs.Respond(c, requestID(c), errs.ErrUnauthenticated)
		}

		if cfg.InternalToken != "" &&
			subtle.ConstantTimeCompare([]byte(token), []byte(cfg.InternalToken)) == 1 {
			return authenticateInternal(c, cfg)
		}

		return authenticateClerk(c, cfg, token)
	}
}

// authenticateInternal handles the internal-bearer path. The bearer
// token has already been verified; this function validates the
// X-User-Id header and loads the user.
func authenticateInternal(c fiber.Ctx, cfg AuthConfig) error {
	raw := c.Get(internalUserIDHeader)
	if raw == "" {
		return errs.Respond(c, requestID(c), errs.ErrUnauthenticated)
	}
	userID, err := uuid.Parse(raw)
	if err != nil {
		return errs.Respond(c, requestID(c), errs.ErrUnauthenticated)
	}

	user, err := cfg.UserRepo.GetByID(c.Context(), userID)
	if err != nil {
		if errors.Is(err, users.ErrNotFound) {
			return errs.Respond(c, requestID(c), errs.ErrUnauthenticated)
		}
		return errs.Respond(c, requestID(c),
			errs.Wrap(err, 500, "INTERNAL_ERROR", "User lookup failed"))
	}

	c.Locals(LocalsUser, user)
	c.Locals(LocalsAuthMode, AuthModeInternal)
	return c.Next()
}

// authenticateClerk handles the Clerk-JWT path — the existing behaviour
// from PR A, refactored out so the two modes read separately.
func authenticateClerk(c fiber.Ctx, cfg AuthConfig, token string) error {
	if cfg.JWKS == nil {
		// Defensive: a Clerk attempt cannot succeed without JWKS.
		// Production always configures it; tests of the internal-only
		// path leave it nil and rely on this branch to reject cleanly
		// instead of panicking on a nil interface.
		return errs.Respond(c, requestID(c), errs.ErrInvalidToken)
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
	c.Locals(LocalsAuthMode, AuthModeClerk)
	return c.Next()
}

// RequireInternalAuth rejects requests that did not authenticate in
// internal mode. Must come AFTER Auth in the chain. Used by the
// /internal/* routes where a Clerk user (even a valid one) must not
// be allowed to fabricate AI usage for themselves.
func RequireInternalAuth() fiber.Handler {
	return func(c fiber.Ctx) error {
		mode, ok := c.Locals(LocalsAuthMode).(string)
		if !ok || mode != AuthModeInternal {
			return errs.Respond(c, requestID(c), errs.ErrForbidden)
		}
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
