package handlers

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/aiservice"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/handlers/httputil"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

// generateInsightsRequest is the openapi shape for POST
// /ai/insights/generate. All fields optional.
type generateInsightsRequest struct {
	InsightType string `json:"insight_type"`
}

// validInsightTypes mirrors the InsightType enum on the openapi
// side; full enum is much longer (loose strings) but the
// generation request only needs sanity-validation on the optional
// hint.
var validInsightTypes = map[string]struct{}{
	"performance":      {},
	"risk":             {},
	"diversification":  {},
	"cost":             {},
	"behavioral":       {},
	"rebalance":        {},
	"allocation_drift": {},
	"tax":              {},
}

// GenerateInsightsHandler synchronously calls AI Service
// /internal/insights/generate, persists every returned insight via
// InsertInsight, and responds 202 with the openapi
// InsightGenerationJob shape — but with `status: done` and
// `insight_id` already populated, since the work is finished
// before the response writes (Path B sync per the B3-ii pre-flight).
//
// Tier gate runs upstream via airatelimit middleware (counts each
// /generate call against the daily AIMessagesDaily counter — the
// per-week / per-day / unlimited gate documented on openapi for
// Free/Plus/Pro is a separate UX feature, tracked in TD-053).
//
// 5xx from AI Service → 502 BAD_GATEWAY; 401/403 → 502 with
// internal-token alert. The handler does NOT enqueue an asynq task
// — Path B is intentionally sync: handler hangs 5-30s waiting for
// LLM, returns done immediately. Future async via TASK_06 worker
// is TD-050.
func GenerateInsightsHandler(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		// Optional body — insight_type is a hint. Empty body means
		// "let the AI service pick".
		req, coded := httputil.BindJSONOptional[generateInsightsRequest](c)
		if coded != nil {
			return errs.Respond(c, reqID, coded)
		}
		req.InsightType = strings.TrimSpace(req.InsightType)
		if req.InsightType != "" {
			if _, ok := validInsightTypes[req.InsightType]; !ok {
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "unknown insight_type hint"))
			}
		}

		queuedAt := time.Now().UTC()
		jobID := uuid.Must(uuid.NewV7())

		// Sync inline LLM call. Per the pre-flight, AI Service is
		// the canonical insight source today; failure here surfaces
		// as 502 + Sentry alert.
		resp, err := deps.AI.GenerateInsights(ctx, user.ID, reqID, aiservice.InsightGenerateRequest{
			InsightType: req.InsightType,
		})
		if err != nil {
			if errors.Is(err, aiservice.ErrUpstreamAuth) {
				deps.Log.Error().Err(err).
					Str("user_id", user.ID.String()).
					Msg("aiservice auth rejected — internal token misconfigured (Sentry alert)")
				return errs.Respond(c, reqID,
					errs.New(http.StatusBadGateway, "EXTERNAL_SERVICE_ERROR",
						"AI Service auth failed — operator action required"))
			}
			deps.Log.Warn().Err(err).Str("user_id", user.ID.String()).
				Msg("aiservice generate insights failed")
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadGateway, "EXTERNAL_SERVICE_ERROR",
					"AI Service insight generation failed; try again later"))
		}

		// Persist every returned insight in one round-trip per row
		// (row count is small — usually 1-3 per call). The first
		// generated insight's id is reported back as
		// InsightGenerationJob.insight_id so the UI has something
		// to scroll to immediately; the rest live behind the
		// /ai/insights list endpoint.
		var firstInsightID *uuid.UUID
		q := dbgen.New(deps.Pool)
		for _, gi := range resp.Insights {
			row, err := q.InsertInsight(ctx, dbgen.InsertInsightParams{
				ID:          uuid.Must(uuid.NewV7()),
				UserID:      user.ID,
				InsightType: gi.InsightType,
				Title:       gi.Title,
				Body:        gi.Body,
				Severity:    gi.Severity,
				Data:        gi.Data,
			})
			if err != nil {
				deps.Log.Warn().Err(err).
					Str("insight_type", gi.InsightType).
					Msg("insight insert failed; skipping")
				continue
			}
			if firstInsightID == nil {
				id := row.ID
				firstInsightID = &id
			}
		}

		body := fiber.Map{
			"job_id":    jobID.String(),
			"status":    "done",
			"queued_at": queuedAt.Format(time.RFC3339),
		}
		if firstInsightID != nil {
			body["insight_id"] = firstInsightID.String()
		} else {
			// AI returned zero insights (no signal, unusual but valid).
			body["insight_id"] = nil
		}

		return c.Status(http.StatusAccepted).JSON(body)
	}
}
