// Package httputil contains HTTP-layer helpers shared across handlers.
// The primary entry point is BindAndValidate — a generic replacement for
// the `c.Body() → json.Unmarshal → hand-rolled checks` boilerplate that
// used to live at the top of every POST/PATCH handler.
package httputil

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"reflect"
	"strings"
	"sync"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// validate is package-level so tag registration (JSON-name lookup)
// happens once. validator.New is safe for concurrent Struct() calls.
var (
	validate     *validator.Validate
	validateOnce sync.Once
)

// defaultValidator lazily builds + configures the singleton. It wires
// a tag-name func so validation-error messages reference the JSON
// field name ("broker_name") the client sent, not the Go field
// identifier ("BrokerName").
func defaultValidator() *validator.Validate {
	validateOnce.Do(func() {
		v := validator.New(validator.WithRequiredStructEnabled())
		v.RegisterTagNameFunc(func(fld reflect.StructField) string {
			name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
			if name == "" || name == "-" {
				return fld.Name
			}
			return name
		})
		validate = v
	})
	return validate
}

// BindAndValidate decodes the JSON request body into *T and runs every
// `validate:"..."` struct tag against the decoded value. Returns
// (non-nil, nil) on success or (nil, *errs.Coded) on any step failure —
// the caller passes the Coded straight to errs.Respond.
//
// Empty bodies produce 400 VALIDATION_ERROR "request body is required".
// Malformed JSON produces 400 VALIDATION_ERROR "invalid JSON body".
// Tag violations produce 400 VALIDATION_ERROR with a per-field message
// using JSON-tag names so the output matches the wire contract.
//
// Handler-specific normalization (TrimSpace, ToUpper, etc.) stays in
// the handler — it's domain logic, not generic binding. The shape of
// this helper is deliberately small; callers that need e.g.
// empty-body-OK semantics fall back to reading c.Body() themselves.
func BindAndValidate[T any](c fiber.Ctx) (*T, *errs.Coded) {
	raw := c.Body()
	if len(raw) == 0 {
		return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "request body is required")
	}
	var t T
	if err := json.Unmarshal(raw, &t); err != nil {
		return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid JSON body")
	}
	if err := defaultValidator().Struct(&t); err != nil {
		return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", humanize(err))
	}
	return &t, nil
}

// BindJSON is the no-validation cousin — decodes the body into T and
// returns on first shape error. Use when handler validation is too
// domain-specific for struct tags (e.g. AI chat request whose
// message.content[] requires cross-field checks). Still normalizes
// the two boilerplate branches: empty body and malformed JSON.
func BindJSON[T any](c fiber.Ctx) (*T, *errs.Coded) {
	raw := c.Body()
	if len(raw) == 0 {
		return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "request body is required")
	}
	var t T
	if err := json.Unmarshal(raw, &t); err != nil {
		return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid JSON body")
	}
	return &t, nil
}

// BindJSONOptional permits an empty body (decodes into the zero
// value). Used by handlers whose request payload is fully optional,
// e.g. POST /ai/conversations where title may or may not be
// supplied. Malformed non-empty JSON still fails with the standard
// "invalid JSON body" message.
func BindJSONOptional[T any](c fiber.Ctx) (*T, *errs.Coded) {
	var t T
	raw := c.Body()
	if len(raw) == 0 {
		return &t, nil
	}
	if err := json.Unmarshal(raw, &t); err != nil {
		return nil, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid JSON body")
	}
	return &t, nil
}

// humanize renders a validator.ValidationErrors list as a single
// semicolon-separated string so the final VALIDATION_ERROR message
// mentions every failing field. Single-field failures look like
// "broker_name is required"; multi-field failures concatenate.
func humanize(err error) string {
	var ves validator.ValidationErrors
	if !errors.As(err, &ves) {
		return err.Error()
	}
	if len(ves) == 0 {
		return "validation failed"
	}
	msgs := make([]string, 0, len(ves))
	for _, fe := range ves {
		msgs = append(msgs, fieldMessage(fe))
	}
	return strings.Join(msgs, "; ")
}

// fieldMessage maps one FieldError to a user-friendly sentence. We
// cover the tags the handlers actually use today; unknown tags fall
// back to "<field> failed <tag> validation" which is good enough to
// point a client at the offending field.
func fieldMessage(fe validator.FieldError) string {
	name := fe.Field()
	switch fe.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", name)
	case "oneof":
		return fmt.Sprintf("%s must be one of: %s", name, strings.Join(strings.Fields(fe.Param()), ", "))
	case "min":
		return fmt.Sprintf("%s must be at least %s", name, fe.Param())
	case "max":
		return fmt.Sprintf("%s must be at most %s", name, fe.Param())
	case "uuid", "uuid4", "uuid7":
		return fmt.Sprintf("%s must be a valid UUID", name)
	case "email":
		return fmt.Sprintf("%s must be a valid email", name)
	case "url":
		return fmt.Sprintf("%s must be a valid URL", name)
	case "gt":
		return fmt.Sprintf("%s must be greater than %s", name, fe.Param())
	case "gte":
		return fmt.Sprintf("%s must be greater than or equal to %s", name, fe.Param())
	case "lt":
		return fmt.Sprintf("%s must be less than %s", name, fe.Param())
	case "lte":
		return fmt.Sprintf("%s must be less than or equal to %s", name, fe.Param())
	default:
		return fmt.Sprintf("%s failed %s validation", name, fe.Tag())
	}
}
