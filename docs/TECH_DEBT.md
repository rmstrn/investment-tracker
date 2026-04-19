# Tech Debt Log

Running ledger of known-but-accepted debt. Each item has an owner (who revisits), a trigger (when to revisit), and a scope (how big the fix is).

Newest entries at the top. When an item is resolved, move it to the "Resolved" section at the bottom with the resolution commit/PR.

---

## Proposed (from B3-ii GAP REPORT, 2026-04-20)

These TDs будут логированы в Active section в финальном PR commit B3-ii-a (или b). Пока здесь для trace.

### TD-048 — SSE error event payload: add `request_id` for Sentry correlation

**Source:** B3-ii GAP REPORT — AI Service `ChatAgent` emits `error` SSE event с `error.message` но без `request_id`. Корреляция Sentry Core API ↔ AI Service по одному incident'у ломается.
**Current state:** X-Request-Id пропагируется на HTTP header level (Core → AI), в request logs видно. Но в SSE error frame, который видит клиент, request_id отсутствует — клиент/support не может репортить incident с ID.
**Fix:** protocol bump в AI Service SSE schema — добавить `request_id` в `error` event data payload. Cross-service: TASK_05 + Core API frontend client.
**Trigger to revisit:** после B3-ii-b merge, перед AI Service production flip (`RUNBOOK_ai_flip.md`).
**Owner:** AI Service maintainer + Core API lead (coordinate)
**Scope:** ~20 LOC AI Service + ~10 LOC Core API parser + frontend display

---

### TD-049 — SSE Last-Event-ID resume protocol

**Source:** B3-ii GAP REPORT — MVP без resume-logic. Если клиент потерял соединение mid-stream, reconnect = new conversation message, нет восстановления незавершённого assistant response.
**Current state:** AI Service не принимает Last-Event-ID header. Клиент при reconnect начинает новый turn — частичный ответ теряется.
**Fix:** event ID schema + serverside buffer (Redis N минут) + AI Service honors Last-Event-ID header для replay from offset. Complex; не на MVP.
**Trigger to revisit:** post-MVP, когда появятся реальные жалобы на lost responses.
**Owner:** AI Service maintainer
**Scope:** ~200 LOC + Redis buffer + AI Service client

---

### TD-050 — `/ai/insights/generate` Path B: handler hangs 5-30s (LB idle risk)

**Source:** B3-ii GAP REPORT — мы выбрали Path B (sync inline) для `/ai/insights/generate`. Handler делает synchronous call к AI Service `/internal/insights/generate`, который работает 5-30s. Fly.io LB idle timeout = 60s, так что запас есть, но узкий. Pro-user flow («Generate ↻» → spinner) приемлем для MVP.
**Current state:** работает day-one. Риск — если Anthropic latency растёт >40s, можем словить LB disconnect intermittently.
**Fix:** async version через TASK_06 worker — `insight_generation_jobs` table + asynq publish + worker pull → AI Service call → write insight. Когда worker infra готова, отрефакторить.
**Trigger to revisit:** TASK_06 worker baseline merged, или если prod мониторинг покажет LB timeout hits.
**Owner:** AI lead + workers lead (TASK_06)
**Scope:** ~300 LOC (migration + worker + handler swap to 202+polling)

---

### TD-051 — Tee SSE parser duplicates AI Service's SSE knowledge (drift risk)

**Source:** B3-ii-b design — Core API `/ai/chat/stream` handler не транспарентный reverse-proxy, он **tee-парсит** SSE stream от AI Service чтобы извлечь assembled assistant content для persist в `ai_messages`. Это значит Core API вписывается в SSE schema AI Service (8 event types, content_block_delta format, etc.). Если AI Service меняет schema — Core API ломается silently.
**Current state:** schema стабильна, но нет single source of truth. Оба сервиса владеют одинаковым знанием.
**Fix options:**
  a. Shared Go package + Python package generated from single spec (openapi SSE schema extension).
  b. Contract tests — Core API + AI Service integration test верифицирует round-trip event format.
  c. AI Service emits post-completion sidecar endpoint `GET /internal/messages/{id}/assembled` — Core API pulls finished content вместо tee. Убирает tee entirely.
**Trigger to revisit:** при первом schema change или при drift incident в проде.
**Owner:** AI + Core API leads
**Scope:** зависит от option — (c) самый чистый, ~400 LOC + refactor tee-handler

---

### TD-052 — Concurrent chat from same user: pre-increment race window

**Source:** B3-ii-a rate-limit middleware — используем `INCR usage:ai_messages_daily:{uid}:{YYYY-MM-DD}` + check against cap. Если юзер шлёт 2 параллельных chat requests прямо на границе cap, обе могут пройти INCR до того как одна из них увидит cap exceeded.
**Current state:** window tight (Redis round-trip ~1ms), реальные пользователи редко шлют параллельные chats. Acceptable для MVP.
**Fix:** reserve+commit pattern — pre-increment в Redis, если AI Service call fails — decrement back. Или distributed lock `SETNX usage:lock:{uid}` для serialization.
**Trigger to revisit:** если в проде заметим abuse pattern или complaints про «I was charged 2x».
**Owner:** Core API lead
**Scope:** ~50 LOC middleware rework + race tests

---

## Active

### TD-053 — `/ai/insights/generate` per-week / per-day tier gate

**Added:** 2026-04-20 (PR B3-ii-a)
**Source:** openapi `/ai/insights/generate` doc string says Free=1/week, Plus=1/day, Pro=unlimited. Текущий handler гейтится через `airatelimit` middleware, который считает против `ai_messages_daily` (Free=5/day, Plus=50/day, Pro=∞) — тот же бюджет что /ai/chat. Бюджет защищён, но семантика «1 в неделю на Free» не enforced — Free может позвать /generate 5 раз в день.
**Risk:** низкий — UI button click frequency низкая, нет abuse signals; openapi-described gate это UX cap, не cost cap.
**Fix:** новый dedicated counter `insights_generated_<period>` в Redis (или usage_counters table). Per-tier window: Free=1/week, Plus=1/day, Pro=skip. Отдельный middleware либо параметризованный airatelimit с кастомным TTL+cap.
**Trigger to revisit:** product решает «Free спамят /generate, нужна жёсткая 1/week крышка», или UI feedback показывает что текущая шаринг-с-чатом семантика confusит.
**Owner:** backend
**Scope:** ~80 LOC + tests — 2 часа

---

### TD-052 — AIRateLimit pre-increment overcount (P2)

**Added:** 2026-04-20 (PR B3-ii-a)
**Source:** `airatelimit` middleware INCRementit Redis counter ДО handler вызова. Если post-INCR n > cap → 429 + counter сидит на n (over). Если handler 5xx (AI Service down) — counter уже инкрементирован, юзер «потерял» попытку.
**Risk:** низкий — overcount-by-1 на 429 = ноль разница для юзера (он уже отгеймлен). Counter-inflate-on-5xx = плохой DX (юзер «потратил quota» на upstream сбой).
**Fix:** «reserve + commit» паттерн. Lua script: SETNX reservation (TTL 60s), handler runs, on success — INCR daily counter + DEL reservation; on failure — DEL reservation; на 429 — никаких inserts. Атомарно, точно.
**Trigger to revisit:** complaint «я не делал столько запросов» или audit показывает >5% overcount drift против ai_usage ledger.
**Owner:** backend
**Scope:** ~50 LOC + tests — 1.5 часа

---

### TD-051 — SSE parser в Core API дублирует AI Service знание о frame format

**Added:** 2026-04-20 (PR B3-ii-a planning, lands in B3-ii-b)
**Source:** B3-ii-b SSE proxy handler парсит frames AI Service'а (event: <type>\ndata: <json>\n\n) для tee → DB persist. AI Service одновременно владеет тем же contract'ом в `ai_service/llm/streaming.py`. Оба должны быть синхронны.
**Risk:** drift при schema bump на одной из сторон. Например, если AI Service добавит новое поле в JSON payload — Core API `tee` parser его игнорит (OK), но если frame format поменяется (CRLF вместо LF, multi-line data:) — silent break.
**Fix:** общий контракт-test: AI Service publishes a fixture set of canonical frames; Core API parser test consumes the same fixture. Или: вытащить `sseproxy` в отдельный Go pkg + Python equivalent с shared spec.
**Trigger to revisit:** при первом silent-bug на streaming side (production incident OR CI canary).
**Owner:** backend + AI lead
**Scope:** ~40 LOC contract-test (фаза 1); полный shared-spec rewrite — отдельный story.

---

### TD-050 — `/ai/insights/generate` Path B handler hangs 5-30s (Fly.io idle 60s)

**Added:** 2026-04-20 (PR B3-ii-a)
**Source:** Path B = sync inline AI Service call. Handler блокирует HTTP request на 5-30s ждущий LLM. Под Fly.io idle timeout (60s) safe, но LB / browser disconnect могут убить connection до завершения.
**Risk:** LB или client side timeout → 502/504, insights не сохранятся, юзер видит ошибку, при retry — ещё один LLM call ($).
**Fix:** Async path — handler enqueue'ит asynq task, returns 202 + status=queued + job_id; worker (TASK_06) пулл'ит → AI Service → INSERT insights → job done. Нужна `insight_generation_jobs` table + `WorkerHardDeleteJob` analog для статусов.
**Trigger to revisit:** asynq worker landed (TASK_06), OR первый production incident про timeout на /generate.
**Owner:** backend (handler) + ops (TASK_06 worker)
**Scope:** ~150 LOC + migration `insight_generation_jobs` + worker handler — 4-6 часов

---

### TD-049 — SSE Last-Event-ID resume protocol

**Added:** 2026-04-20 (PR B3-ii-a planning, lands in B3-ii-b)
**Source:** MVP SSE proxy не поддерживает client-side reconnect+resume. Если client потерял connection mid-stream (network blip, mobile cellular handoff) — он начинает новый chat message. Token cost double, history может задвоиться.
**Risk:** mobile users с unstable connectivity платят 2x за один answer. UI может показать assistant message дважды (если client успел persist первый chunk).
**Fix:** Last-Event-ID header support per SSE spec. Server emits per-frame `id: <uuid>`. На reconnect client sends `Last-Event-ID: <uuid>` → server resumes from that point (нужен per-conversation event log в Redis). Полное решение: persistent SSE journal.
**Trigger to revisit:** mobile launch (TASK_08), или metrics показывают >5% chat sessions с reconnect events.
**Owner:** backend
**Scope:** ~200 LOC + Redis schema + integration tests — 1 день

---

### TD-048 — SSE error event payload extension — request_id field

**Added:** 2026-04-20 (PR B3-ii-a planning, lands in B3-ii-b)
**Source:** AI Service SSE `event: error` payload (см. `ai_service/agents/chat_agent.py` ErrorEvent) carries `message` + `code`, но НЕ `request_id`. Sentry-correlation Core API ↔ AI Service сейчас работает только на HTTP-уровне (X-Request-Id header в request log) — для in-stream errors trace потеряется.
**Risk:** debugging mid-stream errors потребует cross-correlate logs по timestamp + user_id вместо одной trace ID. Slower MTTR.
**Fix:** AI Service ErrorEvent добавляет `request_id: str` field; Core API SSE proxy пропагирует его как полученный X-Request-Id в headers. Координация через TASK_05 CC.
**Trigger to revisit:** первый mid-stream production incident требующий cross-service trace; OR routine TASK_05 update.
**Owner:** backend lead + AI lead (TASK_05 coordination)
**Scope:** ~10 LOC AI Service + ~5 LOC Core API + spec bump

---

### TD-047 — CSVExport tier flag heuristic (P1 pre-GA)

**Added:** 2026-04-19 (PR #40 / B3-i)
**Priority:** P1 — **must fix before public GA**
**Source:** экспорт-tier gate в `/exports` handler'е сейчас эвристика: «если у юзера жёсткий AIMessagesDaily cap → значит free → значит нет экспорта». Рабочая корреляция сегодня, хрупкая архитектура.
**Risk:** если мы захотим дать Free попробовать AI (поднять `AIMessagesDaily` с 3-5 до 10-20 для trial-эксперимента) — экспорт автоматом откроется free-юзерам без явного intent.
**Fix:** добавить `CSVExport bool` в `internal/domain/tiers/limits.go` TierLimits struct. Заменить эвристику на explicit gate: `RequireTier(func(l TierLimits) bool { return l.CSVExport })`. Прописать в tier matrix: Free=false, Plus=true, Pro=true.
**Trigger to revisit:** перед public GA, жёсткий blocker.
**Owner:** backend lead
**Scope:** ~30 LOC + test — 1 час

---

### TD-046 — Aggregator provider clients (SnapTrade / Plaid / broker APIs)

**Added:** 2026-04-19 (PR #40 / B3-i)
**Source:** `POST /accounts` сейчас принимает только `connection_type = manual`. Aggregator flows (SnapTrade OAuth, Plaid, per-broker APIs) возвращают 501 NOT_IMPLEMENTED через scope-cut pattern.
**Current state:** Manual entry работает; aggregator — TASK_06 scope.
**Trigger to revisit:** TASK_06 старт после закрытия TASK_04 (PR C merged).
**Owner:** integrations lead (TASK_06)
**Scope:** full TASK_06 — 4-6 недель

---

### TD-045 — Hard-delete worker must re-check `deletion_scheduled_at`

**Added:** 2026-04-19 (PR #40 / B3-i)
**Pair:** **requires** TD-041 (hard_delete_user worker implementation). Физически неразделимы — воркер без этой проверки ломает undo-flow.
**Source:** DELETE /me не удаляет юзера сразу — помечает `deletion_scheduled_at` + enqueue'ит `hard_delete_user` task с delay=7d. Если юзер передумал и вызвал undo — колонка сбрасывается в NULL, но отложенная задача в asynq остаётся.
**Fix:** worker consumer в TASK_06 должен первым делом re-fetch'ить юзера и делать no-op, если `deletion_scheduled_at IS NULL`. Логировать как `hard_delete_cancelled_undo`.
**Trigger to revisit:** вместе с TD-041 в TASK_06.
**Owner:** workers lead (TASK_06)
**Scope:** ~10 LOC + test сценарий undo

---

### TD-041 — `hard_delete_user` worker consumer

**Added:** 2026-04-19 (PR #40 / B3-i)
**Pair:** **implements** TD-041 but **requires** TD-045 (no-op on undo). Не катить без TD-045.
**Source:** DELETE /me publisher уже в Core API (PR #40). Consumer-side — в TASK_06.
**Current state:** задача enqueue'ится с delay=7d, но воркера ещё нет — задачи копятся в asynq `default` queue.
**Fix:** worker в TASK_06 с scope:
  1. fetch user by ID
  2. **re-check `deletion_scheduled_at IS NOT NULL`** (см. TD-045)
  3. cascade-delete через Postgres FK constraints (accounts, transactions, positions, snapshots, ai_conversations, insights, usage_counters, audit_log, ai_usage)
  4. audit-log запись `user_hard_deleted`
**Trigger to revisit:** TASK_06 старт.
**Owner:** workers lead (TASK_06)
**Scope:** ~100 LOC worker + integration test с 7d-fast-forward

---

### TD-039 — CSV export worker consumer

**Added:** 2026-04-19 (PR #40 / B3-i)
**Source:** POST /exports в Core API создаёт запись в `export_jobs` (status=pending) + enqueue'ит `generate_csv_export` задачу. GET /exports/{id} возвращает status. Consumer-side worker — в TASK_06.
**Current state:** юзер видит status=pending навсегда, т.к. воркера нет.
**Fix:** worker в TASK_06:
  1. materialize CSV из transactions + positions по фильтрам
  2. upload в R2 object storage с presigned URL (TTL 24h)
  3. patch `export_jobs.status='ready'`, `result_url=...`, `expires_at=...`
  4. email-уведомление (опционально)
**Trigger to revisit:** TASK_06 старт.
**Owner:** workers lead (TASK_06)
**Scope:** ~150 LOC + test с test-R2 bucket

---

### TD-001 — Next.js Turbopack incompatible with `experimental.typedRoutes`

**Added:** 2026-04-19 (wave 1)
**Source:** dev startup failure; Turbopack errors on typedRoutes config
**Fix applied:** removed `--turbopack` flag from `apps/web` dev script; runs on webpack
**Cost:** slower dev HMR (~2-3x on cold start)
**Trigger to revisit:** Next.js 15.3+ (typedRoutes + Turbopack compatibility expected)
**Owner:** web lead
**Scope:** 1-line package.json change + smoke test

---

### TD-002 — `make` required for `apps/api` build, unavailable on Windows

**Added:** 2026-04-19 (wave 1)
**Source:** `pnpm build` fails on Windows at `@investment-tracker/api:build` with "make is not recognized"
**Current workaround:** dev and CI use make; Windows devs skip local api build or install make via choco/winget
**Cost:** onboarding friction for Windows contributors
**Trigger to revisit:** if we onboard ≥2 Windows devs, or when we standardize on one build runner
**Owner:** backend lead
**Scope:** replace Makefile with Taskfile (taskfile.dev) or equivalent cross-platform runner — ~half day

---

### TD-003 — `border.default` at 1.48:1 contrast (below strict WCAG 3:1 for UI components)

**Added:** 2026-04-19 (PR #31)
**Source:** strict WCAG AA for non-text UI components requires 3:1; our default border is deliberately lighter for a calm, non-fintech-harsh look
**Current state:** `border.default = slate-300 #cbd5e1` on white = 1.48:1 (fails strict)
**Compensation:** `border.strong` (slate-400, 2.27:1) used wherever the border carries interactive meaning (buttons, focused inputs); `border.default` reserved for decorative containment
**Trigger to revisit:** if accessibility audit or user testing flags missed affordances
**Owner:** design lead
**Scope:** swap `border.default` to `border.strong` in listed primitives — 1-hour sweep; will darken visual tone

---

### TD-004 — Pre-existing `biome-ignore` comments in `packages/ui`

**Added:** 2026-04-19 (PR #32)
**Source:** biome lint errors that weren't safely autofixable; accepted with justifications rather than silencing the rules globally

Inventory (9 ignores, each with reason):

| File | Rule | Reason |
|---|---|---|
| `CountUpNumber.tsx:37` | `useExhaustiveDependencies` | deps intentionally omitted to avoid re-subscription on every render |
| `ChatInputPill.tsx:54` | `useExhaustiveDependencies` | same pattern |
| `ExplainerTooltip.tsx:37` | `useExhaustiveDependencies` | same |
| `ExplainerTooltip.tsx:41` | `useExhaustiveDependencies` | same |
| `BarChart.tsx:88` | `noArrayIndexKey` | static demo data, order never changes |
| `PaywallModal.tsx:44` | `noArrayIndexKey` | same |
| `chat demo:?` | `noArrayIndexKey` | same |
| `SegmentedControl.tsx:56` | `noNonNullAssertion` | options invariant: length ≥ 1 enforced by JSDoc/props contract |
| `SegmentedControl.tsx:72` | `noNonNullAssertion` | same |

**Trigger to revisit:** quarterly lint audit OR when any file is refactored substantially
**Owner:** web lead
**Scope:** verify each ignore is still correct; migrate to proper types or `useCallback`/memoization where it improves code — 2-4 hours quarterly

---

### TD-005 — `BellDropdown` keyboard navigation is minimal

**Added:** 2026-04-19 (PR #32)
**Source:** a11y fix wrapped menu items in `<div role="menuitem" tabIndex={0}>` with Enter/Space handlers; full arrow-key navigation between items not implemented
**Current state:** Tab moves through items linearly, Enter/Space activate. Works but not idiomatic menu navigation.
**Trigger to revisit:** first a11y audit, or user feedback, or any other menu component requiring the same treatment (we'd do it properly once)
**Owner:** web lead
**Scope:** roving tabindex + arrow handlers + home/end + close-on-escape — ~2 hours; upgrade to shared `<Menu>` primitive for reuse

---

### TD-006 — Admin bypass used to merge wave 1 PRs with red CI

**Added:** 2026-04-19 (wave 1 retrospective)
**Source:** PRs #29, #30, #31 merged with `--admin` because CI on main was red from pre-existing biome + Python setup-uv failures unrelated to the PR content
**Resolution applied:** PR #32 (`chore/fix-ci-red-main`) brought main to green; admin bypass no longer needed
**Policy going forward:** `--admin` merge is only acceptable when the red is documented pre-existing on main AND a green-main fix is queued or in progress. Never for genuine CI regressions. Each bypass should be logged in `docs/merge-log.md` with the justification.
**Trigger to revisit:** if we use `--admin` more than once in a quarter — signals a CI hygiene problem
**Owner:** project lead
**Scope:** ongoing discipline

---

### TD-007 — `oapi-codegen` upstream bug on OpenAPI 3.1 `nullable` (issue #373)

**Added:** 2026-04-19 (TASK_03)
**Source:** OpenAPI 3.1 uses `type: [string, "null"]` for nullable fields; oapi-codegen v2 doesn't yet generate correct Go types for this pattern
**Current workaround:** TASK_03 output uses optional fields where possible; where nullable is required semantically, hand-patching is tracked in `apps/api/codegen/patches/`
**Trigger to revisit:** when oapi-codegen releases a fix for [deepmap/oapi-codegen#373]; or when we hit a case where hand-patching is too fragile
**Owner:** backend lead
**Scope:** remove patches + regenerate — ~1 hour after upstream fix

---

### TD-008 — `apps/ai/uv.lock` generation is manual for new Python deps

**Added:** 2026-04-19 (PR #32)
**Source:** first commit of `uv.lock` was manual; new deps require contributors to remember to regenerate
**Current state:** no pre-commit hook for `uv lock`
**Trigger to revisit:** first time lock drift causes a CI failure
**Owner:** AI service lead
**Scope:** add `uv lock` to pre-commit or to a workspace-level script invoked on `pnpm install` — 30 min

---

## Resolved

### TD-R021 — `asynq` publisher wrapper + /market/quote cache-miss enqueue

**Resolved:** 2026-04-19 in PR #40 (SHA `11d6098`) commit `b827241`
**Was:** Core API не имел wrapper'а для публикации фоновых задач в asynq. Market-data handlers на cache-miss возвращали stale data без попытки fetch'нуть свежую цену; workers в TASK_06 оставались без upstream-publisher'а.
**Fix:**
- Новый пакет `internal/clients/asynqpub` с 6 task-type константами + 5 payload struct'ами + `Publisher` wrapper.
- Publisher — nil-safe: `p == nil || p.client == nil` → log warn + no-op (fail-open).
- `Publisher.Enabled() bool` — сигнал для handler'ов эмитить `X-Async-Unavailable: true` header (scope-cut pattern).
- Wired в /market/quote (cache miss → enqueue `fetch_quote`), /accounts/{id}/sync|reconnect, /me DELETE (deletion schedule), /exports (CSV materialise).
- `app.Deps.Asynq` — nil-safe field для dev/test environments без Redis.

---

### TD-R011 — Idempotency race: race-condition window между key-check и processing

**Resolved:** 2026-04-19 in PR #40 (SHA `11d6098`) commit `97a5cf6`
**Was:** Idempotency middleware проверял наличие ключа в Redis → если нет, пускал запрос в handler, записывал ответ в кэш в конце. Window между check и write позволял двум concurrent-запросам с одним Idempotency-Key пройти оба в handler (double-write сценарий на mutations).
**Fix:**
- Переключение на SETNX request-collapsing lock: `SET idem:{key} {pending-marker} NX EX 10` на входе.
- Если SETNX вернул 0 (ключ уже есть) → 409 IDEMPOTENCY_IN_PROGRESS с Retry-After.
- На успешном завершении — `SET idem:{key} {cached-response-json} EX 86400` (24h TTL).
- На 5xx / panic — `DEL idem:{key}` чтобы клиент мог ретраить.
- Новые методы `cache.Client.SetNX` + `cache.Client.Del` как pass-through wrappers.

---

### TD-R001 — `@investment-tracker/design-tokens` subpath exports missing types

**Resolved:** 2026-04-19 in PR #32 commit 2 (`fix(tokens): add types to subpath exports + build on typecheck`)
**Was:** `exports["./brand"]` defined as plain string (JS only), so TypeScript couldn't resolve types; fresh CI checkouts without build artifacts failed `tsc` with TS2307
**Fix:** rewrote `exports` map with `{ types, default }` objects for all JS subpaths; `typecheck` script now triggers `node build.js` to guarantee artifacts; `prepare` hook runs `pnpm install` so tokens are auto-built

### TD-R002 — Port `:8080` conflict with system java.exe on Windows dev

**Resolved:** 2026-04-19 in TASK_01 follow-up
**Was:** API default listen addr `:8080` collided with a pre-existing Java process on the dev's machine
**Fix:** made `API_LISTEN_ADDR` configurable via env, default documented as `:8090` in `.env.example`

---

## Process

- Log it here **when** you decide to defer, not weeks later
- Include the reason, the workaround, and the trigger to revisit
- Quarterly: project lead reviews active items, closes stale ones, promotes blockers
- When resolving: move to Resolved section with PR/commit reference, keep the entry (history value)
