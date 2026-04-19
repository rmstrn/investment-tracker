package fx_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/jackc/pgx/v5"
	"github.com/redis/go-redis/v9"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/fx"
)

// stubQuerier is a hand-rolled fake for the narrow fx.Querier
// interface. Rates map is keyed by "BASE/QUOTE".
type stubQuerier struct {
	rates map[string]decimal.Decimal
	calls int
}

func (s *stubQuerier) GetLatestFXRate(_ context.Context, arg dbgen.GetLatestFXRateParams) (dbgen.FxRate, error) {
	s.calls++
	key := arg.BaseCurrency + "/" + arg.QuoteCurrency
	if r, ok := s.rates[key]; ok {
		return dbgen.FxRate{
			BaseCurrency:  arg.BaseCurrency,
			QuoteCurrency: arg.QuoteCurrency,
			Rate:          r,
		}, nil
	}
	return dbgen.FxRate{}, pgx.ErrNoRows
}

func newResolver(t *testing.T, q *stubQuerier) (*fx.Resolver, *miniredis.Miniredis) {
	t.Helper()
	mr := miniredis.RunT(t)
	ch := cache.NewFromRDB(redis.NewClient(&redis.Options{Addr: mr.Addr()}))
	return fx.NewWith(q, ch, time.Minute), mr
}

func TestFX_IdentityIsOneWithoutDBHit(t *testing.T) {
	q := &stubQuerier{rates: map[string]decimal.Decimal{}}
	r, _ := newResolver(t, q)
	got, err := r.Rate(context.Background(), "USD", "USD")
	if err != nil {
		t.Fatalf("identity errored: %v", err)
	}
	if !got.Equal(decimal.NewFromInt(1)) {
		t.Fatalf("got %s, want 1", got)
	}
	if q.calls != 0 {
		t.Fatalf("identity hit DB %d times, want 0", q.calls)
	}
}

func TestFX_DirectRateFromPostgresCachesInRedis(t *testing.T) {
	q := &stubQuerier{rates: map[string]decimal.Decimal{
		"EUR/USD": decimal.RequireFromString("1.10"),
	}}
	r, mr := newResolver(t, q)

	got, err := r.Rate(context.Background(), "EUR", "USD")
	if err != nil {
		t.Fatalf("first: %v", err)
	}
	if !got.Equal(decimal.RequireFromString("1.10")) {
		t.Fatalf("got %s, want 1.10", got)
	}
	if v, _ := mr.Get("fx:EUR:USD"); v != "1.1" {
		t.Fatalf("redis fx:EUR:USD = %q, want 1.1", v)
	}

	// Second call must not hit Postgres.
	if _, err := r.Rate(context.Background(), "EUR", "USD"); err != nil {
		t.Fatalf("second: %v", err)
	}
	if q.calls != 1 {
		t.Fatalf("DB calls = %d, want 1 (second call should be cached)", q.calls)
	}
}

func TestFX_InverseFallback(t *testing.T) {
	// Store only USD/EUR. Ask for EUR/USD; we expect 1/0.9 ≈ 1.1111.
	q := &stubQuerier{rates: map[string]decimal.Decimal{
		"USD/EUR": decimal.RequireFromString("0.90"),
	}}
	r, mr := newResolver(t, q)

	got, err := r.Rate(context.Background(), "EUR", "USD")
	if err != nil {
		t.Fatalf("inverse: %v", err)
	}
	// 1 / 0.9 = 1.111111...
	if got.StringFixed(4) != "1.1111" {
		t.Fatalf("got %s, want ~1.1111", got)
	}

	// Inverse should have populated Redis for both directions so the
	// next call is a pure cache hit (no DB calls increment).
	prev := q.calls
	if _, err := r.Rate(context.Background(), "EUR", "USD"); err != nil {
		t.Fatalf("second inverse: %v", err)
	}
	if q.calls != prev {
		t.Fatalf("DB calls went from %d → %d, want cached hit only", prev, q.calls)
	}

	if v, _ := mr.Get("fx:USD:EUR"); v == "" {
		t.Fatalf("direct direction not cached after inverse lookup")
	}
	if v, _ := mr.Get("fx:EUR:USD"); v == "" {
		t.Fatalf("inverse direction not cached after inverse lookup")
	}
}

func TestFX_ErrRateUnavailable(t *testing.T) {
	q := &stubQuerier{rates: map[string]decimal.Decimal{}}
	r, _ := newResolver(t, q)

	_, err := r.Rate(context.Background(), "EUR", "XOF")
	if !errors.Is(err, fx.ErrRateUnavailable) {
		t.Fatalf("err = %v, want ErrRateUnavailable", err)
	}
}

func TestFX_CurrenciesUppercased(t *testing.T) {
	q := &stubQuerier{rates: map[string]decimal.Decimal{
		"EUR/USD": decimal.RequireFromString("1.10"),
	}}
	r, _ := newResolver(t, q)
	got, err := r.Rate(context.Background(), "eur", "usd")
	if err != nil {
		t.Fatalf("lowercase: %v", err)
	}
	if !got.Equal(decimal.RequireFromString("1.10")) {
		t.Fatalf("got %s, want 1.10", got)
	}
}

func TestFX_TTLExpiresCacheForcesRefetch(t *testing.T) {
	q := &stubQuerier{rates: map[string]decimal.Decimal{
		"EUR/USD": decimal.RequireFromString("1.10"),
	}}
	r, mr := newResolver(t, q)

	if _, err := r.Rate(context.Background(), "EUR", "USD"); err != nil {
		t.Fatalf("first: %v", err)
	}
	if q.calls != 1 {
		t.Fatalf("first-call DB hits = %d, want 1", q.calls)
	}

	// Fast-forward past the 1-minute TTL set by newResolver.
	mr.FastForward(2 * time.Minute)

	if _, err := r.Rate(context.Background(), "EUR", "USD"); err != nil {
		t.Fatalf("after-expiry: %v", err)
	}
	if q.calls != 2 {
		t.Fatalf("after-expiry DB hits = %d, want 2 (cache expired)", q.calls)
	}
}
