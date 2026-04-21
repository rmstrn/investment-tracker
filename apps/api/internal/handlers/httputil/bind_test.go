package httputil_test

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/handlers/httputil"
)

// sampleBody is a minimal validator-tagged payload the tests parse
// against. Covers the four tag families the handlers use most:
// required, oneof, min/max, and a free-form optional string.
type sampleBody struct {
	Name        string `json:"name"         validate:"required"`
	Tier        string `json:"tier"         validate:"required,oneof=free plus pro"`
	Limit       int    `json:"limit"        validate:"min=1,max=100"`
	RedirectURL string `json:"redirect_url" validate:"omitempty,url"`
}

// runBind wires a disposable Fiber app that hands each POST /bind
// invocation to BindAndValidate and surfaces the result. Returns the
// HTTP response so tests can assert status + body.
func runBind(t *testing.T, body string) *http.Response {
	t.Helper()
	app := fiber.New()
	app.Post("/bind", func(c fiber.Ctx) error {
		v, coded := httputil.BindAndValidate[sampleBody](c)
		if coded != nil {
			return c.Status(coded.Status).JSON(fiber.Map{"error": fiber.Map{"code": coded.Code, "message": coded.Message}})
		}
		return c.JSON(fiber.Map{"ok": true, "name": v.Name})
	})
	var reader *strings.Reader
	if body != "" {
		reader = strings.NewReader(body)
	}
	var req *http.Request
	if reader != nil {
		req = httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/bind", reader)
	} else {
		req = httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/bind", nil)
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	return resp
}

func TestBindAndValidate_HappyPath(t *testing.T) {
	resp := runBind(t, `{"name":"alice","tier":"plus","limit":10}`)
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, want 200", resp.StatusCode)
	}
}

func TestBindAndValidate_EmptyBody_Returns400(t *testing.T) {
	resp := runBind(t, "")
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400 for empty body", resp.StatusCode)
	}
}

func TestBindAndValidate_MalformedJSON_Returns400(t *testing.T) {
	resp := runBind(t, `{this-is-not-json`)
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400 for malformed JSON", resp.StatusCode)
	}
}

func TestBindAndValidate_MissingRequiredField_Returns400(t *testing.T) {
	// `name` omitted — `required` rule fires and the error message
	// must mention the JSON field name, not the Go field name.
	resp := runBind(t, `{"tier":"free","limit":5}`)
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
	body := mustReadBody(t, resp)
	if !strings.Contains(body, "name is required") {
		t.Errorf("body = %s, want to mention \"name is required\"", body)
	}
}

func TestBindAndValidate_InvalidEnum_Returns400(t *testing.T) {
	resp := runBind(t, `{"name":"alice","tier":"platinum","limit":5}`)
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
	body := mustReadBody(t, resp)
	if !strings.Contains(body, "tier must be one of") || !strings.Contains(body, "plus") {
		t.Errorf("body = %s, want tier-of error mentioning plus", body)
	}
}

func TestBindAndValidate_OutOfRangeNumber_Returns400(t *testing.T) {
	resp := runBind(t, `{"name":"alice","tier":"free","limit":999}`)
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
	body := mustReadBody(t, resp)
	if !strings.Contains(body, "limit must be at most") {
		t.Errorf("body = %s, want max-violation for limit", body)
	}
}

func TestBindAndValidate_InvalidURL_Returns400(t *testing.T) {
	// `redirect_url` is `omitempty,url` — empty is fine, but present
	// and non-URL must 400.
	resp := runBind(t, `{"name":"alice","tier":"free","limit":5,"redirect_url":"not a url"}`)
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
	body := mustReadBody(t, resp)
	if !strings.Contains(body, "redirect_url must be a valid URL") {
		t.Errorf("body = %s, want URL-shape error", body)
	}
}

func TestBindJSONOptional_EmptyBodyReturnsZeroValue(t *testing.T) {
	type optBody struct {
		Title string `json:"title"`
	}
	app := fiber.New()
	app.Post("/opt", func(c fiber.Ctx) error {
		v, coded := httputil.BindJSONOptional[optBody](c)
		if coded != nil {
			return c.Status(coded.Status).SendString(coded.Message)
		}
		return c.JSON(fiber.Map{"title": v.Title})
	})
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/opt", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, want 200 (optional body)", resp.StatusCode)
	}
	if got := mustReadBody(t, resp); !strings.Contains(got, `"title":""`) {
		t.Errorf("body = %s, want empty title", got)
	}
}

func TestBindJSONOptional_MalformedBody_Returns400(t *testing.T) {
	type optBody struct {
		Title string `json:"title"`
	}
	app := fiber.New()
	app.Post("/opt", func(c fiber.Ctx) error {
		_, coded := httputil.BindJSONOptional[optBody](c)
		if coded != nil {
			return c.Status(coded.Status).SendString(coded.Message)
		}
		return c.SendStatus(fiber.StatusOK)
	})
	req := httptest.NewRequestWithContext(t.Context(), fiber.MethodPost, "/opt", strings.NewReader(`{bad`))
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("app.Test: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
}

func mustReadBody(t *testing.T, resp *http.Response) string {
	t.Helper()
	buf := make([]byte, 4096)
	n, _ := resp.Body.Read(buf)
	return string(buf[:n])
}
