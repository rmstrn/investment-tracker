package handlers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/aiservice"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
	"github.com/rmstrn/investment-tracker/apps/api/internal/sseproxy"
)

// AIChatSync implements POST /ai/chat — the non-streaming counterpart
// to /ai/chat/stream. Internally it consumes the same SSE pipeline
// (AI Service has no dedicated sync endpoint; sseproxy.Run with
// io.Discard as the client-facing writer keeps the history / usage
// collection logic in one place) and assembles a single JSON
// AIChatResponse from the Result.
//
// Unlike the stream handler, persist runs inline with a 10s timeout
// because the client is still waiting on the 200 response — we want
// the row in the DB before we tell them tokens_used.
func AIChatSync(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		req, perr := parseChatRequestBody(c.Body())
		if perr != nil {
			return errs.Respond(c, reqID, perr)
		}

		q := dbgen.New(deps.Pool)
		if perr := assertConversationOwned(ctx, q, req.ConversationID, user.ID); perr != nil {
			return errs.Respond(c, reqID, perr)
		}

		history, err := loadChatHistory(ctx, q, req.ConversationID)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load history"))
		}

		upstream, err := deps.AI.StreamChat(ctx, user.ID, reqID, aiservice.ChatStreamRequest{
			ConversationID: req.ConversationID,
			Message:        flattenUserContent(req.Message.Content),
			History:        history,
		})
		if err != nil {
			return errs.Respond(c, reqID, mapUpstreamStreamErr(err, &deps.Log, reqID))
		}
		// sseproxy.Run owns upstream.Body and closes it on return;
		// this defer is a belt-and-braces in case Run ever exits
		// before reaching its own deferred close (e.g. Opts validation).
		defer func() { _ = upstream.Body.Close() }()

		result, runErr := sseproxy.Run(ctx, sseproxy.StreamOpts{
			Upstream:       upstream.Body,
			Writer:         io.Discard,
			ConversationID: req.ConversationID,
			RequestID:      reqID,
			// Huge heartbeat: sync mode has no wire to keep alive.
			Heartbeat: time.Hour,
			Logger:    &deps.Log,
		})
		if runErr != nil {
			deps.Log.Warn().Err(runErr).Str("request_id", reqID).
				Str("conversation_id", req.ConversationID.String()).
				Bool("got_message_stop", result != nil && result.GotMessageStop).
				Msg("ai chat sync: proxy run ended with error")
		}
		if result == nil || !result.GotMessageStop {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadGateway, "BAD_GATEWAY", "AI service stream did not complete"))
		}

		// Inline persist — still 10s bg timeout so a stuck pool does
		// not starve the request. Failure is logged but does not
		// change the 200 envelope (tokens were already charged).
		persistCtx, cancel := context.WithTimeout(context.Background(), persistTimeout)
		defer cancel()
		if err := persistTurn(persistCtx, deps.Pool, &deps.Log, user.ID, req.ConversationID, req.Message.Content, result); err != nil {
			deps.Log.Error().Err(err).
				Str("request_id", reqID).
				Str("conversation_id", req.ConversationID.String()).
				Str("message_id", result.MessageID.String()).
				Msg("ai chat sync: persist turn failed — tokens already spent upstream")
		}

		// Shape the AIChatResponse per openapi. Assistant content
		// decoded from the collector JSONB keeps the oneOf blocks
		// intact (text / tool_use / tool_result) so downstream
		// clients render the full turn.
		var assistantContent []any
		if len(result.ContentBlocksJSON) > 0 {
			_ = json.Unmarshal(result.ContentBlocksJSON, &assistantContent)
		}
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"conversation_id": req.ConversationID.String(),
			"message": fiber.Map{
				"id":              result.MessageID.String(),
				"conversation_id": req.ConversationID.String(),
				"role":            "assistant",
				"content":         assistantContent,
				"tokens_used":     result.TotalTokens,
				"created_at":      time.Now().UTC().Format(time.RFC3339),
			},
			"tokens_used": result.TotalTokens,
		})
	}
}
