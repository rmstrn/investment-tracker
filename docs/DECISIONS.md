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

## 2026-04-21 — Paywall demo triggers deferred to Slice 7c (PR #58)

Slice 7a+7b kickoff (`docs/CC_KICKOFF_task07_slice7ab.md` § 3 Step 3)
просил добавить в `(app)/dashboard` dev-only триггер для `PaywallModal`
— чтобы "показать что paywall физически работает, не только в
playground'e". В GAP REPORT PR #58 CC предложил резать этот шаг, PO
одобрил.

**Decision.** Paywall wiring в `(app)` routes (trigger points → modal
→ `/pricing`) отложен до Slice 7c, где приходит Stripe checkout +
реальные DB-backed usage counters.

**Reason.**
1. `PaywallModal` уже экспонируется в `/design/freemium` (Slice 3
   merge) — ещё один demo-триггер в `(app)/dashboard` дублирует, а
   не расширяет покрытие.
2. Без реальных feature-gates это dev-only fake — триггер на кнопке
   без backing-логики. Когда придёт 7c с реальной AI-rate-limit /
   accounts-over-limit / CSV-export проверкой, этот fake всё равно
   переписывается целиком.
3. Scope 7a+7b уже жирный: `(marketing)` route group + landing + 3-tier
   pricing + 8 Vitest specs + middleware update. Лишний wiring
   размывал бы review и увеличивал blast radius PR.

**Tracked as TD-080** в `TECH_DEBT.md`. Конкретные trigger-точки
перечислены там. TD-080 depends TD-057 (Stripe catalog) + TD-053
(per-day insight tier gate) + real DB-backed usage counters (будет
заведён отдельно с 7c kickoff).

**TD-ID note.** TD-079 в этот момент был зарезервирован параллельной
CC #1 сессией (Slice 4a — accounts FK CASCADE / soft-delete mismatch);
поэтому этот ADR и TECH_DEBT.md используют TD-080, а не TD-079. Когда
CC #1 merge'нется раньше — их TD-079 уже живёт выше в файле; когда
позже — они добавят TD-079 append'ом, оба coexist.

**Revisit.** Когда 7c уходит в scope — проверить список triggers в
TD-080: не устарел ли, не нужно ли добавить новые точки (например,
alerts по new surface'ам из 8-й волны).

## 2026-04-21 — Transactions UI: single form-dialog + datetime-local fallback (Slice 5a)

**Context.** TASK_07 Slice 5a (PR #60) шип'ит manual CRUD для transactions на
Position Detail. Kickoff open question #2 явно спрашивал single `TransactionFormDialog`
с `mode` prop vs два отдельных компонента (`AddTransactionDialog` + `EditTransactionDialog`);
open question #3 — shadcn Calendar / DateTimePicker vs `<input type="datetime-local">` fallback.

**Decision 1 — single `TransactionFormDialog` с `mode: 'create' | { kind: 'edit'; transaction }`.**
- Edit-mode locks fields которые API не accept'ит на PATCH (`account_id` / `transaction_type` /
  `symbol` / `asset_type` / `currency`) через `disabled` prop на `NativeSelect` — это декларативно
  и не требует двух разных tree'ев.
- Diff-only PATCH: `diffToUpdateRequest` сравнивает formState с initial snapshot и шлёт только
  реально изменённые поля. Avoids no-op PATCH + explicit about intent.
- Shared validation + shared field-rendering (`TransactionFormFields` subcomponent) — DRY.
- Duplication cost от 2 компонентов превышает lock-prop cost.

**Decision 2 — `<input type="datetime-local">` fallback, no shadcn Calendar.**
- shadcn не установлен; добавление Calendar + Popover — extra surface area для MVP slice.
- HTML5 `datetime-local` daje локальную wall-clock семантику что и нужно ("когда произошёл trade
  в моём часовом поясе"). Submit конвертирует через `new Date(value).toISOString()` в RFC3339 UTC
  (бэк парсит RFC3339).
- Вход получает `Input` styling через `type="datetime-local"` prop (no extra component).
- Edge case — Safari <14.1 не поддерживает `datetime-local` (fallback на text input). MVP
  audience — evergreen browsers, acceptable.

**TransactionUpdateRequest no-null limitation** (не отдельный ADR, но важная nuance).
Если юзер очищает `price` или `fee` в edit-mode, PATCH body эти поля **не включает** — спека
не позволяет отправлять `null` (OpenAPI `TransactionUpdateRequest.additionalProperties: false`,
fields без nullable union). Silent no-op acceptable: backend value остаётся как было. Если
в будущем понадобится real clearing, потребуется backend change + spec update.

**Why not form library** (React Hook Form / Zod). Scope 5a — 7 полей с простой validation;
raw `useState` + inline `validate(state)` помещается в 2 helper'а (`validatePrice`,
`validateExecutedAt`) и соответствует паттерну `AccountFormModal` (Slice 4a). Добавление RHF —
новая зависимость для первого form'а слайса; оправдано когда у нас 3+ форм с nested arrays.

**Owner.** Web lead. **Revisit.** При добавлении 3-й сложной формы (Settings Slice 8), либо
при появлении nested form state (Slice 6b insight action settings).

## 2026-04-21 — Transactions UI: Idempotency-Key auto-inject + fingerprint safety-net (Slice 5a)

**Context.** Kickoff open question #5 спрашивал: `Idempotency-Key` фиксируется на lifecycle
dialog'a (Stripe-style: один user intent = один key, retry того же intent возвращает cached
response) vs regenerated per submit (middleware в `createBrowserApiClient` injects `crypto.randomUUID()`
на каждый mutating request).

**Decision — accept auto-inject middleware behavior; backend fingerprint + isPending button
disable = safety net.**
- Existing middleware в `packages/api-client/src/index.ts:60` генерит новый key на каждый
  POST/PATCH/DELETE. Работает из коробки с Account CRUD (Slice 4a) — не переписываем на один
  slice.
- Accidental double-tap уже blocked через `disabled={submitting}` на submit button + `isPending`
  флаг от TanStack Query mutation.
- Backend `transactions_mutations.go:106` emits `DUPLICATE_TRANSACTION` 409 через fingerprint
  dedup (account/symbol/qty/price/type/minute). Frontend маппит к юзер-понятной "looks like
  a duplicate" toast.

**Failure mode acknowledged.** Network failure после того как request ушёл на сервер и сервер
принял (response потерян в transit) → re-submit сгенерит новый Idempotency-Key → backend не
увидит его как retry. Если fingerprint совпал (same minute + same values) — 409, duplicate
prevented. Если fingerprint разошёлся (юзер поправил поле между попытками на ms-уровне) —
duplicate row возможен. Не критично для MVP manual flow; если словим в alpha → open новый TD
под proper fixed-key lifecycle (Stripe pattern).

**Why not fixed-key per-dialog now.**
- Требует bypass существующего middleware через per-call header override, либо отдельный
  api-client instance на dialog.
- Stripe-pattern ценен когда payload detministic и cacheable на сервере (Stripe сохраняет
  first-response на 24h). У нас `Transaction` create каждый раз новая fingerprint (executed_at
  timestamp разный), поэтому cached replay даёт limited value.
- MVP cost-benefit: замедляет 5a + complex test surface за edge-case защиту от very-rare network
  failure mode.

**What we'd do if we reopened.** Переписать `createBrowserApiClient` так что mutation hooks
могут optional-овски pin'ить key через `options.idempotencyKey` (TanStack mutation variables),
fallback на auto-random. Это аккуратно без breaking existing Slice 4a callers.

**Owner.** Web lead. **Revisit.** Если получим alpha incident с duplicate row от network-lost
edge case, либо если добавится critical mutation где idempotency критична (e.g. Stripe Checkout
в 7c — там уже cost-benefit flip'нется в favor of fixed key).

## 2026-04-21 — AI Service staging deploy topology (TD-070)

**Context.** UI Slice 6a (Insights read-only) и последующий prod soak перед
404-swallow flip (`RUNBOOK_ai_flip.md`) требуют long-lived staging AI Service.
Core API staging уже живёт на `api-staging.investment-tracker.app` (PR C + CORS
slice). AI Service Dockerfile + production `apps/ai/fly.toml` есть с TASK_05, но
staging-аналога не было — `AI_SERVICE_URL` в Core API staging Doppler указывал
на `http://investment-tracker-ai-staging.internal:8000`, где нет listener'а,
результат — 503 на `/ai/chat/*` и `/ai/insights/*` (agreed degrade, TD-070).

**Decision.** Отдельный Fly app `investment-tracker-ai-staging`, отдельная
Doppler config `stg` в project `investment-tracker-ai`. Ключевые параметры
`apps/ai/fly.staging.toml`:

- `app = "investment-tracker-ai-staging"`, `primary_region = "fra"`.
- `ENVIRONMENT = "staging"`, `LOG_LEVEL = "INFO"` в `[env]`.
- `min_machines_running = 1` (не 0 как в prod) — UI smoke / демо не должны ловить
  cold-start; staging traffic всё-равно bursty, `auto_stop_machines = "suspend"`
  держит idle cost низким (~$2-3/мес на 1 suspended machine).
- Anthropic model IDs (`ANTHROPIC_MODEL_SONNET|HAIKU|OPUS`) захардкожены в `[env]`,
  **не** в Doppler. Причина: Fly secrets override `[env]` — если модели живут в
  Doppler и кто-то случайно зальёт туда устаревший ID, он silently вытеснит
  explicit pin в toml. Explicit in diff > silently overridable.
- 4 required secrets в Doppler stg (manifest: `apps/ai/secrets.keys.yaml`):
  `INTERNAL_API_TOKEN`, `ANTHROPIC_API_KEY`, `CORE_API_URL`,
  `CORE_API_INTERNAL_TOKEN`. `ENCRYPTION_KEK` — не нужен (AI Service — proxy к
  Anthropic, не envelope-шифрует; KEK живёт только в Core API).

**Bridge invariant.** `AI_SERVICE_TOKEN` в Core API staging Doppler ≡
`INTERNAL_API_TOKEN` в AI Service staging Doppler (одно и то же значение, две
стороны bearer-пары). Сейчас охраняется руками PO в runbook § 5; automated drift
check зарезервирован как **TD-082** (open'ится как реальный TD когда AI Service
будет готовиться к prod flip).

**Manifest path asymmetry.** Core API manifest лежит в `ops/secrets.keys.yaml`
(legacy shared-ops путь), AI — в `apps/ai/secrets.keys.yaml` (per-service).
Future uniformity question (перенести Core API manifest в `apps/api/` тоже) —
out of scope. `ops/scripts/verify-prod-secrets.sh` генерализован через
`KEYS_FILE="${KEYS_FILE:-<default>}"` fallback (1-line patch) — backward-compat
для существующего Core API callsite ✅. Новый `ops/scripts/verify-ai-secrets.sh`
— thin shim: экспортит `KEYS_FILE=apps/ai/secrets.keys.yaml` и `exec`'ает
generic script. Zero duplication.

**Deploy workflow.** `.github/workflows/deploy-ai.yml` переработан из single-job
на prod в `workflow_dispatch` с input `environment: staging|production`
(default = staging). Job вычисляет `FLY_APP` + `FLY_CONFIG` из input,
pre-deploy runs `verify-ai-secrets.sh`, затем `flyctl deploy --remote-only`.
Две-jobs отдельные staging/prod отклонены как DRY violation — AI pipeline
не имеет k6, release_command миграций или approval gate (в отличие от
`deploy-api.yml`). Workflow — alternative к ручному `flyctl deploy` в runbook
§ 6, **не** заменяет § 2 (`flyctl apps create`) + § 4 (Doppler provisioning) +
§ 5 (Core API bridge update); если PO запустит workflow до их выполнения,
verify-secrets упадёт на пустом Fly app — нормальная защита.

**Consequences.**
- Staging idle cost ~$2-3/мес (1 suspended machine, `min_machines_running=1`).
- Anthropic API key shared между dev/stg/prd на старте — low staging traffic
  делает rotation overhead нецелесообразным; rotate'ить к staging-specific
  key если abuse/cost pattern появится.
- Sentry/PostHog на staging optional — не блокируют deploy.
- Slice 6a разблокируется после PO runtime deploy + smoke (runbook § 2-7).

**Alternatives considered.**
1. `[deploy.env.staging]` в том же `fly.toml` — Fly не поддерживает
   multi-environment в одном конфиге, отклонено.
2. `min_machines_running = 0` + cold-start terpeть — отклонено из-за UX удара
   на демо: первый hit после idle = +5-15 сек задержки, frontend insights
   list выглядит broken.
3. Staging-specific Anthropic key — deferred; нет инцидентов с shared key,
   low traffic не оправдывает provisioning overhead.
4. Модели в Doppler как secrets — отклонено (см. выше про Fly override).

**Scope-adjacent change.** `ops/scripts/verify-prod-secrets.sh` получил 1-line
generalization (`KEYS_FILE="${KEYS_FILE:-<default>}"`) чтобы AI shim мог
override'ить путь без дублирования парсера. Regression risk = near-zero
(существующий Core API callsite не передаёт env → default branch, поведение
идентично). Flag'нуто в PR description отдельным bullet'ом.

**Owner.** Infra + PO (runtime ops). **Revisit.** Когда TD-082 opened для
prod flip — formalize bridge drift check в CI.

## 2026-04-21 — `verify-prod-secrets.sh` generalized via KEYS_FILE env override

Minor refactor: `ops/scripts/verify-prod-secrets.sh` теперь читает манифест из
`KEYS_FILE` env-var с fallback на исторический путь
(`${SCRIPT_DIR}/../secrets.keys.yaml`). Backward-compat для существующего
Core API caller — он env-var не передаёт, fallback → тот же путь → то же поведение.

**Why.** Позволяет per-service shim'ам (первый — `verify-ai-secrets.sh`) выбрать
собственный манифест без дублирования 50 строк YAML-парсинга + flyctl diff
logic. Когда/если добавятся web-client secrets или worker-specific secrets —
та же shim-модель.

**Not done (intentional).** Не переписываю `verify-prod-secrets.sh` в generic
`verify-secrets.sh` с required `KEYS_FILE` — лишний touch на прод-критичный
Core API deploy path ради cosmetic rename. Fallback-путь работает, имя
`verify-prod-secrets.sh` не врёт (когда вызывается без env — это именно Core API
prod secrets). Future cleanup = low-priority P3.

**Owner.** Infra. **Revisit.** Если per-service shims умножатся > 3 — rename
в `verify-secrets.sh` + update всех callers.

## 2026-04-22 — Slice 6a: local sessionStorage dismiss — rationale (PR #64)

**Context.** Kickoff §Decomposition §3 + acceptance criteria уточняют: в Slice 6a dismiss карточек НЕ вызывает `POST /ai/insights/{id}/dismiss`. Вместо этого — `sessionStorage` только на клиентской стороне; на reload страницы dismiss сбрасывается.

**Decision.** `useLocalDismissedInsights` хранит `Set<string>` в React state + mirrors в `sessionStorage` (key `insights.dismissed.v1`). sessionStorage (а не localStorage) — чтобы юзер при следующей сессии видел актуальный список инсайтов с бэка, и не путался что инсайт "есть" на бэке но "исчезает" в UI. Hydration-safe: read из sessionStorage только в `useEffect`, initial render = empty set.

**Trade-off acknowledged.** Dismiss feedback временный — после reload карточка возвращается. Это явно коммуницируется UI copy (не показываем "Dismissed" label, dismiss просто убирает карточку). Слайс 6b заменит это на реальный `POST dismiss` + invalidate query + persistent `dismissed_at` на бэке.

**TD-090.** `InsightData.action_url` читается через runtime cast (`as { action_url?: string }`). Typed oneOf — Slice 6b scope.

**Owner.** Web lead. **Revisit.** Slice 6b — заменить на backend mutation + invalidate TanStack query cache.


## 2026-04-23 — Read-only is NOT a primary positioning differentiator

Earlier `docs/product/02_POSITIONING.md` included «read-only» as one of the unique attributes and part of the anti-positioning. PO observation 2026-04-23: read-only is not a differentiator — every non-trading tracker claims it or is implicitly so. Competitors will also use this line in their own copy; it will become table stakes, not a wedge.

**Decision.** Demote «read-only» from the unique-attributes list. Keep the FACT («we only read broker data, we don't place trades») inside functional descriptions and trust sections, but not as a hero-level differentiator or landing angle.

**Implication for the wedge.** The real differentiator is the combination of (chat-first UX + proactive weekly insights + behavioral coach on actual trade history + source-cited AI + US+EU+crypto in one product + no HNW gate + no advisor upsell). «No trading execution» supports this, but doesn't lead it.

**Action.** Flagged in `02_POSITIONING.md` pending v2 discovery research (in progress by user-researcher, 2026-04-23). Positioning document will be revised after v2 discovery lands.

**Owner.** Navigator (positioning owner). Revisit: after user-researcher delivers v2 discovery report.

## 2026-04-23 — Naming criteria refined

After four rejected rounds, PO added criteria 2026-04-23:
- Length: 1 word ideal, 2 words max
- Memorable + meaningful (not generic abstract, not descriptive)

PO explicitly cannot provide reference brands («какие бренды нравятся по звуку»). Calibration must come from within these new criteria rather than reverse-engineered vibe.

**Previously rejected directions** (still off-limits, tracked in `docs/product/03_NAMING.md`):
- Short imperative verbs: Ask, Tap, Hey, Reply, Know, Tell
- Ask creative spellings: Asq, Yask, Aska, Asko
- Portfolio/folio roots: Folio, Foli, AskFolio, Trove, Stack
- First-pass evocative trio: Delphi, Koan, Vessel

**Action.** `brand-strategist` next dispatch will operate on: 1-2 words, memorable + meaningful, avoiding rejected directions. No reference-brand calibration available — rely on archetype (Magician + Everyman) + locked positioning + bilingual pronounceability.

**Owner.** brand-strategist (naming-doc owner). Revisit: next naming round kickoff.

## 2026-04-23 — PortfolioPilot regulatory structure correction: hybrid, not pure RIA

**Context.** Earlier working assumption (implicit in v1 discovery + lumped framing in v2 wedge table) treated PortfolioPilot as a pure-RIA product with the «Complete financial advice» hero as uniform advisor framing. Evidence pulled from globalpredictions.com/disclosures (fetched 2026-04-23) invalidates that shortcut.

**Correction.** PortfolioPilot operates under a **hybrid regulatory structure** — a real-world implementation of what `STRATEGIC_OPTIONS_v1.md` calls Lane C:

- Public site + Free tier = **education-only**, explicitly not advice (verbatim: «Nothing on the publicly available portions of the Platform should be construed as a solicitation or offer, or recommendation, to buy or sell any security»).
- Paid tiers (Gold $20 / Platinum $49 / Pro $99) = **SEC-registered RIA** under a written Client Agreement (Global Predictions Inc., Form ADV, Form CRS).
- Marketing copy («Complete financial advice for self-directed investors») is legally scoped by the disclosure: the «financial advisor» reference is to the user themselves, not a human advisor the product pretends to be.

**Implication — de-risks Lane C as a strategic option.** Lane C was described in `STRATEGIC_OPTIONS_v1.md` as hypothetical with a real risk of «split brand reads dishonestly». PortfolioPilot's $30B AUM / 40K users confirm the split-narrative structure scales in practice with compliance discipline (disclosure-document + paywall-gated advisor language). This does NOT add a 4th strategic option; it changes the weight of Analyst's lane-flexibility when PO evaluates the three finalists.

**Scope of this correction.** No positioning re-write. No option ranking change. Three files patched for evidence hygiene:

- `docs/product/01_DISCOVERY.md` — §4.5 added («PortfolioPilot as validated Lane C implementation»); §2.1 wedge row and §2.2 survivor list clarified (hybrid, not pure-RIA).
- `docs/product/competitor-matrix.md` — PortfolioPilot row + Origin/Mezzi/Range peers got regulatory-structure sub-rows; §8 summary got Lane A/B/C split.
- `docs/product/STRATEGIC_OPTIONS_v1.md` — Lane C description updated with validation evidence; Option 2 (Analyst) regulatory-lane section expanded; Q6 decision aid + council resolution notes updated.

**No council re-run recommended.** The evidence sharpens a descriptor (Lane C = validated, not hypothetical) but does not overturn any of the three finalists, the ICP analysis, or the wedge framing. A re-run would return the same three options with the same rankings; only Analyst's Lane C attractiveness marginally improves.

**Owner.** Navigator. Revisit: next strategic-options pick session or if user-researcher surfaces additional regulatory evidence for other competitors (Origin, Mezzi primary docs not yet fetched).

## 2026-04-23 — Regulatory lane LOCKED: Lane A (information/education only)

**Context.** `STRATEGIC_OPTIONS_v1.md` regulatory-lane axis offered three deliberate stances: Lane A (information/education), Lane B (SEC RIA from day 1 — Origin path), Lane C (hybrid — launch A, add RIA Pro-tier post-alpha, validated by PortfolioPilot at $30B AUM / 40K users). Each lane is a deliberate choice with downstream consequences for roadmap, compliance cost, and competitive positioning.

**Decision.** PO 2026-04-23 locks **Lane A**. Lane B and Lane C are explicitly REJECTED for this product (not just deferred). PO rationale, verbatim: «я все же не уверен что хочу давать прям советы на покупку, мне нравится "информационное"».

**Rationale.**
- Product philosophy prefers information-only framing end-to-end, not just at launch (so Lane C hybrid path also excluded by same reasoning).
- Lane A coherent with anti-advisor anti-upsell positioning already locked in `02_POSITIONING.md`.
- Zero compliance friction, zero launch delay — no SEC registration path, no Form ADV, no CCO hire, no annual audit overhead.
- Reframes «not-advisor» from regulatory caveat to positive trust signal («we're not selling you anything»).

**Implications (downstream document updates required).**
- `STRATEGIC_OPTIONS_v1.md` — mark Lane B/C as rejected; re-evaluate three options (Oracle / Analyst / Companion) under Lane-A-only constraint. Done 2026-04-23.
- `02_POSITIONING.md` — update `[PENDING-V2]` note: Lane A locked (not pending); extend anti-positioning with «NOT registered investment advisor — information/education only».
- `01_DISCOVERY.md` — add wedge-reassessment subsection for Lane-A-only constraint; main direct competitor shifts from PortfolioPilot (Lane C, different tier) to Getquin (Lane A, 500K users, EU-dominant, multi-lang, AI Financial Agents).
- Option ranking shifts: Companion moves from «strong-but-risky» to strongest defensible wedge (zero direct competitor on behavioral-coach-on-trade-history at Lane A + multi-market). Analyst weakens (lost Lane-C tier-progression moat). Oracle holds with increased Getquin pressure.

**Regulatory caveat (jurisdictional variance).** Lane A across jurisdictions is NOT uniform:
- US SEC: «education vs advice» distinction governed by Investment Advisers Act 1940 + SEC guidance
- EU MiFID II: «investment information» vs «investment advice» (different line drawn than US SEC)
- UK FCA: PERG 8 guidance on personal recommendations vs generic information
- Russia Bank of Russia: separate securities market rules (Federal Law 39-FZ) with distinct advisor registration regime

Not a launch blocker (we stay on the information side of all four lines by design), but **legal review per-jurisdiction is a post-alpha required action before launching in each market.** Tracked as post-alpha roadmap item, not immediate TD.

**Owner.** Navigator (strategic decision). Legal review per-market: post-alpha, owner TBD (likely external counsel per jurisdiction).
**Revisit.** Only if product philosophy fundamentally changes (e.g. PO later decides advice-framing is worth the compliance cost), or if regulatory landscape shifts materially in one of our target markets.

## 2026-04-23 — Geography LOCKED: global multi-market with CIS priority

> **[SUPERSEDED 2026-04-23]** Later «Option 4 review synthesis: 7 PO decisions locked» entry (Q7) removed Russia from scope. Current geography = global multi-market **без РФ**; CIS handling per-country post-alpha, not launch priority. Preserved below as historical record. See `docs/PENDING_CLEANUPS.md` item #3.

**Context.** Initial positioning (v2 discovery, `01_DISCOVERY.md`) described ICP A/B as «US primary, EU secondary» with partial CIS/RU coverage. `STRATEGIC_OPTIONS_v1.md` kept this scope implicit. PO was asked whether to narrow geography (common startup advice: pick one market, dominate, expand later).

**Decision.** PO 2026-04-23 locks **global multi-market scope.** PO rationale, verbatim: «по географии я не хочу менять, в идеале нам чем больше рынков тем лучше, так же и СНГ».

**Scope (explicit market set).**
- US (primary positioning target per ICP A)
- EU (UK + DACH + Southern Europe — head-to-head with Getquin's 500K-user EU footprint)
- UK (post-Brexit FCA jurisdiction — separate from EU MiFID II)
- CIS + Russia (explicit PO priority; near-zero direct competitor coverage in v2 discovery §10 Open research question #6)
- Crypto-native (global, jurisdiction-agnostic user segment)

**Multi-language day-1 requirement.** Global scope requires multi-language day-1, not deferrable to post-alpha. Minimum launch coverage:
- **EN + RU** (hard minimum — US primary + CIS/RU reach)
- **Likely required for competitive EU presence** (against Getquin EN/IT/DE baseline): DE + IT + ES + FR + PT

**Implications (downstream document updates required).**
- MVP scope expands: ~3-6 weeks pre-alpha content localization + i18n infrastructure + QA surface across 2-7 languages
- Content-lead dispatch widens: landing + paywall + microcopy × N languages
- Competitive pressure changes: under global + Lane A, Getquin becomes main direct competitor (not PortfolioPilot, which is Lane C US-primary). User-researcher should deep-dive Getquin specifically — EU penetration patterns, multi-lang UX approach, AI Financial Agents capability boundaries, churn vectors
- Tech-lead scope input: i18n infrastructure is explicit MVP scope, not implicit assumption. Needs kickoff decision on i18n library + content management approach

**Rationale.**
- TAM expansion: global > single-market, especially for a chat-first product where language + jurisdiction are the primary localization cost, not underlying product logic (AI chat about YOUR portfolio is structurally portable across markets)
- CIS/RU is strategic white-space: v2 discovery §10.6 flagged «near-zero evidence of competitors serving Russian-native retail investing users» — potential open market or zero demand; either way, we're the only entrant targeting it deliberately
- Crypto-native segment already global — no geography scope work needed, just explicit inclusion
- Multi-broker aggregation value-prop scales with market count (more brokers across more jurisdictions = stronger «all accounts in one view» pitch)

**Deferred (acknowledged, not locked).**
- Per-market tax reports — NOT day-1. Added to Pro tier roadmap as per-jurisdiction add-ons post-alpha.
- Per-market compliance variance under Lane A — legal review per jurisdiction is post-alpha required action (see Regulatory lane decision above).
- Specific language launch order (which 5 of EN/RU/DE/IT/ES/FR/PT in MVP vs wave 1) — TBD with content-lead + growth strategy.

**Owner.** Navigator (strategic scope). i18n infrastructure: tech-lead. Per-market legal review: post-alpha.
**Revisit.** If alpha signals indicate one market dominates user acquisition by >70%, consider narrowing content/growth focus to that market while keeping others in product. Not before alpha + 3 months of real user data.

## 2026-04-23 — Option 4 review synthesis: 7 PO decisions locked

**Context.** After v1.3 Option 4 lock, CONSTRAINTS Rule 3 process correction triggered 6 parallel independent specialist reviews (brand-strategist, content-lead, product-designer, legal-advisor, finance-advisor, user-researcher — 6/6 WARN distribution). Navigator synthesis landed in `docs/product/REVIEW_SYNTHESIS_2026-04-23.md` with a weighted recommendation (keep metaphor as tagline/brand-world, demote from hero and product-name, ship Coach with warm-start feasibility gate). PO reviewed synthesis 2026-04-23 and locked seven decisions below. This entry is the decision ledger; execution across docs lives in the parallel `docs(strategy)`, `docs(positioning)`, `docs(naming)` commits from the same day.

**Decisions locked.**

**Q1 — YES demotion. «Second Brain for Your Portfolio» becomes tagline, not hero, not product name.**
Hero reverts to imperative framing: «Спроси свой портфель» / «Ask your portfolio» (restoring the pre-Option-4-lock hero that was live and tested before the v2 rewrite). Product name sourced from Round 5 mind/memory territory; PO leaning Memoro but wants to see Round 6 before final lock. «Second Brain» lives as tagline and mid-page brand-world copy — retains strategic value (empty fintech territory, cross-category metaphor prior art) without paying the parse-test tax at hero + the Forte trademark tension at product-name. Rationale: resolves 4 of 6 specialist WARN concerns simultaneously (voice-rule violation, ICP B alienation, Forte tension, parse-time cost) without sacrificing the metaphor's downstream positioning value.

**Q2 — YES with nuance. Coach warm-start is a working assumption, not a pre-lock feasibility gate.**
PO confidence: «думаю мы сможем получить всю историю» via SnapTrade trade-history endpoints. Formal tech-lead feasibility verification happens during actual development stage (when Coach vertical is scoped), not now as a lock prerequisite. Oracle fallback (Path A, original v1.3 fallback) remains available if dev-stage verification fails. This defers the feasibility question from strategic-lock to eng-planning without pretending the risk is zero.

**Q3 — Dashboard-primary architecture with AI woven throughout. Chat is a tab, not the home.**
Rejects designer's Alt 1 (chat-primary home). Pattern is closer to Getquin / Kubera (dashboard + aggregation + tabs) with stronger AI integration — AI surfaces across dashboard cards, insights feed, coach notices — while chat lives as one of the primary navigation destinations. Full UX details (layout, dashboard card types, AI-woven interaction patterns) deferred to design phase (product-designer dispatch post-naming-lock).

**Q4 — NO trademark spend. Accept post-launch rebrand risk.**
No $2-5K US clearance search + attorney hold before name lock. Accepted risk: if a trademark conflict surfaces post-launch, rebrand. Rationale: CONSTRAINTS Rule 1 (no spend) + pre-alpha product where rebrand cost is recoverable compared to legal overhead upfront. Does not preclude later clearance when revenue makes legal spend rational; it blocks the pre-launch clearance spend specifically.

**Q5 — Teaser-paywall pattern for Coach.**
Free tier surfaces «AI noticed a pattern in your trades» as a teaser (one-line curiosity hook). Pattern details (what the pattern is, which trades, frequency, tendency direction) gated behind Plus: «Unlock details — upgrade to Plus». Design intent: FOMO + curiosity + conversion trigger stacked on a single touchpoint. Plus = full Coach (unlimited pattern-reads, full narrative). Pro = unlimited + advanced (factor analytics, tax overlay, alerts). Content-lead owns paywall copy execution post-naming-lock.

**Q6 — YES in-context AI disclaimer. Format TBD design phase.**
Footer disclaimer remains required and unchanged. Additional in-context disclaimer added specifically for EU/UK launch (stricter MiFID II + FCA requirements on investment information vs advice line). Format not pre-specified — PO suggested tooltip treatment as one possibility to minimize visual noise; product-designer will propose format candidates (inline micro-copy, tooltip, first-interaction modal, etc.) when design phase kicks off. Lane A stance locked 2026-04-23 ADR is not changed — this is an execution-layer reinforcement of the existing Lane A lock.

**Q7 — Russia out of scope. Geography updated: «global без РФ».**
Narrows the 2026-04-23 «global multi-market» lock (earlier same-day ADR): US + EU + UK + LATAM + APAC + crypto-native remain explicit; Russia removed from scope. CIS handling decided per-country post-alpha (not per-country locked here). Implication: 152-ФЗ data-localization is no longer a blocker (previously flagged as post-alpha required action under the earlier geography lock) — Russia is now explicitly out, not deferred. Rationale from PO: legal + geopolitical cost of RU-market compliance outweighs the white-space opportunity flagged in v2 discovery §10.6.

**Evidence base.** See `docs/product/REVIEW_SYNTHESIS_2026-04-23.md` for the 6 specialist returns (all commits referenced inline) and Navigator weighted recommendation. PO answers arrived after synthesis review; this ADR captures the answers as-locked.

**Implications (execution across three parallel commits, same day).**
- `docs/product/STRATEGIC_OPTIONS_v1.md` → v1.6. Status changes from TENTATIVE to LOCKED (repositioned). Option 4 reframed as tagline/brand-world, not hero/name. Hero reverts to imperative. Geography amended. See `docs(strategy)` commit.
- `docs/product/02_POSITIONING.md` → v3. `[PENDING-V2]` tags removed. Hero row reverts to imperative. Architecture row adds «dashboard-primary with chat tab + AI woven». Anti-positioning adds «NOT Personal Knowledge Management tool». Geography row removes Russia, adds LATAM/APAC. In-context AI disclaimer note added. See `docs(positioning)` commit.
- `docs/product/03_NAMING.md` → Round 6 placeholder added. Round 5 preserved. PO lean noted (Memoro) but not locked. See `docs(naming)` commit.

**What's NOT changing here.**
- Lane A regulatory lock (2026-04-23 ADR) stands. Q6 reinforces it, doesn't alter it.
- Multi-language day-1 scope narrowed to English-only launch (2026-04-23 Option-4-lock ADR) stands. Russian parallel-drafted secondary; EU languages post-launch.
- Tech-lead, brand-strategist Round 6, content-lead, product-designer dispatches sequencing: Round 6 naming is in flight in parallel with this synthesis lock; execution specialists (content-lead full landing rewrite, product-designer full surface design) wait until PO locks final name.

**Owner.** Navigator (decision synthesis + ledger). PO (decision source).
**Revisit.** Q2 at coach vertical eng-planning stage (SnapTrade history verification gate). Q4 post-launch if trademark conflict surfaces. Q6 at design phase kickoff (format candidates for in-context disclaimer).

## 2026-04-23 — Option 4 «Second Brain for Your Portfolio» LOCKED; no pre-lock interview gate

**Decision.** PO 2026-04-23 locked Option 4 Hybrid — «Second Brain for Your Portfolio» — as the product's strategic direction. Options 1 (Oracle), 2 (Analyst), and 3 (Companion) are rejected as standalone directions (retained in `STRATEGIC_OPTIONS_v1.md` as historical record only; do not re-propose). Hero is locked bilingually:

- Russian: «Второй мозг для твоего портфеля»
- English: «Second Brain for Your Portfolio»

**No pre-lock interview validation gate (PO choice).** The earlier-proposed user-researcher live-interview validation gate («how would you describe this product to a friend?» Mom-Test pass against ICP A before full commit) is explicitly SKIPPED. PO rationale: live interviews deferred until post-alpha when real users exist. Pre-alpha validation is delegated to three parallel specialist feasibility checks instead — `tech-lead` (can coach vertical ship credibly? what's the slice breakdown?), `brand-strategist` (naming round 5 in mind/memory territory — is there a viable candidate avoiding the rejected list?), `content-lead` (English-first landing + paywall copy in Second Brain voice — does the metaphor carry top-of-fold?). `user-researcher`'s next dispatch is post-alpha.

**Fallback to Oracle is named (not a hedge — an escape hatch).** If `tech-lead` returns «coach vertical not feasible for alpha» OR `brand-strategist` cannot surface a viable name in mind/memory territory after round 5, Navigator reverts to Oracle (Path A fallback — keeps the originally locked «Поговори со своим портфелем» hero, lowest cold-start risk, Slice 6 shipping momentum preserved). Fallback is documented here for transparency; it is not the expected path.

**English-first launch (new constraint, 2026-04-23).** Day-1 launch content is English only. Russian parallel-drafted as secondary artifact (ready for v1.x wave but not shipped alongside English). EU languages (DE / IT / ES / FR / PT) deferred to post-launch waves entirely. This narrows the previously-locked multi-language-day-1 scope to English-day-1; Russian and EU languages remain on the roadmap but no longer gate launch. Rationale: reduces pre-alpha content localization + i18n infrastructure cost by ~3-6 weeks; English is sufficient to test Second Brain metaphor's hero parse against ICP A + AI-native ICP B before expanding language surface.

**Rationale for picking Option 4 (recap).**
- PO «объединить» intuition 2026-04-23: the product IS chat + insights + coach, and positioning should reflect that rather than privilege one surface.
- Empty fintech territory: 34-competitor scan returned zero matches for «second brain for portfolio» vocabulary. First-mover owns the category read.
- Cross-category prior art (Forte's book; Notion / Obsidian cultural footprint) lowers import cost — users apply a familiar concept to a new domain rather than learn a new one.
- Lane A (information/education only) is a natural consequence of the memory metaphor, not a compromise. Brain remembers, notices, explains — it does not advise.
- Multi-broker aggregation + global multi-market reinforce unified «one brain holds everything» narrative.

**Risks acknowledged (tracked in `STRATEGIC_OPTIONS_v1.md` Option 4 risks section).**
- Abstract-metaphor hero cognition ~4 sec vs Oracle's 3 sec (locked tested hero swapped for untested metaphor).
- Coach 30-day cold-start inherited from Option 3 — hero promises «remembers» but first month is empty if mitigation not designed.
- Eng scope heaviest of four options — all three surfaces must ship credibly at MVP; commodity drift if not.
- Metaphor import risk for ICP B newcomers («слишком умно» read).
- Naming territory must find a candidate in mind/memory space that avoids four rejected rounds.

**Implications (actioned same day).**
- `STRATEGIC_OPTIONS_v1.md` — v1.3: Option 4 marked LOCKED at top; Options 1/2/3 headings marked REJECTED (historical record); pre-lock gate removed; Q0 and Q9 resolved. — **DONE.**
- `02_POSITIONING.md` — full v2 rewrite to Second Brain metaphor. Hero replaced. Landing structure adjusted (4 sections retained, subtitles updated to match chat/insights/coach narrative). Lane A lock + global geography lock + English-first launch reflected. `[PENDING-V2]` status removed. — **IN FLIGHT.**
- Three parallel specialist dispatches launched 2026-04-23: `tech-lead` (feasibility), `brand-strategist` (naming round 5, mind/memory territory), `content-lead` (English-first landing draft). `user-researcher` NOT dispatched per this decision.
- `03_ROADMAP.md` — pending revision once `tech-lead` returns with coach-vertical slice breakdown.

**Owner.** Navigator (strategic lock). `tech-lead`, `brand-strategist`, `content-lead` own their respective specialist outputs.
**Revisit.** If any specialist returns a blocker → Oracle fallback. Otherwise revisit at alpha launch + 30 days with real user feedback on «second brain» parsing.

## 2026-04-23 — Product name LOCKED: Memoro; domain memoro.co

**Decision.** PO 2026-04-23 locked **Memoro** as the final product name. Pronounced «meh-MO-ro» (EN) / «мемóро» (RU). Primary domain target: **memoro.co**. Round 6 (dispatched 2026-04-23 same day in parallel with the decision-lock synthesis) surfaced 10 viable candidates + 2 DOA; PO reviewed Round 6 top-3 (Orma / Kavo / Ember) against Round 5 lead (Memoro) and held with Memoro.

**Why Memoro over Round 6 alternatives.**
- **vs Orma:** Orma was the closest peer on trade-off. Orma wins on length (2 syl vs 3), domain cleanliness across TLDs, and tagline/name separation (Orma = abstract mark, tagline «Second Brain» = metaphor — different jobs). Memoro wins on declarative semantic specificity — the name literally says «I remember» in Latin 1st-person-singular, which is the product identity, not a shadow. PO preferred the semantic-specificity axis: when the name says what the product does, brand-world copy doesn't have to carry 100% of the meaning-making load.
- **vs Kavo:** Kavo is fully coined (Figma/Stripe shape) — maximum ownability but zero semantic work. RU-speaking diaspora has a minor colloquial flavor risk («каво» as mis-spelling of «кого»). Memoro's Latin root does useful brand work that a pure invented mark does not.
- **vs Ember:** Ember introduces a warmth/light metaphor axis (different from memory/cognition territory). Strong candidate on different axis, but `.com` is effectively ceded to Ember.js open-source framework community — cultural-recall conflict for the tech-adjacent segment of ICP A (Notion/Obsidian cohort). Memoro has no equivalent cultural recall conflict.
- **vs Mneme / Noesis (Round 5 alternates to Memoro):** Mneme has an English silent-M learning-burden («ne-mee» not «m-neem») — real brand-education cost. Noesis is 3 syllables and leans too-academic for ICP B (AI-native 22-32) without enough Everyman warmth. Memoro's bilingual phonetic parity is the strongest of the Round 5 top-3.

**Why `.co` over `.com`.**
- `memoro.com` is parked on Afternic (a domain aftermarket broker) — not a dormant registration, an explicit for-sale asset with broker-escrow overhead. Acquisition cost is unknown (Afternic listings start at $500 and run into five-figure range depending on seller's ask).
- `memoro.co` is ICANN AVAILABLE via standard registrars (Namecheap / Porkbun / Cloudflare Registrar), ~$30-50/year standard registration. No broker, no escrow, no negotiation.
- PO applied **CONSTRAINTS.md Rule 1** (no spend without explicit PO approval) and deferred the `.com` purchase entirely to a future date when budget permits. `.com` remains a future acquisition target but is explicitly NOT blocking launch.
- `.co` TLD is well-established for SaaS brands (Notion.co redirect era, multiple Y Combinator launches on `.co`); does not read as low-quality.

**Domain purchase status.** `memoro.co` is NOT yet registered. PO will register personally when ready (standard consumer-grade registration flow, ~$30-50/yr). CONSTRAINTS Rule 1 respected — Navigator did not authorize any spend; this ADR documents the target domain, not a completed transaction.

**Evidence base.** See `docs/product/03_NAMING.md` Round 5 (Memoro baseline entry) + Round 6 (10-candidate comparison with Memoro as benchmark) for the full candidate pool, WebFetch indirect domain signals, phonetic analysis, and rejected-list deltas. Round 5 + Round 6 are preserved in `03_NAMING.md` as historical record.

**Implications.**
- `03_NAMING.md` — document title changes to «03 — Naming Workshop (LOCKED: Memoro)»; result annotation added at top; Round 5/6 preserved as history. Done same commit.
- `[Name]` / `[Название]` / `[Product]` / `[Продукт]` placeholders across all docs — substituted with «Memoro» (same spelling for EN and RU — proper noun, no transliteration). Done same commit via grep sweep.
- `02_POSITIONING.md` — body narrative sync for Tone of Voice / Onboarding promise / Brand archetype / Key product principles sections, aligning remaining «your second brain» hero-voice residue to imperative-hero + tagline framing. Done same commit.
- `docs/PENDING_CLEANUPS.md` — items #1, #2, #4 closed and moved to Completed. Item #3 was half-done earlier (inline SUPERSEDED banner on geography ADR); moved to Completed in this commit. Item #5 (language expansion order clarifier) stays Active — trigger is post-alpha wave-2 content scope.
- Trademark clearance deferred per Q4 lock 2026-04-23 («no trademark spend before launch; accept post-launch rebrand risk»). Memoro trademark search is post-launch PO decision.

**What this does NOT change.**
- Tagline «Second Brain for Your Portfolio» remains locked (mid-page brand-world copy).
- Hero imperative remains locked bilingually («Ask your portfolio» / «Спроси свой портфель»).
- All other locked decisions from Option 4 synthesis (Lane A, global без РФ, dashboard-primary, teaser-paywall Coach, in-context AI disclaimer) unchanged.

**Owner.** Navigator (name lock + doc sweep). PO (decision source + future domain registration).
**Revisit.** If `memoro.co` registration blocked for any reason when PO attempts it (unlikely — ICANN AVAILABLE signal is strong, but registrars occasionally surface last-minute conflicts), fall back to `.app` / `.io` / `.money` — all showed possibly-free WebFetch signals in Round 5 domain check. If broader trademark conflict surfaces post-launch, Q4 lock accepts the rebrand cost.

## 2026-04-23 — Trial + Free tier + Coach UX + brand commitment (4 locks)

PO 4 decisions from post-specialist-dispatch session:

### Trial: 14-day Plus, card required
Standard SaaS pattern. Free-tier user signs up → 14 days of Plus access → card charged OR auto-downgrade to Free. Card required at signup (better trial→paid conversion; worse trial uptake, acceptable trade-off). Plus (not Pro) gives «real product experience» without over-promising.

### Free tier: 50 messages/month, NO daily limit
PO rejected finance-advisor's 3/day + 60/month combo; monthly cap only. User can burst 10 messages in one day and be silent the next — more retail-friendly. 50/mo is tighter than proposed 60/mo — better unit economics. **Use Haiku (not Sonnet) for Free-tier AI responses** per finance-advisor recommendation (5x cheaper, sufficient quality for Free).

### Coach UX: contextual — NOT dedicated route, NOT filter-chip
- **Blinking icons on contextual elements** (position cards, dashboard widgets, relevant chat threads) when Memoro notices a pattern tied to that element. Icon click → teaser message.
- **Bell-dropdown in top-bar** with unread count. Click → list of all current coach patterns (hub for discovery).
- **No `/coach` route** — contrary to product-designer's earlier recommendation. Contrary also to tech-lead's filter-chip proposal.
- **Free tier paywall teaser:** reveals pattern subject but not substance. Example: «Memoro noticed a pattern in your NVDA trades — upgrade to Plus to see detail». Creates curiosity without Lane A violation.
- **No dedicated surface for Coach** as category-claim — AI woven into existing surfaces per Q3 dashboard-primary lock.

### «Free is always Free» — permanent brand commitment
PO confirms Free tier stays free forever. Content-lead built landing + paywall copy around this («no last chance nonsense», «cancel is one click», «Free is always Free»). Brand promise — if later reneged, significant brand damage. PO confirms understanding and commits.

**Owner.** Navigator (decisions log) + content-lead (copy) + product-designer (coach UX spec rewrite) + finance-advisor (cost model + tier validation).
**Revisit.** Each separately:
- Trial: measure trial→paid conversion at 90 days post-launch; optimize terms if conversion weak.
- Free cap: measure actual Free burn at 1K / 10K / 100K users; adjust cap if unit economics break.
- Coach UX: A/B test contextual vs dedicated route post-alpha if engagement weak.
- Free-forever: anchor commitment — do NOT revisit under normal product-market pressure; only reconsider if company existential risk.

## 2026-04-29 — Theme mechanism: `data-theme` attribute on `<html>` (chart subsystem + production app)

**Decision.** Production app and chart subsystem use `data-theme="light"` / `data-theme="dark"` attribute on `<html>` for theme switching. The `.light` / `.dark` class selectors in the static showcase (`apps/web/public/design-system.html`) and the legacy `.dark` references in `apps/web/src/app/globals.css` are tolerated short-term but are NOT the production mechanism — they remain for the frozen showcase only.

**Why.**

1. **Spec alignment.** `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` §11.4 (locked v1.1) explicitly prescribes `data-theme` on `<html>` as production mechanism («mechanism: data-attribute on `<html>` toggled by user preference, falls back to `prefers-color-scheme`»). Migration kickoff `docs/engineering/kickoffs/2026-04-27-design-system-migration.md` §4.3 mandates the same. Chart blueprint `docs/reviews/2026-04-27-chart-implementation-blueprint.md` flagged this as Open Question 3 — picking `data-theme` resolves it without contradicting either spec.
2. **Zero token-rebuild cost.** `packages/design-tokens/build.js:162` already emits dual selectors: `.dark, [data-theme="dark"] { … }`. Both work today out of the box. No tokens regeneration needed; charts using `var(--chart-series-N)` flip live regardless of which selector wins.
3. **Industry-standard pattern.** Mercury / Linear / Vercel all use `data-theme` on `<html>`. The `next-themes` package (~2kb, MIT) is the de-facto reference implementation and composes cleanly with App Router SSR.
4. **HTML semantics.** A theme is metadata about the document, not a class on it. `data-theme` attribute reads correctly to assistive tech that exposes `aria-*` and `data-*` attributes and aligns with `<meta name="color-scheme">` elsewhere in `<head>`.
5. **Per-subtree theming optionality (future).** If a future surface needs a forced light theme inside a dark page (e.g. an embed preview), `[data-theme="light"]` wins under specificity at any subtree level without class-collision risk against Tailwind's `dark:` variant utilities.

**Implications.**

- `apps/web/src/app/layout.tsx`: add SSR no-flicker inline `<script>` in `<head>` that resolves `localStorage.theme → prefers-color-scheme → 'light'` and writes `data-theme` on `<html>` BEFORE React hydrates. `next-themes` does this out of the box; if `next-themes` conflicts with `providers.tsx` (Clerk + TanStack Query), fall back to a hand-rolled 12-line script.
- `packages/design-tokens/build.js`: keep dual emit `.dark, [data-theme="dark"]` for one transition cycle. Once production app is on `data-theme` and showcase is fully retired (per blueprint Phase 8 redirect), drop the `.dark` half via a follow-on TD.
- `packages/ui/src/charts/tokens.ts`: chart series tokens are referenced as `var(--chart-series-N)` strings — these are theme-agnostic by definition. No chart code needs to know which selector triggers the theme. Live theme switching via `var()` resolution works automatically per chart blueprint architectural decision 3.
- Static showcase (`apps/web/public/design-system.html`): stays on class-toggle; flagged for retirement per migration kickoff §4.3. No tactical change in this decision.
- Tailwind v4 `@custom-variant dark` (currently emitted as `&:where(.dark, .dark *)` per `build.js:322`): this needs widening to also recognise `[data-theme="dark"]`. Tracked as P2 follow-on for the design-system migration slice (already in scope of SLICE-DSM-V1).

**Owner.** Right-Hand (this ADR) + frontend-engineer (implementation in SLICE-DSM-V1 + chart slices SLICE-CHARTS-FE/BACKEND/QA-V1).
**Revisit.** Only if a hydration-mismatch warning surfaces that cannot be resolved by the standard `next-themes` pattern; or if assistive-tech testing surfaces an unexpected interaction between `data-theme` and `aria-` semantics. Neither is anticipated.

**Cross-references.** `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` §11.4; `docs/engineering/kickoffs/2026-04-27-design-system-migration.md` §4.3; `docs/reviews/2026-04-27-chart-implementation-blueprint.md` Open Question 3 (resolved); `docs/engineering/kickoffs/2026-04-29-charts-fe.md`; `docs/engineering/kickoffs/2026-04-29-charts-backend.md`; `docs/engineering/kickoffs/2026-04-29-charts-qa.md`.

## 2026-04-29 — Charts palette: museum-palette extension + ink tonal default (NOT forest-jade ramp)

**Decision.** Adopt **Hybrid (Option C)** with brand-strategist's «museum-palette extension» as the categorical layer. Default chart hue family is **ink/cream tonal**, NOT forest-jade. Forest-jade and bronze remain reserved for their semantic roles (gain / loss / verified) per the existing brand-floor lock. When categorical encoding is unavoidable (≥4 unordered series — asset class, sector, broker), draw from a **5-hue museum-vitrine extension family** (deep slate, paper-stone, fog-blue, dusty plum, muted ochre — exact OKLCH/hex deferred to follow-on product-designer dispatch). All P&L sign encoding replaces green/red with the locked jade/bronze pair, redundantly encoded with sign glyph + zero-axis position.

**Per-chart-kind palette mode** (consensus-synthesised across product-designer, finance-advisor, brand-strategist):

| Chart kind | Default mode | Rationale |
|---|---|---|
| Line | ink for single series; museum-categorical for ≤4 multi-series | Tonal default; categorical only when truly multi-series |
| Area | jade above 0 / bronze below 0 (semantic) | Sign-bearing |
| Bar (drift) | diverging jade ↔ neutral grey ↔ bronze | Sign-bearing |
| Donut | museum-categorical for unordered (asset class, broker); ink tonal ramp for ordinal-by-magnitude | Type-of-data → type-of-palette match |
| Sparkline | ink default; jade/bronze tint at endpoint | Single trend |
| Calendar | per CHARTS_SPEC §2.6 status-categorical | Non-semantic, already locked |
| Treemap | hybrid (ink-tone size + diverging jade↔bronze delta) | Two-channel encoding |
| Stacked bar | museum-categorical ≤7 + locked semantic when sign | Multi-series |
| Scatter | museum-categorical ≤3 groups | Group membership |
| Waterfall | jade=add, bronze=subtract, ink=start/end | Sign-bearing |
| Candlestick | jade up / bronze down (semantic, already locked) | Per-bar sign |

**Why this over forest-jade ramp** (PO's initial intuition):

1. **Brand §13.2 cap is binding.** Forest-jade carries a hard 13-surface cap in the brand system. Ramping it through chart series alone could exceed the cap. Brand-strategist surfaced this constraint; it overrides product-designer's «just ramp the jade» direction.
2. **Data-viz canon.** Sequential palette on **unordered** nominal data (asset class, sector) implies false ranking. Industry canon — Morningstar (the wealth-data benchmark, uses multi-hue categorical for asset class), Atlassian, ColorArchive, CleanChart — treats this as categorical encoding. Finance-advisor concurred: «mono ramp WARN — only ordinal/sequential».
3. **Editorial register.** Bloomberg, FT, Datawrapper, Wealthfront — the «calm-analytical caretaker» reference set Provedo aligns with — lead with ink/cream/grey tonal charts and use color rarely. Reserving jade for its semantic role (verified / accent / gain) is what makes it earn attention.
4. **2-of-3 specialist consensus.** Brand-strategist + finance-advisor explicitly rejected forest-jade-as-default-chart-hue. Product-designer was the lone supporter and did not address the §13.2 cap.
5. **PO directive — quality over speed.** The brand-strategist override is the more conservative move; given «спешить некуда, нужно качество», the smaller-blast-radius decision wins.

**P&L green/red replacement (3-of-3 consensus).** All three specialists supported replacing green/red with locked jade/bronze, redundantly encoded with sign glyph + zero-axis position. Industry deuteranopia-safe pattern (Cleveland-Robbins blue/orange, Bloomberg orange/blue) — Provedo's jade/bronze fills the same role in brand voice.

**Implications.**

- **`docs/design/CHARTS_SPEC.md` §2** — palette taxonomy update needed. Replace ad-hoc 7-hue assignments with the per-chart-kind mode mapping above.
- **`packages/ui/src/charts/DonutChart.tsx`** — switch from per-slice categorical to museum-palette categorical default; expose a `palette: 'categorical' | 'sequential' | 'monochromatic'` prop for explicit caller override (e.g. when caller knows data is ordinal-by-magnitude).
- **`packages/design-tokens/tokens/`** — add 5-hue museum extension family + sequential ink ramp tokens. Keep forest-jade and bronze unchanged.
- **AI-agent prompts** — chart-emission defaults must match new palette taxonomy. Eliminates per-slice random colors; backend chooses mode (categorical/sequential/diverging) by data shape, palette family pinned by mode.
- **Visual regression tests** — TD-112 covers the showcase regression caused by the donut palette change. Refresh chart-tests checkpoint β.1.4 (commit 109e4de) baselines after the new palette lands.
- **Showcase** (`/design-system#charts`) — DonutChart visible diff; update is part of the same PR as the palette change.

**Owner.** Right-Hand (this ADR + decision) + product-designer (museum-palette hex draft, in flight) + frontend-engineer (DonutChart palette swap + AI-agent prompt update, follow-on slice).
**Revisit.** After 5 V2 charts adopt the new palette in production AND user research surfaces a clarity issue. Otherwise, locked.

**Cross-references.** `docs/reviews/2026-04-29-charts-palette-aggregate.md` (full per-specialist transcripts + agreement matrix); `docs/design/PROVEDO_DESIGN_SYSTEM_v1.md` §13.2 (forest-jade 13-surface cap that drove the override); `docs/design/CHARTS_SPEC.md` §2.2 (palette taxonomy section to be updated).

## 2026-04-29 — PR split deferred; today's changes commit as logical groups on existing branch

**Decision.** Defer the physical PR split recommended by tech-lead H6 («design-system hygiene PR-1» + «chart infra PR-2»). Today's 3 slices (A dark-stage removal, B theme-aware fix, C console-errors fix) + Bundle 1 fixes commit as **5–6 logical commits on the existing `chore/plugin-architecture-2026-04-29` branch** in this order: docs/ADRs first, then visual-hygiene group (Slice A + B + Bundle H4/H5 + tests), then favicon + middleware group, then chart infra group (Slice C + Bundle H1/H2/H3 + tests + env). Branch is NOT pushed and no PRs are opened by Right-Hand — that is PO's decision.

**Why deferred (despite tech-lead H6 recommendation).** The branch carries **80+ commits ahead of main** — months of charts α + β + design-system migration + agent-persona consolidation work pre-dating this session. Tech-lead's split recommendation was scoped to today's 3 slices and did NOT account for this historical depth. A physical split into «PR-1 hygiene + PR-2 chart-infra» would require:

1. **PR-0 (historical)** — α + β charts foundation (~75 commits, ~40K LOC) since today's Slice C dispatcher imports from `packages/ui/src/charts/index.ts` whose V1/V2 chart components were built across those 75 commits. Slice C cannot land without them.
2. **PR-1 (visual hygiene)** — depends on PR-0 (StagedSections/StageFrame are part of the design-system migration also in PR-0).
3. **PR-2 (chart infra)** — depends on PR-0 and is independent of PR-1.

That's a 3-PR sequence, not a 2-PR split. Building it correctly is a multi-hour cherry-pick / rebase exercise on a Windows host where Rule 8.3 dispatch hygiene rules already flag NTFS reliability concerns. The cost / value ratio at this stage (pre-alpha, single contributor) does not justify it; a single-PR-on-branch with section-by-section commit history is honest and reviewable.

**What we keep instead.** Logical commits in dependency order, so a future cherry-pick-into-2-PRs (if PO wants) is a small operation rather than re-discovering the partitioning. Each commit message tags its slice (`[slice-A]`, `[slice-B]`, `[slice-C]`, `[bundle-1]`) and group (`hygiene` or `chart-infra`) so a `git log --grep` query selects the partition.

**When to revisit.** If PO opens this branch as a PR and reviewer-overload is reported (CI noise, comment fatigue, unclear scope) — split via cherry-pick-rebase from main into 2 (or 3) sequential PRs at that point, with a clear cost.

**Owner.** Right-Hand (today's commit work) + PO (push + PR open decision).
**Revisit.** Trigger = PO opens PR and asks for split, OR Phase 2 builder dispatch needs Slice C alone landed and Slice C is blocked behind unrelated review traffic.

**Cross-references.** `docs/reviews/2026-04-29-design-system-fixes-aggregate.md` H6 (the original split recommendation); CONSTRAINTS.md Rule 8.3 (Windows dispatch hygiene); branch `chore/plugin-architecture-2026-04-29` git log for the historical depth.

## 2026-04-29 — DonutChart anatomy + interaction: 5 PO-delegated design calls

**Decision.** Five design calls flagged as open in `docs/design/DONUT_ANATOMY_v2_draft.md` resolved by Right-Hand under PO directive «по дизайну подумай сам плз, я не знаю как лучше»:

1. **Default arcMode = `'full'` (360°).** 270° is an opt-in variant for editorial / hero use cases where the missing 90° wedge hosts a callout text or KPI value. Dashboard tile DonutChart instances default to 360° because the primary read is «portfolio allocation» and a missing wedge is decoratively expensive there.

2. **Entrance sequence = by-magnitude descending.** Largest slice animates in first, smallest last. Matches the cognitive query in finance data viz («what's the biggest position?»). Trade-off accepted: clockwise would have been simpler to implement but is data-agnostic; magnitude-ordered animation is data-aware and aligns animation flow with attention flow. Reduced-motion fallback per the existing `<html data-reduced-motion>` plumbing — instant render, no stagger.

3. **Legend click-to-filter — out of scope** for the DonutChart V2 slice. Reasons: (a) YAGNI at pre-alpha — the dashboard surface that would benefit from this is not yet shipped; (b) Lane A discipline — interactive filtering trends toward «trader analysis tool» semantics, drifting from Provedo's «information / education» register. If a future dashboard slice needs it, open a follow-on TD scoped specifically to the dashboard-level interactivity, not as a chart-component primitive.

4. **Hover-shadow token = NEW `--shadow-chart-slice-hover`** added to `packages/design-tokens/tokens/`. Two reasons: (a) hover treatment will re-use across other chart kinds in CHARTS_SPEC §1 (BarChart hover lift, treemap tile hover, scatter point hover, etc.) — a named token earns its weight at the design-system level; (b) explicit > inline for design-system hygiene. The token references a layered shadow stack (paper-press neumorphism + slight accent rim glow) consistent with Provedo's tactile-depth language.

5. **V1 Recharts stagger animation — NOT implemented; accept V1↔V2 visual delta.** V1 (Recharts) renders all slices instantly; V2 (primitives) renders with the 600 ms / 180 ms / 105 ms stagger from the anatomy draft. Reasons: (a) V1 is the bridge backend; sunset criterion in TD-115 already commits to its removal once Phase 2 stabilises; (b) `makeBackendDispatch` pattern explicitly contracts that V1/V2 may differ visually — that is the dispatcher's design intent, not a bug; (c) workaround via multiple `<Pie>` mounts in Recharts is invasive and would create test-time flakiness; (d) the visual delta only matters during the dispatcher window (`NEXT_PUBLIC_PROVEDO_CHART_BACKEND=primitives`) — once V2 is the only path, the delta disappears. Document the delta in CHARTS_SPEC §3 «backend swap» subsection (TD-118) as deliberate, not a regression.

**Why Right-Hand resolved these alone.** PO directive 2026-04-29 «по дизайну подумай сам плз, я не знаю как лучше» — explicit delegation of these tactical design calls. Per CONSTRAINTS Rule 3, these are NOT strategic decisions (no positioning / pricing / regulatory implication; no naming or brand-archetype shift); they sit at the design-system implementation layer where right-hand has standing authority to lock when PO requests delegation.

**Implications for downstream work.**

- **Frontend-engineer slice (Task #13):** receives a coherent brief combining (a) museum-palette token application, (b) gradient direction per `DONUT_GRADIENT_v2_draft.md`, (c) anatomy + interaction per `DONUT_ANATOMY_v2_draft.md`, (d) the 5 design calls above as binding inputs. Single slice, single PR.
- **Tech-lead kickoff (preferred):** before the FE dispatch, tech-lead writes a kickoff doc consolidating the three drafts + the 5 design calls + acceptance criteria. Avoids FE re-discovering the partition. ~30 min wall-clock.
- **TD entries:** open a TD for legend click-to-filter (deferred per call 3) — to capture the deferral so it doesn't get lost, even though we won't act on it now.
- **Showcase regression:** `/design-system#charts` DonutChart visible diff lands as part of the same FE slice. Snapshot baselines for chart-tests checkpoint β.1.4 (commit 109e4de) need refresh.

**Owner.** Right-Hand (this ADR) + tech-lead (kickoff) + frontend-engineer (implementation slice) + qa-engineer (β.1.4 snapshot refresh).
**Revisit.** After 2 weeks of V2 in production OR after first user research session that surfaces a clarity issue with any of the 5 calls. Otherwise locked.

**Cross-references.** `docs/design/DONUT_ANATOMY_v2_draft.md` (the source of the 5 questions); `docs/design/DONUT_GRADIENT_v2_draft.md` (sibling spec); `docs/design/CHART_PALETTE_v2_draft.md` (museum-palette base); CONSTRAINTS.md Rule 3 (delegation rationale).

## 2026-05-01 — Design System v2 supersedes v1; editorial-mh3 + jade + terra tokens removed

Phase 3b of the DS v2 migration is destructive. The `editorial-mh3` primitive
file (5-hue × 2-theme × 3-stop chart palette) has been deleted; its hex values
are inlined directly into the `chart-categorical.{1..5}.{base,top,bottom}`
semantic aliases (chart visual identity unchanged per spec §9). The `jade.*`
and `terra.*` primitive blocks have been removed from `color.json`; consumer
semantic entries (`accent`, `terra`, `state.positive/negative/warning`,
`portfolio.gain/loss`, `border.focus`) re-point to `signal.orange` /
`signal.orange-deep` per spec §11.1. `PROVEDO_DESIGN_SYSTEM_v1.md` carries a
deprecation banner pointing at `PROVEDO_DESIGN_SYSTEM_v2.md`.

CSS var names (`--accent`, `--terra`, `--accent-glow`, `--chart-categorical-N-{base,top,bottom}`)
are preserved — only their underlying values flip. No consumer code touched
except the obsolete `contrast.test.ts` (deleted; its premise was tied to the
removed primitive file).

Reason: complete the visual migration to the candy/paper dual register and
shed dead token families before α cutover.

Owner: frontend-engineer (Phase 3b).
