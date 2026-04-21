// Package aiservice is the Core API → AI Service HTTP client. Every
// outbound call carries Bearer {AIServiceToken} + X-User-Id +
// X-Request-Id so the AI Service can scope the work and emit
// correlated logs.
//
// Two surfaces ship in B3-ii-a:
//
//   - GenerateInsights (sync) — backs POST /ai/insights/generate.
//     Blocking 5-30s call into AI Service /internal/insights/generate.
//
// B3-ii-b will add Chat / ChatStream wrappers on top of the same
// base — the per-request header stamping + 401/403 → 502 mapping is
// shared.
package aiservice

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/rmstrn/investment-tracker/apps/api/internal/httpheader"
)

// ErrUpstreamAuth indicates a 401/403 response from the AI Service.
// This is always a Core-side configuration bug (wrong / missing
// AI_SERVICE_TOKEN) — never a user error. Handlers translate this
// to 502 BAD_GATEWAY for the client and trigger a Sentry alert.
var ErrUpstreamAuth = errors.New("aiservice: upstream rejected internal token")

// ErrUpstreamUnavailable wraps any non-2xx that is not 401/403.
// Handlers map this to 502; the message carries the upstream status
// code for the log line.
type ErrUpstreamUnavailable struct {
	StatusCode int
	Body       string
}

func (e *ErrUpstreamUnavailable) Error() string {
	return fmt.Sprintf("aiservice: upstream HTTP %d: %s", e.StatusCode, truncate(e.Body, 200))
}

// Client wraps a *http.Client + the static config (base URL, token).
// Construct once in main and reuse across handlers.
type Client struct {
	baseURL string
	token   string
	httpc   *http.Client
}

// New returns a Client. baseURL is the scheme+host of AI Service
// (e.g. http://ai-service.internal:8000); paths are appended by each
// per-method call. The HTTP client uses no overall timeout — long
// /insights/generate calls can run 30s+; per-request context cancels
// drive cleanup.
func New(baseURL, token string) *Client {
	return &Client{
		baseURL: strings.TrimRight(baseURL, "/"),
		token:   token,
		httpc:   &http.Client{Timeout: 0},
	}
}

// InsightGenerateRequest mirrors AI Service InsightGenerationRequest
// (apps/ai/src/ai_service/models.py). period_days is optional — AI
// Service applies its default when omitted.
type InsightGenerateRequest struct {
	InsightType string `json:"insight_type,omitempty"`
	PeriodDays  int    `json:"period_days,omitempty"`
}

// InsightGenerateResponse mirrors AI Service InsightGenerationResponse.
// `Insights` is the list of generated insight rows ready for the
// Core API to persist; `Usage` is the token-accounting trail that
// AI Service used to write directly to /internal/ai/usage but will
// be Core-API-owned end-to-end after the TASK_05 follow-up (see
// the dual-write coordination note in the B3-ii pre-flight).
type InsightGenerateResponse struct {
	Insights []GeneratedInsight `json:"insights"`
	Usage    []TokenUsage       `json:"usage"`
}

// GeneratedInsight is the AI-Service-side projection of an insight
// before it lives in the insights table. The handler maps these
// fields onto dbgen.Insight when persisting.
type GeneratedInsight struct {
	InsightType string          `json:"insight_type"`
	Title       string          `json:"title"`
	Body        string          `json:"body"`
	Severity    string          `json:"severity"`
	Data        json.RawMessage `json:"data,omitempty"`
}

// TokenUsage is the per-LLM-call accounting record AI Service emits
// alongside generated insights. Mirrors ai_service.models.TokenUsage.
type TokenUsage struct {
	Model        string  `json:"model"`
	InputTokens  int     `json:"input_tokens"`
	OutputTokens int     `json:"output_tokens"`
	CostUSD      float64 `json:"cost_usd"`
}

// ChatHistoryMessage mirrors AI Service `ai_service.models.ChatMessage`.
// Role is strictly user|assistant — Core API filters out `tool` rows
// when loading history for context (AI Service pydantic refuses any
// other value).
type ChatHistoryMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// ChatStreamRequest mirrors AI Service `ai_service.models.ChatRequest`.
// Message is the already-flattened user turn (text blocks joined by
// "\n\n" per Anthropic convention); History is oldest-first and
// capped at 40 entries on the AI-Service side.
type ChatStreamRequest struct {
	ConversationID uuid.UUID            `json:"conversation_id"`
	Message        string               `json:"message"`
	History        []ChatHistoryMessage `json:"history"`
}

// StreamChat opens a POST to /internal/chat/stream and returns the
// raw *http.Response so the caller can stream the SSE body without
// buffering. On 401/403 the body is drained + closed here and
// ErrUpstreamAuth returned (same convention as GenerateInsights);
// on any other non-2xx the error carries the body for logs and the
// response is closed. On 2xx the caller MUST Close resp.Body when
// done (sseproxy.Run does this automatically via defer).
func (c *Client) StreamChat(ctx context.Context, userID uuid.UUID, requestID string, req ChatStreamRequest) (*http.Response, error) {
	body, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("aiservice: marshal chat stream request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost,
		c.baseURL+"/internal/chat/stream", bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("aiservice: build chat stream request: %w", err)
	}
	c.stampHeaders(httpReq, userID, requestID)
	// Override Accept — the upstream returns SSE, not JSON.
	httpReq.Header.Set("Accept", "text/event-stream")

	resp, err := c.httpc.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("aiservice: do chat stream request: %w", err)
	}

	if resp.StatusCode == http.StatusUnauthorized || resp.StatusCode == http.StatusForbidden {
		_, _ = io.Copy(io.Discard, resp.Body)
		_ = resp.Body.Close()
		return nil, ErrUpstreamAuth
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		raw, _ := io.ReadAll(resp.Body)
		_ = resp.Body.Close()
		return nil, &ErrUpstreamUnavailable{StatusCode: resp.StatusCode, Body: string(raw)}
	}

	return resp, nil
}

// GenerateInsights calls POST /internal/insights/generate. Blocks
// for the full AI Service round-trip; caller is expected to be on
// a request-bound context so client disconnect cancels upstream.
func (c *Client) GenerateInsights(ctx context.Context, userID uuid.UUID, requestID string, req InsightGenerateRequest) (*InsightGenerateResponse, error) {
	body, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("aiservice: marshal insight request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost,
		c.baseURL+"/internal/insights/generate", bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("aiservice: build request: %w", err)
	}
	c.stampHeaders(httpReq, userID, requestID)

	resp, err := c.httpc.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("aiservice: do request: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode == http.StatusUnauthorized || resp.StatusCode == http.StatusForbidden {
		return nil, ErrUpstreamAuth
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		raw, _ := io.ReadAll(resp.Body)
		return nil, &ErrUpstreamUnavailable{StatusCode: resp.StatusCode, Body: string(raw)}
	}

	var out InsightGenerateResponse
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, fmt.Errorf("aiservice: decode insight response: %w", err)
	}
	return &out, nil
}

// stampHeaders sets the three internal-auth headers every outbound
// call carries. Header names come from the shared httpheader
// package so Go + Python agree on casing ("X-Request-ID" — Sprint
// C 3a canonicalized the previous "X-Request-Id" Title-case drift
// on this exact call site).
func (c *Client) stampHeaders(req *http.Request, userID uuid.UUID, requestID string) {
	req.Header.Set(httpheader.Authorization, "Bearer "+c.token)
	req.Header.Set(httpheader.UserID, userID.String())
	if requestID != "" {
		req.Header.Set(httpheader.RequestID, requestID)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
}

// truncate caps a string for log lines. AI Service can return rich
// upstream error bodies; full echo blows the log budget.
func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}

// Now is the wallclock the client uses for any internal time stamps
// (currently none — exposed for future Chat token-bucket bookkeeping).
var Now = time.Now
