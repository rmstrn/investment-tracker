# Engineering decisions log

A running log of non-obvious engineering decisions: what was decided, why,
and when we plan to revisit. Newest entries at the bottom.

## 2026-04-19 — Dependency upgrade policy

Until post-MVP (after first production deploy), we PIN current majors for all
tooling. Dependabot is configured to auto-PR minor/patch only; majors are
bulk-upgraded once per quarter in a dedicated "upgrades" sprint.

Reason: pre-launch stability > latest features. Mid-build major bumps cost
more than they return.

Owner of quarterly upgrade pass: project lead.
First review: post-MVP launch + 2 weeks.

## 2026-04-19 — API listen address configurable via env

Default API port moved from `:8080` to `:8090` and made configurable via
`API_LISTEN_ADDR` in `.env.local`. Triggered by a port collision with a
system Java process during local dev.

Reason: hardcoding ports leaks onto contributor machines; `:8080` is too
popular. Env-driven config is cheap and future-proof.

Pattern: any bind-address or external-service URL goes through the
`envOr(key, default)` helper in `apps/api/config/config.go`. Document in
`.env.example` with a sensible default.

Owner: backend lead. Revisit: never (this is just how we do it).

## 2026-04-19 — Design tokens subpath exports require types + build-on-install

`@investment-tracker/design-tokens` exposes subpaths (`./brand`, `./color`,
etc.). Original `package.json` declared these as plain strings — JS-only.
TypeScript in a fresh CI checkout couldn't resolve the types and failed
`tsc` with TS2307 across downstream packages.

Decision:

1. Every subpath in `exports` uses the full object form:
   ```json
   "./brand": { "types": "./dist/brand.d.ts", "default": "./dist/brand.js" }
   ```
2. `typecheck` script depends on a built `dist/` — it runs `node build.js`
   first, so artifacts exist before `tsc` runs downstream.
3. `prepare` hook runs `pnpm build` on `pnpm install`, so contributors
   never hit "module not found" after a clean clone.

Pattern: applies to any package we publish internally that has subpath
exports. Codified in the design-tokens package; other packages follow the
same shape when they add subpaths.

Owner: web lead. Revisit: only if the build step becomes slow enough to
matter on fresh installs.

## 2026-04-19 — Admin merge bypass policy

`gh pr merge --admin` is allowed under one condition only: the CI failure
on the PR is documented pre-existing on `main` AND a green-main fix is
either already merging in parallel or explicitly queued.

Never for:
- genuine regressions introduced by the PR
- "convenience" to skip a slow check
- to unblock a PR whose own tests are failing

Every admin merge must be logged in `docs/merge-log.md` with:
- PR number + title
- the specific pre-existing failure cited
- link to the green-main fix PR (or a TODO with owner + date)

This came out of wave 1 where we used `--admin` for PRs #29, #30, #31
because of pre-existing biome + setup-uv failures unrelated to the PRs;
PR #32 brought main back to green and closed that window.

Owner: project lead. Revisit: if we use `--admin` more than once per
quarter, the CI hygiene process itself needs attention.

## 2026-04-20 — `ai_usage` ledger: Core API is single-writer

**Decision:** записи в `ai_usage` table делает **только Core API**, синхронно,
в той же DB transaction что и INSERT последнего assistant message в
`ai_messages` (после SSE `message_stop` frame). AI Service (Python)
**не пишет** в `ai_usage` через RPC к Core API.

**Context:**
- TASK_05 § 7 исходно показывал `await core_api.record_ai_usage(...)` из
  Python — AI Service делал RPC после Anthropic response.
- TASK_04 B3-ii-b plan (2026-04-20) закладывает Core API synchronous
  DB write после `message_stop` в `/ai/chat/stream` handler.
- Если оба пишут — дубликаты в ledger, биллинг завышен x2, audit broken.

**Почему Core API owner:**
1. Core API уже владеет остальными usage counters (`usage_counters` table
   для daily rate-limit cap). Single service owns all billing/usage writes.
2. Core API имеет атомарный DB transaction вокруг message persist +
   ai_usage insert — если transaction упадёт, всё откатится.
3. AI Service был owner только потому что ему «удобнее» — слабый аргумент
   против consistency риска.
4. Когда в будущем появится billing reconciliation job, он смотрит в одно
   место.

**Consequences:**
- AI Service `record_ai_usage` вызов + HTTP client method **удаляются**
  в отдельной TASK_05 cleanup PR (~50-150 LOC).
- TASK_05 cleanup PR **блокирует merge** B3-ii-b (Core API write path
  для chat). B3-ii-a можно мержить независимо.
- AI Service всё ещё возвращает usage данные (input_tokens, output_tokens,
  model) в SSE `message_stop` payload — Core API извлекает их оттуда
  для INSERT в `ai_usage`.

**Owner:** backend lead (Core API) + AI lead (Python removal).
**Revisit:** при next billing schema change (e.g. multi-model pricing,
partial turn billing). Не ранее MVP launch.

## 2026-04-20 — Core API Fly.io deploy (PR C)

PR C ships the first real deploy infrastructure for `apps/api` —
Dockerfile, fly.toml (prod + staging), GitHub Actions pipeline, k6
smoke suite, Doppler-driven secrets, `RUNBOOK_deploy.md`. Preflight was
written against an empty slate; the repo already carried TASK_01/A
bootstrap (alpine base, `cmd/api`/`cmd/workers` split, `doppler-sync.yml`,
manual `deploy-api.yml`). The decisions below capture why we filled the
gaps rather than rewriting what was there.

**Alpine base image, not distroless.** Distroless would shrink the
final image by ~10 MB and cut the shell-shaped attack surface, but the
committed Dockerfile has been alpine since day one — switching mid-wave
risks breaking implicit TASK_01/A assumptions (CGO edge cases, debug
convenience via `fly ssh console`) for a marginal security gain.
Revisit only if the security team mandates it; not treated as debt.

**Doppler as single source of truth for secrets.** `doppler-sync.yml`
was already committed, so PR C builds on that rather than introducing a
parallel `ops/secrets.env.template` flow. The CD pipeline asserts the
invariant via `ops/scripts/verify-prod-secrets.sh` (Fly secret names
diff against `ops/secrets.keys.yaml`) but never touches values — value
propagation stays a `doppler-sync.yml` manual dispatch.

**Single region `fra` for MVP.** Neon prod and Upstash prod both live
in `eu-central-1`; matching with a single Fly region gives <5ms intra-
region latency, the simplest failure mode, and the cheapest bill.
Multi-region is TD-061 for ~1k paying users.

**Rolling deploy strategy, not blue-green.** Rolling is Fly's default
for stateless HTTP with `min_machines_running ≥ 2` and gives zero-
downtime with half the complexity of blue-green. SSE streams can drop
mid-deploy; `EventSource` auto-reconnects and the tee-parser persists
content up to the drop. Blue-green for SSE safety is TD-064 if the
drop becomes a real incident.

**`migrate` subcommand with `release_command`, not ephemeral machine.**
`release_command = "/app/api migrate up"` runs in an ephemeral VM
before the rolling swap. If migrations fail the deploy aborts — new
code never meets old schema. The alternative (ephemeral `fly machine
run "goose up"` in the workflow) decouples migrations from deploy and
opens an "old code against new schema" window that is exactly the
incident we are trying to prevent. Cost: ~130 LOC subcommand + tests.
DATABASE_URL is the only env the subcommand reads — it does not need
config.Load's full Clerk/Stripe/Polygon surface, so migrations stay
runnable before every machine secret is provisioned.

**Workers deploy target removed from `workflow_dispatch`.**
`cmd/workers/main.go` is still a 30-second heartbeat placeholder.
Shipping it to prod by a click-mistake would masquerade as healthy
worker coverage while real enqueued tasks silently drop. PR D restores
the target along with a real asynq consumer; tracked as TD-066 so the
re-enable is a PR D prerequisite, not a wishlist item.

**Health path fix: `/healthz` → `/health`.** fly.toml's bootstrap
healthcheck pointed at `/healthz`; the handler has always registered
`/health` (server.go:48). First deploy would have marked every machine
unhealthy on 404. Handler registration is source of truth; the fly
config is the bootstrap artefact to align.

**`/metrics` on the same public port.** Prometheus default registry
(go_* + process_*) exposed at `/metrics` is scraped by Fly's
[metrics] block from private 6PN. The same path is externally
reachable on the app port, which is acceptable at MVP — default
collectors leak process telemetry only. Custom app metrics
(request_duration, pgx pool gauges) are out of scope; they land when a
Grafana dashboard actually reads them.

**Separate `fly.staging.toml` rather than parameterised fly.toml.**
Staging gets cheaper knobs (`min_machines_running = 1`,
`auto_stop_machines = "suspend"`) that prod cannot afford (SSE cold
starts would be user-visible). Two small committed files beat a single
parameterised toml + envsubst layer — the divergence is small, rare,
and better reviewed visually.

**Owner:** backend lead.
**Revisit:** first prod deploy + 7 days. If rolling deploys, the
Doppler flow, or the `release_command` path produce incidents, re-open
relevant sub-decisions; otherwise consolidate at next review post-first-
enterprise customer.
