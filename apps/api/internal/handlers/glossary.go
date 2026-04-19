package handlers

import (
	"errors"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

const defaultGlossaryLocale = "en"

// slugPattern mirrors the openapi regex on /glossary/{slug}. The Fiber
// router does not enforce the pattern automatically so the handler
// validates up front to keep 400s separable from 404s.
var slugPattern = regexp.MustCompile(`^[a-z0-9-]+$`)

// ListGlossaryTerms returns glossary terms for the requested locale.
// This endpoint is public (openapi sets `security: []`) — no auth
// middleware, no user lookup. Empty list is a valid response when the
// requested locale has no seeded rows.
func ListGlossaryTerms(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		ctx := c.Context()

		locale := strings.TrimSpace(c.Query("locale"))
		if locale == "" {
			locale = defaultGlossaryLocale
		}

		rows, err := dbgen.New(deps.Pool).ListGlossaryTermsByLocale(ctx, locale)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list glossary"))
		}

		items := make([]fiber.Map, 0, len(rows))
		for _, r := range rows {
			items = append(items, shapeGlossaryTerm(r))
		}
		return c.JSON(fiber.Map{"data": items})
	}
}

// GetGlossaryTerm returns a single term by slug + locale. Public
// endpoint, same security posture as the list. 404 when the (slug,
// locale) pair does not exist — no fallback locale probe, because
// the UI can retry with a different locale if it wants.
func GetGlossaryTerm(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		ctx := c.Context()

		slug := strings.ToLower(strings.TrimSpace(c.Params("slug")))
		if !slugPattern.MatchString(slug) {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "slug must match ^[a-z0-9-]+$"))
		}
		locale := strings.TrimSpace(c.Query("locale"))
		if locale == "" {
			locale = defaultGlossaryLocale
		}

		row, err := dbgen.New(deps.Pool).GetGlossaryTerm(ctx, dbgen.GetGlossaryTermParams{
			Slug:   slug,
			Locale: locale,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load glossary term"))
		}
		return c.JSON(shapeGlossaryTerm(row))
	}
}

func shapeGlossaryTerm(t dbgen.GlossaryTerm) fiber.Map {
	var longDef any
	if t.LongDef != nil {
		longDef = *t.LongDef
	}
	return fiber.Map{
		"slug":          t.Slug,
		"locale":        t.Locale,
		"title":         t.Title,
		"short_def":     t.ShortDef,
		"long_def":      longDef,
		"related_slugs": t.RelatedSlugs,
		"updated_at":    t.UpdatedAt.Time.UTC().Format(time.RFC3339),
	}
}
