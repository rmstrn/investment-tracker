package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"

	"github.com/rmstrn/investment-tracker/apps/api/internal/app"
	"github.com/rmstrn/investment-tracker/apps/api/internal/clients/asynqpub"
	dbgen "github.com/rmstrn/investment-tracker/apps/api/internal/db/generated"
	"github.com/rmstrn/investment-tracker/apps/api/internal/domain/tiers"
	"github.com/rmstrn/investment-tracker/apps/api/internal/errs"
	"github.com/rmstrn/investment-tracker/apps/api/internal/middleware"
)

var validExportResources = map[string]struct{}{
	"transactions": {}, "positions": {}, "snapshots": {}, "dividends": {},
}

// CreateExport queues a CSV export job per openapi ExportCreateRequest.
// Tier-gated Plus+ via tiers.Limit (CSV export = premium feature per
// §15.5). The handler inserts a `queued` row, enqueues
// generate_export, and returns 202 + the job body with
// result_url:null + X-Export-Pending header so clients know to poll.
//
// TD-039 tracks the TASK_06 worker-side consumer. Until it lands,
// jobs stay in `queued` forever; GET /exports/{id} still answers
// truthfully.
func CreateExport(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		// Tier gate: Plus or Pro. Explicit CSVExport flag matches the
		// AdvancedAnalytics / TaxReports pattern — no more AI-cap
		// heuristic. Sprint C follow-up closed TD-047.
		if !tiers.For(user.SubscriptionTier).CSVExport {
			return errs.Respond(c, reqID,
				errs.New(http.StatusForbidden, "FEATURE_LOCKED", "CSV export requires Plus or higher"))
		}

		var req struct {
			Resource string   `json:"resource"`
			Format   string   `json:"format"`
			From     *string  `json:"from"`
			To       *string  `json:"to"`
			Columns  []string `json:"columns"`
		}
		if err := json.Unmarshal(c.Body(), &req); err != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid JSON body"))
		}
		if _, ok := validExportResources[req.Resource]; !ok {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "resource must be one of transactions, positions, snapshots, dividends"))
		}
		if req.Format != "csv" {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "format must be csv"))
		}

		// filters JSONB just mirrors the request — the worker reads
		// from/to/columns out of it, so no dedicated columns are
		// needed on export_jobs for MVP filters.
		filters, err := json.Marshal(map[string]any{
			"from":    req.From,
			"to":      req.To,
			"columns": req.Columns,
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to marshal filters"))
		}

		row, err := dbgen.New(deps.Pool).CreateExportJob(ctx, dbgen.CreateExportJobParams{
			ID:       uuid.Must(uuid.NewV7()),
			UserID:   user.ID,
			Resource: req.Resource,
			Format:   req.Format,
			Filters:  filters,
		})
		if err != nil {
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to create export job"))
		}

		if !deps.Asynq.Enabled() {
			c.Set("X-Async-Unavailable", "true")
		}
		if _, qerr := deps.Asynq.Enqueue(ctx, asynqpub.TaskGenerateExport,
			asynqpub.GenerateExportPayload{
				ExportID: row.ID.String(),
				UserID:   user.ID.String(),
				Resource: req.Resource,
				Format:   req.Format,
			}); qerr != nil {
			deps.Log.Warn().Err(qerr).Str("export_id", row.ID.String()).
				Msg("generate_export enqueue failed — job will stay in queued until re-enqueued (TD-039)")
		}

		c.Set("X-Export-Pending", "true")
		return c.Status(http.StatusAccepted).JSON(shapeExportJob(row))
	}
}

// GetExport returns the current ExportJob shape per openapi. Scoped
// by user_id so cross-user polling is 404.
func GetExport(deps *app.Deps) fiber.Handler {
	return func(c fiber.Ctx) error {
		reqID := requestIDFromLocals(c)
		user := middleware.UserFromCtx(c)
		ctx := c.Context()

		id, perr := uuid.Parse(c.Params("id"))
		if perr != nil {
			return errs.Respond(c, reqID,
				errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "invalid export id"))
		}

		row, err := dbgen.New(deps.Pool).GetExportJobByID(ctx, dbgen.GetExportJobByIDParams{
			ID: id, UserID: user.ID,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				return errs.Respond(c, reqID, errs.ErrNotFound)
			}
			return errs.Respond(c, reqID,
				errs.Wrap(err, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to load export job"))
		}
		return c.JSON(shapeExportJob(row))
	}
}

func shapeExportJob(j dbgen.ExportJob) fiber.Map {
	var filters any
	if len(j.Filters) > 0 {
		var decoded any
		if err := json.Unmarshal(j.Filters, &decoded); err == nil {
			filters = decoded
		}
	}
	var rowCount any
	if j.RowCount != nil {
		rowCount = int(*j.RowCount)
	}
	var resultURL any
	if j.ResultUrl != nil {
		resultURL = *j.ResultUrl
	}
	var errMsg any
	if j.Error != nil {
		errMsg = *j.Error
	}
	var completed any
	if j.CompletedAt.Valid {
		completed = j.CompletedAt.Time.UTC().Format(time.RFC3339)
	}
	return fiber.Map{
		"id":           j.ID.String(),
		"resource":     j.Resource,
		"format":       j.Format,
		"status":       j.Status,
		"filters":      filters,
		"row_count":    rowCount,
		"result_url":   resultURL,
		"error":        errMsg,
		"created_at":   j.CreatedAt.Time.UTC().Format(time.RFC3339),
		"completed_at": completed,
	}
}
