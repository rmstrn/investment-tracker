# Backend Health Inventory — 2026-04-21

Snapshot всего, что открыто на backend'е, для планирования sprint'а debt-closure + deep refactor. Не план действий, а опись. UI в работе у Claude Design — окно свободно для backend work.

Scope: `apps/api` (Go / Fiber v3), `apps/ai` (Python 3.13 / FastAPI), поддерживающие `packages/` и ops config. Не включает Web (`apps/web`), iOS (`apps/ios`), design system.

---

## §1 — Open TECH_DEBT entries

Все 43 unresolved TD из `docs/TECH_DEBT.md` (snapshot до migrations этого sprint'а). Severity mapping: **P1 = GA blocker, P2 = post-GA OK для alpha но до scale, P3 = polish**. Effort: S=<2h, M=0.5–2d, L=>2d. "Trigger" — copy-paste из TECH_DEBT с сокращением.

### P1 (GA blocker)

| ID | Title | Effort | Trigger |
|----|-------|--------|---------|
| TD-090 | `turbo.json` env list drift — Vercel env vars filtered out | S (fixed, audit only) | grep `turbo.json` allowlist vs Vercel env inventory; drift = silent prod break |
| TD-066 | Restore `workers` deploy target | M | `cmd/workers` acquires a real consumer (PR D scope — блокирует TD-039/041/045) |
| TD-047 | CSVExport tier flag heuristic | S | перед public GA, жёсткий blocker |

### P2 (alpha-safe, must fix pre-scale)

| ID | Title | Effort | Trigger |
|----|-------|--------|---------|
| TD-089 | Root `prepare` hook падает в CI build env без `.git` | S (fixed) | если monorepo добавит другой `prepare`-using app |
| TD-088 | `process.env.X ?? '<default>'` audit across monorepo | S (fixed, audit only) | `rg 'process\.env\.\w+ \?\?' apps/ packages/` |
| TD-086 | Нет CI gate для AI Service Docker build | M | перед следующим Dockerfile-touching PR на apps/ai или apps/api |
| TD-084 | flyctl build context: CWD vs `--config` toml location | M | при добавлении нового Fly app с monorepo subpath |
| TD-080 | Paywall gate wiring в `(app)` routes | M | when paywall copy finalised |
| TD-078 | Mandatory `gh pr checks <N> --watch` before merge | — | process discipline |
| TD-077 | Lefthook pre-push gap: golangci-lint not run locally | S | any golangci-reported issue slipped past a green push |
| TD-069 | `doppler-sync.yml` not env-aware (stg/prd dimension missing) | M | first staging secret rotation OR first prod deploy |
| TD-067 | deploy-web.yml / deploy-ai.yml pipeline consistency | L | first successful prod deploy of all three services |
| TD-064 | Blue-green deploys instead of rolling | L | first SSE drop incident OR `smoke-prod ai_chat_stream` flaking |
| TD-063 | Per-tenant rate limits | M | first enterprise-customer conversation OR tenant-saturated cache |
| TD-062 | APM / cross-service trace correlation | L | alongside AI Service 404-swallow flip (RUNBOOK_ai_flip.md) |
| TD-060 | KMS-managed KEK (replace env-based) | L | first enterprise / GDPR conversation OR SOC2 scoping |
| TD-058 | GDPR `/me/export` data bundle | M | перед public EU launch (compliance blocker) |
| TD-057 | Billing CRUD endpoints after prod Stripe catalog | M | prod Stripe product catalog + portal + price_id's published |
| TD-056 | Clerk Backend SDK wiring (2FA + session mutations) | M | web UI готов интегрировать 2FA OR enterprise session-mgmt ask |
| TD-055 | AI stream OpenAPI spec drift (re-serialize in Core API) | M | first new frame type/field in AI Service SSE schema |
| TD-054 | CC agent memory lives outside repo — shared invariants gap | S | first incident of drift между CC сессиями |
| TD-053 | `/ai/insights/generate` per-week / per-day tier gate | S | product decides "Free spams /generate, нужна жёсткая крышка" |
| TD-052 | AIRateLimit pre-increment overcount | S | complaint "не делал столько запросов" или audit >5% drift vs ai_usage |
| TD-051 | SSE parser в Core API duplicates AI Service frame-format knowledge | S→L | first silent streaming bug |
| TD-050 | `/ai/insights/generate` Path B handler hangs 5–30s (Fly idle 60s) | M | asynq worker landed (TASK_06) OR first /generate timeout incident |
| TD-049 | SSE Last-Event-ID resume protocol | M | mobile launch (TASK_08) OR >5% chat reconnect rate |
| TD-048 | SSE error event payload — add `request_id` field | S | first mid-stream production incident needing cross-service trace |
| TD-041 | `hard_delete_user` worker consumer | M | TASK_06 start |

### P3 (polish / when-touched)

| ID | Title | Effort | Trigger |
|----|-------|--------|---------|
| TD-087 | `uv sync --no-editable` in multi-stage Dockerfile | S (fixed) | next Python service multi-stage Dockerfile |
| TD-085 | `apps/ai/.dockerignore` README.md exclusion | S (fixed) | covered by TD-086 CI gate |
| TD-083 | hook-commitlint.sh fallback branches dead under `set -e` | S | fresh worktree bootstrap |
| TD-082 | automated drift check for AI_SERVICE_TOKEN ≡ INTERNAL_API_TOKEN | — | AI Service prod cutover |
| TD-081 | reserved/unused | — | — |
| TD-079 | accounts→transactions FK=CASCADE but handler uses soft-delete | S | audit pass |
| TD-076 | Contract sync test: OpenAPI → k6 smoke shape validation | M | next silent drift OR when smoke count > ~10 (today 5) |
| TD-068 | `AIChatStreamEvent` schema tighten | S | OpenAPI housekeeping OR new `content_delta.delta` payload |
| TD-065 | `TransactionRow.kind` — support split events | S | first user feedback про splits OR broker integration delivers them |
| TD-061 | Multi-region deploy | L | ~1k paying users OR first fra outage |
| TD-059 | `/portfolio/tax/export` downloadable bundle | M per jurisdiction | TASK_06 worker slice + product priority |
| TD-046 | Aggregator provider clients (SnapTrade / Plaid / broker APIs) | L (4–6 weeks) | TASK_06 start — блокирует real-broker flow |
| TD-045 | Hard-delete worker — re-check `deletion_scheduled_at` | S | with TD-041 в TASK_06 |
| TD-039 | CSV export worker consumer | M | TASK_06 start |
| TD-008 | `apps/ai/uv.lock` generation manual для new Python deps | S | first time lock drift causes CI failure |
| TD-007 | `oapi-codegen` bug on OpenAPI 3.1 `nullable` (issue #373) | S | upstream fix OR hand-patch too fragile |
| TD-006 | Admin bypass discipline | — | if `--admin` used more than once per quarter |
| TD-005 | `BellDropdown` keyboard navigation minimal | S | first a11y audit |
| TD-004 | Pre-existing `biome-ignore` comments в `packages/ui` | S quarterly | quarterly lint audit |
| TD-003 | `border.default` 1.48:1 contrast (below WCAG 3:1) | S | a11y audit |
| TD-002 | `make` required for apps/api build (Windows gap) | S | ≥2 Windows devs onboarded |
| TD-001 | Next.js Turbopack incompatible with `experimental.typedRoutes` | S | Next.js 15.3+ |

**Fixed-inline flags remaining in Active:** TD-085, TD-087, TD-089, TD-088, TD-090 — already closed in code, остаются в Active только для audit/pattern tracking. Can be mass-moved to Resolved in next debt sweep.

---

## §2 — MVP backend blockers

### Broker integrations — TD-046 umbrella (P3 today, becomes P1 on TASK_06 start)

- **SnapTrade OAuth** — env vars `SNAPTRADE_CLIENT_ID` + `SNAPTRADE_CONSUMER_KEY` are marked `required:"true"` в `apps/api/internal/config/config.go:71-72` — boot would fail without them, but no client code exists. `internal/clients/README.md` lists `snaptrade/` as a planned directory; actual directory не создан. Handler `accounts_mutations.go:90-95` explicitly rejects `type=aggregator` with 400 "not yet wired (TD-046)".
- **Binance / Coinbase / Kraken** — same state. Listed in `internal/clients/README.md`, not implemented. Handler rejects `type=api` identically. No env/config scaffolding for them yet.
- **Manual flow** — fully functional. `POST /accounts` + `POST /transactions` (OpenAPI-complete, integration tests landed). UI_BACKLOG recommendation: ship alpha on manual-only, TD-046 in parallel.
- **Config gotcha:** prod deploy today would break because SnapTrade vars are `required`. Options: relax to `default:""`, или gate by feature flag, или provision sandbox creds in staging now. Not tracked as a standalone TD.

### AI Insights backend — largely complete (post-TD-070)

- Handlers: `insights.go` (read), `ai_insights_generate.go` (generate), `ai_insights_mutations.go` (mark-read / dismiss). Integration tests landed for all three.
- Python: `apps/ai/src/ai_service/api/insights.py` — endpoint responds. Slice 6a marked UNBLOCKED in roadmap.
- Gaps tied to existing TDs: TD-050 (generate hang 5–30s near Fly idle-60s limit — needs async path via workers), TD-053 (per-week/day tier gate). Neither blocks alpha, both become relevant when usage > demo traffic.

### Workers process — placeholder only (P1 blocker for multiple TDs)

- `apps/api/cmd/workers/main.go` — 40 lines, `log.Println("workers: heartbeat")` every 30s. No asynq consumer registered.
- Blocks: TD-039 (CSV export), TD-041 (hard-delete user), TD-045 (re-check deletion), TD-050 (insight generate async path).
- Infra: asynq publisher exists in `internal/clients/asynqpub` (3.8% coverage). Consumer side missing entirely. Redis is provisioned (rate-limiter uses it). `deploy-api.yml` has a `Restore workers deploy target` TD-066 for the workflow; не просто добавить queue-name, нужен также отдельный Fly app / process group.

### Other backend blockers from ROADMAP / UI_BACKLOG

- Slice 12 (Empty/Error states) — primarily frontend, but any backend endpoint returning 4xx/5xx needs consistent error envelope shape. Today: `errs/errs.go` provides a single `Coded` envelope; integration tests assert shape. No action needed unless UI asks for new error codes.
- Slice 17 (Observability) — see §4. UI_BACKLOG tags as P3 polish; backend side (Sentry wired, /metrics exposed) is largely done.
- `/portfolio/tax/export` (TD-059) — P3, post-TASK_06.
- `GDPR /me/export` (TD-058) — P2, pre-EU-GA blocker.
- Billing CRUD (TD-057) — P2, blocked on prod Stripe catalog setup (not backend-tech).
- Clerk Backend SDK (TD-056) — P2, for 2FA + session mutations; web не готов интегрировать.

---

## §3 — Test coverage gaps

**Go Core API** — raw `go test -cover ./...` (unit only, `-tags=integration` omitted):

| Package | Coverage | Note |
|---------|---------:|------|
| `internal/server` | **0.0%** | fiber app wiring, middleware chain, route table. TD-091 root-cause lived here; no test ever would have caught it. |
| `internal/handlers` | **1.6%** | 40 integration test files under `//go:build integration` — require live DB; excluded from default run. Handler unit coverage effectively zero. |
| `internal/clients/asynqpub` | 3.8% | placeholder publisher — parity with worker consumer TD-066 state |
| `cmd/api` | 9.3% | boot + Sentry init; low-impact |
| `internal/domain/users` | 18.2% | `GetOrCreateByClerkID` race paths not covered |
| `internal/middleware` | 60.8% | auth.go Clerk JWT + internal-token dual-path — JWKS refresh & issuer-skip paths untested |
| `internal/sseproxy` | **77.5%** | confirmed gap from TD-R091: `sseproxy.Run` tested against `ResponseRecorder` (synchronous), nothing tests Fiber `SendStreamWriter` async wrapper or `persistTurnBackground` goroutine lifecycle |
| `internal/middleware/airatelimit` | 80.6% | Redis flap fail-open path covered; overcount (TD-052) not exercised |
| `internal/crypto` | 82.8% | KEK envelope, mostly green |
| `internal/domain/{fx,tax,analytics,portfolio,transactions}` | 76–100% | healthy — pure-logic domains |

**Build failures during coverage run:** `go: no such tool "covdata"` for `internal/api/gen`, `internal/cache`, `internal/db`, `cmd/workers`, `internal/config`, `internal/clients/webhookidem`, `codegen/preprocess`, `internal/errs`, `internal/domain/tiers`, `internal/logger`. These are `[no test files]` packages that the Go 1.25 coverage tooling chokes on — orthogonal to coverage, but still noise every CI run.

**Python AI Service** — `pytest --cov=src -q`, 84% total:

- `src/ai_service/observability.py` — 52% (Sentry/PostHog init stubs; live-service paths untested)
- `src/ai_service/llm/client.py` — 88%
- `src/ai_service/api/behavioral.py` — 89%
- `src/ai_service/api/deps.py` — 91%
- Everything else ≥92%. `pytest-cov` wasn't installed until this session (just added `pytest-cov==7.1.0` locally); no baseline enforcement in CI.

**Specific gap clusters flagged for sprint:**

- SSE streaming pipeline — integration-level test that wires real Fiber + mock AI Service SSE + asserts `ai_messages` + `ai_usage` rows persisted. Scheduled as TD-R091 trigger-to-revisit; explicit blocker to catching regressions of the TD-091 fix.
- Rate-limiter overcount (TD-052) — no test exercises the pre-increment-before-upstream-failure path.
- Auth middleware edge cases — issuer-skip (dev), JWKS refetch on stale key, internal-token X-User-Id missing.
- AI Service ↔ Core API proxy — client contract tests exist (`internal/clients/aiservice/client_test.go`) but use handcrafted `httptest` fakes, not the real AI Service OpenAPI schema (TD-051 + TD-055 duplication).

---

## §4 — Observability gaps

### What's wired

- **Sentry** — Go `cmd/api/main.go:80-162` (SDK init, flush on shutdown). Python `apps/ai/src/ai_service/observability.py` (init_sentry + init_posthog). Both gate on `SENTRY_DSN` env var; no DSN = silent disable, logged at boot.
- **PostHog** — Python only. `apps/ai/src/ai_service/config.py:92-95` env vars exist. Go side has none (by design — backend emits server-side; PostHog intended for web/iOS funnel).
- **Structured logging** — Go uses `zerolog` (JSON); Python uses `structlog` + `python-json-logger`. Both emit `service`, `env`, `request_id` on every line. Log level gated by env.
- **Request ID propagation** — `X-Request-Id` header read inbound (`middleware/requestlog.go` Go; `api/middleware.py` Python), forwarded on AI Service client call (`clients/aiservice/client.go:212`). Works end-to-end.
- **Health endpoints** — Go `/health` (server.go:80), Python `/health` + `/healthz` (main.go:90-93). Both return 200 with service metadata.
- **Prometheus** — Go `/metrics` (server.go:81-87) exposes default `go_*` + `process_*` collectors via promhttp.

### What's missing (or thin)

- **Custom app metrics (Go)** — `server.go:85-87` comment explicitly lists as TODO: `request_duration`, `pgx_pool_stats`, `upstream_ai_duration`, `sse_frames_emitted`, `airatelimit_hits`. No histograms defined. Fly `[metrics]` block scrapes `/metrics` but gets only Go runtime data.
- **Python /metrics** — not implemented. `prometheus_client` not in `pyproject.toml` deps. AI Service is observable only via Sentry / PostHog events + logs.
- **OpenTelemetry / APM** — not wired. No trace propagation via `traceparent` header. TD-062 P2 explicitly opened for this.
- **Sampling strategy** — Sentry `traces_sample_rate` defaults not tuned per env. Python has `sentry_traces_sample_rate` config; Go doesn't expose one (see `cmd/api/main.go:150-158`).
- **Error aggregation across services** — no shared correlation id convention beyond `X-Request-Id`. A pattern like `chat-turn-id` or `insight-generation-id` would cluster related logs across /ai and /api; today each service tags with its own request_id.
- **Dashboard provisioning** — roadmap §152 "Sentry + PostHog dashboards" unchecked. No Grafana / Fly dashboards committed to repo. UI_BACKLOG Slice 17 P3.

---

## §5 — Code smells / refactor candidates

13 items, concrete — not a refactor plan.

1. **`apps/api/internal/handlers/` — JSON-unmarshal + validation boilerplate repeats 15+ times** (accounts, me, transactions, ai_chat, insights). Same pattern: `c.Body()` → `json.Unmarshal` → hand-rolled nil / length / enum checks → `errs.New(http.StatusBadRequest, "VALIDATION_ERROR", "...")`. No shared `bindAndValidate[T]` helper. Each handler re-invents its own error-string phrasing. Candidate: single generic helper + struct-tag-driven validation (gofiber already ships `validator/v10`).
2. **`apps/api/internal/handlers/webhook_stripe.go` ↔ `webhook_clerk.go`** — near-identical structural twins (300+ and 280+ lines). Verifier interface, payload unmarshalling, `webhookidem.Claimer` claim/dispatch, event-type switch. No shared abstraction. One bug fix must be applied to both files.
3. **`apps/api/internal/handlers/accounts_mutations.go`** (384 lines) — validation tables + repeated `json.Unmarshal` + `dbgen.New(deps.Pool)` boilerplate across 8 mutation handlers (create, update, delete, + 5 variants). Five near-identical error-wrap patterns.
4. **`apps/api/internal/handlers/ai_chat_shared.go`** (379 lines) — mixed concerns: request parsing + DB history loading + flattening + ownership checks + error mapping. `historyCap` hardcoded here and independently capped at `max_length=40` on the AI Service `ChatRequest` side — two places of truth.
5. **`apps/api/internal/middleware/auth.go:80-200`** — Clerk JWT verify + internal-token bearer fallback mixed in one handler. Internal-token check is shallow: bearer-string match + `X-User-Id` trust. No rate-limit on failed auth attempts.
6. **`apps/api/internal/server/server.go:44-130`** — middleware chain order-dependent (RequestID → RequestLog → CORS → Auth) with inline comments warning against reordering. One slip breaks tracing. No registry abstraction or ordering-assert test.
7. **`apps/api/internal/domain/tiers/limits.go`** — tier caps (`AIMessagesDaily`=5/50/∞, `InsightsWeekly`=3/20/∞) hardcoded in Go. AI Service has no equivalent constants; Python enforces nothing on tier, blindly streams. Source-of-truth drift waiting to happen.
8. **`apps/ai/src/ai_service/llm/pricing.py:1-42`** — model pricing in code ($3.00/$15.00 per Mtok Sonnet, $1.00/$5.00 Haiku). Core API `ai_usage.cost_usd` column is `NUMERIC(10,6)` with no range validation; if pricing.py drifts or bumps to a more expensive model, billing ledger silently records wrong numbers. No parity test.
9. **`apps/api/internal/domain/users/repo.go:50-116`** — `GetOrCreateByClerkID` does `SELECT` then `INSERT` in separate queries, not upsert. Concurrent Clerk webhook fan-out could race (low-frequency in MVP but real).
10. **`apps/api/internal/handlers/ai_chat_stream.go:70-95`** — TD-R091 fix is correct but structurally awkward: persist + error-log live inside the `SendStreamWriter` closure because Fiber v3 forces it. Logic is invisible to test harness, hard to reuse for another streaming endpoint. Comment documents the constraint but doesn't abstract it.
11. **Config surface fragmentation — `InternalToken`** — appears in `.env.example`, Go `config.Config.CoreAPIInternalToken`, middleware header check, Python `CORE_API_INTERNAL_TOKEN` config, `ops/secrets.keys.yaml`. Go field name `CoreAPIInternalToken` vs env `CORE_API_INTERNAL_TOKEN` vs Python field `core_api_internal_token` — three casings. One rename is a 5-file change.
12. **`apps/ai/src/ai_service/clients/core_api.py:40-100`** — thin HTTP client that re-implements the Bearer + `X-User-Id` header pattern that the Core API middleware expects. No shared constant package between services for header names (`X-User-Id`, `X-Request-Id`, `X-Internal-Token`).
13. **`apps/api/internal/sseproxy/proxy.go` + `apps/ai/src/ai_service/llm/streaming.py`** — both own a model of "SSE frame shape + `message_stop` semantics". TD-051 tracks this as "Core API duplicates AI Service frame format knowledge". Contract test exists in neither; one side drifts = TD-R091-style silent bug.

---

## §6 — Dependencies status

### Go (apps/api, `go 1.25`)

Direct deps with newer minor/patch (non-exhaustive, filtered to ones we actually use):

| Module | Current | Latest |
|--------|---------|--------|
| `github.com/getsentry/sentry-go` | v0.45.1 | v0.46.0 |
| `github.com/go-playground/validator/v10` | v10.20.0 | v10.30.2 |
| `github.com/jackc/pgtype` | v1.14.0 | v1.14.4 |
| `github.com/rs/zerolog` | v1.35.0 | v1.35.1 |
| `github.com/gofiber/schema` | v1.7.0 | v1.7.1 |
| `github.com/gofiber/utils/v2` | v2.0.2 | v2.0.4 |
| `github.com/prometheus/common` | v0.66.1 | v0.67.5 |
| `github.com/prometheus/procfs` | v0.19.2 | v0.20.1 |

**govulncheck:** `No vulnerabilities found.` (against current `go.sum`).

### Python (apps/ai, `requires-python>=3.13`)

`uv pip list --outdated`:

| Package | Current | Latest |
|---------|---------|--------|
| `pydantic-settings` | 2.13.1 | 2.14.0 |
| `pydantic` | 2.13.2 | 2.13.3 |
| `pydantic-core` | 2.46.2 | 2.46.3 |
| `posthog` | 7.12.0 | 7.13.0 |
| `uvicorn` | 0.44.0 | 0.45.0 |
| `mypy` | 1.20.1 | 1.20.2 |
| `idna` | 3.11 | 3.12 |

No `pip-audit` / `safety` run — not in dev deps. Advisory check not automated.

### pnpm (root + apps/web + packages)

Direct deps with major bumps pending:

- `next` 15.5.15 → 16.2.4 (major)
- `typescript` 5.9.3 → 6.0.3 (major)
- `vitest` 2.1.9 → 4.1.5 (major gap)
- `happy-dom` 15.11.7 → 20.9.0 (major gap)
- `@vitejs/plugin-react` 4.7.0 → 6.0.1 (major)
- `lucide-react` 0.468.0 → 1.8.0 (major)
- `tailwind-merge` 2.6.1 → 3.5.0 (major)
- `style-dictionary` 4.4.0 → 5.4.0 (major)
- `lefthook` 1.13.6 → 2.1.6 (major)
- `@redocly/cli` 1.34.11 → 2.29.0 (major — and see advisories below)
- `openapi-fetch` 0.13.8 → 0.17.0

`pnpm audit`:
- **Prod tree:** `No known vulnerabilities found.`
- **Full tree (incl dev):** 42 advisories (2 low, 20 moderate, 18 high, 2 critical). Critical both in `happy-dom` (VM context escape RCE — test env) and `handlebars` (JS injection via AST confusion — pulled in by `@redocly/cli@1.34.11`). Highs include `undici` (WebSocket parser crash + memory), `vite` (fs.deny bypass + arbitrary file read via dev-server WS), `rollup` (path traversal), `minimatch` (ReDoS), `fastify` (content-type bypass — transitive), `lodash` (`_.template` code injection — transitive via older tooling). All dev-tree; no prod exposure.

---

## Appendix: data provenance

- TD list: `docs/TECH_DEBT.md` HEAD as of 2026-04-21 post-TD-R091 close.
- Coverage: `sh scripts/with-go.sh test -cover ./...` (Go 1.25) + `sh scripts/with-uv.sh run pytest --cov=src` (after installing `pytest-cov` locally — not yet in `pyproject.toml` dev deps).
- Deps: `go list -m -u all` / `uv pip list --outdated` / `pnpm outdated --recursive` / `pnpm audit` / `govulncheck ./...`.
- Code smells: bounded repo walk of `apps/api/internal/handlers/`, `apps/api/internal/middleware/`, `apps/api/internal/server/`, `apps/api/internal/domain/`, `apps/ai/src/ai_service/`. Not exhaustive.
- MVP blockers: `docs/03_ROADMAP.md` + `docs/UI_BACKLOG.md` + direct grep for provider/client presence in `apps/api/internal/clients/`.
