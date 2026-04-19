// Package pagination provides the cursor shape used by every list
// endpoint in the API.
//
// Every list sorts by `(created_at DESC, id DESC)` so that rows with
// the same timestamp (manual bulk imports, broker sync batches) still
// have a stable order. The cursor encodes the last (created_at, id)
// seen by the caller; the next page query adds
// `WHERE (created_at, id) < ($1, $2)` — Postgres evaluates that as
// tuple-order which matches our sort exactly.
//
// Wire format: base64url( JSON { last_id: uuid, last_ts: RFC3339Nano } )
// Base64url is URL-safe (no +/=) so clients can pass the cursor as a
// query string without escaping.
package pagination

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

// Default and max list sizes used by every list handler that does not
// override them. 50 is enough for a first render; 200 is the absolute
// cap so a single query never tramples the pool's budget.
const (
	DefaultPageSize = 50
	MaxPageSize     = 200
)

// ErrInvalidCursor is returned by Decode when the input is non-empty
// but cannot be parsed. Callers map this to 400 VALIDATION_ERROR.
var ErrInvalidCursor = errors.New("pagination: invalid cursor")

// Cursor is the decoded position. A zero-value Cursor (IsZero()==true)
// means "start at the top" — Decode("") returns this.
type Cursor struct {
	LastID uuid.UUID `json:"last_id"`
	LastTS time.Time `json:"last_ts"`
}

// IsZero reports whether c represents the first page.
func (c Cursor) IsZero() bool {
	return c.LastID == uuid.Nil && c.LastTS.IsZero()
}

// Encode produces the wire-format cursor. Passing two zero values
// produces "" so the caller can unconditionally set the next_cursor
// field on the response; clients treat empty as "no more pages".
func Encode(lastID uuid.UUID, lastTS time.Time) string {
	if lastID == uuid.Nil && lastTS.IsZero() {
		return ""
	}
	payload, _ := json.Marshal(Cursor{
		LastID: lastID,
		LastTS: lastTS.UTC(),
	})
	return base64.RawURLEncoding.EncodeToString(payload)
}

// Decode reverses Encode. Empty string → zero Cursor + nil error so
// handlers can treat "no cursor" and "first page" the same way.
// Anything else that fails to parse cleanly returns ErrInvalidCursor;
// callers SHOULD NOT leak the underlying decode error to clients.
func Decode(s string) (Cursor, error) {
	if s == "" {
		return Cursor{}, nil
	}
	raw, err := base64.RawURLEncoding.DecodeString(s)
	if err != nil {
		return Cursor{}, fmt.Errorf("%w: base64: %v", ErrInvalidCursor, err)
	}
	var c Cursor
	if err := json.Unmarshal(raw, &c); err != nil {
		return Cursor{}, fmt.Errorf("%w: json: %v", ErrInvalidCursor, err)
	}
	// A cursor must name a real row — either a UUID or a timestamp,
	// otherwise it is indistinguishable from the first-page marker and
	// means the caller sent garbage.
	if c.LastID == uuid.Nil && c.LastTS.IsZero() {
		return Cursor{}, fmt.Errorf("%w: both fields zero", ErrInvalidCursor)
	}
	return c, nil
}

// ResolveLimit clamps a caller-supplied page size to [1, MaxPageSize].
// A non-positive request (or missing) uses DefaultPageSize.
func ResolveLimit(requested int) int {
	if requested <= 0 {
		return DefaultPageSize
	}
	if requested > MaxPageSize {
		return MaxPageSize
	}
	return requested
}
