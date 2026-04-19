package pagination_test

import (
	"errors"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/rmstrn/investment-tracker/apps/api/internal/pagination"
)

func TestCursor_RoundTrip(t *testing.T) {
	id := uuid.Must(uuid.NewV7())
	ts := time.Date(2026, 4, 19, 15, 30, 45, 123456789, time.UTC)

	encoded := pagination.Encode(id, ts)
	if encoded == "" {
		t.Fatal("non-empty inputs produced empty cursor")
	}

	decoded, err := pagination.Decode(encoded)
	if err != nil {
		t.Fatalf("decode: %v", err)
	}
	if decoded.LastID != id {
		t.Fatalf("last_id = %s, want %s", decoded.LastID, id)
	}
	if !decoded.LastTS.Equal(ts) {
		t.Fatalf("last_ts = %v, want %v", decoded.LastTS, ts)
	}
}

func TestCursor_EncodeZeroReturnsEmpty(t *testing.T) {
	// Zero values → "" so a handler can `c.Set("next_cursor",
	// Encode(...))` without a branch for the no-more-pages case.
	if got := pagination.Encode(uuid.Nil, time.Time{}); got != "" {
		t.Fatalf("Encode(zero, zero) = %q, want empty", got)
	}
}

func TestCursor_DecodeEmptyIsZero(t *testing.T) {
	c, err := pagination.Decode("")
	if err != nil {
		t.Fatalf("empty decode errored: %v", err)
	}
	if !c.IsZero() {
		t.Fatalf("empty decode produced non-zero cursor: %+v", c)
	}
}

func TestCursor_DecodeMalformedRejects(t *testing.T) {
	cases := []string{
		"!!!not-base64!!!",
		"dGhpcyBpcyBub3QganNvbg",           // valid base64, not JSON
		"eyJsYXN0X2lkIjoibm90LWEtdXVpZCJ9", // {"last_id":"not-a-uuid"}
		"e30",                              // {} — zero cursor via the wire, must reject
	}
	for _, in := range cases {
		t.Run(in, func(t *testing.T) {
			_, err := pagination.Decode(in)
			if err == nil {
				t.Fatalf("expected ErrInvalidCursor for %q", in)
			}
			if !errors.Is(err, pagination.ErrInvalidCursor) {
				t.Fatalf("err not ErrInvalidCursor: %v", err)
			}
		})
	}
}

func TestCursor_BaseIsURLSafe(t *testing.T) {
	// 100 random cursors — none should contain +, /, or =. Those
	// characters would need percent-encoding in a query string.
	for i := 0; i < 100; i++ {
		id := uuid.Must(uuid.NewV7())
		ts := time.Now().UTC().Add(time.Duration(i) * time.Hour)
		c := pagination.Encode(id, ts)
		for _, b := range []byte(c) {
			if b == '+' || b == '/' || b == '=' {
				t.Fatalf("cursor %q contains URL-unsafe byte %q", c, b)
			}
		}
	}
}

func TestResolveLimit(t *testing.T) {
	cases := []struct {
		name string
		in   int
		want int
	}{
		{"negative → default", -1, pagination.DefaultPageSize},
		{"zero → default", 0, pagination.DefaultPageSize},
		{"one → one", 1, 1},
		{"in range", 25, 25},
		{"at max → max", pagination.MaxPageSize, pagination.MaxPageSize},
		{"over max → clamped", pagination.MaxPageSize * 10, pagination.MaxPageSize},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := pagination.ResolveLimit(tc.in); got != tc.want {
				t.Fatalf("ResolveLimit(%d) = %d, want %d", tc.in, got, tc.want)
			}
		})
	}
}
