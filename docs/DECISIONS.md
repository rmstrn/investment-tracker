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
