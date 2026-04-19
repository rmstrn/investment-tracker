package asynqpub

import (
	"testing"
)

// Enabled is nil-receiver safe: a nil *Publisher must return false so
// handlers can branch on it before calling Enqueue. The real
// client-backed path is exercised by the integration tests of the
// calling handlers (which already assert the X-Async-Unavailable
// header behaviour).
func TestEnabled_NilReceiver(t *testing.T) {
	var p *Publisher
	if p.Enabled() {
		t.Fatalf("nil *Publisher.Enabled() = true, want false")
	}
}

// A zero Publisher (non-nil receiver but nil internal client) also
// reports disabled. This is the fallback state when New("") returns
// (nil, nil) for an empty URL and the caller stores a zero struct
// instead of a nil pointer.
func TestEnabled_NilClient(t *testing.T) {
	p := &Publisher{}
	if p.Enabled() {
		t.Fatalf("Publisher{client: nil}.Enabled() = true, want false")
	}
}
