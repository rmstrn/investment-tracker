// Package sseproxy bridges the Core API `/ai/chat/stream` handler and
// the AI Service `/internal/chat/stream` upstream. It is a purpose-
// built streaming proxy — not httputil.ReverseProxy — because the
// B3-ii-b acceptance criteria require three things ReverseProxy
// cannot co-operate on safely:
//
//  1. Tee every frame through a collector so the handler can persist
//     the final assistant message + ai_usage in one DB transaction.
//  2. Re-serialise the AI Service's frame shape into the openapi
//     AIChatStreamEvent shape the web / mobile clients compile
//     against (the two shapes diverged post-PR #42; see TD-055).
//  3. Inject heartbeat comments every N seconds without racing the
//     main response writer — a single-writer goroutine draining a
//     frames + heartbeat select is the cleanest way to guarantee
//     ordering.
//
// The equivalent-semantics guarantees we carry from the original
// ReverseProxy + FlushInterval:-1 direction are:
//
//   - no server-side buffering — every translated frame is written
//     and flushed immediately,
//   - no response-side timeout — long LLM turns are bounded only by
//     the request context (client disconnect) and upstream read
//     errors.
//
// The package is transport-agnostic: Run takes an io.Reader for the
// upstream body, an io.Writer for the client side, and a flush
// callback. The handler wires c.Response().BodyStreamWriter to those
// in stream mode, or an io.Discard / bytes.Buffer pair in sync mode.
package sseproxy

import (
	"bufio"
	"bytes"
	"errors"
	"fmt"
	"io"
)

// MaxFrameBytes caps a single SSE frame (event + data lines + the
// terminating blank line). 1 MiB is generous — a Claude content_delta
// carrying a fully-formed 8 kB message still fits 100x over — and
// bounds pathological upstream misbehaviour from pinning the reader
// goroutine on unbounded growth.
const MaxFrameBytes = 1 << 20

// ErrFrameTooLarge fires when a frame exceeds MaxFrameBytes. The
// handler maps this to an openapi-compliant `error` frame pushed to
// the client + a critical log + stream abort — the upstream is
// misbehaving, not the user.
var ErrFrameTooLarge = errors.New("sseproxy: frame exceeds 1 MiB cap")

// Frame is the parsed output of reader. `Event` is the `event:` line
// value (e.g. "message_start"); `Data` is the raw bytes following
// `data: ` — callers json.Unmarshal this against the AI Service
// pydantic shape. Comment-only frames (lines starting with `:`) are
// dropped at reader level and never surface here.
type Frame struct {
	Event string
	Data  []byte
}

// Reader pulls SSE frames from an upstream io.Reader. Frames are
// delimited by a blank line (`\n\n` OR `\r\n\r\n`); fields inside a
// frame are `event: ...` and `data: ...` lines. Multi-line `data:`
// payloads are concatenated with `\n` per the SSE spec, though the
// AI Service today emits single-line JSON data per frame so this is
// defensive.
type Reader struct {
	br *bufio.Reader
}

// NewReader constructs a Reader. The internal buffer starts at 8 KiB
// and grows on demand up to MaxFrameBytes.
func NewReader(r io.Reader) *Reader {
	return &Reader{br: bufio.NewReaderSize(r, 8<<10)}
}

// Next returns the next frame or io.EOF at end of stream. Comment
// frames (`:` lines, used by some SSE servers as heartbeats) are
// silently consumed. A frame that hits MaxFrameBytes returns
// ErrFrameTooLarge and the reader is no longer safe to use.
func (r *Reader) Next() (Frame, error) {
	var (
		event  string
		data   bytes.Buffer
		hasAny bool
		total  int
	)

	for {
		line, err := r.readLine()
		if err != nil {
			if errors.Is(err, io.EOF) && hasAny {
				// Upstream closed mid-frame. Surface what we have —
				// the caller will treat it as an incomplete stream
				// and skip persist per AC #3.
				return Frame{Event: event, Data: data.Bytes()}, io.ErrUnexpectedEOF
			}
			return Frame{}, err
		}

		total += len(line)
		if total > MaxFrameBytes {
			return Frame{}, ErrFrameTooLarge
		}

		// Blank line ends the frame. Drop pure-comment frames
		// (no event + no data) — they're heartbeats from some SSE
		// servers; our upstream does not emit them, but be robust.
		if len(line) == 0 {
			if !hasAny {
				continue
			}
			return Frame{Event: event, Data: data.Bytes()}, nil
		}

		// Comment line — discard.
		if line[0] == ':' {
			continue
		}

		key, value := splitField(line)
		switch key {
		case "event":
			event = value
			hasAny = true
		case "data":
			if data.Len() > 0 {
				data.WriteByte('\n')
			}
			data.WriteString(value)
			hasAny = true
		default:
			// id: / retry: / unknown — ignore silently.
		}
	}
}

// readLine returns the next line stripped of its trailing CR/LF.
func (r *Reader) readLine() (string, error) {
	line, err := r.br.ReadString('\n')
	if err != nil && !errors.Is(err, io.EOF) {
		return "", fmt.Errorf("sseproxy: read upstream: %w", err)
	}
	if len(line) == 0 && errors.Is(err, io.EOF) {
		return "", io.EOF
	}
	// Strip \n then optional \r.
	if n := len(line); n > 0 && line[n-1] == '\n' {
		line = line[:n-1]
	}
	if n := len(line); n > 0 && line[n-1] == '\r' {
		line = line[:n-1]
	}
	return line, nil
}

// splitField splits `key: value` or `key:value`. A leading space after
// the colon is conventional per the SSE spec and stripped.
func splitField(line string) (key, value string) {
	i := 0
	for i < len(line) && line[i] != ':' {
		i++
	}
	key = line[:i]
	if i == len(line) {
		return key, ""
	}
	value = line[i+1:]
	if len(value) > 0 && value[0] == ' ' {
		value = value[1:]
	}
	return key, value
}
