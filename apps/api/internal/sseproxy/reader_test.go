package sseproxy

import (
	"bytes"
	"errors"
	"io"
	"strings"
	"testing"
	"time"
)

// slowReader feeds a buffer to bufio.Reader one chunk at a time with
// a settable cut-list. Each Read call delivers at most one chunk's
// worth of bytes, then blocks briefly to simulate network framing
// before returning. The goal: exercise the Reader's handling of
// frames that are split mid-field, mid-JSON, and mid-newline.
type slowReader struct {
	chunks [][]byte
	i      int
}

func newSlowReader(chunks ...[]byte) *slowReader { return &slowReader{chunks: chunks} }

func (s *slowReader) Read(p []byte) (int, error) {
	if s.i >= len(s.chunks) {
		return 0, io.EOF
	}
	chunk := s.chunks[s.i]
	s.i++
	n := copy(p, chunk)
	if n < len(chunk) {
		// Put the remainder back as a new head chunk. bufio
		// readers always pass buffers >= 4 KiB, so in practice
		// this branch is unreachable with realistic chunks.
		s.chunks = append([][]byte{chunk[n:]}, s.chunks[s.i:]...)
		s.i = 0
	}
	// Inject a tiny pause so writers that flush between chunks can
	// be observed by tests that care about timing.
	time.Sleep(time.Millisecond)
	return n, nil
}

// TestReaderHappyPath confirms a single well-formed stream parses
// into the expected frame sequence. Establishes the baseline before
// the TCP-split variants.
func TestReaderHappyPath(t *testing.T) {
	src := strings.Join([]string{
		"event: message_start",
		`data: {"type":"message_start","message_id":"m-1"}`,
		"",
		"event: content_delta",
		`data: {"type":"content_delta","text":"Hello"}`,
		"",
		"event: message_stop",
		`data: {"type":"message_stop","stop_reason":"end_turn","usage":{"model":"claude","input_tokens":3,"output_tokens":5,"cost_usd":0.001}}`,
		"",
		"",
	}, "\n")

	r := NewReader(strings.NewReader(src))
	want := []string{"message_start", "content_delta", "message_stop"}
	for _, evt := range want {
		f, err := r.Next()
		if err != nil {
			t.Fatalf("Next(%s): %v", evt, err)
		}
		if f.Event != evt {
			t.Errorf("event: got %q want %q", f.Event, evt)
		}
		if len(f.Data) == 0 {
			t.Errorf("%s: empty data", evt)
		}
	}
	if _, err := r.Next(); !errors.Is(err, io.EOF) {
		t.Errorf("expected EOF after all frames, got %v", err)
	}
}

// TestReaderSplitAcrossEventLine covers the TCP boundary landing
// inside the `event:` line. The reader must buffer the partial line
// across Read calls and still emit a single frame.
func TestReaderSplitAcrossEventLine(t *testing.T) {
	chunks := [][]byte{
		[]byte("event: mess"),
		[]byte("age_start\ndata: {\"type\":\"message_start\""),
		[]byte(",\"message_id\":\"m-1\"}\n\n"),
	}
	r := NewReader(newSlowReader(chunks...))

	f, err := r.Next()
	if err != nil {
		t.Fatalf("Next: %v", err)
	}
	if f.Event != "message_start" {
		t.Errorf("event: got %q", f.Event)
	}
	if !bytes.Contains(f.Data, []byte(`"message_id":"m-1"`)) {
		t.Errorf("data missing message_id: %s", f.Data)
	}
}

// TestReaderSplitInsideDataJSON covers the boundary landing inside
// the JSON payload of a `data:` field, which is the most common
// real-world TCP split case for long content_delta frames.
func TestReaderSplitInsideDataJSON(t *testing.T) {
	full := `data: {"type":"content_delta","text":"A long streaming token"}`
	mid := len(full) / 2

	chunks := [][]byte{
		[]byte("event: content_delta\n"),
		[]byte(full[:mid]),
		[]byte(full[mid:] + "\n\n"),
	}
	r := NewReader(newSlowReader(chunks...))

	f, err := r.Next()
	if err != nil {
		t.Fatalf("Next: %v", err)
	}
	if f.Event != "content_delta" {
		t.Errorf("event: got %q", f.Event)
	}
	if !bytes.Contains(f.Data, []byte("A long streaming token")) {
		t.Errorf("data payload garbled: %s", f.Data)
	}
}

// TestReaderSplitAcrossFrameBoundary covers the boundary landing on
// the blank line (`\n\n`) that separates two frames. Historical bug
// class: a reader returning early at the first \n could emit one
// frame and miss the next.
func TestReaderSplitAcrossFrameBoundary(t *testing.T) {
	chunks := [][]byte{
		[]byte("event: a\ndata: {}\n"),
		[]byte("\nevent: b\ndata: {}\n\n"),
	}
	r := NewReader(newSlowReader(chunks...))

	first, err := r.Next()
	if err != nil {
		t.Fatalf("first Next: %v", err)
	}
	if first.Event != "a" {
		t.Errorf("first event: got %q", first.Event)
	}
	second, err := r.Next()
	if err != nil {
		t.Fatalf("second Next: %v", err)
	}
	if second.Event != "b" {
		t.Errorf("second event: got %q", second.Event)
	}
}

// TestReaderCRLFTerminators accepts `\r\n` as well as `\n`. Some
// intermediaries (nginx, dev proxies) normalise line endings.
func TestReaderCRLFTerminators(t *testing.T) {
	src := "event: ping\r\ndata: {}\r\n\r\n"
	r := NewReader(strings.NewReader(src))
	f, err := r.Next()
	if err != nil {
		t.Fatalf("Next: %v", err)
	}
	if f.Event != "ping" {
		t.Errorf("event: got %q", f.Event)
	}
}

// TestReaderCommentFrameSkipped confirms `:`-prefixed comment lines
// (our own heartbeats, or upstream's) do not surface as frames.
func TestReaderCommentFrameSkipped(t *testing.T) {
	src := ": keep-alive\n\nevent: tick\ndata: {}\n\n"
	r := NewReader(strings.NewReader(src))
	f, err := r.Next()
	if err != nil {
		t.Fatalf("Next: %v", err)
	}
	if f.Event != "tick" {
		t.Errorf("expected tick, got %q", f.Event)
	}
}

// TestReaderFrameCap returns ErrFrameTooLarge when a single frame
// exceeds 1 MiB. The cap exists to bound a pathological upstream
// that pins the reader on unbounded growth.
func TestReaderFrameCap(t *testing.T) {
	var b bytes.Buffer
	b.WriteString("event: huge\ndata: ")
	// 2 MiB payload.
	filler := bytes.Repeat([]byte("a"), MaxFrameBytes+16)
	b.Write(filler)
	b.WriteString("\n\n")

	r := NewReader(&b)
	_, err := r.Next()
	if !errors.Is(err, ErrFrameTooLarge) {
		t.Errorf("expected ErrFrameTooLarge, got %v", err)
	}
}

// TestReaderMidFrameEOF surfaces an incomplete frame as
// io.ErrUnexpectedEOF so the proxy can treat it as a drop and skip
// persist per AC #3.
func TestReaderMidFrameEOF(t *testing.T) {
	src := "event: content_delta\ndata: {\"type\":\"content_delta\",\"text"
	r := NewReader(strings.NewReader(src))
	_, err := r.Next()
	if !errors.Is(err, io.ErrUnexpectedEOF) {
		t.Errorf("expected ErrUnexpectedEOF, got %v", err)
	}
}
