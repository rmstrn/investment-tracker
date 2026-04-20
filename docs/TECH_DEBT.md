# Tech Debt Log

Running ledger of known-but-accepted debt. Each item has an owner (who revisits), a trigger (when to revisit), and a scope (how big the fix is).

Newest entries at the top. When an item is resolved, move it to the "Resolved" section at the bottom with the resolution commit/PR.

---

## Active

### TD-065 — `TransactionRow.kind`: support split events

**Added:** 2026-04-20 (PR #48 / TASK_07 Slice 2)
**Priority:** P3
**Source:** `packages/ui` `TransactionRow.kind` enum = `buy | sell | dividend | deposit | withdrawal | fee`. OpenAPI `TransactionType` enum включает `split` — для которого нет mapping в `kind` (нет cash flow, нет amount column semantics, иконка buy/sell не подходит). PR #48 filter'ит `split` события из `/positions/[id]` Transactions tab + surface'ит footnote `"Stock splits hidden (N)"` если хотя бы один split присутствует в fetched pages.
**Risk:** low — splits не искажают денежные суммы на detail page (фильтр client-side, API contract не меняется, ledger в БД не трогаем). Visual-only gap: пользователь не видит что 2:1 split произошёл, информация про изменение quantity теряется в UI (хотя сам факт изменения quantity уже отражён в `position.quantity`).
**Fix:** расширить `TransactionRow.kind` value `'split'`. Display: ratio (`2:1`) + execution date, no amount column (или em-dash). Domain helper `splitRatio(t: Transaction): string` — парсит `t.source_details` либо compute из `quantity_before`/`quantity_after` (требует backend контракт — возможно уже в `source_details` JSONB при импорте). UI: muted tone, distinct icon (`lucide` `Split`). Test coverage: один smoke для splits-variant `TransactionRow`.
**Trigger to revisit:** первый user feedback про отсутствие splits в Transactions list; OR первый seed dataset со split events для UI testing; OR broker integration (TASK_06) начинает поставлять split events массово.
**Owner:** frontend + design
**Scope:** ~80 LOC (TransactionRow kind extension + splitRatio helper + test + footnote cleanup в apps/web `PositionTransactionsTab`) — 0.5 day

---

### TD-059 — `/portfolio/tax/export` downloadable bundle

**Added:** 2026-04-20 (PR #46 / B3-iii)
**Priority:** P3
**Source:** openapi defines `GET /portfolio/tax/export` returning a downloadable tax package (CSV/PDF). B3-iii shipped a 501 stub; real implementation overlaps TD-039 (export-job worker) + jurisdiction-specific rendering templates.
**Risk:** low — не влияет на Pro-tier tax report JSON (`GetPortfolioTax` работает). Downloadable export — convenience feature, не блокер GA.
**Fix:** after export-job worker lands (TASK_06 / TD-039), add renderer per jurisdiction (DE/US/UK/FR/ES/NL) + enqueue pattern matching existing `/exports` flow. Wire stub → real handler.
**Trigger to revisit:** TASK_06 worker slice landed, product опционально prioritizes tax downloads.
**Owner:** backend + design (jurisdiction templates)
**Scope:** ~200 LOC handler + per-jurisdiction renderer packages — 1-2 days per jurisdiction

---

### TD-058 — GDPR `/me/export` data bundle

**Added:** 2026-04-20 (PR #46 / B3-iii)
**Priority:** P2 (GDPR compliance — требуется для EU retail launch)
**Source:** openapi `GET /me/export` → `UserExportBundle`. B3-iii shipped 501 stub — aggregation handler не реализован. Empty/partial bundle misrepresents user data, поэтому честнее 501 чем empty-200.
**Risk:** medium — GDPR Article 15 (right of access) expects a responsive export within a month. MVP launch без endpoint'а = юридически наш `/me/export` должен работать хотя бы на запрос через support. Current gap = soft risk.
**Fix:** handler aggregates all per-user tables (users, accounts, transactions, positions, portfolio_snapshots, ai_conversations, ai_messages, insights, usage_counters, ai_usage, notifications, notification_preferences, audit_log), optionally decrypts `accounts.credentials_encrypted` (or omits), returns signed JSON. Consider async via export-job flow если размер большой.
**Trigger to revisit:** перед public EU launch (GA blocker for compliance), OR первый support-ticket с запросом GDPR export.
**Owner:** backend + legal review
**Scope:** ~200 LOC aggregation + test fixtures

---

### TD-057 — Billing CRUD endpoints after prod Stripe catalog

**Added:** 2026-04-20 (PR #46 / B3-iii)
**Priority:** P2 (зависит от Stripe prod setup, не блокер CI)
**Source:** 5 `/billing/*` endpoints (GET subscription, POST checkout, POST portal, GET invoices, POST cancellation-feedback) зашли scope-cut 501 stubs. `/billing/webhook` уже live (PR #46) — это client-facing half Stripe integration, требует:
  1. Prod Stripe product+price catalog (price_id'ы для STRIPE_PRICE_PLUS/PRO уже переменные env'а).
  2. Stripe Customer Portal config в dashboard.
  3. `cancellation_feedback` таблица (мини-миграция).
  4. Real Stripe `client.CheckoutSessions.New` с метаданным `user_id` (для webhook resolve fallback — pattern уже закреплён в B3-iii).
**Risk:** low — пока продовый Stripe не настроен, эти endpoints не нужны. Webhook без them'а graceful degradation через warn+200 до первой checkout-через-UI.
**Fix:** отдельный slice после PR C. Handler'ы используют client-instance stripe.Client (per-request `client.New(cfg.StripeSecretKey, nil)`) чтобы оставаться consistent с webhook-side no-global-stripe.Key.
**Trigger to revisit:** prod Stripe setup complete (product catalog + portal config + price_id'ы published).
**Owner:** backend lead + billing ops
**Scope:** ~400-500 LOC (5 handlers + cancellation_feedback миграция + tests) — 1-2 days

---

### TD-056 — Clerk Backend SDK wiring (2FA + session mutations)

**Added:** 2026-04-20 (PR #46 / B3-iii)
**Priority:** P2
**Pair:** TD-027 (original Clerk SDK gap — оригинально только про `GET /me/sessions`). TD-056 — расширение на полный surface: 2FA × 5 + `DELETE /me/sessions/{id,others}` × 2.
**Source:** 7 endpoints'ов proxied в Clerk Management API (openapi comment § 234: "All 2FA + session endpoints proxy to Clerk Management API"). B3-iii shipped:
  - `GET /me/2fa` — empty-state-200 + `X-Clerk-Unavailable` (matches ListMySessions pattern, `{enabled: false, backup_codes: {remaining: 0}}`).
  - POST `/me/2fa/{enroll,verify,disable,backup-codes/regenerate}` — 501 NOT_IMPLEMENTED + `X-Clerk-Unavailable`.
  - DELETE `/me/sessions/{id}`, `/me/sessions/others` — 501 NOT_IMPLEMENTED + `X-Clerk-Unavailable`.
**Risk:** low — web/iOS могут реализовать 2FA напрямую через Clerk SDK (not proxied через наш API). Наши endpoints — convenience для UI stability + fleet visibility. Прямой Clerk SDK — workaround до TD-056.
**Fix:** add Clerk Backend SDK (`github.com/clerk/clerk-sdk-go/v2`) в `app.Deps`. Handler'ы вызывают `clerkClient.Users.VerifyTOTP(...)`, `clerkClient.Sessions.Revoke(...)` и т.п. Empty-state на `GET /me/2fa` → real `Users.Get(clerkUserID)` + parsing 2FA enrolment fields.
**Trigger to revisit:** web UI готов интегрировать 2FA flow; OR первый enterprise-customer запрос на session management.
**Owner:** backend lead
**Scope:** ~200 LOC (SDK wiring + 7 handlers + tests с Clerk SDK stub) — 1 day

---

### TD-055 — AI stream OpenAPI spec drift (re-serialize in Core API)

**Added:** 2026-04-20 (PR #44 / B3-ii-b)
**Priority:** P2
**Source:** AI Service SSE frames (`ai_service/models.py`) diverged from the openapi `AIChatStreamEvent` shape — `message_start` без `conversation_id`, `content_delta {text}` vs openapi `{index, delta:{text}}`, `message_stop` несёт `usage: TokenUsage` вместо `{message_id, tokens_used}`, `error` несёт `{message, code}` вместо обёрнутого `ErrorEnvelope`. Core API `sseproxy/translator.go` сейчас re-serialize'ит каждый frame в openapi-compliant форму перед отдачей клиенту.
**Risk:** любая schema эволюция на AI Service side должна синхронно отражаться в Core API serializer, иначе silent drift либо на клиенте (web/iOS codegen от openapi) либо на Core tee-parser (который собирает content blocks для persist). Единая точка изменения сейчас — переписать translator + опционально openapi fix.
**Mitigation:** contract test между AI Service canonical fixture frames и Core API re-serialize output. Фаза 1 — shared fixture set + парный тест. Фаза 2 — align openapi spec к AI Service shape OR align AI Service к openapi (cross-service решение).
**Trigger to revisit:** первый новый frame type / field в AI Service SSE schema; OR перед public GA когда mobile/web клиенты завязываются на openapi codegen жёстко.
**Owner:** backend (Core API) + AI lead (TASK_05) для coord.
**Scope:** фаза 1 ~60 LOC (fixture file + test); полный spec-align — отдельная story.

---

### TD-054 — CC agent memory lives outside repo (shared invariants gap)

**Added:** 2026-04-20 (flag from TASK_05 cleanup CC, post-PR #43)
**Source:** каждая Claude Code сессия пишет свою memory в `C:\Users\<user>\.claude\projects\<project>\...` — вне репозитория. Новые CC сессии не видят выводы предыдущих (например TASK_05 CC записал invariant «ai_usage owner = Core API» в local memory note, но B3-ii-b CC этого файла не получит).
**Current mitigation:** shared invariants дублируются в `docs/PO_HANDOFF.md` и `docs/DECISIONS.md` — новые CC читают их первым делом. Практически проблема не острая, пока PO поддерживает дисциплину записи decisions в DECISIONS.md.
**Risk:** низкий — если PO забудет записать decision в doc, новый CC может переизобретать или расходиться. Единичная точка отказа = дисциплина PO.
**Fix options:**
  a. `docs/CC_MEMORY/` в репо — каждая CC сессия commit'ит свою memory note как artifact. Git-версионировано. Минус: шум в commits, memory меняется часто.
  b. Convention: любой long-lived invariant из CC memory → зеркалится в DECISIONS.md автоматически (prompt update для CC).
  c. Оставить как есть — PO owns invariants в DECISIONS/PO_HANDOFF, CC memory считается ephemeral cache.
**Trigger to revisit:** первый incident drift между CC сессиями (один CC ведёт себя inconsistent с другим из-за missing invariant).
**Owner:** PO + any CC
**Scope:** (b) самый дешёвый — update continuation prompt template, ~5 LOC в PO_HANDOFF § 12.

---

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
**Status note (2026-04-20):** publisher path verified done в B3-i (`61d6c08`). Clerk `user.deleted` webhook (PR #46 B3-iii) uses the same contract — enqueue через `asynqpub.TaskHardDeleteUser` + `HardDeleteGracePeriod` delay + `X-Async-Unavailable` when publisher off. Comment-anchor в `apps/api/internal/clients/asynqpub/publisher.go:159` фиксирует requirement для consumer. Actively Active до merge TASK_06.
**Trigger to revisit:** вместе с TD-041 в TASK_06.
**Owner:** workers lead (TASK_06)
**Scope:** ~10 LOC + test сценарий undo

---

### TD-041 — `hard_delete_user` worker consumer

**Added:** 2026-04-19 (PR #40 / B3-i)
**Pair:** **implements** TD-041 but **requires** TD-045 (no-op on undo). Не катить без TD-045.
**Source:** DELETE /me publisher уже в Core API (PR #40). Consumer-side — в TASK_06.
**Current state:** задача enqueue'ится с delay=7d, но воркера ещё нет — задачи копятся в asynq `default` queue.
**Status note (2026-04-20):** publisher-path complete и усилен в B3-iii. Два call-site'а делают enqueue: (1) `DeleteMe` в `me_mutations.go` (user-initiated); (2) `handleClerkUserDeleted` в `webhook_clerk.go` (Clerk webhook driven). Оба следуют одному contract'у. Consumer остаётся scope TASK_06.
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
