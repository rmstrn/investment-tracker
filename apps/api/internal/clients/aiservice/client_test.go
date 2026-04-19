package aiservice

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/google/uuid"
)

// fakeServer captures the inbound request + replies with a canned
// status / body. Single-use; spin a fresh one per test case.
type fakeServer struct {
	*httptest.Server
	gotAuthHeader  string
	gotXUserID     string
	gotXRequestID  string
	gotContentType string
	gotPath        string
	gotBody        []byte
}

func newFakeServer(t *testing.T, status int, body string) *fakeServer {
	t.Helper()
	fs := &fakeServer{}
	fs.Server = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fs.gotAuthHeader = r.Header.Get("Authorization")
		fs.gotXUserID = r.Header.Get("X-User-Id")
		fs.gotXRequestID = r.Header.Get("X-Request-Id")
		fs.gotContentType = r.Header.Get("Content-Type")
		fs.gotPath = r.URL.Path
		buf := make([]byte, 4096)
		n, _ := r.Body.Read(buf)
		fs.gotBody = buf[:n]
		w.WriteHeader(status)
		_, _ = w.Write([]byte(body))
	}))
	t.Cleanup(fs.Close)
	return fs
}

func TestGenerateInsights_HappyPath_StampsHeaders(t *testing.T) {
	fs := newFakeServer(t, http.StatusOK, `{
		"insights": [{
			"insight_type": "performance",
			"title": "Up 5%",
			"body": "Your portfolio is up...",
			"severity": "info"
		}],
		"usage": [{
			"model": "claude-3-5-haiku-20241022",
			"input_tokens": 100,
			"output_tokens": 200,
			"cost_usd": 0.001
		}]
	}`)

	c := New(fs.URL, "test-token-32-bytes-or-more-yes-it-is")
	uid := uuid.Must(uuid.NewV7())
	resp, err := c.GenerateInsights(context.Background(), uid, "req-abc",
		InsightGenerateRequest{InsightType: "performance", PeriodDays: 7})
	if err != nil {
		t.Fatalf("err = %v", err)
	}
	if len(resp.Insights) != 1 || resp.Insights[0].Title != "Up 5%" {
		t.Fatalf("insights = %+v", resp.Insights)
	}
	if len(resp.Usage) != 1 || resp.Usage[0].InputTokens != 100 {
		t.Fatalf("usage = %+v", resp.Usage)
	}

	if fs.gotPath != "/internal/insights/generate" {
		t.Fatalf("path = %q", fs.gotPath)
	}
	if fs.gotAuthHeader != "Bearer test-token-32-bytes-or-more-yes-it-is" {
		t.Fatalf("auth header = %q", fs.gotAuthHeader)
	}
	if fs.gotXUserID != uid.String() {
		t.Fatalf("x-user-id = %q, want %s", fs.gotXUserID, uid)
	}
	if fs.gotXRequestID != "req-abc" {
		t.Fatalf("x-request-id = %q", fs.gotXRequestID)
	}
	if fs.gotContentType != "application/json" {
		t.Fatalf("content-type = %q", fs.gotContentType)
	}

	var sentBody InsightGenerateRequest
	if err := json.Unmarshal(fs.gotBody, &sentBody); err != nil {
		t.Fatalf("decode sent body: %v", err)
	}
	if sentBody.InsightType != "performance" || sentBody.PeriodDays != 7 {
		t.Fatalf("sent body = %+v", sentBody)
	}
}

func TestGenerateInsights_401_ReturnsErrUpstreamAuth(t *testing.T) {
	fs := newFakeServer(t, http.StatusUnauthorized, `{"detail":"bad token"}`)

	c := New(fs.URL, "wrong-token")
	_, err := c.GenerateInsights(context.Background(), uuid.Must(uuid.NewV7()), "",
		InsightGenerateRequest{})
	if !errors.Is(err, ErrUpstreamAuth) {
		t.Fatalf("err = %v, want ErrUpstreamAuth", err)
	}
}

func TestGenerateInsights_403_ReturnsErrUpstreamAuth(t *testing.T) {
	fs := newFakeServer(t, http.StatusForbidden, `{"detail":"forbidden"}`)

	c := New(fs.URL, "any-token")
	_, err := c.GenerateInsights(context.Background(), uuid.Must(uuid.NewV7()), "",
		InsightGenerateRequest{})
	if !errors.Is(err, ErrUpstreamAuth) {
		t.Fatalf("err = %v, want ErrUpstreamAuth", err)
	}
}

func TestGenerateInsights_500_ReturnsErrUpstreamUnavailable(t *testing.T) {
	fs := newFakeServer(t, http.StatusInternalServerError, `{"detail":"boom"}`)

	c := New(fs.URL, "ok-token")
	_, err := c.GenerateInsights(context.Background(), uuid.Must(uuid.NewV7()), "",
		InsightGenerateRequest{})

	var upstream *ErrUpstreamUnavailable
	if !errors.As(err, &upstream) {
		t.Fatalf("err = %v, want *ErrUpstreamUnavailable", err)
	}
	if upstream.StatusCode != 500 {
		t.Fatalf("status = %d", upstream.StatusCode)
	}
	if !strings.Contains(upstream.Body, "boom") {
		t.Fatalf("body = %q", upstream.Body)
	}
}

func TestGenerateInsights_OmitsXRequestIdWhenEmpty(t *testing.T) {
	fs := newFakeServer(t, http.StatusOK, `{"insights":[],"usage":[]}`)

	c := New(fs.URL, "tok")
	if _, err := c.GenerateInsights(context.Background(), uuid.Must(uuid.NewV7()), "",
		InsightGenerateRequest{}); err != nil {
		t.Fatalf("err = %v", err)
	}
	if fs.gotXRequestID != "" {
		t.Fatalf("x-request-id = %q, want empty when caller passes empty", fs.gotXRequestID)
	}
}

func TestNew_TrimsTrailingSlash(t *testing.T) {
	c := New("http://localhost:8000/", "tok")
	if c.baseURL != "http://localhost:8000" {
		t.Fatalf("baseURL = %q, want trailing slash trimmed", c.baseURL)
	}
}
