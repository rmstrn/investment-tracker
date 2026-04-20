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

// TestStreamChat_StampsHeadersAndAcceptOverride covers the header
// contract for the chat stream path. Unlike GenerateInsights, the
// Accept header must be text/event-stream so the upstream FastAPI
// StreamingResponse fires instead of a JSON render.
func TestStreamChat_StampsHeadersAndAcceptOverride(t *testing.T) {
	var gotAuth, gotUser, gotReq, gotAccept, gotPath string
	var gotBody []byte

	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotAuth = r.Header.Get("Authorization")
		gotUser = r.Header.Get("X-User-Id")
		gotReq = r.Header.Get("X-Request-Id")
		gotAccept = r.Header.Get("Accept")
		gotPath = r.URL.Path
		buf := make([]byte, 4096)
		n, _ := r.Body.Read(buf)
		gotBody = buf[:n]
		w.Header().Set("Content-Type", "text/event-stream")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("event: message_stop\ndata: {}\n\n"))
	}))
	defer srv.Close()

	c := New(srv.URL, "stream-token")
	uid := uuid.Must(uuid.NewV7())
	convID := uuid.Must(uuid.NewV7())

	resp, err := c.StreamChat(context.Background(), uid, "req-stream", ChatStreamRequest{
		ConversationID: convID,
		Message:        "hello",
		History:        []ChatHistoryMessage{{Role: "user", Content: "prev"}},
	})
	if err != nil {
		t.Fatalf("StreamChat: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if gotPath != "/internal/chat/stream" {
		t.Errorf("path = %q", gotPath)
	}
	if gotAuth != "Bearer stream-token" {
		t.Errorf("auth = %q", gotAuth)
	}
	if gotUser != uid.String() {
		t.Errorf("x-user-id = %q want %s", gotUser, uid)
	}
	if gotReq != "req-stream" {
		t.Errorf("x-request-id = %q", gotReq)
	}
	if gotAccept != "text/event-stream" {
		t.Errorf("accept = %q", gotAccept)
	}
	if !strings.Contains(string(gotBody), `"conversation_id":"`+convID.String()+`"`) {
		t.Errorf("body missing conversation_id: %s", gotBody)
	}
	if !strings.Contains(string(gotBody), `"message":"hello"`) {
		t.Errorf("body missing message: %s", gotBody)
	}
	if !strings.Contains(string(gotBody), `"history":[{"role":"user","content":"prev"}]`) {
		t.Errorf("body missing history: %s", gotBody)
	}
}

// TestStreamChat_401_ReturnsErrUpstreamAuth confirms the same
// 401/403 → ErrUpstreamAuth mapping as GenerateInsights, with the
// response body drained so the connection can be reused.
func TestStreamChat_401_ReturnsErrUpstreamAuth(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusUnauthorized)
		_, _ = w.Write([]byte(`{"detail":"bad token"}`))
	}))
	defer srv.Close()

	c := New(srv.URL, "wrong")
	// On ErrUpstreamAuth StreamChat closes the body itself before
	// returning nil *http.Response — linter cannot follow the
	// contract across the call, but the client code does.
	_, err := c.StreamChat(context.Background(), uuid.Must(uuid.NewV7()), "", ChatStreamRequest{ //nolint:bodyclose // client drains+closes on auth error
		ConversationID: uuid.Must(uuid.NewV7()),
		Message:        "x",
	})
	if !errors.Is(err, ErrUpstreamAuth) {
		t.Fatalf("err = %v, want ErrUpstreamAuth", err)
	}
}

// TestStreamChat_500_ReturnsErrUpstreamUnavailable surfaces the
// upstream body so the handler can log it, and closes the response
// so we do not leak connections.
func TestStreamChat_500_ReturnsErrUpstreamUnavailable(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte(`{"detail":"upstream blew up"}`))
	}))
	defer srv.Close()

	c := New(srv.URL, "tok")
	_, err := c.StreamChat(context.Background(), uuid.Must(uuid.NewV7()), "", ChatStreamRequest{ //nolint:bodyclose // client closes on non-2xx
		ConversationID: uuid.Must(uuid.NewV7()),
		Message:        "x",
	})
	var upstream *ErrUpstreamUnavailable
	if !errors.As(err, &upstream) {
		t.Fatalf("err = %v want *ErrUpstreamUnavailable", err)
	}
	if upstream.StatusCode != http.StatusInternalServerError {
		t.Errorf("status = %d", upstream.StatusCode)
	}
	if !strings.Contains(upstream.Body, "upstream blew up") {
		t.Errorf("body = %q", upstream.Body)
	}
}
