# Pre-flight — PR C (Core API deploy: Dockerfile + fly.toml + k6 smoke + runbook)

**Status:** DRAFT — pre-flight prepared while B3-ii / B3-iii are still open. PR C opens after B3-iii merges and has clean 24h in staging.
**Owner:** TBD (backend maintainer at deploy time)
**Est. size:** 1800-2400 LOC (Dockerfile + fly.toml + GitHub Actions wire + k6 smoke + runbook + health/metrics wiring + misc)
**Blast radius:** Core API prod environment — first real deploy. No user data yet in prod DB (will be seeded post-deploy via Clerk first sign-up). Write path is live but backed by a fresh DB.

---

## Context

Through PRs A → B3-iii, Core API has been built and tested entirely in CI + local dev against ephemeral PG / Redis. PR C is the «make it actually run somewhere» deploy slice:

- Multi-stage Dockerfile for the API binary
- `fly.toml` for Fly.io (region, scaling, secrets references, health checks)
- GitHub Actions `deploy-core-api.yml` — on push to `main`, build + push image, deploy, run smoke
- `/health` and `/metrics` endpoints wired (already scaffolded in PR A — this PR verifies they work behind the load balancer)
- k6 smoke suite — 5-10 scenarios hitting the most critical paths post-deploy
- `RUNBOOK_deploy.md` — how to deploy, how to roll back, how to check logs, what to do if smoke fails

**Out of scope for PR C:**
- Multi-region deploy (single region `fra` for MVP; revisit post-GA)
- APM (Datadog/New Relic) — using Fly.io native metrics + Grafana Cloud via Prometheus scrape later
- KMS/Vault integration — KEK stays in Fly secrets for MVP (TD-048)
- Worker deploy (asynq workers) — separate PR D; blocked until we have at least one worker that actually needs to run (currently no-op — `asynqpub.Enabled()` returns false in prod)
- AI Service deploy — TASK_05 owns its own deploy PR
- Web / iOS deploy — TASK_07 / TASK_08 own those

---

## Current state (pre-flight)

### What's ready
- **Health endpoint** — `/health` returns 200 with `{status: "ok", version: "<sha>", db: "ok", redis: "ok"}`. Implemented in PR A, tested in CI.
- **Metrics endpoint** — `/metrics` exposes Prometheus format (go_* + request_duration_seconds + db_pool_* via pgx stats). Exists from PR A.
- **Config loader** — reads from env (12-factor), fails fast on missing required keys. Exists from PR A.
- **Migrations** — `goose up` runs on startup (toggle via `DB_MIGRATE_ON_START=true`) or manually via `./core-api migrate up`.
- **Graceful shutdown** — SIGTERM → stop accepting new requests, drain in-flight, close DB/Redis pools, exit within 25s. Already wired in PR A's `cmd/core-api/main.go`.

### What's missing (PR C delivers)
- [ ] Dockerfile (currently only a dev `Dockerfile.dev` exists for `docker compose up`)
- [ ] `fly.toml` (no Fly config anywhere in repo)
- [ ] GitHub Actions deploy workflow
- [ ] Fly secrets set (see inventory below)
- [ ] k6 smoke suite
- [ ] `RUNBOOK_deploy.md`
- [ ] DNS — `api.investment-tracker.app` → Fly app
- [ ] TLS — Fly auto-provisions Let's Encrypt, but needs the domain pointed first
- [ ] Staging app (`investment-tracker-core-api-staging`) created separately in Fly — one-time admin action, not in code

---

## Dockerfile (skeleton)

File: `apps/api/Dockerfile`

```dockerfile
# syntax=docker/dockerfile:1.7

# ---- build stage ----
FROM golang:1.25-alpine AS build
WORKDIR /src

# Cache go mod deps
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/root/go/pkg/mod go mod download

# Copy source
COPY . .

# Build binary — stripped, CGO off for static build
ARG VERSION=dev
RUN --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/root/go/pkg/mod \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags "-s -w -X main.Version=${VERSION}" \
    -o /out/core-api ./apps/api/cmd/core-api

# ---- runtime stage ----
FROM gcr.io/distroless/static-debian12:nonroot
WORKDIR /app
COPY --from=build /out/core-api /app/core-api
COPY --from=build /src/apps/api/db/migrations /app/migrations

USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/app/core-api"]
CMD ["serve"]
```

**Notes:**
- Distroless `static-debian12:nonroot` — ~2 MB base, no shell, no package manager → reduced attack surface.
- `CGO_ENABLED=0` — pure Go, no glibc dependency, works in distroless.
- Multi-stage build keeps final image tiny (binary + migrations only, ~15-20 MB).
- `VERSION` build arg — set in CI to `$GITHUB_SHA`, flows into `/health` response and Prometheus `build_info` gauge.
- Migrations baked into the image — allows `core-api migrate up` to run on deploy before `serve` starts.

---

## fly.toml (skeleton)

File: `apps/api/fly.toml`

```toml
app = "investment-tracker-core-api"
primary_region = "fra"
kill_signal = "SIGTERM"
kill_timeout = 30

[build]
  dockerfile = "Dockerfile"

[deploy]
  release_command = "/app/core-api migrate up"
  strategy = "rolling"

[env]
  PORT = "8080"
  GOMAXPROCS = "2"
  LOG_LEVEL = "info"
  LOG_FORMAT = "json"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 2

  [http_service.concurrency]
    type = "requests"
    soft_limit = 200
    hard_limit = 250

  [[http_service.checks]]
    interval = "15s"
    timeout = "2s"
    grace_period = "10s"
    method = "GET"
    path = "/health"

[[vm]]
  size = "shared-cpu-1x"
  memory = "512mb"
  cpus = 1
  cpu_kind = "shared"

[metrics]
  port = 8080
  path = "/metrics"
```

**Notes:**
- `primary_region = "fra"` — Frankfurt, closest to likely EU user base, near Polygon/Stripe egress.
- `min_machines_running = 2` — two machines behind the LB for zero-downtime deploys and basic HA. Scale up via `fly scale count` when traffic justifies.
- `auto_stop_machines = false` — keep warm; cold starts hurt UX.
- `release_command = migrate up` — Fly runs this in an ephemeral VM before promoting the new release. If it fails, deploy aborts. Safe for forward-only migrations; for destructive ones, coordinate manually.
- `strategy = "rolling"` — machines replaced one at a time; each passes `/health` before next is replaced.
- `[metrics]` block — Fly scrapes `/metrics` and exposes to Grafana Cloud if configured.

---

## Secrets inventory

Set via `fly secrets set -a investment-tracker-core-api KEY=value` or bulk via `fly secrets import`. Store the source-of-truth list in `ops/secrets.env.template` (empty values, committed) + a 1Password vault entry.

| Secret | Source | Notes |
|---|---|---|
| `DATABASE_URL` | Neon (prod project) | `postgresql://...?sslmode=require&pool_max_conns=20` |
| `REDIS_URL` | Upstash (prod DB) | `rediss://default:...@...upstash.io:6379` |
| `CLERK_SECRET_KEY` | Clerk dashboard → API Keys → Secret | used for JWT verification (though we typically verify via JWKS, secret kept for server-side APIs) |
| `CLERK_WEBHOOK_SECRET` | Clerk dashboard → Webhooks → endpoint | svix signing secret |
| `CLERK_JWKS_URL` | Clerk → API Keys → JWKS URL | non-secret but kept alongside for easy rotation |
| `STRIPE_SECRET_KEY` | Stripe dashboard → Developers → API Keys | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard → Webhooks → endpoint signing secret | `whsec_...` |
| `AI_SERVICE_URL` | internal | `https://investment-tracker-ai.internal:8080` (Fly 6PN) |
| `CORE_API_INTERNAL_TOKEN` | generated (`openssl rand -base64 48`) | shared with AI Service; used for service-to-service auth |
| `KEK_MASTER_V1` | generated (`openssl rand -base64 32`) | 32 raw bytes base64; first master KEK |
| `KEK_PRIMARY_ID` | `1` | rotation pointer; bump to `2` on rotation, keep `V1` around for decrypt |
| `POLYGON_API_KEY` | Polygon dashboard | market data |
| `SENTRY_DSN` | Sentry project → Client Keys | error tracking |
| `POSTHOG_API_KEY` | PostHog → Project Settings | server-side events (funnel stitching) |

**Non-secret env** (set in `[env]` block of fly.toml, not secrets):
`PORT`, `GOMAXPROCS`, `LOG_LEVEL`, `LOG_FORMAT`, `APP_ENV=production`, `CORS_ORIGINS=https://app.investment-tracker.app`, `CLERK_JWKS_URL` (could also be here).

**Pre-deploy secret verification:** `fly secrets list -a investment-tracker-core-api` — confirm all 14 are present. Script: `ops/scripts/verify-prod-secrets.sh` (to ship in PR C).

---

## GitHub Actions — deploy-core-api.yml

File: `.github/workflows/deploy-core-api.yml`

Trigger: push to `main` that touches `apps/api/**`, `tools/openapi/**`, or the workflow file itself. Also `workflow_dispatch` for manual.

Stages:
1. **Build & push image** — GHCR (`ghcr.io/ruslan-m/investment-tracker-core-api:<sha>`). Cache mount via `actions/cache` for go build.
2. **Deploy to staging** — `flyctl deploy -a investment-tracker-core-api-staging --image ...:<sha> --remote-only --wait-timeout 600`.
3. **k6 smoke on staging** — blocks promotion if any critical scenario fails.
4. **Manual approval gate** — GitHub Environment `production` with 1 required reviewer (me). Deploy not auto-promoted.
5. **Deploy to prod** — same flyctl call, prod app.
6. **k6 smoke on prod** — non-blocking (alerts on failure, doesn't revert).
7. **Tag release** — `v0.0.<run_number>` + GitHub Release with auto-generated changelog.

**Secrets the workflow needs:**
- `FLY_API_TOKEN` — scoped to the two apps
- `GHCR_TOKEN` — repo-scoped PAT for image push

**Concurrency:** group `deploy-core-api-${{ github.ref }}`, `cancel-in-progress: false` — never cancel in-flight deploy.

---

## k6 smoke suite

Dir: `tools/k6/smoke/`

Five scenarios covering happy-path critical flows. Each runs ~60s at a small fixed rate, asserting P95 latency and error rate.

### 1. `health.js`
```js
import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 1,
  duration: "10s",
  thresholds: {
    http_req_duration: ["p(95) < 200"],
    http_req_failed: ["rate < 0.01"],
  },
};

export default function () {
  const res = http.get(`${__ENV.BASE_URL}/health`);
  check(res, {
    "status is 200": (r) => r.status === 200,
    "db is ok": (r) => r.json("db") === "ok",
    "redis is ok": (r) => r.json("redis") === "ok",
  });
}
```

### 2. `portfolio_read.js`
Hit `GET /v1/portfolio` with a test user's Clerk JWT (seeded via `ops/k6/seed-user.sh`). Targets: P95 < 300ms, 500 RPS for 60s.

### 3. `positions_read.js`
`GET /v1/positions` with ~100 positions in the test user's account. P95 < 500ms.

### 4. `ai_chat_stream.js`
`POST /v1/ai/chat/stream` — open SSE, assert first byte < 2s, receive at least one `data:` event, close cleanly. Runs at 5 RPS for 30s. Hits AI Service via the reverse proxy (validates B3-ii end-to-end).

### 5. `idempotency.js`
Fires the same `POST /v1/accounts` twice in rapid succession with the same `Idempotency-Key`. Asserts first returns 201, second returns either 200 (idempotent replay) or 409 (IDEMPOTENCY_IN_PROGRESS) — both are correct.

**Running locally:** `BASE_URL=http://localhost:8080 k6 run tools/k6/smoke/health.js`.
**In CI:** wrapper script `tools/k6/run-smoke.sh` runs all 5, aggregates exit codes, fails CI if any critical threshold breached.

---

## Deploy runbook (skeleton for RUNBOOK_deploy.md)

Separate file (`docs/RUNBOOK_deploy.md`) — PR C delivers. Headings:

1. Pre-deploy checklist (migrations reviewed, secrets verified, staging green for 24h, no active incidents)
2. Standard deploy flow (merge to main → auto to staging → smoke → manual approve → prod)
3. Emergency hotfix flow (direct-to-prod via `workflow_dispatch` — requires 2 approvers)
4. Rollback procedure (`fly releases list` → `fly deploy --image <prev-sha>` → smoke → confirm)
5. Debugging a bad deploy (how to SSH via `fly ssh console`, where logs live, how to correlate with Sentry request-ids)
6. Secrets rotation (KEK, Clerk, Stripe — each has its own mini-procedure; KEK rotation is the only one that touches DB)
7. Scaling up / down (`fly scale count`, `fly scale vm`, how to read the signal)
8. DB migration considerations (backward-compatible only in this PR; destructive migrations get separate PR + coordination)

---

## Definition of Done

- [ ] `apps/api/Dockerfile` builds locally (< 2 min cached, < 5 min cold); image < 25 MB
- [ ] `apps/api/fly.toml` valid (`fly config validate`)
- [ ] GitHub Actions `deploy-core-api.yml` green on a dry-run PR (build + push only, no deploy)
- [ ] All 14 secrets set on staging Fly app, verified via `ops/scripts/verify-prod-secrets.sh`
- [ ] Staging app `investment-tracker-core-api-staging` deploys cleanly, `/health` returns 200 externally
- [ ] k6 smoke (all 5 scenarios) runs green against staging for 24h continuously (cron job scrapes `/health` every minute → CI dashboard)
- [ ] `RUNBOOK_deploy.md` reviewed end-to-end by owner
- [ ] `DECISIONS.md` entry: «Fly.io for Core API deploy» (region choice, rolling strategy, single-region for MVP)
- [ ] `merge-log.md` entry for PR C with SHA, deploy timestamp, first staging deploy URL
- [ ] Rollback rehearsal on staging — deploy a known-bad image, confirm rollback restores service within 3 min
- [ ] DNS `api-staging.investment-tracker.app` + `api.investment-tracker.app` pointing at Fly (post-deploy, not in PR)

---

## Known risks

### 1. Release command timeout
Fly's `release_command` has a 5-min default. If a migration grows long (e.g. backfill on large table), deploy hangs. **Mitigation:** keep migrations in PR C forward-only and index-light; for expensive backfills, use a separate one-shot machine + manual coordination. Documented in the runbook.

### 2. Clerk JWKS endpoint latency from Frankfurt
Clerk's JWKS is US-hosted. First cold request from fra region can add 200-400ms to the auth middleware. **Mitigation:** JWKS cached in memory with 10-min TTL; first request after deploy may be slow but stabilizes. Acceptable for MVP.

### 3. Single-region DB → API latency
Neon prod lives in `eu-central-1` (Frankfurt). Fly `fra` is also Frankfurt. Latency should be < 5ms intra-region. **Risk:** if the DB region changes (e.g. we move to a different Neon project), latency spikes. Documented as assumption.

### 4. Secrets drift between staging and prod
Easy to set a secret on prod and forget staging, or vice versa. **Mitigation:** `ops/secrets.env.template` committed with required keys (empty values); `verify-prod-secrets.sh` runs in CI and fails if any are missing. No automated sync (prod values must never appear in CI).

### 5. KEK rotation becomes risky under load
Rotating `KEK_PRIMARY_ID` from `1` to `2` means new writes encrypt with V2, reads try both. If a bad V2 key is set (e.g. wrong byte length), writes succeed but future reads fail silently. **Mitigation:** KEK set requires a strict length check (fail-fast on startup); rotation procedure in runbook includes "decrypt one known record after rotation" smoke step.

### 6. Rolling deploy can serve stale code briefly
During a rolling deploy (N machines swapped sequentially), some requests hit v1, some v2. For pure HTTP JSON this is fine; for SSE streams, a mid-stream machine swap can drop the connection. **Mitigation:** SSE client reconnects cleanly; AI Service's EventSource handles this. Documented.

### 7. asynq workers absent in prod means deferred tasks silently drop
B3-i ships `X-Async-Unavailable: true` header when publisher is disabled; right now `asynqpub.Enabled()` returns `false` in prod because no workers are deployed yet. This is the intended scope-cut, but monitoring must confirm the header is being set (not that tasks are being enqueued and lost). **Mitigation:** add Grafana panel «count of `X-Async-Unavailable: true` responses» as a sanity gauge post-deploy. Workers land in PR D.

---

## Follow-up TDs (propose at PR C open time)

- **TD-048:** Replace env-based KEK with cloud KMS (AWS KMS or GCP KMS). Current env KEK is fine for MVP but audit-hostile. Priority: P2, revisit at first enterprise/GDPR-sensitive customer conversation.
- **TD-049:** Multi-region deploy. Single `fra` region is an SPOF. Priority: P3, revisit at 1k paying users.
- **TD-050:** APM/trace correlation (OpenTelemetry → Grafana Tempo or Datadog). Current setup is Sentry + structured logs + Prom metrics; cross-service traces manual via `X-Request-Id`. Priority: P2, do alongside AI Service flip (RUNBOOK_ai_flip).
- **TD-051:** Per-tenant rate limits via Redis-backed token bucket. Current rate limit is per-IP only (protects from DoS, doesn't protect shared resources from one abusive tenant). Priority: P2, do before first enterprise customer.
- **TD-052:** Blue-green deploys instead of rolling. Rolling is fine for stateless HTTP but risky for mid-stream SSE. Blue-green gives full switch + instant rollback. Priority: P3, do only if rolling causes real incidents.

---

## Sequencing

**Blocked on:**
- B3-ii merged (AI SSE reverse-proxy live) — otherwise scenario 4 of k6 smoke can't pass
- B3-iii merged (write path complete) — otherwise deploying an incomplete API
- 24h clean staging run post-B3-iii — any new bugs surfaced should be fixed before prod deploy

**Blocks:**
- First production user onboarding
- TASK_07 web frontend prod deploy (needs a real API URL)
- TASK_05 AI Service prod deploy can proceed in parallel (different Fly app)

**Rough timeline:** PR C opens ~T+1 day after B3-iii merges, sits in staging for 24-48h, prod deploy mid-week (never Friday). Full runway from B3-iii merge to prod API live: ~3-4 days if no surprises.
