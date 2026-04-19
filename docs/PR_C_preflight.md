# PR C Pre-flight — Core API Deploy Infrastructure

**Status:** DRAFT — pre-flight prepared while CC works on TASK_04 B3-i. PR C starts after B3-iii merge.
**Scope:** final PR of TASK_04 — ships Core API to production on Fly.io with full observability and load-test baseline.
**Est. size:** ~800-1200 LOC (Dockerfile, fly.toml, k6 script, runbook, health/metrics endpoints if not yet wired). Review-friendly.
**Merge order:** last in TASK_04 sequence → closes the task.

---

## What's IN scope for PR C

1. **Dockerfile** — multi-stage, Go 1.25-alpine build, distroless runtime, final image < 50MB.
2. **fly.toml** — app config for Fly.io: regions, scaling, health checks, services, env vars, secrets references.
3. **k6 smoke suite** — baseline load test: 500 RPS on `/v1/portfolio` with P95 < 200ms (from TASK_04 DoD).
4. **Deploy runbook** — `docs/RUNBOOK_core_api_deploy.md`: first-time deploy, subsequent deploys, rollback, incident response basics.
5. **Health check endpoint** — `/health` returns 200 with short JSON `{status, commit_sha, started_at}`. Verify exists after B1 foundation; add if missing.
6. **Metrics endpoint** — `/metrics` Prometheus-format, gated to internal network (not exposed publicly). Verify exists; add if missing.
7. **CI/CD wire-up** — GitHub Actions job for `fly deploy` on merge to main; uses `FLY_API_TOKEN` secret (placeholder from TASK_01).
8. **Smoke test in CI** — after deploy, run a handful of k6 scenarios against the freshly-deployed prod instance; abort deploy if P95/error rate degrades.

## What's OUT of scope (deferred to post-MVP ops PR)

- Multi-region deployment beyond the initial 1-2 regions (Neon/Supabase proximity matters; pick based on primary user geography — likely `fra` + `iad`).
- Auto-scaling beyond simple min=2 / max=10 CPU-based (no custom metrics yet).
- Blue/green or canary deploys (Fly.io rolling update is sufficient for MVP).
- APM tracing (OpenTelemetry collector, Grafana Tempo) — Sentry traces are enough for MVP.
- KMS key management (KEK stays in env/Doppler; TD already tracks this).
- Workers deploy — separate PR after TASK_06 starts (workers are just an `asynq` queue; not in MVP scope for this deploy).
- CDN in front of Core API — Cloudflare is already assumed to proxy traffic for rate-limit + DDoS; no origin pull config change needed.

---

## Dockerfile skeleton

```dockerfile
# syntax=docker/dockerfile:1

# ─── Build stage ───────────────────────────────────────────────
FROM golang:1.25-alpine AS build

WORKDIR /src

# Cache deps separately from source
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build statically linked binary, strip symbols, embed commit SHA
ARG COMMIT_SHA=unknown
RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags="-s -w -X main.commitSHA=${COMMIT_SHA}" \
    -o /out/api \
    ./cmd/api

# ─── Runtime stage ─────────────────────────────────────────────
FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=build /out/api /api

EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/api"]
```

**Key decisions to confirm at build time:**
- **Distroless `static-debian12:nonroot`** — smallest attack surface, no shell, enforced non-root. Alternative: `scratch` (even smaller) but no CA certs baked in → breaks HTTPS to Stripe/Clerk/etc. Distroless wins.
- **CGO disabled** — pure static binary, no libc dependency. Compatible with distroless.
- **Commit SHA embedded** — surfaces in `/health` response → operators know what's deployed without external tooling.
- **No migrations in image** — Core API doesn't run migrations (goose is a separate out-of-band job; see runbook). Image is stateless.
- **No .env, no secrets in image** — all env from Fly.io secrets / Doppler at runtime.

**Expected image size:** 20-40MB (pure Go static + distroless). Validate with `docker images` in CI.

## fly.toml skeleton

```toml
app = "investment-tracker-api"
primary_region = "fra"           # Frankfurt (EU baseline); add "iad" for US later

[build]
  dockerfile = "apps/api/Dockerfile"

[env]
  PORT = "8080"
  ENV = "production"
  LOG_LEVEL = "info"
  # All secrets via `fly secrets set ...` — see runbook

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false      # MVP: no stop-on-idle; want warm starts
  auto_start_machines = true
  min_machines_running = 2        # always at least 2 replicas
  processes = ["app"]

  [[http_service.checks]]
    interval = "15s"
    timeout = "3s"
    grace_period = "10s"
    method = "GET"
    path = "/health"
    protocol = "http"

[[vm]]
  size = "shared-cpu-1x"          # MVP default; scale up on hot path evidence
  memory = "512mb"
  cpu_kind = "shared"

[metrics]
  port = 9091
  path = "/metrics"
  # Fly.io picks up Prometheus format automatically
```

**Regions strategy (MVP):** start with `fra` only if user base is EU-leaning; add `iad` after first US beta users. Not both in PR C unless Neon/Supabase have a multi-region setup ready (they don't, on free/MVP tier).

**Volumes:** Core API is stateless → no volume. If pgvector embeddings live on a separate Postgres (they do, via Neon/Supabase), no local volume in Fly required. If pgvector moves local one day → TD.

## Secrets inventory (to set via `fly secrets set` before first deploy)

From reading `apps/api/internal/config/*` at flip time — expected to include, at minimum:

| Secret | Source | Rotation policy |
|---|---|---|
| `DATABASE_URL` | Neon/Supabase connection string | Rotate via provider UI; update with `fly secrets set` |
| `REDIS_URL` | Upstash connection string | Rotate via provider UI |
| `CLERK_SECRET_KEY` | Clerk dashboard | Rotate on suspected breach only |
| `CLERK_JWKS_URL` | Clerk dashboard (public) | Static |
| `STRIPE_SECRET_KEY` | Stripe dashboard | Rotate on suspected breach |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint config | Rotate when endpoint URL changes |
| `AI_SERVICE_URL` | Internal (Fly.io 6pn network) | Static per env |
| `CORE_API_INTERNAL_TOKEN` | 32+ random bytes (generate with `openssl rand -base64 32`) | Rotate quarterly; coordinate with AI Service deploy |
| `KEK_MASTER_V1` | 32 random bytes (base64) | Never rotate without re-encrypt migration (TD-018) |
| `KEK_PRIMARY_ID` | `v1` | Bump when rotating KEK |
| `POLYGON_API_KEY` | Polygon.io dashboard | Rotate via provider |
| `COINGECKO_API_KEY` | CoinGecko (if paid tier) | Rotate via provider |
| `SNAPTRADE_CLIENT_ID` + `SNAPTRADE_CONSUMER_KEY` | SnapTrade dashboard | Rotate on breach |
| `SENTRY_DSN` | Sentry project | Static |

Note: `DOPPLER_TOKEN` can replace all of the above via Doppler CLI in Fly.io build (see DECISIONS for Doppler setup). Decide at PR C time which path (direct Fly secrets vs. Doppler wrapper).

## k6 smoke suite structure

Directory: `apps/api/tests/load/`

```
load/
├── k6.config.js
├── scenarios/
│   ├── portfolio_read.js        # GET /v1/portfolio — 500 RPS, P95 < 200ms
│   ├── positions_read.js        # GET /v1/positions — 300 RPS
│   ├── transactions_read.js     # GET /v1/transactions (paginated) — 200 RPS
│   └── ai_chat_nonstream.js     # POST /v1/ai/chat — 50 RPS (AI Service is slow; lower target)
├── fixtures/
│   └── seed_user.sh             # creates a test user with ~100 positions + ~500 transactions
└── README.md                    # how to run locally + CI
```

**Scenarios to implement in PR C:**

1. `portfolio_read.js` — primary DoD gate. 500 RPS sustained 2 min, assert `http_req_duration p(95) < 200ms` + `http_req_failed rate < 0.01`.
2. `positions_read.js` — hits `prices` + `fx_rates` cache path. Validates Redis throughput.
3. `transactions_read.js` — pagination stability under load (cursor pagination shouldn't skew or duplicate rows).
4. `ai_chat_nonstream.js` — light load on AI proxy; mostly confirms 429 rate-limit kicks in at the expected threshold (per tier) rather than a performance check.

**Not in PR C:**
- Stress test (finding breaking point) — separate exercise.
- Soak test (24h constant load) — not needed for MVP.
- Webhook load (Stripe/Clerk) — handled by respective providers' retry; our endpoint just needs to be fast enough (< 500ms per event).

## Deploy runbook skeleton

New file at PR C time: `docs/RUNBOOK_core_api_deploy.md`. Sections to include:

1. **Prerequisites** — Fly.io CLI installed, `FLY_API_TOKEN` in env, access to Neon/Supabase and Upstash dashboards, access to Doppler workspace.
2. **First-time deploy** — `fly launch` walkthrough, volume setup (none), secrets set step-by-step.
3. **Migrations** — how to run `goose up` out-of-band against prod DB. **Not part of Core API image.** Separate flow: locally `DATABASE_URL=<prod> goose -dir apps/api/db/migrations postgres up` — requires network access to prod DB (run from Fly.io ephemeral machine or via SSH tunnel via Neon console). TD: automate this in CI once schema stabilizes.
4. **Subsequent deploys** — `git push origin main` triggers GH Actions → `fly deploy`. No manual steps. CI runs k6 smoke post-deploy, aborts on regression.
5. **Rollback** — `fly deploy --image <prev-sha>` — previous images kept for 30 days on Fly.io. DB migrations are forward-only (goose); rollback of schema requires manual `goose down` which is risky → preferred is fix-forward.
6. **Incident response basics** — health check fail handling, Sentry alert triage, log access (`fly logs`), machine restart (`fly machine restart <id>`).
7. **Observability pointers** — Sentry project URL, Grafana dashboard URLs (if available), PostHog project.
8. **On-call rotation** — TBD at MVP launch; for now: maintainer is on-call.

## Definition of Done (PR C)

- [ ] `apps/api/Dockerfile` builds locally, image < 50MB, binary runs `/health` → 200.
- [ ] `apps/api/fly.toml` validates (`fly config validate`).
- [ ] `/health` and `/metrics` endpoints exist and work (add if missing during PR C).
- [ ] `apps/api/tests/load/` k6 scripts exist and run against local Core API (via docker-compose) successfully.
- [ ] `.github/workflows/deploy-api.yml` exists: on push to main, builds image, runs `fly deploy`, runs k6 smoke against deployed URL.
- [ ] `docs/RUNBOOK_core_api_deploy.md` exists and includes all sections above.
- [ ] First prod deploy completed (can be done out-of-band after merge — doesn't have to be in PR).
- [ ] All secrets set in Fly.io; verified by `fly secrets list`.
- [ ] Sentry receives errors from prod (trigger a 500 intentionally and verify).
- [ ] Load test against prod: 500 RPS portfolio read, P95 < 200ms, error rate < 0.1% — documented in runbook.

## Known risks / open questions

1. **Neon/Supabase region match.** If Neon is in `us-east-1` and Fly is in `fra`, latency adds ~100ms/query. Decision needed pre-PR: pick region based on DB location, or switch DB provider.
2. **Cold start time.** `auto_stop_machines = false` + `min_machines_running = 2` guarantees no cold start, but costs more. Revisit after launch usage metrics.
3. **KEK in env vs. Doppler.** Doppler gives audit trail; Fly secrets don't. Preference: Doppler injection at runtime. Decide before first deploy.
4. **Prometheus `/metrics` scrape permissions.** Fly.io scrapes via internal network; if we expose the port publicly by mistake, it leaks timing info. fly.toml sample above uses a separate `port = 9091` which must NOT be in `http_service` section — confirm.
5. **Log shipping.** Fly captures stdout, but retention is limited (24h on free plans). If we need more → ship to Loki or Sentry Logs. TD for post-launch.

## Follow-ups (new TDs likely opened by PR C)

- TD-046 (proposed): Automate `goose up` in CI against prod DB using ephemeral Fly machine.
- TD-047 (proposed): Fly multi-region deploy (add `iad` after first US beta users hit 100 MAU).
- TD-048 (proposed): OpenTelemetry collector for distributed tracing (replace or complement Sentry performance).
- TD-049 (proposed): Log shipping to Loki/Grafana with 30-day retention.
- TD-050 (proposed): `KEK_MASTER_V1` rotation playbook + migration script (depends on TD-018).
