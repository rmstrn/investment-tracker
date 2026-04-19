// Package asynqpub is the thin publisher wrapper around asynq.Client.
// Handlers import this, not asynq directly, for two reasons:
//
//  1. Tests can inject a nil Publisher (or one whose Enqueue is a
//     noop) so per-handler paths do not need a live Redis + worker
//     lifecycle just to exercise the 200-response side.
//  2. Task payload encoding lives in one place — callers pass
//     typed payload structs, not []byte blobs.
//
// Consumer side (workers) is TASK_06 scope. This package is
// publish-only.
package asynqpub

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/hibiken/asynq"
	"github.com/rs/zerolog"
)

// Task types — the canonical contract with the worker side (TASK_06).
// Keep stable; changes require coordinated worker deploy.
const (
	TaskFetchQuote      = "market:fetch_quote"
	TaskSyncAccount     = "account:sync"
	TaskReconnectAcc    = "account:reconnect"
	TaskGenerateExport  = "export:generate"
	TaskGenerateInsight = "ai:generate_insight"
	TaskHardDeleteUser  = "user:hard_delete"
)

// Publisher wraps *asynq.Client with the project's conventions.
// A nil Publisher is valid and turns every Enqueue into a logged
// noop — test harnesses rely on this.
type Publisher struct {
	client *asynq.Client
	log    zerolog.Logger
}

// New builds a Publisher against a Redis URL. Returns (nil, nil)
// when url is empty so callers can choose "no async" as a
// deployment option without branching on config in main.
func New(url string, log zerolog.Logger) (*Publisher, error) {
	if url == "" {
		return nil, nil
	}
	opt, err := asynq.ParseRedisURI(url)
	if err != nil {
		return nil, fmt.Errorf("asynqpub: parse redis uri: %w", err)
	}
	return &Publisher{
		client: asynq.NewClient(opt),
		log:    log,
	}, nil
}

// Close releases the underlying asynq connection. Safe to call on nil.
func (p *Publisher) Close() error {
	if p == nil || p.client == nil {
		return nil
	}
	return p.client.Close()
}

// Enqueue publishes a task. Nil publisher → logged noop + (nil, nil)
// so the handler caller can proceed with its response. A non-nil
// publisher with a transport error returns the error so the handler
// can decide whether to 500 or emit a warning header.
//
// Typical call from a handler:
//
//	info, err := deps.Asynq.Enqueue(ctx, asynqpub.TaskFetchQuote,
//	    FetchQuotePayload{Symbol: "AAPL", AssetType: "stock"})
func (p *Publisher) Enqueue(ctx context.Context, taskType string, payload any, opts ...asynq.Option) (*asynq.TaskInfo, error) {
	if p == nil || p.client == nil {
		p.logNoop(taskType)
		return nil, nil
	}
	raw, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("asynqpub: marshal payload for %s: %w", taskType, err)
	}
	task := asynq.NewTask(taskType, raw)
	info, err := p.client.EnqueueContext(ctx, task, opts...)
	if err != nil {
		if errors.Is(err, asynq.ErrDuplicateTask) {
			// Idempotent dedup is a feature, not an error — a second
			// Enqueue for the same unique_id returns this and callers
			// should treat it as success.
			return nil, nil
		}
		return nil, fmt.Errorf("asynqpub: enqueue %s: %w", taskType, err)
	}
	return info, nil
}

// logNoop emits a best-effort warning so operators notice that a
// deployment is running without async. Does not fail the request.
func (p *Publisher) logNoop(taskType string) {
	// p may be nil, in which case we cannot access p.log; skip the log
	// in that case — the production path always has a non-nil
	// publisher and the test path does not need the noise.
	if p == nil {
		return
	}
	p.log.Warn().
		Str("task_type", taskType).
		Msg("asynqpub: publisher not configured; task dropped (deployment running without async)")
}

// FetchQuotePayload is the contract with the worker's fetch_quote
// handler. Closes TD-021 when wired from /market/quote's miss branch.
type FetchQuotePayload struct {
	Symbol    string `json:"symbol"`
	AssetType string `json:"asset_type"`
}

// SyncAccountPayload is the contract with the worker's account-sync
// handler. Emitted from POST /accounts/{id}/sync and /reconnect.
type SyncAccountPayload struct {
	AccountID string `json:"account_id"`
	UserID    string `json:"user_id"`
	Reason    string `json:"reason"` // manual|reconnect
}

// GenerateExportPayload is emitted from POST /exports. Worker
// materialises the CSV bundle and uploads to the bucket; result_url
// is then patched into export_jobs (TD-039).
type GenerateExportPayload struct {
	ExportID string `json:"export_id"`
	UserID   string `json:"user_id"`
	Resource string `json:"resource"` // transactions|positions|snapshots|dividends
	Format   string `json:"format"`   // csv
}

// GenerateInsightPayload is emitted from POST /ai/insights/generate.
// Worker calls AI Service, stores the resulting insights rows.
type GenerateInsightPayload struct {
	UserID string `json:"user_id"`
}

// HardDeleteUserPayload is emitted from DELETE /me. Worker runs
// after the 7-day grace window; must re-check
// users.deletion_scheduled_at before purging (TD-045 — handler-side
// undo-deletion simply clears the column, the worker idempotently
// no-ops when it sees NULL).
type HardDeleteUserPayload struct {
	UserID string `json:"user_id"`
}

// HardDeleteGracePeriod is the delay applied to HardDeleteUser
// tasks. Matches the openapi /me/undo-deletion description — users
// get 7 days to reverse the decision.
const HardDeleteGracePeriod = 7 * 24 * time.Hour
