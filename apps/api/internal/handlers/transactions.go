package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
	"github.com/rmstrn/investment-tracker/apps/api/internal/pagination"
)

// cursorSentinel is the "far-future" timestamp used on the first page
// so the (executed_at, id) < (ts, id) tuple predicate matches every
// row. Chosen well past any realistic broker-sync clock skew.
var cursorSentinel = time.Date(9999, 1, 1, 0, 0, 0, 0, time.UTC)

var validAssetTypes = map[string]struct{}{
	"stock": {}, "etf": {}, "crypto": {},
}

var validTransactionTypes = map[string]struct{}{
	"buy": {}, "sell": {}, "dividend": {}, "split": {},
	"transfer_in": {}, "transfer_out": {}, "fee": {},
}

// ListTransactions returns the authenticated user's transactions page,
// filtered by the query params listed in openapi.yaml#/paths/~1transactions.
// Response shape: PaginatedEnvelope + { data: Transaction[] }.
//
// Transactions carry no envelope-encrypted columns (schema as of
// 20260418120001_initial_schema); `notes` is plain TEXT. No decrypt
// step runs here. Broker credentials are the only AES-GCM payload in
// the schema today and they live on `accounts`.
func ListTransactions(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		params, parseErr := parseListTransactionsQuery(c)
		if parseErr != nil {
			return errs.Respond(c, reqID, parseErr)
		}
		params.UserID = user.ID

		rows, err := dbgen.New(deps.Pool).ListTransactionsFiltered(ctx, params)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list transactions"))
		}

		items := make([]fiber.Map, 0, len(rows))
		for _, r := range rows {
			items = append(items, shapeTransaction(r))
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
				"total_count": nil, // cheap count is a TD (TD-023 not yet added; none planned — omit unless a UI pain point emerges)
			},
		})
	}
}

func parseListTransactionsQuery(c fiber.Ctx) (dbgen.ListTransactionsFilteredParams, *errs.Coded) {
	var p dbgen.ListTransactionsFilteredParams

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

	if raw := strings.TrimSpace(c.Query("account_id")); raw != "" {
		id, convErr := uuid.Parse(raw)
		if convErr != nil {
			return p, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid account_id")
		}
		p.AccountID = &id
	}
	if raw := strings.TrimSpace(c.Query("symbol")); raw != "" {
		sym := strings.ToUpper(raw)
		p.Symbol = &sym
	}
	if raw := strings.TrimSpace(c.Query("asset_type")); raw != "" {
		if _, ok := validAssetTypes[raw]; !ok {
			return p, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid asset_type")
		}
		p.AssetType = &raw
	}
	if raw := strings.TrimSpace(c.Query("transaction_type")); raw != "" {
		if _, ok := validTransactionTypes[raw]; !ok {
			return p, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid transaction_type")
		}
		p.TransactionType = &raw
	}
	if raw := strings.TrimSpace(c.Query("from")); raw != "" {
		t, convErr := time.Parse(time.RFC3339, raw)
		if convErr != nil {
			return p, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid from timestamp; expected RFC3339")
		}
		p.FromTs = pgtype.Timestamptz{Time: t, Valid: true}
	}
	if raw := strings.TrimSpace(c.Query("to")); raw != "" {
		t, convErr := time.Parse(time.RFC3339, raw)
		if convErr != nil {
			return p, errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid to timestamp; expected RFC3339")
		}
		p.ToTs = pgtype.Timestamptz{Time: t, Valid: true}
	}

	return p, nil
}

func shapeTransaction(t dbgen.Transaction) fiber.Map {
	out := fiber.Map{
		"id":               t.ID.String(),
		"account_id":       t.AccountID.String(),
		"symbol":           t.Symbol,
		"asset_type":       t.AssetType,
		"transaction_type": t.TransactionType,
		"quantity":         t.Quantity.StringFixed(10),
		"currency":         t.Currency,
		"fee":              t.Fee.StringFixed(10),
		"executed_at":      t.ExecutedAt.Time.UTC().Format(time.RFC3339),
		"source":           t.Source,
		"fingerprint":      t.Fingerprint,
		"created_at":       t.CreatedAt.Time.UTC().Format(time.RFC3339),
	}

	if t.Price.Valid {
		out["price"] = t.Price.Decimal.StringFixed(10)
	} else {
		out["price"] = nil
	}

	if len(t.SourceDetails) > 0 {
		var decoded any
		if err := json.Unmarshal(t.SourceDetails, &decoded); err == nil {
			out["source_details"] = decoded
		} else {
			out["source_details"] = nil
		}
	} else {
		out["source_details"] = nil
	}

	if t.Notes != nil {
		out["notes"] = *t.Notes
	} else {
		out["notes"] = nil
	}

	return out
}

// nullableString returns nil for an empty cursor so the JSON field
// renders as `null` per PaginationMeta.next_cursor spec.
func nullableString(s string) any {
	if s == "" {
		return nil
	}
	return s
}
