# @investment-tracker/api

Core API + background workers — Go 1.23, Fiber v3, sqlc + pgx, asynq.

**One Go module, two binaries:**

```
apps/api/
├── go.mod                                      # module github.com/rmstrn/investment-tracker/apps/api
├── cmd/
│   ├── api/main.go                             # HTTP server (Fiber)
│   └── workers/main.go                         # asynq consumer
├── internal/                                   # shared between cmd/api and cmd/workers
│   ├── config/
│   ├── db/                 (sqlc + pgx)        # TASK_03 migrations, TASK_04 queries
│   ├── models/             (domain types)
│   ├── clients/            (external APIs)
│   ├── auth/               (Clerk JWT verify)
│   └── crypto/             (envelope encryption)
├── Dockerfile              (multi-stage, targets: api, workers)
├── fly.toml                (Fly.io config — api)
├── fly.workers.toml        (Fly.io config — workers)
└── .golangci.yml
```

## Run locally

```bash
# Start infra first
pnpm dev:infra

# In separate terminals:
cd apps/api
make run-api          # → http://localhost:8080/healthz
make run-workers      # → logs a heartbeat every 30s (placeholder)
```

Or from root:

```bash
pnpm --filter @investment-tracker/api dev
```

## Build

```bash
cd apps/api
make build            # → ./bin/api, ./bin/workers
```

Or with Docker:

```bash
docker build --target api     -t api     -f apps/api/Dockerfile apps/api
docker build --target workers -t workers -f apps/api/Dockerfile apps/api
```

## Lint / test

```bash
make lint             # golangci-lint
make vet              # go vet
make test             # unit tests
```

## Status

Scaffold. Real handlers, routing, db layer, and asynq tasks land in **TASK_04**
(with schema migrations arriving from **TASK_03**).
