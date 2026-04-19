package handlers

import (
	"net/http"
	"testing"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

func makeReq(t *testing.T, mut func(*aiUsageRequest)) (aiUsageRequest, string) {
	t.Helper()
	userID := uuid.MustParse("01940000-0000-7000-8000-000000000001")
	req := aiUsageRequest{
		UserID:       userID,
		Model:        "claude-sonnet-4-6",
		InputTokens:  100,
		OutputTokens: 250,
		CostUSD:      decimal.RequireFromString("0.004500"),
	}
	if mut != nil {
		mut(&req)
	}
	return req, userID.String()
}

func TestAIUsageValidate_HappyPath(t *testing.T) {
	req, header := makeReq(t, nil)
	if err := req.validate(header); err != nil {
		t.Fatalf("happy path errored: %v", err)
	}
}

func TestAIUsageValidate_UserIDHeaderMismatchRejects(t *testing.T) {
	req, _ := makeReq(t, nil)
	other := uuid.Must(uuid.NewV7()).String()
	err := req.validate(other)
	if err == nil {
		t.Fatal("expected error on body vs header mismatch")
	}
	if err.Status != http.StatusBadRequest || err.Code != "VALIDATION_ERROR" {
		t.Fatalf("got status=%d code=%q, want 400 VALIDATION_ERROR", err.Status, err.Code)
	}
}

func TestAIUsageValidate_ModelNotInWhitelistRejects(t *testing.T) {
	req, header := makeReq(t, func(r *aiUsageRequest) {
		r.Model = "gpt-4o"
	})
	err := req.validate(header)
	if err == nil {
		t.Fatal("expected error on non-whitelisted model")
	}
	if err.Status != http.StatusBadRequest {
		t.Fatalf("status = %d, want 400", err.Status)
	}
}

func TestAIUsageValidate_AcceptsAllWhitelistedModels(t *testing.T) {
	// Regression guard: if the model matrix in DECISIONS.md changes and
	// the whitelist falls out of sync, this test catches it at compile
	// time (the constant list is here and the list is the one place the
	// handler reads).
	for _, m := range []string{"claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"} {
		t.Run(m, func(t *testing.T) {
			req, header := makeReq(t, func(r *aiUsageRequest) { r.Model = m })
			if err := req.validate(header); err != nil {
				t.Fatalf("whitelisted model %s rejected: %v", m, err)
			}
		})
	}
}

func TestAIUsageValidate_NegativeTokensRejected(t *testing.T) {
	cases := []func(*aiUsageRequest){
		func(r *aiUsageRequest) { r.InputTokens = -1 },
		func(r *aiUsageRequest) { r.OutputTokens = -1 },
	}
	for i, mut := range cases {
		req, header := makeReq(t, mut)
		if err := req.validate(header); err == nil {
			t.Fatalf("case %d: expected error on negative tokens", i)
		}
	}
}

func TestAIUsageValidate_NegativeCostRejected(t *testing.T) {
	req, header := makeReq(t, func(r *aiUsageRequest) {
		r.CostUSD = decimal.RequireFromString("-0.01")
	})
	if err := req.validate(header); err == nil {
		t.Fatal("expected error on negative cost")
	}
}

func TestAIUsageValidate_ZeroCostAccepted(t *testing.T) {
	// A $0 call is possible (e.g. a tool-only turn that doesn't produce
	// output tokens or a cached response). Must not be rejected.
	req, header := makeReq(t, func(r *aiUsageRequest) {
		r.CostUSD = decimal.Zero
		r.OutputTokens = 0
	})
	if err := req.validate(header); err != nil {
		t.Fatalf("zero cost rejected: %v", err)
	}
}
