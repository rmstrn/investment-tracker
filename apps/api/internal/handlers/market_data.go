package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgtype"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

const maxBulkSymbols = 100

// ListFxRates returns cached FX rates per openapi.yaml FxRatesResponse.
// Default behaviour: latest cached row per (base, quote) pair. Filters
// on base / quote narrow the set. When `as_of` is supplied the latest
// rule disappears — only rows on that exact date come back.
func ListFxRates(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		ctx := c.Context()
		q := dbgen.New(deps.Pool)

		base := stringPtrOrNil(strings.ToUpper(strings.TrimSpace(c.Query("base"))))
		quote := stringPtrOrNil(strings.ToUpper(strings.TrimSpace(c.Query("quote"))))

		if asOfRaw := strings.TrimSpace(c.Query("as_of")); asOfRaw != "" {
			asOf, err := time.Parse("2006-01-02", asOfRaw)
			if err != nil {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "as_of must be YYYY-MM-DD"))
			}
			rows, err := q.ListFXRatesOnDate(ctx, dbgen.ListFXRatesOnDateParams{
				AsOf:  pgtype.Date{Time: asOf, Valid: true},
				Base:  base,
				Quote: quote,
			})
			if err != nil {
				return errs.Respond(c, reqID,
					errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list fx rates"))
			}
			return c.JSON(fiber.Map{"data": shapeFXRatesOnDate(rows)})
		}

		rows, err := q.ListLatestFXRates(ctx, dbgen.ListLatestFXRatesParams{
			Base:  base,
			Quote: quote,
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list fx rates"))
		}
		return c.JSON(fiber.Map{"data": shapeLatestFXRates(rows)})
	}
}

// ListPrices returns the latest cached quote for every symbol
// requested per openapi.yaml PricesResponse. Misses are silently
// omitted — the response surfaces what is known without 404ing the
// whole batch on a single unknown ticker.
func ListPrices(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		ctx := c.Context()

		raw := strings.TrimSpace(c.Query("symbols"))
		if raw == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "symbols is required (comma-separated)"))
		}
		parts := strings.Split(raw, ",")
		symbols := make([]string, 0, len(parts))
		for _, p := range parts {
			if s := strings.ToUpper(strings.TrimSpace(p)); s != "" {
				symbols = append(symbols, s)
			}
		}
		if len(symbols) == 0 {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "symbols list is empty after trimming"))
		}
		if len(symbols) > maxBulkSymbols {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "symbols list exceeds 100"))
		}

		params := dbgen.ListPricesBySymbolsParams{Symbols: symbols}
		if at := strings.ToLower(strings.TrimSpace(c.Query("asset_type"))); at != "" {
			if _, ok := validAssetTypes[at]; !ok {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid asset_type"))
			}
			params.AssetType = &at
		}
		if cur := strings.ToUpper(strings.TrimSpace(c.Query("currency"))); cur != "" {
			params.Currency = &cur
		}

		rows, err := dbgen.New(deps.Pool).ListPricesBySymbols(ctx, params)
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to list prices"))
		}

		items := make([]fiber.Map, 0, len(rows))
		for _, r := range rows {
			items = append(items, fiber.Map{
				"symbol":     r.Symbol,
				"asset_type": r.AssetType,
				"currency":   r.Currency,
				"price":      r.Price.StringFixed(10),
				"as_of":      r.AsOf.Time.UTC().Format(time.RFC3339),
				"source":     r.Source,
			})
		}
		return c.JSON(fiber.Map{"data": items})
	}
}

func shapeLatestFXRates(rows []dbgen.FxRate) []fiber.Map {
	return shapeFXRates(rows)
}

func shapeFXRatesOnDate(rows []dbgen.FxRate) []fiber.Map {
	return shapeFXRates(rows)
}

func shapeFXRates(rows []dbgen.FxRate) []fiber.Map {
	out := make([]fiber.Map, 0, len(rows))
	for _, r := range rows {
		out = append(out, fiber.Map{
			"base_currency":  r.BaseCurrency,
			"quote_currency": r.QuoteCurrency,
			"rate":           r.Rate.StringFixed(10),
			"as_of":          r.AsOf.Time.UTC().Format("2006-01-02"),
			"source":         r.Source,
		})
	}
	return out
}

func stringPtrOrNil(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
