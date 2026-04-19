package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/fx"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/portfolio"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
	"github.com/rmstrn/investment-tracker/apps/api/internal/pagination"
)

// GetPosition returns one enriched Position per openapi.yaml. Reuses
// the loader + calculator wiring from ListPositions so the response
// shape is byte-for-byte identical for the same row.
func GetPosition(deps *app.Deps) fiber.Handler {
	fxResolver := fx.New(deps.Pool, deps.Cache)

	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		display := resolveDisplayCurrency(c, user)
		ctx := c.Context()

		id, parseErr := uuid.Parse(c.Params("id"))
		if parseErr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid position id"))
		}

		row, err := dbgen.New(deps.Pool).GetPositionByID(ctx, dbgen.GetPositionByIDParams{
			ID:     id,
			UserID: user.ID,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load position"))
		}

		positions := []portfolio.Position{{
			ID:        row.ID,
			AccountID: row.AccountID,
			Symbol:    row.Symbol,
			AssetType: row.AssetType,
			Quantity:  row.Quantity,
			AvgCost:   row.AvgCost,
			Currency:  strings.ToUpper(row.Currency),
		}}

		prices, err := loadPricesForPositions(ctx, deps.Pool, positions)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load price"))
		}
		fxMap, err := loadFXForPositions(ctx, fxResolver, positions, BaseCurrency, display)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to resolve fx"))
		}

		snap, err := portfolio.CalculateSnapshot(positions, prices, fxMap, BaseCurrency, display)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "calculation failed"))
		}
		if len(snap.Positions) == 0 {
			// Snapshot dropped the row because price was unresolved.
			// Surface it as 200 with the unresolved fields zeroed out
			// rather than 404 — caller asked for an existing row.
			return c.JSON(shapePositionItem(portfolio.EnrichedPosition{
				Position: positions[0],
			}, display, lookupFX(fxMap, BaseCurrency, display)))
		}
		return c.JSON(shapePositionItem(snap.Positions[0], display, lookupFX(fxMap, BaseCurrency, display)))
	}
}

// ListPositionTransactions returns the transactions that built one
// position per openapi.yaml. Uses ListTransactionsByPosition which
// joins positions ↔ transactions on (user_id, account_id, symbol) —
// positions are materialised, so there is no real FK.
//
// 404 when the position id does not exist or belongs to another user
// (an empty join result with a phantom id is indistinguishable from a
// row with literally zero transactions; we pre-check the position
// exists for that user so the empty case stays a true empty-state 200).
func ListPositionTransactions(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, parseErr := uuid.Parse(c.Params("id"))
		if parseErr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid position id"))
		}

		q := dbgen.New(deps.Pool)
		if _, err := q.GetPositionByID(ctx, dbgen.GetPositionByIDParams{ID: id, UserID: user.ID}); err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to verify position"))
		}

		params, parseErr2 := parsePositionTransactionsQuery(c, id, user.ID)
		if parseErr2 != nil {
			return errs.Respond(c, reqID, parseErr2)
		}

		rows, err := q.ListTransactionsByPosition(ctx, params)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list transactions"))
		}

		items := make([]fiber.Map, 0, len(rows))
		for _, r := range rows {
			items = append(items, shapeTransaction(r))
		}

		hasMore := len(rows) == int(params.RowLimit)
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

func parsePositionTransactionsQuery(c fiber.Ctx, positionID, userID uuid.UUID) (dbgen.ListTransactionsByPositionParams, *errs.Coded) {
	p := dbgen.ListTransactionsByPositionParams{
		PositionID: positionID,
		UserID:     userID,
	}

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

	return p, nil
}
