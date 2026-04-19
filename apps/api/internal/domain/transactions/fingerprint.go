// Package transactions holds the transaction aggregate: fingerprint-based
// deduplication, insertion, and read queries.
package transactions

import (
	"crypto/sha256"
	"encoding/hex"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

// Fingerprint returns a stable hash that identifies a transaction across
// sources. The same (account, symbol, quantity, price, type, minute) pair
// always produces the same hex digest regardless of the transport that
// delivered it — manual entry, API sync, or CSV import. That lets us
// deduplicate with ON CONFLICT DO NOTHING on the (user_id, fingerprint)
// unique index (migration 20260418120002_indexes.sql).
//
// Design notes:
//
//   - Timestamp is truncated to the minute in UTC. Broker / aggregator
//     clocks drift by a few seconds; truncation absorbs that without
//     collapsing genuinely distinct trades (humans and bots don't usually
//     place two identical orders inside one minute).
//   - Quantity and price are serialised via shopspring/decimal's
//     canonical String — no float64, no locale dance.
//   - The separator "|" was chosen because it never appears in the values
//     we serialise (UUIDs, upper-case symbols, decimal strings, enum
//     strings, RFC3339 timestamps).
func Fingerprint(
	accountID uuid.UUID,
	symbol string,
	quantity decimal.Decimal,
	price decimal.NullDecimal,
	txType string,
	executedAt time.Time,
) string {
	minute := executedAt.UTC().Truncate(time.Minute)

	priceStr := ""
	if price.Valid {
		priceStr = price.Decimal.String()
	}

	data := strings.Join([]string{
		accountID.String(),
		strings.ToUpper(strings.TrimSpace(symbol)),
		quantity.String(),
		priceStr,
		strings.ToLower(strings.TrimSpace(txType)),
		minute.Format(time.RFC3339),
	}, "|")

	sum := sha256.Sum256([]byte(data))
	return hex.EncodeToString(sum[:])
}
