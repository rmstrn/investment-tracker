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

// unreadCountCap mirrors the openapi description: the bell badge
// never shows a real count past 99 — the UI renders "99+". Clamp on
// the server so a user with 50k unread rows doesn't ship a bignum
// over the wire.
const unreadCountCap = 99

// ListNotifications returns a paginated slice of the user's
// notifications per openapi Notification[]. Optional
// ?unread_only=true filter so the UI can drive a "new" tab off one
// endpoint.
func ListNotifications(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		params, perr := parseNotificationsQuery(c, user.ID)
		if perr != nil {
			return errs.Respond(c, reqID, perr)
		}

		rows, err := dbgen.New(deps.Pool).ListNotificationsByUser(ctx, params)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list notifications"))
		}

		items := make([]fiber.Map, 0, len(rows))
		for _, r := range rows {
			items = append(items, shapeNotification(r))
		}

		hasMore := len(rows) == int(params.RowLimit)
		nextCursor := ""
		if hasMore && len(rows) > 0 {
			last := rows[len(rows)-1]
			nextCursor = pagination.Encode(last.ID, last.CreatedAt.Time)
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

// GetUnreadNotificationCount returns the unread badge count, capped
// at 99 per openapi.
func GetUnreadNotificationCount(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		count, err := dbgen.New(deps.Pool).CountUnreadNotifications(ctx, user.ID)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to count unread"))
		}
		n := int(count)
		if n > unreadCountCap {
			n = unreadCountCap
		}
		return c.JSON(fiber.Map{"unread": n})
	}
}

// MarkNotificationRead sets read_at on a single notification.
// Idempotent — setting read_at on an already-read row preserves the
// original timestamp via COALESCE so retries do not rewrite it.
func MarkNotificationRead(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, perr := uuid.Parse(c.Params("id"))
		if perr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid notification id"))
		}

		affected, err := dbgen.New(deps.Pool).MarkNotificationRead(ctx, dbgen.MarkNotificationReadParams{
			ID:     id,
			UserID: user.ID,
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to mark read"))
		}
		if affected == 0 {
			return errs.Respond(c, reqID, errs.ErrNotFound)
		}
		return c.SendStatus(http.StatusNoContent)
	}
}

// MarkAllNotificationsRead bulk-flips every unread row. Response
// carries marked_count so the UI can update its badge without a
// second round-trip.
func MarkAllNotificationsRead(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		affected, err := dbgen.New(deps.Pool).MarkAllNotificationsRead(ctx, user.ID)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to mark all read"))
		}
		return c.JSON(fiber.Map{"marked_count": affected})
	}
}

// ---------- helpers ----------

func parseNotificationsQuery(c fiber.Ctx, userID uuid.UUID) (dbgen.ListNotificationsByUserParams, *errs.Coded) {
	p := dbgen.ListNotificationsByUserParams{UserID: userID}

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

	if raw := strings.ToLower(strings.TrimSpace(c.Query("unread_only"))); raw == "true" {
		t := true
		p.UnreadOnly = &t
	}

	return p, nil
}

func shapeNotification(n dbgen.Notification) fiber.Map {
	var data any
	if len(n.Data) > 0 {
		var decoded any
		if err := json.Unmarshal(n.Data, &decoded); err == nil {
			data = decoded
		}
	}
	var deepLink any
	if n.DeepLink != nil {
		deepLink = *n.DeepLink
	}
	var readAt any
	if n.ReadAt.Valid {
		readAt = n.ReadAt.Time.UTC().Format(time.RFC3339)
	}
	return fiber.Map{
		"id":         n.ID.String(),
		"type":       n.Type,
		"title":      n.Title,
		"body":       n.Body,
		"data":       data,
		"deep_link":  deepLink,
		"read_at":    readAt,
		"created_at": n.CreatedAt.Time.UTC().Format(time.RFC3339),
	}
}
