package middleware_test

// Clerk-path auth tests. The existing auth_internal_test.go covers
// the internal-token branch exhaustively; this file exercises the
// Clerk-JWT branch that has been sitting at lower coverage because
// wiring a real JWKS is more work than a stub.
//
// We use a hand-rolled stub keyfunc.Keyfunc that returns a known
// RSA public key, and mint JWTs with the matching private key. This
// never hits the network — the tests run in milliseconds alongside
// the rest of the package suite.
//
// Not covered (intentional — out of sprint scope):
//   - JWKS refresh-on-miss (belongs to the keyfunc library, not
//     our middleware); best tested via an httptest.Server simulating
//     key rotation, future sprint C work.

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"errors"
	"net/http/httptest"
	"testing"
	"time"

	jwkset "github.com/MicahParks/jwkset"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/rs/zerolog"

	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// stubKeyfunc is a minimal keyfunc.Keyfunc that always returns the
// same RSA public key. Real prod uses keyfunc.NewDefaultCtx against
// Clerk's JWKS URL; for tests we skip the HTTP fetch.
type stubKeyfunc struct{ pub *rsa.PublicKey }

func (s *stubKeyfunc) Keyfunc(_ *jwt.Token) (any, error)        { return s.pub, nil }
func (s *stubKeyfunc) KeyfuncCtx(_ context.Context) jwt.Keyfunc { return s.Keyfunc }
func (s *stubKeyfunc) Storage() jwkset.Storage                  { return nil }
func (s *stubKeyfunc) VerificationKeySet(_ context.Context) (jwt.VerificationKeySet, error) {
	return jwt.VerificationKeySet{}, errors.New("stub: not implemented")
}

// clerkStubLookup satisfies UserLookup with a GetOrCreateByClerkID
// path that returns a preloaded user or a configurable error.
type clerkStubLookup struct {
	byClerkID  map[string]*dbgen.User
	returnErr  error
	createCall int
}

func (c *clerkStubLookup) GetByID(_ context.Context, id uuid.UUID) (*dbgen.User, error) {
	return nil, users.ErrNotFound
}
func (c *clerkStubLookup) GetOrCreateByClerkID(_ context.Context, clerkID, _ string) (*dbgen.User, error) {
	c.createCall++
	if c.returnErr != nil {
		return nil, c.returnErr
	}
	if u, ok := c.byClerkID[clerkID]; ok {
		return u, nil
	}
	return nil, users.ErrNotFound
}

// keyPair generates a test RSA key once per test. Small bit-size
// keeps the test under a couple ms even on slow Windows CI runners;
// we never sign anything security-sensitive with it.
func keyPair(t *testing.T) (*rsa.PrivateKey, *rsa.PublicKey) {
	t.Helper()
	priv, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		t.Fatalf("rsa keygen: %v", err)
	}
	return priv, &priv.PublicKey
}

// mintJWT signs a minimal Clerk-style JWT with the provided private
// key and claims. Leave any required field zero to exercise that
// field's rejection path.
func mintJWT(t *testing.T, priv *rsa.PrivateKey, sub, iss string, exp time.Time) string {
	t.Helper()
	claims := middleware.ClerkClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   sub,
			Issuer:    iss,
			ExpiresAt: jwt.NewNumericDate(exp),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		Email: sub + "@test.local",
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	signed, err := tok.SignedString(priv)
	if err != nil {
		t.Fatalf("sign: %v", err)
	}
	return signed
}

// newClerkAuthApp builds a Fiber app with the Clerk-JWT branch
// wired: stub keyfunc, configurable issuer, and a user-lookup stub.
func newClerkAuthApp(t *testing.T, pub *rsa.PublicKey, issuer string, stub *clerkStubLookup) *fiber.App {
	t.Helper()
	app := fiber.New()
	app.Use(middleware.RequestID())
	app.Use(middleware.Auth(middleware.AuthConfig{
		JWKS:     &stubKeyfunc{pub: pub},
		UserRepo: stub,
		Issuer:   issuer,
		// InternalToken empty — this app is Clerk-only; internal
		// bearer path disabled so test isolation is clean.
	}))
	app.Get("/probe", func(c fiber.Ctx) error {
		u, _ := c.Locals(middleware.LocalsUser).(*dbgen.User)
		mode, _ := c.Locals(middleware.LocalsAuthMode).(string)
		return c.JSON(fiber.Map{"user_id": u.ID.String(), "auth_mode": mode})
	})
	return app
}

// TestClerkAuth_IssuerSkipInDevMode asserts that cfg.Issuer="" (dev
// mode) accepts a JWT with any issuer string. The middleware
// comment at auth.go:71 documents this as the dev-only relaxation.
func TestClerkAuth_IssuerSkipInDevMode(t *testing.T) {
	priv, pub := keyPair(t)
	uid := uuid.Must(uuid.NewV7())
	stub := &clerkStubLookup{byClerkID: map[string]*dbgen.User{
		"user_abc": {ID: uid, SubscriptionTier: "free"},
	}}
	app := newClerkAuthApp(t, pub, "" /* dev — skip issuer check */, stub)

	tok := mintJWT(t, priv, "user_abc", "https://whatever.anywhere.com", time.Now().Add(5*time.Minute))
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, want 200 (dev mode should skip issuer check)", resp.StatusCode)
	}
	if stub.createCall != 1 {
		t.Errorf("GetOrCreateByClerkID called %d times, want 1", stub.createCall)
	}
}

// TestClerkAuth_StrictIssuer_RejectsMismatch asserts that when
// cfg.Issuer is non-empty (prod / staging), a JWT whose `iss` does
// not match is rejected with 401.
func TestClerkAuth_StrictIssuer_RejectsMismatch(t *testing.T) {
	priv, pub := keyPair(t)
	uid := uuid.Must(uuid.NewV7())
	stub := &clerkStubLookup{byClerkID: map[string]*dbgen.User{
		"user_abc": {ID: uid, SubscriptionTier: "free"},
	}}
	app := newClerkAuthApp(t, pub, "https://clerk.myapp.com", stub)

	tok := mintJWT(t, priv, "user_abc", "https://attacker.test", time.Now().Add(5*time.Minute))
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401 (strict issuer)", resp.StatusCode)
	}
	if stub.createCall != 0 {
		t.Errorf("GetOrCreateByClerkID called %d times, want 0 (reject before user lookup)", stub.createCall)
	}
}

// TestClerkAuth_StrictIssuer_AcceptsMatch — positive control for
// the strict-issuer case.
func TestClerkAuth_StrictIssuer_AcceptsMatch(t *testing.T) {
	priv, pub := keyPair(t)
	uid := uuid.Must(uuid.NewV7())
	stub := &clerkStubLookup{byClerkID: map[string]*dbgen.User{
		"user_ok": {ID: uid, SubscriptionTier: "plus"},
	}}
	app := newClerkAuthApp(t, pub, "https://clerk.myapp.com", stub)

	tok := mintJWT(t, priv, "user_ok", "https://clerk.myapp.com", time.Now().Add(5*time.Minute))
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}
}

// TestClerkAuth_ExpiredJWT_Rejects — jwt.WithExpirationRequired +
// 30s leeway (auth.go:165) should still reject a JWT expired
// 5 minutes ago.
func TestClerkAuth_ExpiredJWT_Rejects(t *testing.T) {
	priv, pub := keyPair(t)
	stub := &clerkStubLookup{byClerkID: map[string]*dbgen.User{
		"user_abc": {ID: uuid.Must(uuid.NewV7())},
	}}
	app := newClerkAuthApp(t, pub, "", stub)

	tok := mintJWT(t, priv, "user_abc", "https://any", time.Now().Add(-5*time.Minute))
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401 for expired JWT", resp.StatusCode)
	}
}

// TestClerkAuth_MissingSubjectClaim_Rejects — auth.go:175 enforces
// `sub` to be non-empty; a JWT without it is 401 even if the
// signature checks out.
func TestClerkAuth_MissingSubjectClaim_Rejects(t *testing.T) {
	priv, pub := keyPair(t)
	stub := &clerkStubLookup{byClerkID: map[string]*dbgen.User{}}
	app := newClerkAuthApp(t, pub, "", stub)

	tok := mintJWT(t, priv, "" /* empty sub */, "https://any", time.Now().Add(5*time.Minute))
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401 for missing sub", resp.StatusCode)
	}
	if stub.createCall != 0 {
		t.Errorf("GetOrCreateByClerkID called %d, want 0 (reject before user lookup)", stub.createCall)
	}
}

// TestClerkAuth_UserLookupErrorSurfaces500 — when
// GetOrCreateByClerkID returns a non-ErrNotFound error (e.g.
// Postgres down), the middleware wraps it as 500 INTERNAL_ERROR
// instead of silently allowing the request.
func TestClerkAuth_UserLookupErrorSurfaces500(t *testing.T) {
	priv, pub := keyPair(t)
	stub := &clerkStubLookup{
		byClerkID: map[string]*dbgen.User{},
		returnErr: errors.New("boom: pg down"),
	}
	app := newClerkAuthApp(t, pub, "", stub)

	tok := mintJWT(t, priv, "user_abc", "https://any", time.Now().Add(5*time.Minute))
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusInternalServerError {
		t.Fatalf("status = %d, want 500", resp.StatusCode)
	}
}

// TestClerkAuth_UserLookupNotFoundReturns401 — ErrNotFound on
// GetOrCreateByClerkID is a distinct branch: the JWT verified but
// we couldn't hydrate the user. Returns 401.
func TestClerkAuth_UserLookupNotFoundReturns401(t *testing.T) {
	priv, pub := keyPair(t)
	stub := &clerkStubLookup{byClerkID: map[string]*dbgen.User{} /* empty — GetOrCreate returns ErrNotFound */}
	app := newClerkAuthApp(t, pub, "", stub)

	tok := mintJWT(t, priv, "unknown_user", "https://any", time.Now().Add(5*time.Minute))
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401", resp.StatusCode)
	}
}

// TestRequireTier_RejectsInsufficientTier covers the tier-gate
// middleware that mounts in front of paid endpoints. Free users
// hitting a Plus-required route bounce at RequireTier with 403 +
// the tier-details envelope clients render into paywall UI.
func TestRequireTier_RejectsInsufficientTier(t *testing.T) {
	app := fiber.New()
	app.Use(middleware.RequestID())
	app.Use(func(c fiber.Ctx) error {
		c.Locals(middleware.LocalsUser, &dbgen.User{
			ID:               uuid.Must(uuid.NewV7()),
			SubscriptionTier: "free",
		})
		return c.Next()
	})
	app.Use(middleware.RequireTier("plus"))
	app.Get("/paid", func(c fiber.Ctx) error { return c.SendString("ok") })

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/paid", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusForbidden {
		t.Errorf("status = %d, want 403", resp.StatusCode)
	}
}

// TestRequireTier_AcceptsEqualTier positive control — a free user
// hitting a free-required route passes. Also exercises the
// happy-path branch that reads c.Locals(LocalsUser) cleanly.
func TestRequireTier_AcceptsEqualTier(t *testing.T) {
	app := fiber.New()
	app.Use(middleware.RequestID())
	app.Use(func(c fiber.Ctx) error {
		c.Locals(middleware.LocalsUser, &dbgen.User{
			ID:               uuid.Must(uuid.NewV7()),
			SubscriptionTier: "plus",
		})
		return c.Next()
	})
	app.Use(middleware.RequireTier("plus"))
	app.Get("/paid", func(c fiber.Ctx) error { return c.SendString("ok") })

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/paid", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("status = %d, want 200", resp.StatusCode)
	}
}

// TestRequireTier_RejectsMissingUser covers the defensive branch
// when RequireTier runs without the Auth middleware in front
// (programmer error — should never happen in production routes).
func TestRequireTier_RejectsMissingUser(t *testing.T) {
	app := fiber.New()
	app.Use(middleware.RequestID())
	app.Use(middleware.RequireTier("plus"))
	app.Get("/paid", func(c fiber.Ctx) error { return c.SendString("ok") })

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/paid", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Errorf("status = %d, want 401 for missing user", resp.StatusCode)
	}
}

// TestUserFromCtx_ReturnsAuthenticatedUser covers the helper that
// handlers use to read the authenticated user. Also exercises the
// happy-path branch (non-nil, right type).
func TestUserFromCtx_ReturnsAuthenticatedUser(t *testing.T) {
	uid := uuid.Must(uuid.NewV7())
	app := fiber.New()
	app.Use(func(c fiber.Ctx) error {
		c.Locals(middleware.LocalsUser, &dbgen.User{ID: uid, SubscriptionTier: "free"})
		return c.Next()
	})
	app.Get("/probe", func(c fiber.Ctx) error {
		u := middleware.UserFromCtx(c)
		return c.SendString(u.ID.String())
	})

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("status = %d, want 200", resp.StatusCode)
	}
}

// TestRequestLog_PopulatesLogFields is a smoke test for the
// RequestLog middleware — runs a request through it and verifies
// the app survives. We don't assert on log content (the
// zerolog-to-buffer dance is noisy and brittle); the middleware
// is straightforward so reaching every branch is enough.
func TestRequestLog_PopulatesLogFields(t *testing.T) {
	logger := zerolog.Nop()
	app := fiber.New()
	app.Use(middleware.RequestID())
	app.Use(middleware.RequestLog(logger))
	app.Get("/x", func(c fiber.Ctx) error { return c.SendStatus(fiber.StatusOK) })
	app.Get("/err", func(c fiber.Ctx) error { return c.SendStatus(fiber.StatusInternalServerError) })

	for _, path := range []string{"/x", "/err"} {
		req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, path, nil)
		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("app.Test %s: %v", path, err)
		}
		_ = resp.Body.Close()
	}
}

// TestAuth_MalformedAuthorizationHeaders covers the extractBearer
// rejections that the Clerk-path test pack did not exercise: no
// Authorization header, wrong scheme prefix, empty bearer value.
func TestAuth_MalformedAuthorizationHeaders(t *testing.T) {
	_, pub := keyPair(t)
	stub := &clerkStubLookup{byClerkID: map[string]*dbgen.User{}}
	app := newClerkAuthApp(t, pub, "", stub)

	cases := map[string]string{
		"missing_header":     "",
		"wrong_scheme_basic": "Basic Zm9vOmJhcg==",
		"wrong_scheme_token": "Token abcdef",
		"bearer_with_no_val": "Bearer ",
		"bearer_only":        "Bearer",
		"lowercase_bearer":   "bearer abc",
	}

	for name, auth := range cases {
		t.Run(name, func(t *testing.T) {
			req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
			if auth != "" {
				req.Header.Set("Authorization", auth)
			}
			resp, err := app.Test(req)
			if err != nil {
				t.Fatalf("app.Test: %v", err)
			}
			defer func() { _ = resp.Body.Close() }()
			if resp.StatusCode != fiber.StatusUnauthorized {
				t.Errorf("status = %d, want 401 for %q", resp.StatusCode, auth)
			}
		})
	}
}
