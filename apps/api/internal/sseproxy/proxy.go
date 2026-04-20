package sseproxy

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog"
)

// DefaultHeartbeat is the idle interval used when StreamOpts.Heartbeat
// is zero. 15s matches the acceptance criteria and sits well below
// the Fly.io 60s idle timeout + a typical LB idle of 60-120s.
const DefaultHeartbeat = 15 * time.Second

// heartbeatFrame is the literal bytes a comment frame takes on the
// wire. SSE clients ignore `:`-prefixed lines (openapi note too).
// Writing it as a fixed byte slice keeps the hot path allocation-
// free.
var heartbeatFrame = []byte(": keep-alive\n\n")

// FlushFunc is called after every successful Write. Returning a
// non-nil error unblocks the writer loop — the handler treats it as
// a client disconnect (bufio.Writer over fasthttp surfaces dropped
// TCP as a Flush error well before the next Write hits an error
// state).
type FlushFunc func() error

// StreamOpts carries the inputs Run needs. Upstream is closed by
// Run; the caller must not touch it after calling Run.
type StreamOpts struct {
	Upstream       io.ReadCloser
	Writer         io.Writer
	Flush          FlushFunc
	ConversationID uuid.UUID
	RequestID      string
	Heartbeat      time.Duration
	Logger         *zerolog.Logger
}

// Result is what Run hands back to the handler for persistence.
// GotMessageStop is the single bit that decides whether to insert
// the assistant message + ai_usage row: per AC #3 (revised), insert
// iff a message_stop frame was observed, regardless of stop_reason.
type Result struct {
	MessageID         uuid.UUID
	ContentBlocksJSON []byte
	TotalTokens       int
	Model             string
	InputTokens       int
	OutputTokens      int
	CostUSD           float64
	StopReason        string
	GotMessageStop    bool
	// ErrorCode / ErrorMessage are populated when the upstream
	// emitted an `error` event. Handlers log these at warn level —
	// user-visible failure that still completed the openapi contract.
	ErrorCode    string
	ErrorMessage string
}

// Run drives one end-to-end proxy pass. It returns when:
//
//   - the upstream reader hits io.EOF (clean close), OR
//   - ctx is cancelled (client disconnect), OR
//   - the upstream returns an unrecoverable error.
//
// The writer goroutine (this call) is the sole writer on
// StreamOpts.Writer. No heartbeat or frame bypasses it, eliminating
// the race between heartbeat injection and frame passthrough that
// a multi-writer design carries.
func Run(ctx context.Context, opts StreamOpts) (*Result, error) {
	if opts.Upstream == nil {
		return nil, errors.New("sseproxy: Upstream is required")
	}
	if opts.Writer == nil {
		return nil, errors.New("sseproxy: Writer is required")
	}
	defer func() { _ = opts.Upstream.Close() }()

	hb := opts.Heartbeat
	if hb <= 0 {
		hb = DefaultHeartbeat
	}

	logger := opts.Logger
	if logger == nil {
		nop := zerolog.Nop()
		logger = &nop
	}

	collector := NewCollector(opts.ConversationID)

	frames := make(chan Frame, 8)
	readErrCh := make(chan error, 1)

	// Reader goroutine — only produces to the frames channel.
	// Closes it on completion (success or failure) so the writer
	// loop below can drain and exit cleanly.
	go func() {
		defer close(frames)
		r := NewReader(opts.Upstream)
		for {
			f, err := r.Next()
			if err != nil {
				readErrCh <- err
				return
			}
			select {
			case frames <- f:
			case <-ctx.Done():
				readErrCh <- ctx.Err()
				return
			}
		}
	}()

	ticker := time.NewTicker(hb)
	defer ticker.Stop()

	var writeErr error

writeLoop:
	for {
		select {
		case <-ctx.Done():
			writeErr = ctx.Err()
			break writeLoop

		case <-ticker.C:
			if _, err := opts.Writer.Write(heartbeatFrame); err != nil {
				writeErr = fmt.Errorf("sseproxy: heartbeat write: %w", err)
				break writeLoop
			}
			if err := flushWriter(opts.Flush); err != nil {
				writeErr = fmt.Errorf("sseproxy: heartbeat flush: %w", err)
				break writeLoop
			}

		case f, ok := <-frames:
			if !ok {
				// Reader finished (success or error). The loop
				// exits; the final error is drained below.
				break writeLoop
			}
			// Observe first so the collector's currentIndex is in
			// place when Translate looks it up for deltas.
			if err := collector.Observe(f); err != nil {
				logger.Warn().Err(err).Str("event", f.Event).
					Msg("sseproxy: collector observe failed")
			}
			if f.Event == "error" {
				var e aiError
				if uerr := json.Unmarshal(f.Data, &e); uerr == nil {
					collector.HasError = true
					collector.ErrorCode = e.Code
					collector.ErrorMessage = e.Message
				}
			}
			out, emit, err := Translate(f, collector, opts.RequestID)
			if err != nil {
				logger.Warn().Err(err).Str("event", f.Event).
					Msg("sseproxy: translate failed")
				continue
			}
			if !emit {
				continue
			}
			if err := writeFrame(opts.Writer, out); err != nil {
				writeErr = fmt.Errorf("sseproxy: frame write: %w", err)
				break writeLoop
			}
			if err := flushWriter(opts.Flush); err != nil {
				writeErr = fmt.Errorf("sseproxy: frame flush: %w", err)
				break writeLoop
			}
			ticker.Reset(hb)
		}
	}

	// Reap the reader — even after the writer loop exited on a
	// write failure or context cancel, we must not leak its
	// goroutine.
	readErr := drainReader(readErrCh, frames)

	res := &Result{
		MessageID:      collector.MessageID,
		TotalTokens:    collector.TotalTokens(),
		Model:          collector.Usage.Model,
		InputTokens:    collector.Usage.InputTokens,
		OutputTokens:   collector.Usage.OutputTokens,
		CostUSD:        collector.Usage.CostUSD,
		StopReason:     collector.StopReason,
		GotMessageStop: collector.GotStop,
	}
	if blocks, err := collector.ContentBlocksJSON(); err == nil {
		res.ContentBlocksJSON = blocks
	}
	if collector.HasError {
		code := collector.ErrorCode
		if code == "" {
			code = "AI_STREAM_ERROR"
		}
		res.ErrorCode = code
		res.ErrorMessage = collector.ErrorMessage
	}

	// Return the first hard failure. Clean io.EOF from the reader
	// is not an error — it's the normal close path for a completed
	// stream.
	if writeErr != nil {
		return res, writeErr
	}
	if readErr != nil && !errors.Is(readErr, io.EOF) {
		return res, readErr
	}
	return res, nil
}

// writeFrame renders one outFrame as SSE wire bytes.
func writeFrame(w io.Writer, f outFrame) error {
	if _, err := io.WriteString(w, "event: "); err != nil {
		return err
	}
	if _, err := io.WriteString(w, f.Event); err != nil {
		return err
	}
	if _, err := io.WriteString(w, "\ndata: "); err != nil {
		return err
	}
	if _, err := w.Write(f.Data); err != nil {
		return err
	}
	if _, err := io.WriteString(w, "\n\n"); err != nil {
		return err
	}
	return nil
}

func flushWriter(fn FlushFunc) error {
	if fn == nil {
		return nil
	}
	return fn()
}

// drainReader empties the frames channel so the reader goroutine
// can exit, then fetches its terminal error if any.
func drainReader(readErrCh <-chan error, frames <-chan Frame) error {
	for range frames {
	}
	select {
	case err := <-readErrCh:
		return err
	default:
		return nil
	}
}
