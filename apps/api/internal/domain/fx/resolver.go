// Package fx resolves an FX rate from the cheapest available source:
// Redis hot cache first, Postgres fx_rates table fallback, and one
// level of inverse-pair lookup so a sparse rate store (one direction
// stored per pair) still serves both directions.
//
// Rates are always interpreted as "1 base = rate quote".
package fx

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
)

// DefaultCacheTTL is the Redis hot-cache lifetime for FX quotes. Five
// minutes per the 2026-04-19 market-data-layer decision; the underlying
// fx_rates table is written once per day by the rates worker, so a
// 5-minute hot cache is a wash between staleness and Redis load.
const DefaultCacheTTL = 5 * time.Minute

// ErrRateUnavailable is returned when neither Redis nor Postgres nor the
// inverse pair has a rate for the requested currencies.
var ErrRateUnavailable = errors.New("fx: rate unavailable")

// Querier is the narrow slice of sqlc's Queries we need. *dbgen.Queries
// satisfies it; tests pass a stub.
type Querier interface {
	GetLatestFXRate(ctx context.Context, arg dbgen.GetLatestFXRateParams) (dbgen.FxRate, error)
}

// Resolver looks up an FX rate using Redis → Postgres → inverse-pair
// fallback in that order. Safe for concurrent use.
type Resolver struct {
	cache *cache.Client
	q     Querier
	ttl   time.Duration
}

// New builds a Resolver from the standard pool + cache. Use NewWith to
// customise the TTL or inject a stub Querier in tests.
func New(pool *pgxpool.Pool, c *cache.Client) *Resolver {
	return NewWith(dbgen.New(pool), c, DefaultCacheTTL)
}

// NewWith is the test-friendly constructor.
func NewWith(q Querier, c *cache.Client, ttl time.Duration) *Resolver {
	if ttl <= 0 {
		ttl = DefaultCacheTTL
	}
	return &Resolver{cache: c, q: q, ttl: ttl}
}

// Rate returns the rate such that `1 base = rate quote`. Identity pair
// (base == quote) is short-circuited to 1.0 without touching Redis or
// Postgres.
//
// Resolution order:
//  1. Redis key fx:{base}:{quote}   — 5-min hot cache
//  2. Postgres fx_rates latest row  — populates Redis on hit
//  3. Redis key fx:{quote}:{base}   — may have been cached earlier
//  4. Postgres fx_rates inverse     — returns 1/rate, populates both
//     directions in Redis so the next call is a 1-hop
//
// Missing on all four → ErrRateUnavailable.
func (r *Resolver) Rate(ctx context.Context, base, quote string) (decimal.Decimal, error) {
	base = strings.ToUpper(base)
	quote = strings.ToUpper(quote)
	if base == quote {
		return decimal.NewFromInt(1), nil
	}

	if rate, ok := r.getCache(ctx, base, quote); ok {
		return rate, nil
	}

	if rate, ok, err := r.getDirect(ctx, base, quote); err != nil {
		return decimal.Zero, err
	} else if ok {
		r.setCache(ctx, base, quote, rate)
		return rate, nil
	}

	if rate, ok := r.getCache(ctx, quote, base); ok && !rate.IsZero() {
		inv := decimal.NewFromInt(1).Div(rate)
		r.setCache(ctx, base, quote, inv)
		return inv, nil
	}

	if rate, ok, err := r.getDirect(ctx, quote, base); err != nil {
		return decimal.Zero, err
	} else if ok && !rate.IsZero() {
		inv := decimal.NewFromInt(1).Div(rate)
		r.setCache(ctx, quote, base, rate)
		r.setCache(ctx, base, quote, inv)
		return inv, nil
	}

	return decimal.Zero, fmt.Errorf("%w: %s→%s", ErrRateUnavailable, base, quote)
}

func (r *Resolver) getCache(ctx context.Context, base, quote string) (decimal.Decimal, bool) {
	if r.cache == nil {
		return decimal.Zero, false
	}
	val, found, err := r.cache.Get(ctx, cacheKey(base, quote))
	if err != nil || !found {
		return decimal.Zero, false
	}
	d, err := decimal.NewFromString(val)
	if err != nil {
		return decimal.Zero, false
	}
	return d, true
}

func (r *Resolver) setCache(ctx context.Context, base, quote string, rate decimal.Decimal) {
	if r.cache == nil {
		return
	}
	_ = r.cache.Set(ctx, cacheKey(base, quote), rate.String(), r.ttl)
}

func (r *Resolver) getDirect(ctx context.Context, base, quote string) (decimal.Decimal, bool, error) {
	row, err := r.q.GetLatestFXRate(ctx, dbgen.GetLatestFXRateParams{
		BaseCurrency:  base,
		QuoteCurrency: quote,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return decimal.Zero, false, nil
		}
		return decimal.Zero, false, fmt.Errorf("fx: db lookup %s→%s: %w", base, quote, err)
	}
	return row.Rate, true, nil
}

func cacheKey(base, quote string) string {
	return "fx:" + base + ":" + quote
}
