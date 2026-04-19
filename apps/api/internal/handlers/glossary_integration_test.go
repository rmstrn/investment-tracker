//go:build integration

package handlers_test

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/gofiber/fiber/v3"
)

func seedGlossaryTerm(t *testing.T, slug, locale, title, shortDef string) {
	t.Helper()
	_, err := testPool.Exec(context.Background(), `
		INSERT INTO glossary_terms (slug, locale, title, short_def)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (slug, locale) DO UPDATE SET title = EXCLUDED.title
	`, slug, locale, title, shortDef)
	if err != nil {
		t.Fatalf("seed glossary: %v", err)
	}
}

func TestListGlossaryTerms_PublicNoAuth(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	// The tier-c seed migration already populates some terms; drop them
	// and insert our own for deterministic assertions.
	if _, err := testPool.Exec(context.Background(), `DELETE FROM glossary_terms`); err != nil {
		t.Fatalf("clear glossary: %v", err)
	}
	seedGlossaryTerm(t, "alpha", "en", "Alpha", "Excess return over a benchmark.")
	seedGlossaryTerm(t, "beta", "en", "Beta", "Sensitivity to market moves.")
	seedGlossaryTerm(t, "alpha", "ru", "Альфа", "Избыточная доходность.")

	// No auth headers at all — /glossary is public per openapi.
	resp, body := doJSON(t, a, fiber.MethodGet, "/glossary", "", "", nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 2 {
		t.Fatalf("default locale en should return 2, got %d", len(data))
	}
}

func TestListGlossaryTerms_LocaleFilter(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	if _, err := testPool.Exec(context.Background(), `DELETE FROM glossary_terms`); err != nil {
		t.Fatalf("clear glossary: %v", err)
	}
	seedGlossaryTerm(t, "alpha", "en", "Alpha", "Excess return.")
	seedGlossaryTerm(t, "alpha", "ru", "Альфа", "Избыточная доходность.")

	resp, body := doJSON(t, a, fiber.MethodGet, "/glossary?locale=ru", "", "", nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d", resp.StatusCode)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	data := out["data"].([]any)
	if len(data) != 1 {
		t.Fatalf("ru locale should return 1, got %d", len(data))
	}
	if data[0].(map[string]any)["title"] != "Альфа" {
		t.Fatalf("title = %v", data[0].(map[string]any)["title"])
	}
}

func TestGetGlossaryTerm_HappyPath(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	seedGlossaryTerm(t, "alpha", "en", "Alpha", "Excess return.")

	resp, body := doJSON(t, a, fiber.MethodGet, "/glossary/alpha", "", "", nil)
	if resp.StatusCode != fiber.StatusOK {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
	var out map[string]any
	_ = json.Unmarshal(body, &out)
	if out["slug"] != "alpha" {
		t.Fatalf("slug = %v", out["slug"])
	}
	if out["short_def"] != "Excess return." {
		t.Fatalf("short_def = %v", out["short_def"])
	}
}

func TestGetGlossaryTerm_NotFound(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	resp, body := doJSON(t, a, fiber.MethodGet, "/glossary/does-not-exist", "", "", nil)
	if resp.StatusCode != fiber.StatusNotFound {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}

func TestGetGlossaryTerm_InvalidSlug_400(t *testing.T) {
	resetDB(t)
	a := newTestApp(t)

	resp, body := doJSON(t, a, fiber.MethodGet, "/glossary/BAD_SLUG", "", "", nil)
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", resp.StatusCode, body)
	}
}
