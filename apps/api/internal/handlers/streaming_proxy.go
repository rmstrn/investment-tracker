package handlers

// RunStreamingProxy is the Fiber bridge between a streaming
// upstream (e.g. AI Service /v1/chat/stream) and the client SSE
// response. Packages the TD-R091 async-callback invariants so
// every streaming handler that ships going forward — today only
// /ai/chat/stream; insights streaming when Slice 6a lands —
// reuses one implementation instead of re-deriving the "persist
// must live inside the SendStreamWriter closure" story.
//
// Flow:
//
//  1. Commit the SSE response (text/event-stream + no-cache +
//     X-Accel-Buffering: no + 200). Caller is responsible for
//     ensuring pre-stream failures (401/404/5xx upstream,
//     ownership checks) have already surfaced as a JSON envelope
//     BEFORE invoking this helper.
//  2. c.SendStreamWriter(async callback):
//     - sseproxy.Run drives the reader/writer loop.
//     - On message_stop → cfg.OnSuccess(res). The callback runs
//       after the outer handler returns (fasthttp semantics), so
//       OnSuccess MUST be safe to call from a goroutine-like
//       scope — typical pattern is fire-and-forget to
//       persistTurnBackground.
//     - On dropped stream (no message_stop) → cfg.OnDropped.
//       Typical pattern: log + no persist.
//  3. SendStreamWriter returning an error is demoted to a warn
//     log — the client has either already received data or
//     disconnected; fail-loud on top of that helps nobody.
//
// Constraints preserved from TD-R091:
//   - OnSuccess fires inside the async callback. Do NOT check
//     sseproxy.Result in the outer handler scope — it will be nil
//     (Fiber v3 hands the callback to fasthttp which runs it after
//     the outer handler returns).
//   - Persist work should happen on a detached context (see
//     persistTurnBackground), not c.Context(), so a client
//     disconnect after upstream already spent tokens does not
//     roll back the billing insert.

import (
	"bufio"
	"io"
	"net/http"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/rs/zerolog"

	"github.com/rmstrn/investment-tracker/apps/api/internal/httpheader"
	"github.com/rmstrn/investment-tracker/apps/api/internal/sseproxy"
)

// StreamingProxyConfig carries every knob RunStreamingProxy needs.
// Log / RequestID / ConversationID thread through to sseproxy
// structured logging; OnSuccess / OnDropped are the handler's
// domain-specific behaviors for the two terminal states.
type StreamingProxyConfig struct {
	// Log is the zerolog sink sseproxy + the dispatcher log through.
	// Required — a nil logger here would drop the TD-R091 "stream
	// dropped" log we rely on to alert ops.
	Log *zerolog.Logger

	// RequestID is stamped on every log line the proxy emits so
	// upstream / client logs correlate. Typical source is
	// middleware.RequestID via requestIDFromLocals(c).
	RequestID string

	// ConversationID scopes the stream for the collector's
	// message_id generation and appears on every log line.
	ConversationID uuid.UUID

	// OnSuccess runs after the upstream delivered message_stop.
	// res is guaranteed non-nil and GotMessageStop is true. The
	// callback executes inside the fasthttp async scope — it is
	// NOT safe to read c.Locals or write to c.Response here.
	// Launch any DB work on a detached context via
	// persistTurnBackground or equivalent.
	OnSuccess func(res *sseproxy.Result)

	// OnDropped runs when the stream closed without a
	// message_stop frame — most commonly upstream disconnect or
	// a parser error in sseproxy. Typical body: structured log +
	// no persist (do NOT write partial content — the billing
	// ledger is tied to completed turns).
	OnDropped func()
}

// RunStreamingProxy is the one call streaming handlers make after
// they have a 2xx upstream response in hand. See the package-level
// doc comment for the flow + TD-R091 invariants.
func RunStreamingProxy(c fiber.Ctx, upstream io.ReadCloser, cfg StreamingProxyConfig) {
	// Commit to SSE only after the caller has verified upstream is
	// 2xx and the body is ready. Any pre-stream 4xx/5xx must have
	// already surfaced as a JSON envelope before this call.
	c.Set(fiber.HeaderContentType, "text/event-stream")
	c.Set(fiber.HeaderCacheControl, "no-cache")
	c.Set("Connection", "keep-alive")
	c.Set(httpheader.AccelBuffering, "no")
	c.Status(http.StatusOK)

	ctx := c.Context()

	// TD-R091 anchor: SendStreamWriter hands its callback to
	// fasthttp which runs it *after* this function returns. Any
	// value we set inside the callback (sseproxy.Result) is
	// invisible in the outer scope — branching on it here would
	// always see nil. That is why OnSuccess / OnDropped are
	// closures captured at call time; they fire from inside the
	// callback where Result is actually populated.
	streamErr := c.SendStreamWriter(func(w *bufio.Writer) {
		res, runErr := sseproxy.Run(ctx, sseproxy.StreamOpts{
			Upstream:       upstream,
			Writer:         w,
			Flush:          w.Flush,
			ConversationID: cfg.ConversationID,
			RequestID:      cfg.RequestID,
			Logger:         cfg.Log,
		})
		if runErr != nil {
			cfg.Log.Warn().Err(runErr).
				Str("request_id", cfg.RequestID).
				Str("conversation_id", cfg.ConversationID.String()).
				Bool("got_message_stop", res != nil && res.GotMessageStop).
				Msg("streaming proxy: run ended with error")
		}
		if res != nil && res.GotMessageStop {
			if cfg.OnSuccess != nil {
				cfg.OnSuccess(res)
			}
			return
		}
		if cfg.OnDropped != nil {
			cfg.OnDropped()
		}
	})
	if streamErr != nil {
		cfg.Log.Warn().Err(streamErr).
			Str("request_id", cfg.RequestID).
			Msg("streaming proxy: SendStreamWriter error")
	}
}
