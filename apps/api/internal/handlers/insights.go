package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
	"github.com/rmstrn/investment-tracker/apps/api/internal/pagination"
)

// ListInsights returns the authenticated user's proactive insights
// per openapi.yaml Insight[] inside a PaginatedEnvelope. Active rows
// (dismissed_at IS NULL) by default; include_dismissed=true surfaces
// the dismissed tombstones too.
//
// Full Insight objects come back on the list — there is no detail
// endpoint in the spec, which is by design: the payload is small
// enough that an expand-on-click UI can operate entirely from the
// list cache without a second round-trip. If a future projection
// shrinks the list shape (e.g. title-only summary), a detail
// endpoint would need to land with it; right now all fields are
// already surfaced here.
func ListInsights(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		params, perr := parseInsightsListQuery(c, user.ID)
		if perr != nil {
			return errs.Respond(c, reqID, perr)
		}

		rows, err := dbgen.New(deps.Pool).ListInsightsByUser(ctx, params)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list insights"))
		}

		items := make([]fiber.Map, 0, len(rows))
		for _, r := range rows {
			items = append(items, shapeInsight(r))
		}

		hasMore := len(rows) == int(params.RowLimit)
		nextCursor := ""
		if hasMore && len(rows) > 0 {
			last := rows[len(rows)-1]
			nextCursor = pagination.Encode(last.ID, last.GeneratedAt.Time)
		}

		return c.JSON(fiber.Map{
			"data": items,
			"meta": fiber.Map{
				"has_more":    hasMore,
				"next_cursor": nullableString(nextCursor),
				"total_count": nil,
			},
		})
	}
}

func parseInsightsListQuery(c fiber.Ctx, userID uuid.UUID) (dbgen.ListInsightsByUserParams, *errs.Coded) {
	p := dbgen.ListInsightsByUserParams{UserID: userID}
	cursor, err := pagination.Decode(c.Query("cursor"))
	if err != nil {
		return p, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid cursor")
	}
	if cursor.IsZero() {
		p.CursorTs = pgtype.Timestamptz{Time: cursorSentinel, Valid: true}
		p.CursorID = uuid.Nil
	} else {
		p.CursorTs = pgtype.Timestamptz{Time: cursor.LastTS, Valid: true}
		p.CursorID = cursor.LastID
	}
	limit := pagination.DefaultPageSize
	if raw := c.Query("limit"); raw != "" {
		parsed, convErr := strconv.Atoi(raw)
		if convErr != nil || parsed < 0 {
			return p, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid limit")
		}
		limit = pagination.ResolveLimit(parsed)
	}
	p.RowLimit = int32(limit)

	if raw := strings.ToLower(strings.TrimSpace(c.Query("include_dismissed"))); raw != "" {
		if raw != "true" && raw != "false" {
			return p, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "include_dismissed must be true or false")
		}
		if raw == "true" {
			sentinel := "include"
			p.IncludeDismissed = &sentinel
		}
	}

	return p, nil
}

func shapeInsight(i dbgen.Insight) fiber.Map {
	var data any
	if len(i.Data) > 0 {
		var decoded any
		if err := json.Unmarshal(i.Data, &decoded); err == nil {
			data = decoded
		}
	}
	var viewed any
	if i.ViewedAt.Valid {
		viewed = i.ViewedAt.Time.UTC().Format(time.RFC3339)
	}
	var dismissed any
	if i.DismissedAt.Valid {
		dismissed = i.DismissedAt.Time.UTC().Format(time.RFC3339)
	}
	return fiber.Map{
		"id":           i.ID.String(),
		"insight_type": i.InsightType,
		"title":        i.Title,
		"body":         i.Body,
		"severity":     i.Severity,
		"data":         data,
		"generated_at": i.GeneratedAt.Time.UTC().Format(time.RFC3339),
		"viewed_at":    viewed,
		"dismissed_at": dismissed,
	}
}
