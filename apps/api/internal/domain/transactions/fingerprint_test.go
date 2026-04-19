package transactions_test

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"

	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/transactions"
)

func fixedAccount() uuid.UUID {
	return uuid.MustParse("01940000-0000-7000-8000-000000000001")
}

func TestFingerprint_DeterministicForSameInputs(t *testing.T) {
	acc := fixedAccount()
	qty := decimal.RequireFromString("10.5")
	price := decimal.NewNullDecimal(decimal.RequireFromString("150.23"))
	ts := time.Date(2026, 4, 19, 15, 30, 15, 0, time.UTC)

	a := transactions.Fingerprint(acc, "AAPL", qty, price, "buy", ts)
	b := transactions.Fingerprint(acc, "AAPL", qty, price, "buy", ts)
	if a != b {
		t.Fatalf("fingerprint not deterministic:\n  a=%s\n  b=%s", a, b)
	}
}

func TestFingerprint_HexLength64(t *testing.T) {
	got := transactions.Fingerprint(fixedAccount(), "X", decimal.NewFromInt(1),
		decimal.NullDecimal{}, "buy", time.Now())
	if len(got) != 64 {
		t.Fatalf("want 64 hex chars (sha256), got %d (%s)", len(got), got)
	}
}

func TestFingerprint_TimeTruncatedToMinute(t *testing.T) {
	acc := fixedAccount()
	qty := decimal.NewFromInt(1)
	price := decimal.NewNullDecimal(decimal.NewFromInt(100))

	base := time.Date(2026, 4, 19, 15, 30, 0, 0, time.UTC)
	a := transactions.Fingerprint(acc, "AAPL", qty, price, "buy", base)
	b := transactions.Fingerprint(acc, "AAPL", qty, price, "buy", base.Add(37*time.Second))
	if a != b {
		t.Fatalf("sub-minute drift should not change fingerprint:\n  a=%s\n  b=%s", a, b)
	}

	// Cross-minute must differ.
	c := transactions.Fingerprint(acc, "AAPL", qty, price, "buy", base.Add(61*time.Second))
	if a == c {
		t.Fatalf("crossing a minute should change fingerprint: both %s", a)
	}
}

func TestFingerprint_TimezoneInvariant(t *testing.T) {
	// A trade executed at 15:30 UTC has the same fingerprint whether the
	// input uses UTC or any offset.
	acc := fixedAccount()
	qty := decimal.NewFromInt(1)
	price := decimal.NewNullDecimal(decimal.NewFromInt(100))

	utc := time.Date(2026, 4, 19, 15, 30, 0, 0, time.UTC)
	est := utc.In(time.FixedZone("EST", -5*3600))

	a := transactions.Fingerprint(acc, "AAPL", qty, price, "buy", utc)
	b := transactions.Fingerprint(acc, "AAPL", qty, price, "buy", est)
	if a != b {
		t.Fatalf("timezone change should not affect fingerprint:\n  a=%s\n  b=%s", a, b)
	}
}

func TestFingerprint_CaseAndWhitespaceNormalisation(t *testing.T) {
	acc := fixedAccount()
	qty := decimal.NewFromInt(1)
	price := decimal.NewNullDecimal(decimal.NewFromInt(100))
	ts := time.Date(2026, 4, 19, 15, 30, 0, 0, time.UTC)

	a := transactions.Fingerprint(acc, "aapl ", qty, price, "BUY", ts)
	b := transactions.Fingerprint(acc, "AAPL", qty, price, "buy", ts)
	if a != b {
		t.Fatalf("case/whitespace should not change fingerprint:\n  a=%s\n  b=%s", a, b)
	}
}

func TestFingerprint_NilPriceVsZeroPriceDiffer(t *testing.T) {
	// Splits carry a NULL price; trades at literally $0 (edge case) carry
	// a zero decimal. These are semantically different and must not
	// collide.
	acc := fixedAccount()
	qty := decimal.NewFromInt(1)
	ts := time.Date(2026, 4, 19, 15, 30, 0, 0, time.UTC)

	split := transactions.Fingerprint(acc, "AAPL", qty, decimal.NullDecimal{}, "split", ts)
	zero := transactions.Fingerprint(acc, "AAPL", qty,
		decimal.NewNullDecimal(decimal.Zero), "buy", ts)
	if split == zero {
		t.Fatalf("NULL price must differ from zero price: both %s", split)
	}
}

func TestFingerprint_DifferentAccountsDiffer(t *testing.T) {
	qty := decimal.NewFromInt(1)
	price := decimal.NewNullDecimal(decimal.NewFromInt(100))
	ts := time.Date(2026, 4, 19, 15, 30, 0, 0, time.UTC)

	accA := uuid.MustParse("01940000-0000-7000-8000-00000000000a")
	accB := uuid.MustParse("01940000-0000-7000-8000-00000000000b")

	a := transactions.Fingerprint(accA, "AAPL", qty, price, "buy", ts)
	b := transactions.Fingerprint(accB, "AAPL", qty, price, "buy", ts)
	if a == b {
		t.Fatalf("different accounts must produce different fingerprints: both %s", a)
	}
}
