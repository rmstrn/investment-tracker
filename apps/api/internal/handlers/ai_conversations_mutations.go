package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/handlers/httputil"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

const conversationTitleMaxChars = 200

// CreateAIConversation opens a new chat thread per openapi
// POST /ai/conversations. Body is optional — clients may pass
// {title: "..."} or an empty body. When title is empty the column
// stays null and the AI Service auto-derives one from the first
// user message on the next /ai/chat round (B3-ii-b will wire that
// path).
//
// Returns 201 Created + AIConversation summary shape (matches the
// list endpoint's per-row projection from B2b for client cache
// consistency). message_count is always 0 on a fresh row.
// createConversationRequest is the openapi shape for POST
// /ai/conversations. Empty body is valid — all fields are optional.
type createConversationRequest struct {
	Title string `json:"title"`
}

func CreateAIConversation(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		req, coded := httputil.BindJSONOptional[createConversationRequest](c)
		if coded != nil {
			return errs.Respond(c, reqID, coded)
		}
		req.Title = strings.TrimSpace(req.Title)
		if len(req.Title) > conversationTitleMaxChars {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "title exceeds 200 chars"))
		}

		var titlePtr *string
		if req.Title != "" {
			titlePtr = &req.Title
		}

		row, err := dbgen.New(deps.Pool).InsertAIConversation(ctx, dbgen.InsertAIConversationParams{
			ID:     uuid.Must(uuid.NewV7()),
			UserID: user.ID,
			Title:  titlePtr,
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to create conversation"))
		}

		var titleOut any
		if row.Title != nil {
			titleOut = *row.Title
		}
		return c.Status(http.StatusCreated).JSON(fiber.Map{
			"id":                   row.ID.String(),
			"title":                titleOut,
			"last_message_preview": nil,
			"message_count":        0,
			"created_at":           row.CreatedAt.Time.UTC().Format(time.RFC3339),
			"updated_at":           row.UpdatedAt.Time.UTC().Format(time.RFC3339),
		})
	}
}

// DeleteAIConversation removes one conversation and (via the
// schema's ON DELETE CASCADE on ai_messages.conversation_id) every
// message in its thread. Idempotent: a second DELETE on the same
// id returns 404, which clients treat as "already gone".
func DeleteAIConversation(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, perr := uuid.Parse(c.Params("id"))
		if perr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid conversation id"))
		}

		affected, err := dbgen.New(deps.Pool).DeleteAIConversation(ctx, dbgen.DeleteAIConversationParams{
			ID:     id,
			UserID: user.ID,
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to delete conversation"))
		}
		if affected == 0 {
			return errs.Respond(c, reqID, errs.ErrNotFound)
		}
		return c.SendStatus(http.StatusNoContent)
	}
}
