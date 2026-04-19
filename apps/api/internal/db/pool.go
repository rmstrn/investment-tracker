// Package db holds transport-level helpers around the Postgres pool.
//
// All type-safe query helpers live under `generated/` (produced by sqlc,
// do not edit by hand). Anything non-generated — connection pooling,
// transaction helpers, error mapping — lives here.
package db

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// PoolConfig tunes the pool. Defaults target a 2-inst API fleet (20-50
// active connections per instance, see TASK_04 "Важные решения").
type PoolConfig struct {
	URL             string
	MaxConns        int32
	MinConns        int32
	MaxConnLifetime time.Duration
	MaxConnIdleTime time.Duration
	HealthCheckFreq time.Duration
}

// DefaultPoolConfig is the starting point for pgxpool setup — callers pass
// their DATABASE_URL and go.
func DefaultPoolConfig(url string) PoolConfig {
	return PoolConfig{
		URL:             url,
		MaxConns:        50,
		MinConns:        5,
		MaxConnLifetime: time.Hour,
		MaxConnIdleTime: 30 * time.Minute,
		HealthCheckFreq: time.Minute,
	}
}

// NewPool constructs a pgxpool.Pool. It pings the database once before
// returning so startup fails fast on bad credentials or unreachable hosts.
func NewPool(ctx context.Context, pc PoolConfig) (*pgxpool.Pool, error) {
	cfg, err := pgxpool.ParseConfig(pc.URL)
	if err != nil {
		return nil, fmt.Errorf("db: parse config: %w", err)
	}
	cfg.MaxConns = pc.MaxConns
	cfg.MinConns = pc.MinConns
	cfg.MaxConnLifetime = pc.MaxConnLifetime
	cfg.MaxConnIdleTime = pc.MaxConnIdleTime
	cfg.HealthCheckPeriod = pc.HealthCheckFreq

	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return nil, fmt.Errorf("db: new pool: %w", err)
	}

	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := pool.Ping(pingCtx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("db: ping: %w", err)
	}

	return pool, nil
}
