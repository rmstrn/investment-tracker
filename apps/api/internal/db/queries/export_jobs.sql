-- name: CreateExportJob :one
-- Row-first insert so the handler can return a valid ExportJob body
-- alongside the 202. status starts at 'queued'; the worker flips it
-- to running → done/failed and patches result_url + row_count.
INSERT INTO export_jobs (id, user_id, resource, format, filters)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetExportJobByID :one
-- Scoped by user_id so cross-user polling surfaces as ErrNoRows → 404.
SELECT * FROM export_jobs
WHERE id = $1 AND user_id = $2;
