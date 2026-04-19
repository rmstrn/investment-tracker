package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
	"github.com/rmstrn/investment-tracker/apps/api/internal/pagination"
)

const lastMessagePreviewMaxChars = 200

// ListAIConversations returns AIConversationSummary[] inside a
// PaginatedEnvelope, cursor-paginated by (updated_at, id) descending.
// The last_message_preview field is extracted from the most recent
// assistant message's content JSONB and capped at
// lastMessagePreviewMaxChars for list ergonomics.
func ListAIConversations(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		params, perr := parseConversationsListQuery(c, user.ID)
		if perr != nil {
			return errs.Respond(c, reqID, perr)
		}

		rows, err := dbgen.New(deps.Pool).ListAIConversationsByUser(ctx, params)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list conversations"))
		}

		items := make([]fiber.Map, 0, len(rows))
		for _, r := range rows {
			var title any
			if r.Title != nil {
				title = *r.Title
			}
			items = append(items, fiber.Map{
				"id":                   r.ID.String(),
				"title":                title,
				"last_message_preview": previewFromContent(r.LastMessageContent),
				"message_count":        int(r.MessageCount),
				"created_at":           r.CreatedAt.Time.UTC().Format("2006-01-02T15:04:05Z07:00"),
				"updated_at":           r.UpdatedAt.Time.UTC().Format("2006-01-02T15:04:05Z07:00"),
			})
		}

		hasMore := len(rows) == int(params.RowLimit)
		nextCursor := ""
		if hasMore && len(rows) > 0 {
			last := rows[len(rows)-1]
			nextCursor = pagination.Encode(last.ID, last.UpdatedAt.Time)
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

// GetAIConversation returns AIConversationDetail — the conversation
// summary plus a paginated slice of its messages. Messages are
// newest-first, same cursor scheme as the list.
func GetAIConversation(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, parseErr := uuid.Parse(c.Params("id"))
		if parseErr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid conversation id"))
		}

		q := dbgen.New(deps.Pool)
		conv, err := q.GetAIConversationByID(ctx, dbgen.GetAIConversationByIDParams{ID: id, UserID: user.ID})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load conversation"))
		}

		msgParams, perr := parseMessagesQuery(c, conv.ID)
		if perr != nil {
			return errs.Respond(c, reqID, perr)
		}
		msgs, err := q.ListAIConversationMessages(ctx, msgParams)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load messages"))
		}

		items := make([]fiber.Map, 0, len(msgs))
		for _, m := range msgs {
			var tokens any
			if m.TokensUsed != nil {
				tokens = *m.TokensUsed
			}
			items = append(items, fiber.Map{
				"id":              m.ID.String(),
				"conversation_id": m.ConversationID.String(),
				"role":            m.Role,
				"content":         decodeContent(m.Content),
				"tokens_used":     tokens,
				"created_at":      m.CreatedAt.Time.UTC().Format("2006-01-02T15:04:05Z07:00"),
			})
		}

		hasMore := len(msgs) == int(msgParams.RowLimit)
		nextCursor := ""
		if hasMore && len(msgs) > 0 {
			last := msgs[len(msgs)-1]
			nextCursor = pagination.Encode(last.ID, last.CreatedAt.Time)
		}

		var title any
		if conv.Title != nil {
			title = *conv.Title
		}

		return c.JSON(fiber.Map{
			"conversation": fiber.Map{
				"id":                   conv.ID.String(),
				"title":                title,
				"last_message_preview": nil,
				"message_count":        len(msgs),
				"created_at":           conv.CreatedAt.Time.UTC().Format("2006-01-02T15:04:05Z07:00"),
				"updated_at":           conv.UpdatedAt.Time.UTC().Format("2006-01-02T15:04:05Z07:00"),
			},
			"messages": items,
			"meta": fiber.Map{
				"has_more":    hasMore,
				"next_cursor": nullableString(nextCursor),
				"total_count": nil,
			},
		})
	}
}

func parseConversationsListQuery(c fiber.Ctx, userID uuid.UUID) (dbgen.ListAIConversationsByUserParams, *errs.Coded) {
	p := dbgen.ListAIConversationsByUserParams{UserID: userID}
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
	return p, nil
}

func parseMessagesQuery(c fiber.Ctx, conversationID uuid.UUID) (dbgen.ListAIConversationMessagesParams, *errs.Coded) {
	p := dbgen.ListAIConversationMessagesParams{ConversationID: conversationID}
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
	return p, nil
}

// previewFromContent digs the first `text` block out of the JSONB
// content array and truncates to the preview cap. Non-text-first
// messages (tool-use only, etc.) yield nil so the client shows the
// conversation title instead.
func previewFromContent(raw []byte) any {
	if len(raw) == 0 {
		return nil
	}
	var blocks []map[string]any
	if err := json.Unmarshal(raw, &blocks); err != nil {
		return nil
	}
	for _, b := range blocks {
		if b["type"] == "text" {
			if s, ok := b["text"].(string); ok {
				if len(s) > lastMessagePreviewMaxChars {
					return s[:lastMessagePreviewMaxChars]
				}
				return s
			}
		}
	}
	return nil
}

// decodeContent parses the JSONB content array into Go values the
// fiber JSON serializer can round-trip into the openapi
// AIMessageContent[] shape. Malformed rows surface as an empty
// array — corruption is a data-quality bug, not a 500.
func decodeContent(raw []byte) []any {
	if len(raw) == 0 {
		return []any{}
	}
	var out []any
	if err := json.Unmarshal(raw, &out); err != nil {
		return []any{}
	}
	return out
}
