package middleware_test

import (
	"context"
	"errors"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"

	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// stubUserLookup satisfies middleware.UserLookup without a database —
// tests configure GetByID to return a fixed user or an error.
type stubUserLookup struct {
	byID           map[uuid.UUID]*dbgen.User
	clerkCallCount int
}

func (s *stubUserLookup) GetByID(_ context.Context, id uuid.UUID) (*dbgen.User, error) {
	if u, ok := s.byID[id]; ok {
		return u, nil
	}
	return nil, users.ErrNotFound
}

func (s *stubUserLookup) GetOrCreateByClerkID(_ context.Context, _, _ string) (*dbgen.User, error) {
	s.clerkCallCount++
	return nil, errors.New("not expected in this test")
}

const testInternalToken = "internal-shared-secret-1234567890"

func newAuthApp(t *testing.T, stub *stubUserLookup) *fiber.App {
	t.Helper()
	app := fiber.New()
	app.Use(middleware.RequestID())
	app.Use(middleware.Auth(middleware.AuthConfig{
		UserRepo:      stub,
		InternalToken: testInternalToken,
		// JWKS left nil — any Clerk-path attempt will panic; tests
		// that exercise the Clerk branch must provide their own app.
	}))
	app.Get("/probe", func(c fiber.Ctx) error {
		u, _ := c.Locals(middleware.LocalsUser).(*dbgen.User)
		mode, _ := c.Locals(middleware.LocalsAuthMode).(string)
		return c.JSON(fiber.Map{
			"user_id":   u.ID.String(),
			"auth_mode": mode,
		})
	})
	return app
}

func TestAuth_InternalTokenAcceptsValidHeaders(t *testing.T) {
	uid := uuid.Must(uuid.NewV7())
	stub := &stubUserLookup{byID: map[uuid.UUID]*dbgen.User{
		uid: {ID: uid, SubscriptionTier: "free"},
	}}
	app := newAuthApp(t, stub)

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	req.Header.Set("Authorization", "Bearer "+testInternalToken)
	req.Header.Set("X-User-Id", uid.String())
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}
	if stub.clerkCallCount != 0 {
		t.Fatalf("Clerk path was hit: %d calls", stub.clerkCallCount)
	}
}

func TestAuth_SingleBitOffTokenFallsThroughNotInternal(t *testing.T) {
	// A bearer close to the secret but not equal must NOT be treated as
	// internal — constant-time compare catches this. It then falls into
	// the Clerk path, which we expect to fail (JWKS is nil), so we
	// expect a 401 and zero user loads.
	uid := uuid.Must(uuid.NewV7())
	stub := &stubUserLookup{byID: map[uuid.UUID]*dbgen.User{uid: {ID: uid}}}
	app := newAuthApp(t, stub)

	tampered := testInternalToken[:len(testInternalToken)-1] + "X"
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	req.Header.Set("Authorization", "Bearer "+tampered)
	req.Header.Set("X-User-Id", uid.String())
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401 (Clerk path should reject a non-JWT bearer)", resp.StatusCode)
	}
}

func TestAuth_InternalTokenWithoutXUserIDRejects(t *testing.T) {
	stub := &stubUserLookup{byID: map[uuid.UUID]*dbgen.User{}}
	app := newAuthApp(t, stub)

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	req.Header.Set("Authorization", "Bearer "+testInternalToken)
	// deliberately omit X-User-Id
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401", resp.StatusCode)
	}
}

func TestAuth_InternalTokenWithMalformedUserIDRejects(t *testing.T) {
	stub := &stubUserLookup{byID: map[uuid.UUID]*dbgen.User{}}
	app := newAuthApp(t, stub)

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	req.Header.Set("Authorization", "Bearer "+testInternalToken)
	req.Header.Set("X-User-Id", "not-a-uuid")
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401", resp.StatusCode)
	}
}

func TestAuth_InternalTokenUnknownUserRejects(t *testing.T) {
	// Valid UUID in the header but no such user in the repo — treat as
	// unauthenticated (the AI Service should never invent user ids).
	unknown := uuid.Must(uuid.NewV7())
	stub := &stubUserLookup{byID: map[uuid.UUID]*dbgen.User{}}
	app := newAuthApp(t, stub)

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/probe", nil)
	req.Header.Set("Authorization", "Bearer "+testInternalToken)
	req.Header.Set("X-User-Id", unknown.String())
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("status = %d, want 401 (unknown user)", resp.StatusCode)
	}
}

func TestRequireInternalAuth_RejectsClerkMode(t *testing.T) {
	app := fiber.New()
	app.Use(func(c fiber.Ctx) error {
		// simulate a Clerk-authenticated request
		c.Locals(middleware.LocalsAuthMode, middleware.AuthModeClerk)
		return c.Next()
	})
	app.Use(middleware.RequireInternalAuth())
	app.Get("/internal/x", func(c fiber.Ctx) error { return c.SendString("ok") })

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/internal/x", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != fiber.StatusForbidden {
		t.Fatalf("status = %d, want 403", resp.StatusCode)
	}
}

func TestRequireInternalAuth_AcceptsInternalMode(t *testing.T) {
	app := fiber.New()
	app.Use(func(c fiber.Ctx) error {
		c.Locals(middleware.LocalsAuthMode, middleware.AuthModeInternal)
		return c.Next()
	})
	app.Use(middleware.RequireInternalAuth())
	app.Get("/internal/x", func(c fiber.Ctx) error { return c.SendString("ok") })

	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodGet, "/internal/x", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}
}
