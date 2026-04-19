-- Runs once on first Postgres container startup (via docker-entrypoint-initdb.d).
-- Enables extensions we'll use across the project. Subsequent schema migrations
-- live in apps/api/internal/db/migrations (goose) — filled in TASK_03 / TASK_04.

-- UUIDs (gen_random_uuid) — built into Postgres 13+ but needs pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Embeddings for AI retrieval layer (TASK_05)
CREATE EXTENSION IF NOT EXISTS vector;

-- Case-insensitive text (e.g. email comparison)
CREATE EXTENSION IF NOT EXISTS citext;

-- Composite GIN indexes with btree ops
CREATE EXTENSION IF NOT EXISTS btree_gin;
