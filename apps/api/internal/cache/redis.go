// Package cache wraps the go-redis client. Every other package depends on
// *cache.Client, never on *redis.Client directly — this leaves us room to
// swap implementations or add tracing/metrics in one place.
package cache

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

// Client is the project's Redis facade. It is safe for concurrent use.
type Client struct {
	rdb *redis.Client
}

// New builds a Client from a standard redis:// URL. It pings the server
// once so startup fails fast on misconfiguration.
func New(ctx context.Context, url string) (*Client, error) {
	opts, err := redis.ParseURL(url)
	if err != nil {
		return nil, fmt.Errorf("cache: parse url: %w", err)
	}

	rdb := redis.NewClient(opts)

	pingCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	if err := rdb.Ping(pingCtx).Err(); err != nil {
		_ = rdb.Close()
		return nil, fmt.Errorf("cache: ping: %w", err)
	}

	return &Client{rdb: rdb}, nil
}

// NewFromRDB wraps an existing *redis.Client. Useful in tests where a
// miniredis instance has already been configured.
func NewFromRDB(rdb *redis.Client) *Client { return &Client{rdb: rdb} }

// Redis exposes the underlying client for cases where the wrapper does
// not cover the exact primitive needed (pub/sub, pipelining).
func (c *Client) Redis() *redis.Client { return c.rdb }

// Close releases the underlying connections.
func (c *Client) Close() error { return c.rdb.Close() }

// Get returns the value for key, or ("", false, nil) if the key is missing.
func (c *Client) Get(ctx context.Context, key string) (string, bool, error) {
	v, err := c.rdb.Get(ctx, key).Result()
	if err == redis.Nil {
		return "", false, nil
	}
	if err != nil {
		return "", false, err
	}
	return v, true, nil
}

// Set writes key = value with TTL; a zero TTL means "no expiry".
func (c *Client) Set(ctx context.Context, key, value string, ttl time.Duration) error {
	return c.rdb.Set(ctx, key, value, ttl).Err()
}

// SetNX is atomic "set if absent" — returns true when the key was
// acquired (did not exist), false when another caller owned it.
// Used by the idempotency middleware's request-collapsing lock.
// Uses go-redis' Set+NX option per its 2.6.12+ guidance; the older
// SetNX wrapper is deprecated in upstream.
func (c *Client) SetNX(ctx context.Context, key, value string, ttl time.Duration) (bool, error) {
	res, err := c.rdb.SetArgs(ctx, key, value, redis.SetArgs{Mode: "NX", TTL: ttl}).Result()
	if err != nil {
		if err == redis.Nil {
			return false, nil
		}
		return false, err
	}
	_ = res // "OK" on success; anything else still counts as acquired.
	return true, nil
}

// Del removes key. No-op and nil error when the key is absent.
func (c *Client) Del(ctx context.Context, key string) error {
	return c.rdb.Del(ctx, key).Err()
}

// IncrWithTTL atomically increments the counter at key and, if this is
// the first increment, sets its TTL. Returns the new counter value.
func (c *Client) IncrWithTTL(ctx context.Context, key string, ttl time.Duration) (int64, error) {
	pipe := c.rdb.TxPipeline()
	incr := pipe.Incr(ctx, key)
	ttlCmd := pipe.ExpireNX(ctx, key, ttl)
	if _, err := pipe.Exec(ctx); err != nil {
		return 0, err
	}
	_ = ttlCmd // ExpireNX return is ignored; we just want the side effect
	return incr.Val(), nil
}
