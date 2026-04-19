package middleware

import (
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/rs/zerolog"

	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
)

// requestIDHeader is the canonical header for propagating a request id
// in and out. Matches conventional gateway / proxy naming.
const requestIDHeader = "X-Request-ID"

// RequestID returns a middleware that attaches a request id to the
// context (c.Locals(LocalsRequestID)) and echoes it as a response
// header. If the client sent one in `X-Request-ID`, it is trusted
// verbatim; otherwise a fresh UUIDv7 is generated so ids sort by time
// in log aggregators.
//
// Must come BEFORE Auth so that authentication failures can still
// reference a request id in their error envelope (errs.Respond reads
// it from Locals).
func RequestID() fiber.Handler {
	return func(c fiber.Ctx) error {
		id := c.Get(requestIDHeader)
		if id == "" {
			if v7, err := uuid.NewV7(); err == nil {
				id = v7.String()
			} else {
				id = uuid.New().String() // v7 failure is cosmic, fall back to v4
			}
		}
		c.Locals(LocalsRequestID, id)
		c.Set(requestIDHeader, id)
		return c.Next()
	}
}

// RequestLog returns a middleware that logs one structured line per
// request with method, path, status, latency, user id (when present),
// request id, and auth mode (when set by Auth). Must come AFTER
// RequestID and ideally AFTER Auth so the user id is resolved.
//
// Failures are logged at warn (4xx) / error (5xx) so a log-aggregator
// alert on `level=error service=api` lights up on 5xx spikes without
// amplifying on 401s from unauthenticated clients.
func RequestLog(log zerolog.Logger) fiber.Handler {
	return func(c fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		duration := time.Since(start)

		status := c.Response().StatusCode()
		var level zerolog.Level
		switch {
		case status >= 500:
			level = zerolog.ErrorLevel
		case status >= 400:
			level = zerolog.WarnLevel
		default:
			level = zerolog.InfoLevel
		}

		evt := log.WithLevel(level).
			Str("request_id", requestIDFromCtx(c)).
			Str("method", c.Method()).
			Str("path", c.Path()).
			Int("status", status).
			Dur("duration", duration).
			Str("ip", c.IP())

		if u, ok := c.Locals(LocalsUser).(*users.User); ok && u != nil {
			evt = evt.Str("user_id", u.ID.String())
		}
		if mode, ok := c.Locals(LocalsAuthMode).(string); ok && mode != "" {
			evt = evt.Str("auth_mode", mode)
		}
		if err != nil {
			evt = evt.Err(err)
		}
		evt.Msg("request")

		return err
	}
}

// requestIDFromCtx returns the request id stored by the RequestID
// middleware, or "" if it was not applied (should not happen in prod).
func requestIDFromCtx(c fiber.Ctx) string {
	if id, ok := c.Locals(LocalsRequestID).(string); ok {
		return id
	}
	return ""
}
