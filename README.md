# investment-tracker

AI-native investment portfolio tracker. Aggregates positions across brokers and crypto exchanges (read-only), surfaces analytics, and exposes a conversational AI layer over the portfolio.

> Not a broker. Does not execute trades. Read-only data aggregation and analysis.

Full product context lives in [`docs/`](./docs):
[Project brief](./docs/00_PROJECT_BRIEF.md) · [Tech stack](./docs/01_TECH_STACK.md) · [Architecture](./docs/02_ARCHITECTURE.md) · [Roadmap](./docs/03_ROADMAP.md) · [Task boards](./docs/)

## Quickstart

Prereqs: `pnpm@9+`, `node@22+`, `docker`, `go@1.23+` (for API work), `uv` (for AI service).

```bash
# 1. Install JS/TS dependencies
pnpm install

# 2. Start local infra (Postgres 17 + Redis 7 + Adminer)
pnpm dev:infra

# 3. Copy env templates
cp .env.example .env.local
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
cp apps/ai/.env.example  apps/ai/.env.local

# 4. Run everything in dev mode
pnpm dev
```

After `pnpm dev:infra`:

| Service   | URL                     |
| --------- | ----------------------- |
| Postgres  | `localhost:5432`        |
| Redis     | `localhost:6379`        |
| Adminer   | http://localhost:8081   |

## Monorepo layout

```
.
├── apps/
│   ├── web/              Next.js 15 + React 19 + Tailwind v4
│   ├── api/              Go (Fiber) — Core API + Workers (one module, two binaries)
│   │   ├── cmd/api/         HTTP server
│   │   └── cmd/workers/     asynq consumer
│   └── ai/               Python 3.13 + FastAPI — LLM service
├── packages/
│   ├── design-tokens/    Style Dictionary — source-of-truth design tokens (TASK_02)
│   ├── shared-types/     TS types generated from OpenAPI (filled by TASK_03)
│   ├── api-client/       Typed API client generated from OpenAPI (filled by TASK_03)
│   ├── ui/               Shared React components
│   └── config/           Shared configs (biome, tsconfig)
├── tools/
│   ├── openapi/          OpenAPI spec + codegen scripts
│   └── scripts/          Shell helpers (db, setup)
├── docs/                 Product/architecture docs
├── docker-compose.yml    Local infra
└── turbo.json            Monorepo task pipeline
```

## Package naming

All internal packages use the `@investment-tracker/*` scope. Example imports:

```ts
import { tokens } from '@investment-tracker/design-tokens';
import type { Portfolio } from '@investment-tracker/shared-types';
import { apiClient } from '@investment-tracker/api-client';
```

## Scripts

| Command                   | What it does                                         |
| ------------------------- | ---------------------------------------------------- |
| `pnpm dev`                | Run all apps in parallel (Turbo)                     |
| `pnpm dev:infra`          | Docker: start Postgres + Redis + Adminer             |
| `pnpm dev:infra:down`     | Docker: stop infra                                   |
| `pnpm dev:infra:reset`    | Docker: wipe volumes and restart                     |
| `pnpm build`              | Build all apps                                       |
| `pnpm lint`               | Biome + golangci-lint + ruff                         |
| `pnpm typecheck`          | tsc, mypy, `go vet`                                  |
| `pnpm test`               | All unit tests                                       |
| `pnpm format`             | Biome format                                         |

Per-app commands: `cd apps/api && make run-api`, `cd apps/ai && uv run fastapi dev`, etc.

## CI/CD

GitHub Actions workflows live in [`.github/workflows/`](./.github/workflows/).

- **`ci.yml`** — runs on every PR and push to `main`: lint, typecheck, test, build, security scans (gitleaks, trivy, govulncheck). This is the merge gate.
- **`deploy-web.yml`** — Vercel deploy. `workflow_dispatch` only until secrets are wired up.
- **`deploy-api.yml`** / **`deploy-ai.yml`** — Fly.io deploys. `workflow_dispatch` only.
- **`doppler-sync.yml`** — pushes secrets from Doppler to deploy targets. `workflow_dispatch` only.
- **`sentry-release.yml`** — publishes a release to Sentry. `workflow_dispatch` only.

### Secrets to configure before first deploy

Before `deploy-*` workflows can run, add these to GitHub repo **Settings → Secrets and variables → Actions**:

```
# Vercel (web)
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Fly.io (api + ai)
FLY_API_TOKEN

# Doppler (secret sync)
DOPPLER_TOKEN

# Sentry (release tracking)
SENTRY_AUTH_TOKEN
SENTRY_ORG
SENTRY_PROJECT
```

Also configure:

- **Branch protection on `main`** — require PR, require passing `ci.yml` checks, require 1 approval. (GitHub UI → Settings → Branches.)
- **Dependabot** — enabled via `.github/dependabot.yml`; just confirm it's turned on in repo settings.

## Mobile

The iOS app lives in a separate repository — see [`github.com/rmstrn/investment-tracker-ios`](https://github.com/rmstrn/investment-tracker-ios) (to be created in TASK_08). Not part of this monorepo by design (Xcode + pnpm workspaces don't mix well).

## Observability

| Signal    | Tool                                                  |
| --------- | ----------------------------------------------------- |
| Errors    | Sentry (one project per app: `web`, `api`, `ai`)      |
| Metrics   | Grafana Cloud (Prometheus-compatible)                 |
| Logs      | Grafana Loki                                          |
| Traces    | OpenTelemetry → Grafana Tempo                         |
| Product   | PostHog                                               |

SDK initialization stubs are in each app; wire real DSNs via env.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branch strategy, commit conventions, and the PR process.

## License

MIT — see [LICENSE](./LICENSE).
