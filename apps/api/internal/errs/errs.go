// Package errs provides the standardized error envelope used across the
// API. Every HTTP error response — from middleware or handlers — follows
// this shape (see openapi.yaml `ErrorEnvelope`).
package errs

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gofiber/fiber/v3"
)

// Coded is an HTTP-shaped error with a stable machine code, a user-safe
// message, an HTTP status, and optional details.
type Coded struct {
	Status  int            `json:"-"`
	Code    string         `json:"code"`
	Message string         `json:"message"`
	Details map[string]any `json:"details,omitempty"`
	Cause   error          `json:"-"`
}

func (e *Coded) Error() string {
	if e.Cause != nil {
		return e.Code + ": " + e.Message + ": " + e.Cause.Error()
	}
	return e.Code + ": " + e.Message
}

func (e *Coded) Unwrap() error { return e.Cause }

// New creates a Coded error.
func New(status int, code, message string) *Coded {
	return &Coded{Status: status, Code: code, Message: message}
}

// Wrap attaches a cause to a Coded error — keeps the envelope identical
// but preserves the stack for logging.
func Wrap(err error, status int, code, message string) *Coded {
	return &Coded{Status: status, Code: code, Message: message, Cause: err}
}

// WithDetails attaches structured details (e.g., upgrade_url for a tier
// limit) to an existing error.
func (e *Coded) WithDetails(d map[string]any) *Coded {
	e.Details = d
	return e
}

// Well-known codes — keep in sync with openapi.yaml `ErrorEnvelope.code`.
var (
	ErrUnauthenticated       = New(http.StatusUnauthorized, "UNAUTHENTICATED", "Authentication required")
	ErrInvalidToken          = New(http.StatusUnauthorized, "INVALID_TOKEN", "Token invalid or expired")
	ErrForbidden             = New(http.StatusForbidden, "FORBIDDEN", "Access denied")
	ErrTierLimitExceeded     = New(http.StatusForbidden, "TIER_LIMIT_EXCEEDED", "Feature requires a higher tier")
	ErrNotFound              = New(http.StatusNotFound, "NOT_FOUND", "Resource not found")
	ErrValidation            = New(http.StatusBadRequest, "VALIDATION_ERROR", "Invalid input")
	ErrQuoteNotAvailable     = New(http.StatusNotFound, "QUOTE_NOT_AVAILABLE", "Price data not yet fetched for this symbol")
	ErrRateLimit             = New(http.StatusTooManyRequests, "RATE_LIMIT_EXCEEDED", "Too many requests")
	ErrIdempotencyConflict   = New(http.StatusConflict, "IDEMPOTENCY_KEY_CONFLICT", "Idempotency key reused with different body")
	ErrIdempotencyInProgress = New(http.StatusConflict, "IDEMPOTENCY_IN_PROGRESS", "A request with this idempotency key is still being processed")
	ErrInternal              = New(http.StatusInternalServerError, "INTERNAL_ERROR", "An unexpected error occurred")
)

// Respond writes a Coded error as the canonical JSON envelope. It first
// unwraps through Coded types to find the nearest code.
func Respond(c fiber.Ctx, requestID string, err error) error {
	var ce *Coded
	if !errors.As(err, &ce) {
		ce = Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "An unexpected error occurred")
	}

	body := struct {
		Error struct {
			Code      string         `json:"code"`
			Message   string         `json:"message"`
			RequestID string         `json:"request_id,omitempty"`
			Details   map[string]any `json:"details,omitempty"`
		} `json:"error"`
	}{}
	body.Error.Code = ce.Code
	body.Error.Message = ce.Message
	body.Error.RequestID = requestID
	body.Error.Details = ce.Details

	c.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)
	c.Status(ce.Status)
	raw, _ := json.Marshal(body)
	return c.Send(raw)
}
