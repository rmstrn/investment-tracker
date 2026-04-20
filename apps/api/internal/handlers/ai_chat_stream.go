package handlers

import (
	"bufio"
	"net/http"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/aiservice"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
	"github.com/rmstrn/investment-tracker/apps/api/internal/sseproxy"
)

// AIChatStream proxies POST /ai/chat/stream to the AI Service
// streaming endpoint and persists the completed turn — user message,
// assistant message, ai_usage ledger row, conversation touch — in a
// single DB transaction on a detached background context.
//
// The handler finishes writing the SSE stream to the client inside
// SendStreamWriter; the persist step runs in a goroutine so a client
// disconnect after the upstream already spent tokens does not roll
// back the billing insert (AC #9, per DECISIONS 2026-04-20 + R3 in
// the B3-ii-b risk list).
//
// Pre-stream errors (ownership 404, upstream 401/403/5xx) produce a
// JSON error envelope — we only commit to text/event-stream once the
// upstream response is 2xx and flowing.
func AIChatStream(deps *app.Deps) fiber.Handler {
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

		// Commit to SSE response only after we have a 2xx upstream.
		c.Set(fiber.HeaderContentType, "text/event-stream")
		c.Set(fiber.HeaderCacheControl, "no-cache")
		c.Set("Connection", "keep-alive")
		c.Set("X-Accel-Buffering", "no")
		c.Status(http.StatusOK)

		userBlocks := req.Message.Content
		var result *sseproxy.Result

		streamErr := c.SendStreamWriter(func(w *bufio.Writer) {
			res, runErr := sseproxy.Run(ctx, sseproxy.StreamOpts{
				Upstream:       upstream.Body,
				Writer:         w,
				Flush:          w.Flush,
				ConversationID: req.ConversationID,
				RequestID:      reqID,
				Logger:         &deps.Log,
			})
			result = res
			if runErr != nil {
				deps.Log.Warn().Err(runErr).
					Str("request_id", reqID).
					Str("conversation_id", req.ConversationID.String()).
					Bool("got_message_stop", res != nil && res.GotMessageStop).
					Msg("ai chat stream: proxy run ended with error")
			}
		})
		if streamErr != nil {
			deps.Log.Warn().Err(streamErr).Str("request_id", reqID).
				Msg("ai chat stream: SendStreamWriter error")
		}

		// Persist iff the upstream delivered a message_stop (AC #3
		// revised: insert regardless of stop_reason as long as
		// message_stop arrived). A mid-stream drop yields
		// GotMessageStop=false + log + skip.
		if result != nil && result.GotMessageStop {
			persistTurnBackground(&deps.Log, deps.Pool, user.ID, req.ConversationID, userBlocks, result)
		} else {
			deps.Log.Error().
				Str("request_id", reqID).
				Str("conversation_id", req.ConversationID.String()).
				Msg("ai chat stream: message_stop not received — skipping persist; assistant turn dropped")
		}
		return nil
	}
}
