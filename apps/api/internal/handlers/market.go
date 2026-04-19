package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/cache"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/asynqpub"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
)

const (
	quoteCacheTTL           = 60 * time.Second
	quoteMissRetryAfterSecs = 60
)

// GetMarketQuote returns the latest price for one symbol, per
// openapi.yaml MarketQuote. Resolution order:
//
//  1. Redis hot cache (key `quote:{asset_type}:{symbol}`, TTL 60s).
//  2. prices table — USD preferred, most recent as_of.
//  3. Miss → 404 with retry_after_seconds=60.
//
// External-provider fallback is deliberately NOT in this handler path.
// An unbounded handler hitting polygon/coingecko on miss would add
// p99 unpredictability and create a DoS vector on exotic symbols.
// When the asynq publisher lands (PR B3), a miss should enqueue a
// fetch_quote job; the next user retry serves from cache. Tracked as
// TD-021. Until then, the 404 is a terminal signal — client retries
// only help after an out-of-band feed pass.
func GetMarketQuote(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		ctx := c.Context()

		symbol := strings.ToUpper(strings.TrimSpace(c.Query("symbol")))
		assetType := strings.ToLower(strings.TrimSpace(c.Query("asset_type")))
		if symbol == "" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "symbol is required"))
		}
		if _, ok := validAssetTypes[assetType]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "asset_type must be one of stock, etf, crypto"))
		}

		cacheKey := fmt.Sprintf("quote:%s:%s", assetType, symbol)
		if raw, ok, err := deps.Cache.Get(ctx, cacheKey); err == nil && ok {
			var cached fiber.Map
			if jerr := json.Unmarshal([]byte(raw), &cached); jerr == nil {
				return c.JSON(cached)
			}
			// Corrupt cache row — fall through to DB rather than fail.
			deps.Log.Warn().Str("request_id", reqID).Str("key", cacheKey).
				Msg("quote cache row unparseable; falling through to DB")
		}

		row, err := dbgen.New(deps.Pool).GetLatestPrice(ctx, dbgen.GetLatestPriceParams{
			Symbol:    symbol,
			AssetType: assetType,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				// Closes TD-021. Enqueue a fetch_quote task so a
				// subsequent client retry (after Retry-After) hits the
				// cache or a fresh prices row. Enqueue errors and nil
				// publisher are logged but do not block the 404 —
				// client already has actionable retry info.
				if _, qerr := deps.Asynq.Enqueue(ctx, asynqpub.TaskFetchQuote,
					asynqpub.FetchQuotePayload{Symbol: symbol, AssetType: assetType}); qerr != nil {
					deps.Log.Warn().Err(qerr).
						Str("request_id", reqID).
						Str("symbol", symbol).
						Msg("fetch_quote enqueue failed — client retry still advised")
				}
				return respondQuoteMiss(c, reqID, symbol, assetType)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load quote"))
		}

		body := shapeQuote(row)
		if err := cacheQuote(ctx, deps.Cache, cacheKey, body); err != nil {
			// Cache write failure is non-fatal — quote is already on the wire.
			deps.Log.Warn().Err(err).Str("request_id", reqID).Str("key", cacheKey).
				Msg("quote cache write failed")
		}
		return c.JSON(body)
	}
}

func shapeQuote(p dbgen.Price) fiber.Map {
	return fiber.Map{
		"symbol":         p.Symbol,
		"asset_type":     p.AssetType,
		"currency":       p.Currency,
		"price":          p.Price.StringFixed(10),
		"previous_close": nil, // not stored in `prices` today — TD-024
		"change_percent": nil, // same
		"as_of":          p.AsOf.Time.UTC().Format(time.RFC3339),
		"source":         p.Source,
	}
}

func cacheQuote(ctx context.Context, c *cache.Client, key string, body fiber.Map) error {
	raw, err := json.Marshal(body)
	if err != nil {
		return err
	}
	return c.Set(ctx, key, string(raw), quoteCacheTTL)
}

// respondQuoteMiss emits the canonical 404 for a price-not-yet-fetched
// symbol. The retry_after_seconds field is a hint to clients; the
// Retry-After header carries the same value for HTTP-native consumers.
// Symbol/asset_type are reported through the structured `details`
// block so that the human-facing message string stays stable for
// clients keying off errs.ErrQuoteNotAvailable.
func respondQuoteMiss(c fiber.Ctx, reqID, symbol, assetType string) error {
	c.Set(fiber.HeaderRetryAfter, fmt.Sprintf("%d", quoteMissRetryAfterSecs))
	return errs.Respond(c, reqID,
		errs.ErrQuoteNotAvailable.WithDetails(map[string]any{
			"retry_after_seconds": quoteMissRetryAfterSecs,
			"symbol":              symbol,
			"asset_type":          assetType,
		}))
}
