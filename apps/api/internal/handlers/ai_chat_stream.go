package handlers

import (
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
// Pre-stream errors (ownership 404, upstream 401/403/5xx) produce a
// JSON error envelope — we only commit to text/event-stream once the
// upstream response is 2xx and flowing.
//
// Streaming work after the upstream is in hand delegates to
// RunStreamingProxy (streaming_proxy.go) — that helper owns the
// TD-R091 async-callback invariants, so the handler body here is
// the "pre-flight validation + happy path kickoff" only.
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

		// Ownership of upstream.Body transfers into RunStreamingProxy
		// → sseproxy.Run, which `defer`s Close. bodyclose can't follow
		// the chain past the named helper call, hence the pragma.
		upstream, err := deps.AI.StreamChat(ctx, user.ID, reqID, aiservice.ChatStreamRequest{ //nolint:bodyclose // closed inside RunStreamingProxy → sseproxy.Run
			ConversationID: req.ConversationID,
			Message:        flattenUserContent(req.Message.Content),
			History:        history,
		})
		if err != nil {
			return errs.Respond(c, reqID, mapUpstreamStreamErr(err, &deps.Log, reqID))
		}

		userBlocks := req.Message.Content

		RunStreamingProxy(c, upstream.Body, StreamingProxyConfig{
			Log:            &deps.Log,
			RequestID:      reqID,
			ConversationID: req.ConversationID,
			OnSuccess: func(res *sseproxy.Result) {
				// Detached-context persist — a client disconnect
				// after the upstream already spent tokens must not
				// roll back the billing insert (AC #9). Runs in a
				// fresh goroutine; see persistTurnBackground.
				persistTurnBackground(&deps.Log, deps.Pool, user.ID, req.ConversationID, userBlocks, res)
			},
			OnDropped: func() {
				// Stream closed without message_stop → upstream cut
				// or parser error. Log + no persist; the user saw
				// partial text but the assistant turn is considered
				// "never completed" for billing + history purposes.
				deps.Log.Error().
					Str("request_id", reqID).
					Str("conversation_id", req.ConversationID.String()).
					Msg("ai chat stream: message_stop not received — skipping persist; assistant turn dropped")
			},
		})
		return nil
	}
}
