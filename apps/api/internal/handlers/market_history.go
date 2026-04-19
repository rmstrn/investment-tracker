package handlers

import (
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v3"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

// validHistoryIntervals + validMarketHistoryPeriods mirror the openapi
// enums; validation runs before the 501 so callers get a 400 on
// obvious typos and a 501 on the underlying scope-cut.
var (
	validMarketHistoryPeriods = map[string]struct{}{
		"1d": {}, "5d": {}, "1m": {}, "3m": {}, "6m": {},
		"1y": {}, "5y": {}, "max": {},
	}
	validMarketHistoryIntervals = map[string]struct{}{
		"1m": {}, "5m": {}, "15m": {}, "1h": {},
		"1d": {}, "1wk": {}, "1mo": {},
	}
)

// GetMarketHistory would return an OHLC series per openapi.yaml
// MarketHistoryResponse. There is no local OHLC / market_history
// table and no external provider client wired into deps yet — the
// handler validates input and returns 501 NOT_IMPLEMENTED. TD-030
// tracks the OHLC ingest pipeline; once it lands the validation
// stays and the body switches to a real series.
//
// 501 over empty-200 because an empty series is not a meaningful
// chart-render signal — every miss would silently produce a blank
// chart, which is worse than an explicit "feature not yet
// available" error a UI can fall back from.
func GetMarketHistory(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)

		symbol := strings.ToUpper(strings.TrimSpace(c.Query("symbol")))
		assetType := strings.ToLower(strings.TrimSpace(c.Query("asset_type")))
		period := c.Query("period")
		interval := c.Query("interval", "1d")

		if symbol == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "symbol is required"))
		}
		if _, ok := validAssetTypes[assetType]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "asset_type must be one of stock, etf, crypto"))
		}
		if _, ok := validMarketHistoryPeriods[period]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "period must be one of 1d, 5d, 1m, 3m, 6m, 1y, 5y, max"))
		}
		if _, ok := validMarketHistoryIntervals[interval]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid interval"))
		}

		return errs.Respond(c, reqID,
			errs.New(http.StatusNotImplemented, "NOT_IMPLEMENTED",
				"OHLC history not yet available — TD-030 tracks the ingest pipeline"))
	}
}
