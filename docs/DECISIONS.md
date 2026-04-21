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

## 2026-04-21 — CORS middleware: implicit → allowlist (PR #54 + #55)

**Decision.** Core API теперь несёт Fiber v3 `cors.New()` как первый
middleware после `RequestID` / `RequestLog` и до Auth. Exact-origin
allowlist из env var `ALLOWED_ORIGINS` (CSV → `envconfig` сплитит в
`[]string` нативно). `AllowCredentials: true`, поэтому wildcard `*`
недопустим — origins должны совпадать посимвольно (без trailing
slash). `ExposeHeaders` покрывает 10 scope-cut `X-*` (PO_HANDOFF §6) +
`X-RateLimit-*` + `X-Request-ID` — web client читает их через
`onRateLimitHeaders` hook (PR #50). Preflight OPTIONS возвращаются 204
самим middleware — Auth их не видит. `/health` + `/metrics` + webhooks
no-op'ятся потому что Fly / Clerk / Stripe не шлют `Origin` header.

**Почему allowlist, а не `*`.** Финансовое приложение, в будущем
ходим через Clerk cookies (credentials mode); браузер игнорит `*` +
credentials комбо. Также `*.vercel.app` отклоняется — attacker
регистрирует `evil.vercel.app` и читает user data.

**Ship chain.** PR #54 (`adad1a1`, 2026-04-20) — middleware + config +
тесты. PR #55 (`f1b5799`, 2026-04-21) — golangci-lint hotfix
(`bodyclose`×2 + `noctx`×2) в новом `cors_test.go`. Оба PR смёрджены
squash. Подробности — `merge-log.md`.

### Incident: PR #54 admin-bypass merge with red CI

**What happened.** PR #54 был смёржен с failing `Go — lint + vet +
build + test` check. 4 golangci-lint issue: два `bodyclose` (missing
`defer resp.Body.Close()` после `app.Test()`) и два `noctx`
(`httptest.NewRequest` вместо `NewRequestWithContext`). `go vet` +
`go test -short` локально были зелёные; lefthook pre-push hook
прогоняет `gofmt` / `go vet` / `typecheck` / `py-mypy`, но не полный
`golangci-lint run`. CC не запустил его вручную перед push. PO
смёржил PR despite red check, доверившись GAP REPORT про "все тесты
зелёные". Hotfix ушёл в PR #55 (cherry-pick уже готового коммита
`d3f674a` из мёртвой `feature/api-cors`).

**Classification.** Admin-bypass под TD-006 — incident трассируем, но
это был сценарий "single red check после approval", не P1 hotfix.
Повторное использование нормализует policy violation, поэтому ниже
две TD-записи для предотвращения.

### TD-077 (high) — lefthook pre-push gap: golangci-lint not run locally

> Renumbered 2026-04-21: original draft использовал TD-076, но этот ID уже занят «Contract sync test» (PR C, 2026-04-20). Сохраняем policy в TECH_DEBT.md под TD-077.

`lefthook.yml` pre-push hook сегодня: `typecheck` + `go-vet` +
`py-mypy`. Этого мало: категории `bodyclose`, `noctx`, `errcheck`,
`gocritic`, `revive` ловятся ТОЛЬКО на CI. Добавить
`tools/scripts/hook-golangci-lint.sh` + entry в pre-push. Опция:
запускать только на staged Go файлах через `{staged_files}` или
`--new-from-rev=origin/main`, чтобы не гонять full lint каждый push.
**Owner:** backend lead. **Revisit:** after next Go-touching PR —
подтвердить что incident не повторяется.

### TD-078 (high) — policy: `gh pr checks <N> --watch` обязателен перед `gh pr merge`

> Renumbered 2026-04-21: см. note в TD-077 выше — оригинальный draft TD-077 → TD-078 для консистентности с TECH_DEBT.md.

Сейчас CC и PO в разных сессиях могут одновременно одобрить merge без
синхронизации с CI. Admin-bypass должен быть **явным** решением
(`--admin` flag + inline comment с reason), не молчаливым default'ом
когда кто-то торопится. Политика: перед `gh pr merge` обязательный
`gh pr checks <N> --watch` до all-green; если красный — hotfix flow.

## 2026-04-21 — Accounts soft-delete pattern + FK mismatch deferred (TD-079)

**Context:** TASK_07 Slice 4a (Manual Accounts CRUD) wires the Web UI to
`DELETE /accounts/{id}`, which is soft-delete by contract (handler sets
`deleted_at`, OpenAPI spec: "Historical transactions remain for accurate
snapshot reconstruction"). Pre-flight surfaced that the schema-level FK
`transactions.account_id REFERENCES accounts(id) ON DELETE CASCADE`
contradicts that contract if a hard DELETE ever hits `accounts`.

**Decision:** Slice 4a consumes the handler's soft-delete contract as-is.
The Delete confirm copy — "Remove «{name}» from portfolio? Trades stay
historical, portfolio recalculates without this account." — is accurate
under current behavior. FK hardening (RESTRICT or BEFORE-DELETE trigger)
is defense-in-depth against future misuse, not an immediate exploit;
filed as **TD-079 (P3)**.

**Why not fix now:** out of Slice 4a scope (web-only slice), and a schema
change needs a backend slice + migration review. Noted here so the next
engineer touching account lifecycle sees the constraint and does not
silently rely on CASCADE.

**Related:** TD-079 in TECH_DEBT.md; `apps/api/internal/handlers/accounts_mutations.go:183`; `apps/api/db/migrations/20260418120001_initial_schema.sql:72`.

## 2026-04-21 — AccountConnectCard not reused for manual accounts list (Slice 4a)

**Context:** `packages/ui/src/domain/AccountConnectCard.tsx` exists and was
considered for the `/accounts` list row. Inspection showed it is an OAuth
"connect broker" card (Connect / Disconnect buttons, provider logos,
statuses `connected / not_connected / syncing / error`) — semantics built
around live broker connection flows (SnapTrade, Binance, Coinbase) that
Slice 4a explicitly does **not** cover (those are blocked on TD-046 and
scheduled for Slice 4b / 4c).

**Decision:** Slice 4a ships a local `AccountListItem` component in
`apps/web/src/components/accounts/`. Forcing the manual flow into
`AccountConnectCard` would have required stretching its prop surface
(hiding Connect/Disconnect, adding Rename/Delete kebab, adding "Manual"
status) and leaving a misleading name for Slice 4b when real broker
cards land beside manual rows.

**Follow-up:** when Slice 4b introduces broker accounts in the same list,
consider a unified `AccountListItem` that branches on `connection_type`
rather than reusing the domain card. Re-evaluate at that point.
