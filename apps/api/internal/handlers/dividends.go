package handlers

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/users"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
	"github.com/rmstrn/investment-tracker/apps/api/internal/pagination"
)

// ListDividends returns paid and (someday) upcoming dividend events for
// the authenticated user per openapi.yaml DividendEvent.
//
// Data source — TD-022. The schema does not carry a dedicated
// `dividends` or `corporate_actions` table. Historical dividends are
// sourced from the transactions ledger (transaction_type='dividend'),
// which covers the "paid" half of the endpoint contract. Upcoming
// dividends require an ingest pipeline that does not exist yet —
// until it ships, status="upcoming" is never produced. Empty-state
// callers still see 200 with data:[] per the "empty != 404" rule.
//
// Tier gate: Plus+ per openapi.yaml #/paths/~1portfolio~1dividends.
func ListDividends(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		if !users.HasTier(user, users.TierPlus) {
			return errs.Respond(c, reqID,
				errs.New(http.StatusForbidden, "FEATURE_LOCKED", "Dividend calendar requires Plus or higher"))
		}

		params, parseErr := parseDividendsQuery(c)
		if parseErr != nil {
			return errs.Respond(c, reqID, parseErr)
		}
		params.UserID = user.ID

		rows, err := dbgen.New(deps.Pool).ListDividendTransactions(ctx, params)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list dividends"))
		}

		items := make([]fiber.Map, 0, len(rows))
		for _, r := range rows {
			items = append(items, shapeDividendEvent(r))
		}

		hasMore := int32(len(rows)) == params.RowLimit
		nextCursor := ""
		if hasMore && len(rows) > 0 {
			last := rows[len(rows)-1]
			nextCursor = pagination.Encode(last.ID, last.ExecutedAt.Time)
		}

		return c.JSON(fiber.Map{
			"data": items,
			"meta": fiber.Map{
				"has_more":    hasMore,
				"next_cursor": nullableString(nextCursor),
				"total_count": nil,
			},
		})
	}
}

func parseDividendsQuery(c fiber.Ctx) (dbgen.ListDividendTransactionsParams, *errs.Coded) {
	var p dbgen.ListDividendTransactionsParams

	cursor, err := pagination.Decode(c.Query("cursor"))
	if err != nil {
		return p, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid cursor")
	}
	if cursor.IsZero() {
		p.CursorTs = pgtype.Timestamptz{Time: cursorSentinel, Valid: true}
		p.CursorID = uuid.Nil
	} else {
		p.CursorTs = pgtype.Timestamptz{Time: cursor.LastTS, Valid: true}
		p.CursorID = cursor.LastID
	}

	limit := pagination.DefaultPageSize
	if raw := c.Query("limit"); raw != "" {
		parsed, convErr := strconv.Atoi(raw)
		if convErr != nil || parsed < 0 {
			return p, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid limit")
		}
		limit = pagination.ResolveLimit(parsed)
	}
	p.RowLimit = int32(limit)

	// The endpoint takes `from` / `to` as `format: date`. RFC3339 works
	// too (clients that include a zero time); keep both forms accepted.
	if raw := strings.TrimSpace(c.Query("from")); raw != "" {
		t, convErr := parseDateOrDateTime(raw)
		if convErr != nil {
			return p, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid from date")
		}
		p.FromTs = pgtype.Timestamptz{Time: t, Valid: true}
	}
	if raw := strings.TrimSpace(c.Query("to")); raw != "" {
		t, convErr := parseDateOrDateTime(raw)
		if convErr != nil {
			return p, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid to date")
		}
		p.ToTs = pgtype.Timestamptz{Time: t, Valid: true}
	}

	return p, nil
}

// parseDateOrDateTime accepts 2006-01-02 (spec) and RFC3339 — the
// endpoint declares `format: date` but clients often send ISO
// timestamps; be liberal on read.
func parseDateOrDateTime(s string) (time.Time, error) {
	if t, err := time.Parse("2006-01-02", s); err == nil {
		return t.UTC(), nil
	}
	return time.Parse(time.RFC3339, s)
}

func shapeDividendEvent(t dbgen.Transaction) fiber.Map {
	// transactions.price on a dividend row is amount-per-share.
	amountPerShare := "0.0000000000"
	if t.Price.Valid {
		amountPerShare = t.Price.Decimal.StringFixed(10)
	}

	total := "0.0000000000"
	if t.Price.Valid {
		total = t.Quantity.Mul(t.Price.Decimal).StringFixed(10)
	}

	return fiber.Map{
		"symbol":           t.Symbol,
		"asset_type":       t.AssetType,
		"currency":         t.Currency,
		"amount_per_share": amountPerShare,
		"ex_date":          nil, // not tracked on transactions — TD-022
		"record_date":      nil, // same
		"pay_date":         t.ExecutedAt.Time.UTC().Format("2006-01-02"),
		"total_amount":     total,
		"status":           "paid",
	}
}
