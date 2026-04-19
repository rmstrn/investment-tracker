package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// SearchMarket returns symbol autocomplete results per openapi.yaml.
// Until a real symbol-master or external provider lands (TD-029), the
// candidate set is whatever symbols already exist in the prices table —
// good enough for the user's own holdings and recently-quoted
// instruments, useless for new tickers. The X-Search-Provider header
// surfaces the source so callers can grey-out partial coverage.
//
// `name`, `exchange`, and `logo_url` come back as the symbol /
// uppercase symbol / null respectively — the prices table does not
// carry security-master metadata. Once TD-029 lands, the loader
// switches to a richer source and the handler shape stays the same.
func SearchMarket(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		ctx := c.Context()

		q := strings.TrimSpace(c.Query("q"))
		if q == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "q is required"))
		}

		params := dbgen.SearchPriceSymbolsParams{
			Query:    "%" + strings.ToUpper(q) + "%",
			RowLimit: 20,
		}
		if raw := strings.TrimSpace(c.Query("asset_type")); raw != "" {
			if _, ok := validAssetTypes[raw]; !ok {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid asset_type"))
			}
			params.AssetType = &raw
		}
		if raw := c.Query("limit"); raw != "" {
			parsed, convErr := strconv.Atoi(raw)
			if convErr != nil || parsed < 1 || parsed > 50 {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "limit must be 1-50"))
			}
			// Range-checked above (1..50) — safe to narrow to int32.
			params.RowLimit = int32(parsed) //nolint:gosec // G109: bounded 1..50
		}

		rows, err := dbgen.New(deps.Pool).SearchPriceSymbols(ctx, params)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to search symbols"))
		}

		c.Set("X-Search-Provider", "prices_table")
		items := make([]fiber.Map, 0, len(rows))
		for _, r := range rows {
			items = append(items, fiber.Map{
				"symbol":     r.Symbol,
				"asset_type": r.AssetType,
				"name":       r.Symbol, // TD-029: real provider supplies a long name
				"currency":   r.Currency,
				"exchange":   nil,
				"logo_url":   nil,
			})
		}
		return c.JSON(fiber.Map{"data": items})
	}
}
