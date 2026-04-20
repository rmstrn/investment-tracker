# Product Owner Handoff — investment-tracker

**Что это:** документ для передачи состояния между сессиями Claude. Когда чат лагает / переполнен контекстом / теряется фокус — открыть новый чат, дать промт (внизу документа), Claude поднимает весь проект по этому файлу и доп.документам.

**Last updated:** 2026-04-20 (вечер — PR #45 TASK_07 Slice 1 merged (`a622bd3`), main tip = `a622bd3` + this docs pass on top. **TASK_04 closed (9 of 9). TASK_07 Slice 1 in main.** Следующее — PR C (Fly.io deploy) параллельно с TASK_07 Slice 2.)

---

## 0. Кто я, что за проект

**Ruslan, Product Owner.** Не разработчик. Оркеструю параллельные Claude Code (CC) сессии — каждая CC-сессия работает свой PR в своём worktree (D:\investment-tracker-b3, и т.д.). Главный документный репозиторий — `D:\СТАРТАП\docs\`.

**Investment-tracker** — AI-native агрегатор инвест-портфеля. Стек: Next.js 15 (web), Go 1.25 (Core API), Python (AI Service), Postgres (Neon), Redis (Upstash), Clerk auth, Stripe billing, Fly.io deploy. MVP для EU retail investors.

**Полный brief:** `D:\СТАРТАП\docs\00_PROJECT_BRIEF.md`.

---

## 1. Текущий статус (2026-04-20)

### Волна 1 — ✅ закрыта
TASK_01 (monorepo+CI), TASK_02 (design system), TASK_03 (API contract + schema).

### Волна 2 — 🚧 в работе (TASK_04 закрыт, PR C впереди)
- **TASK_04 Core API (Go):** 9 of ~9 PRs merged.
  - ✅ A (skeleton), B1, B2a, B2b, B2c (read path), **B3-i (write path mutations, 2026-04-19, SHA `11d6098`, PR #40)**, **B3-ii-a (AI foundation + 5 handlers, 2026-04-20, SHA `8c52a4d`, PR #42)**, **B3-ii-b (AI chat sync + SSE reverse-proxy + single-writer ai_usage, 2026-04-20, SHA `c2a2afe`, PR #44)**, **B3-iii (Clerk/Stripe webhooks + webhook_events idempotency + 14 scope-cut 501 stubs, 2026-04-20, SHA `08e09f4`, PR #46)**
  - ⏳ PR C — deploy: Dockerfile + fly.toml + k6 smoke + runbook (см. `PR_C_preflight.md`). Blocked-on: 24-48h clean staging post-B3-iii desirable.
- **TASK_05 AI Service (Python):** ✅ merged (PR #34) + ✅ cleanup merged (PR #43, 2026-04-20, SHA `b6108a4`) — `record_ai_usage` dual-write удалён. Core API теперь single-writer для `ai_usage` ledger (см. PR #44 B3-ii-b для persist implementation). 404-swallow flip на strict propagation — после B3-iii (см. `RUNBOOK_ai_flip.md`).

### Волна 3 — 🟢 в работе
- **TASK_07 (Web Frontend):** **Slice 1 merged** (PR #45, SHA `a622bd3`, 2026-04-20) — Clerk auth (middleware + ClerkProvider + (auth) routes) + `(app)/dashboard` vertical slice с `PortfolioValueCardLive` поверх `GET /portfolio` + TanStack Query `usePortfolio` hook (server-hydrated initialData) + 1 Vitest smoke. ~551 LOC (значительно ниже 1200-1600 anchor — scaffold берёт половину). Slice 2+ pending (Positions / Position Detail / Chat UI / Insights / Accounts / Settings / Paywall / Vercel deploy).
- **TASK_06 (Broker Integrations):** ⏳ starts после PR C close.

### Волна 4 — 🧊 отложено
TASK_08 iOS (нужен Mac + Xcode, отдельный репо).

---

## 2. Ключевые PR SHAs

| PR | Scope | SHA | Дата |
|---|---|---|---|
| **main tip** | (после post-merge docs pass PR #45 — обновится этим коммитом) | TBD | 2026-04-20 |
| #45 | TASK_07 Slice 1: Clerk auth + middleware + (auth) routes + (app)/dashboard vertical slice + PortfolioValueCardLive + TanStack Query usePortfolio + 1 Vitest | `a622bd3` | 2026-04-20 |
| docs-only | post-merge pass PR #46 B3-iii | `0c3bea5` | 2026-04-20 |
| #46 | B3-iii: Clerk/Stripe webhooks + webhook_events idempotency + 14 scope-cut 501 stubs | `08e09f4` | 2026-04-20 |
| docs-only | CC_KICKOFF_task07_slice1 revised (+ PO sync kickoff prompts) | `a75f541` / `aa4d4a5` | 2026-04-20 |
| #44 | B3-ii-b: POST /ai/chat + POST /ai/chat/stream (SSE reverse-proxy, tee-parser, persistTurn single-writer `ai_usage`) | `c2a2afe` | 2026-04-20 |
| #43 | TASK_05 cleanup: remove `record_ai_usage` dual-write (Python) | `b6108a4` | 2026-04-20 |
| #42 | B3-ii-a: AI client + rate-limit middleware + 5 handlers (conv create/del, insights gen/dismiss/viewed) | `8c52a4d` | 2026-04-20 |
| docs-only | DECISIONS.md: ai_usage single-writer ADR (reference для PR #43) | `47276bb` | 2026-04-20 |
| docs-only | PO_HANDOFF + merge-log entry (CC-landed для clean tree перед B3-ii pre-flight) | `e96f6de` | 2026-04-20 |
| docs-only | docs sync post-#40 (14 файлов) | `84465f7` | 2026-04-20 |
| #40 | B3-i: 19 handlers + SETNX idempotency + asynqpub wrapper + X-Async-Unavailable header | `11d6098` | 2026-04-19 |
| pre-#40 fix-up | `Publisher.Enabled()` + эмиссия `X-Async-Unavailable: true` в 5 call sites | `61d6c08` | 2026-04-19 |
| #34 | TASK_05 AI Service initial merge | — | — |
| #39 | B2c closure | `fb16525` | — |
| #30 | TASK_03 API contract + schema | `08f44c2` | — |
| #29 | TASK_02 design screenshots | — | — |

> **Notes на расхождение SHA:**
> - `b6108a4` (PR #43) смерджен после `8c52a4d` (PR #42) — обе merge-squash, squash-only policy соблюдена.
> - `47276bb` — docs-only direct-to-main, нужен был CC-task05 как reference для cleanup work (grep DECISIONS.md вернул 0 matches до commit'а — классический timing-gap).
> - `e96f6de` — CC-landed docs (PO не успел закоммитить перед B3-ii start). Pattern на будущее: **PO коммитит docs до команды start CC**, иначе CC закоммитит за него и tip уедет.
> - `8532301` — осиротевший local commit pre-rebase. В `origin/main` живёт только `84465f7`.

Полный лог — `merge-log.md`.

---

## 3. Как я работаю с CC (правила орекстровки)

**Cycle per PR:**
1. CC анонсирует pre-flight audit на слайс.
2. CC присылает GAP REPORT: scope, CI status (ожидаем 8/8 green), LOC count, closed/opened TDs, scope-adjacent changes, контракт подтверждён.
3. Я (PO-Claude) оцениваю: есть ли риск? что докинуть? дать ли отмашку?
4. Ruslan мержит (squash-only политика; admin-bypass только по TD-006).
5. PO-Claude делает post-merge docs pass: merge-log + TECH_DEBT + TASK файл + README.
6. Ruslan ack'ит → CC стартует следующий PR.

**Squash-only policy.** История на main — только squash-коммиты. Rebase-merge и merge-commits запрещены.

**Admin-bypass policy (TD-006):** только при CI-outage или hotfix после P1 incident declaration. Логируется в `merge-log.md` с причиной.

**State hygiene:** каждая новая сессия **ВЕРИФИЦИРУЕТ через Read** что файл реально на диске, прежде чем подтверждать обновление. Прецедент был: предыдущая сессия «обновила» 10+ файлов, но большинство не сохранилось — пришлось восстанавливать.

---

## 4. Active TDs (newest first)

| ID | Priority | Description | Pair / Links |
|---|---|---|---|
| TD-059 | P3 | `/portfolio/tax/export` downloadable bundle — scope-cut 501 в B3-iii | overlap TD-039 |
| TD-058 | P2 | GDPR `/me/export` bundle aggregation — scope-cut 501 в B3-iii | legal review pre-EU launch |
| TD-057 | P2 | Billing CRUD endpoints — scope-cut 501 в B3-iii; нужен prod Stripe catalog | after PR C |
| TD-056 | P2 | Clerk Backend SDK — 2FA × 5 + session mutations × 2; scope-cut в B3-iii | pair TD-027 |
| TD-055 | P2 | AI stream OpenAPI spec drift: Core API re-serialize'ит SSE frames в openapi shape; schema эволюция на AI Service стороне требует sync update в Core translator | contract-test fixture |
| TD-054 | P3 | CC agent memory lives outside repo — shared invariants gap | mitigation: DECISIONS.md дисциплина |
| TD-053 | P2 | `/ai/insights/generate` per-week/per-day tier gate (1/wk Free, 1/day Plus) | planned Redis counter |
| TD-052 | P2 | AIRateLimit pre-increment overcount (429 или 5xx) | reserve+commit Lua |
| TD-051 | P2 | SSE parser в Core API дублирует AI Service знание frame format | contract-test fixture |
| TD-050 | P1 | `/ai/insights/generate` Path B hangs 5-30s (Fly.io idle 60s) | TASK_06 async worker |
| TD-049 | P3 | SSE Last-Event-ID resume protocol | TASK_08 mobile launch |
| TD-048 | P3 | SSE error event payload: add `request_id` field (cross-service) | TASK_05 coord |
| TD-047 | **P1 pre-GA** | CSVExport tier flag — хрупкая корреляция с AIMessagesDaily ≥ 100 | standalone |
| TD-046 | P2 | Aggregator provider clients (SnapTrade / Plaid / broker APIs) | inherits → TASK_06 |
| TD-045 | P1 | Hard-delete worker must re-check `deletion_scheduled_at IS NOT NULL` перед wiping. Publisher done B3-i (`61d6c08`), Clerk user.deleted webhook (PR #46) использует тот же contract | **⇔ TD-041** |
| TD-041 | P1 | `hard_delete_user` worker consumer (7-day delayed task). Publisher-path complete; два call-site'а (DeleteMe + Clerk user.deleted webhook); consumer в TASK_06 | **⇔ TD-045** |
| TD-039 | P2 | CSV export worker consumer | будет после deploy workers (PR D) |
| TD-007 | P3 | oapi-codegen OpenAPI 3.1 nullable upstream bug | workaround works |
| TD-006 | — | Admin-bypass policy (not a debt, policy document) | see merge-log.md |

**Resolved by PR #40:**
- TD-R011 — SETNX idempotency lock (was: race window между key-check и processing)
- TD-R021 — asynq publisher wrapper + /market/quote cache-miss enqueue

Полный файл: `TECH_DEBT.md`.

---

## 5. Active decisions quick-ref

| Topic | Decision | Почему |
|---|---|---|
| Go version | 1.25+ | `go tool` pinned dev deps (sqlc, oapi-codegen) |
| API framework | **oapi-codegen spec-first** (NOT huma v2) | фронт/iOS качают клиенты из той же spec — риск рассинхрона в code-first |
| Money | shopspring/decimal | никогда float64 |
| Encryption | AES-256-GCM envelope | BYTEA blob: `[kek_id(1) \|\| nonce_outer(12) \|\| encrypted_dek(32+16) \|\| nonce_inner(12) \|\| ciphertext \|\| tag(16)]`; KEK в env (`KEK_MASTER_V1` + `KEK_PRIMARY_ID`) |
| Tiers | `tiers.Limits` struct + `RequireTier(flag func(l TierLimits) bool)` middleware | ❌ anti-pattern: `if user.Tier == "pro"`; ✅ `if tiers.For(user.Tier).TaxReports` |
| Idempotency | SETNX lock: `SET idem:{key} pending NX EX 10` → 409 IDEMPOTENCY_IN_PROGRESS; payload cached 24h | TD-R011 closed |
| Pagination | Cursor-based (base64), не offset | scale для transactions |
| IDs | UUID v7 (не v4) | монотонные, лучше для индексов |
| Auth | dual-mode: Clerk JWT OR `CORE_API_INTERNAL_TOKEN` + X-User-Id header | для AI Service / workers |
| SSE | `httputil.ReverseProxy` + `FlushInterval: -1` | typing-эффект не буферизуется |
| Clerk webhooks | svix SDK | идемпотентность через `webhook_events (source, event_id)` PK + ON CONFLICT DO NOTHING |
| Stripe webhooks | stripe-go SDK | аналогично |
| Queue | asynq (Redis-backed); queues: default/sync/prices/insights/exports/deletions | `asynqpub.Enabled()` в проде пока `false` (workers не задеплоены) |

Полный ADR лог: `DECISIONS.md`.

---

## 6. Scope-cut headers (all 10)

Core API эмитит header когда фича частично недоступна — клиент рендерит degraded state. **Всё задокументировано в `02_ARCHITECTURE.md`.**

| Header | Trigger |
|---|---|
| X-Clerk-Unavailable | Clerk webhook не доставлен → stale user state |
| X-Search-Provider | Polygon search rate-limited → cached fallback |
| X-Benchmark-Unavailable | /portfolio/performance без S&P сравнения |
| X-Analytics-Partial | /portfolio/allocation неполный (missing price) |
| X-Withholding-Unavailable | dividend withholding tax не посчитан |
| X-Tax-Advisory | /insights генерит tax advice — UI должен показать disclaimer |
| X-FX-Unavailable | FX курс не найден → позиция в native currency |
| X-Partial-Portfolio | один из accounts не засинкан |
| X-Export-Pending | CSV export в очереди (async) |
| X-Async-Unavailable | asynq publisher disabled (workers не задеплоены) — **эмитится сейчас на проде** |

---

## 7. File map

| Файл | Назначение |
|---|---|
| `README.md` | Индекс + wave status |
| `00_PROJECT_BRIEF.md` | Концепция, аудитория, USP |
| `01_TECH_STACK.md` | Стек технологий |
| `02_ARCHITECTURE.md` | Архитектура + модель данных + scope-cut headers + patterns |
| `03_ROADMAP.md` | MVP план по месяцам |
| `04_DESIGN_BRIEF.md` | Дизайн-система v1.1 |
| `DECISIONS.md` | Engineering ADR log |
| `TECH_DEBT.md` | Tech debt tracker |
| `merge-log.md` | Журнал merge-событий + policy |
| `CLAUDE_CODE_PROMPTS.md` | Шаблоны для CC сессий |
| `RUNBOOK_ai_flip.md` | AI Service 404-swallow → strict flip (после B3-iii) |
| `PR_C_preflight.md` | GAP-анализ финального PR C (Fly.io deploy) |
| `PO_HANDOFF.md` | **ЭТОТ ФАЙЛ** — handoff между сессиями |
| `TASK_01..08_*.md` | Таски по компонентам |

---

## 8. Known gotchas / прецеденты

1. **State loss между сессиями.** Было: сессия «обновила» 10+ файлов, но ~80% на диске не было. Защита: всегда Read перед confirm.
2. **`gh pr merge --delete-branch` может упасть** на local-checkout если worktree уже на main. Remote-side мерж всё равно проходит — local cleanup отдельно: `git worktree remove --force D:/investment-tracker-b3 && git worktree prune`.
3. **X-Async-Unavailable «implied» vs emitted.** В GAP REPORT PR #40 CC сначала написал что header «implied», при probing выяснилось — не эмитился. Фикс: pre-merge commit 61d6c08. Урок: на scope-cut header'ы требовать явной демонстрации, не подразумеваний.
4. **Ghost files в README.** `merge-log.md`, `RUNBOOK_ai_flip.md`, `PR_C_preflight.md` были проиндексированы, но на диске отсутствовали. Фикс: все созданы 2026-04-20.
5. **TASK_08 был Волна 2** — устаревшая метка, поправлено на Волна 4 (deferred) для консистентности с README.

---

## 9. Параллельные треки

**Track 1 — Core API (TASK_04): DONE** ✅
9 of 9 PRs merged. PR C (Fly.io deploy) unblocked, ждёт morning polish pass.
Последнее: B3-iii (PR #46, squash `08e09f4`) → docs sync `0c3bea5`.

**Track 2 — Web Frontend (TASK_07): Wave 3 🟢 in flight**
Slice 1 merged (PR #45, squash `a622bd3`) — Clerk auth + `(app)/dashboard`
vertical slice + `PortfolioValueCardLive` + 1 Vitest. LOC ~551. Значительно
ниже 1200-1600 anchor (anchor был cap'ом, не floor'ом) — scaffold
(`PortfolioCard`, api-client wrapper, `AppShell`/`Sidebar`/`TopBar`,
gain/loss tokens) делает половину работы. Main tip post-docs = этот
docs-pass commit.

### Next

- **TASK_07 Slice 2** — Positions list + Position Detail (анкор TBD,
  kickoff пишется когда Slice 1 validated post-merge smoke — docker
  compose + Go API + real Clerk dev project + `/dashboard` runtime).
- **PR C deploy** — после morning polish (`PR_C_preflight.md` §
  "Follow-up TDs" — перенумеровать TD-048..052 (заняты в TECH_DEBT.md,
  плюс TD-056..059 от B3-iii) в TD-060+, либо placeholder `TD-TBD: ...`;
  плюс § 5/7/6 cleanup items из раздела "Утром — опциональный docs
  polish pass" ниже).
- **AI Service 404-swallow flip** — после prod soak PR C
  (`RUNBOOK_ai_flip.md`).

**Blocked-on для PR C:** 24-48h clean staging post-B3-iii desirable.

**Key reference points (предыдущие PRs):**
- PR #46 (B3-iii) `08e09f4` — Clerk/Stripe webhooks + webhook_events idempotency + 14 scope-cut 501 stubs. TD-056..059 opened.
- PR #45 (TASK_07 Slice 1) `a622bd3` — web vertical slice (см. merge-log entry наверху).
- PR #44 (B3-ii-b) `c2a2afe` — AI chat sync + SSE reverse-proxy + single-writer `ai_usage`. TD-055 opened.
- PR #42 (B3-ii-a) `8c52a4d` — AI client foundation + rate-limit middleware + 5 handlers.
- PR #43 (TASK_05 cleanup) `b6108a4` — Python `record_ai_usage` dual-write удалён.

**Worktree cleanup (на PO):**
- `D:/investment-tracker-b3iii` — `git worktree remove --force D:/investment-tracker-b3iii && git worktree prune`.
- `D:/investment-tracker-task07-s1` — `git worktree remove --force D:/investment-tracker-task07-s1 && git worktree prune` + локальную ветку `feature/task07-slice1` уже нет на remote, локально можно снести `git branch -D feature/task07-slice1 post-merge-task07-s1` из D:\СТАРТАП.

**Ключевая архитектурная точка:** AI chat + persistence полностью в main; web vertical slice готов против `/portfolio`. Клиенты (web/iOS) строятся против стабильного OpenAPI контракта.

### Что НЕ готово в UI (scope Slice 2+)

- Positions list + Position Detail — Slice 2.
- Chat UI (streaming) — Slice 2 или 3.
- Insights feed, Accounts CRUD, Settings, Paywall, Pricing marketing — Slice 3+.
- Visual disabled state для placeholder nav-слотов Sidebar — требует расширения `NavItem` API в `packages/ui` (добавить `disabled?: boolean` + render logic), отдельным micro-slice.
- `usePortfolioHistory` + period toggle + sparkline — Slice 2+.
- Vercel preview на PR — отдельный setup PR.
- Real Sentry/PostHog DSN wiring — после publishable DSN выданы.
- Real Clerk dev project + runtime sign-in/sign-up smoke — PO post-merge.

### Утром — опциональный docs polish pass

Нестрого обязательно, но если есть 30 мин:
1. PO_HANDOFF § 5 Decisions quick-ref → ужать до ссылки + highlights (сейчас дублирует DECISIONS.md).
2. PO_HANDOFF § 7 File map → расширить до всех 21 файла (сейчас 14).
3. TECH_DEBT → добавить legend сверху Active: «P1 = GA blocker, P2 = post-GA OK, P3 = polish».
4. RUNBOOK_ai_flip → header-note: «Status 2026-04-20: PR #42/#43/#44 merged; flip trigger = after B3-iii».
5. 03_ROADMAP → закрыть dangling Doppler TODO.
6. Tier caps: в 00_PROJECT_BRIEF + TASK_04 note «code is source of truth (Free=5, Plus=50, Pro=∞)».

### Открытые TDs (P1/P2)

- **TD-047** — CSVExport tier flag (P1 pre-GA).
- **TD-045 ⇔ TD-041** — hard-delete worker + undo re-check (P1). Часть B3-iii scope.
- **TD-048..053** — SSE/rate-limit/insights-gate polish (low-medium priority).
- **TD-054** — CC memory portability (low priority).
- **TD-055** — AI stream OpenAPI spec drift (P2, Core/TASK_05 coord). Phase 1 ~60 LOC — contract fixture + test.

---

## 10. Draft response to CC in flight (последний ответ, который готовился)

На случай если нужно отправить CC прямо сейчас — вот что было подготовлено как реакция на его «Жду отмашки» после мержа #40:

> Worktree cleanup моя забота (`git worktree remove --force D:/investment-tracker-b3 && git worktree prune` + `git pull --ff-only` в D:\СТАРТАП).
>
> Docs pass закрыт полностью. Зелёный свет на B3-ii. Anchor 2000-2500 LOC.
>
> Мой POV на pre-flight items (см. секцию 9 этого документа — детально расписаны все 9 пунктов).
>
> Жду GAP REPORT.

---

## 10.5 Промт для параллельной TASK_05 cleanup сессии

Скопировать в новый CC чат. Scope — удалить `record_ai_usage` вызов из Python AI Service. Блокер для B3-ii-b merge.

```
Привет. Я Ruslan, Product Owner проекта investment-tracker
(AI-инвест-трекер: Next.js web + Go Core API + Python AI Service).
Главный док-репозиторий: D:\СТАРТАП.

У нас параллельно идёт TASK_04 B3-ii-a в другом CC чате (Go Core API,
свой worktree). Я прошу тебя сделать МАЛЕНЬКУЮ правку в TASK_05
(Python AI Service, apps/ai/...).

Контекст и все решения — в:
  D:\СТАРТАП\docs\PO_HANDOFF.md (прочти целиком первым делом)

Scope правки (ничего другого не трогать):

В AI Service сейчас есть вызов core_api.record_ai_usage(...)
после каждого Anthropic response (см. TASK_05 § 7 и код
в apps/ai/src/ai_service/... — скорее всего в handlers chat/stream
и insights/generate, и в клиенте core_api.py).

Этот вызов нужно УДАЛИТЬ полностью. Причина: дубликат учёта.
Core API теперь сам пишет ai_usage в своей DB transaction после
SSE close (это делается в TASK_04 B3-ii-b). Если оба пишут —
ledger дублируется, биллинг завышен x2.

Что сделать:
1. Найти все call sites `record_ai_usage` / `record_ai_usage_async`
   и любые связанные с записью usage в Core API.
2. Удалить вызовы. Удалить метод в core_api.py клиенте если он
   больше нигде не используется.
3. Удалить тесты которые mock'ают этот вызов (или обновить если
   они проверяют полный flow — тогда просто убрать expectation
   на usage call).
4. Добавить короткий комментарий на месте удалённого вызова
   (один раз, в главной точке flow):
   # ai_usage tracking owned by Core API (TASK_04 B3-ii-b).
   # See docs/PO_HANDOFF.md § 9 (ai_usage dual-write resolution).
5. Запустить тесты локально, убедиться что всё зелёное.
6. Открыть PR — название:
   "TASK_05: remove Core API ai_usage call (dual-write fix)"
   В описании сослаться на TASK_04 B3-ii-b dependency.

Что НЕ делать:
- Не трогать бизнес-логику chat/stream или insights/generate.
- Не трогать SSE error events (TD-048 — отдельная работа позже).
- Не менять ничего кроме удаления usage-вызовов.
- Не переписывать core_api.py клиент — только удалить ненужный метод.
- Не добавлять новые зависимости.

Размер: ожидаю 50-150 LOC touched, очень маленький PR.

Timing: нужно смерджить до того как основной CC дойдёт до
B3-ii-b (через ~3 дня). Желательно за 1-2 дня.

Мой стиль общения (из PO_HANDOFF):
- Русский, коротко, без overformatting.
- Decisions-first: сначала что делаешь, потом почему.
- Видишь риск — говори сразу.
- Верифицируй каждый Edit через Read (state loss бывал).

Первым делом: прочти PO_HANDOFF.md, README.md, TASK_05_ai_service.md.
Потом grep'ни по apps/ai/ все call sites record_ai_usage. Потом дай
мне короткий план-дельту (что удалить, где, размер) до write-phase.
```

---

## 11. Мой стиль общения (для нового Claude)

- **Русский по умолчанию**, английские технические термины OK.
- **Коротко, без over-formatting** (минимум bold/headers/bullets, prose-first).
- **Decisions-first:** сначала что делать, потом почему.
- **Видишь риск — говори сразу**, не жди вопроса.
- **Автономен в scope**: «как считаешь нужное» — значит доверяю решать самому.
- **Pushback welcome** — если вижу что ты ошибся или CC ошибся, скажу; жду того же.
- **Файлы создавать в `D:\СТАРТАП\docs\`**, scratch в outputs.
- **Links через `computer://`** когда расшариваю файл.
- **TodoList** использовать активно для многошаговой работы.
- **Всегда верифицировать через Read** перед confirm обновления — state loss уже был.

---

## 12. Continuation prompt (копировать в новый чат)

```
Привет. Я Ruslan, Product Owner проекта investment-tracker
(AI-инвест-трекер: Next.js web + Go API + Python AI Service).
Оркеструю параллельные Claude Code сессии — каждая CC работает
свой PR в отдельном worktree. Главный проект: D:\СТАРТАП.

Предыдущая сессия забагала (context window). Полный контекст
и handoff — в файле:

  D:\СТАРТАП\docs\PO_HANDOFF.md

Прочти его ПЕРВЫМ ДЕЛОМ. Для фона также пробежись по:

  D:\СТАРТАП\docs\README.md
  D:\СТАРТАП\docs\02_ARCHITECTURE.md
  D:\СТАРТАП\docs\TECH_DEBT.md
  D:\СТАРТАП\docs\merge-log.md

Текущий статус в двух словах:
- main tip = b6108a4 (PR #43 TASK_05 cleanup squash, 2026-04-20)
- PR #42 (B3-ii-a, SHA 8c52a4d) смержен 2026-04-20 — AI client
  foundation + rate-limit middleware + 5 handlers
- PR #43 (TASK_05 cleanup, SHA b6108a4) смержен 2026-04-20 —
  record_ai_usage dual-write удалён, Core API = single writer
- Следующий PR — B3-ii-b (POST /ai/chat sync + POST /ai/chat/stream
  SSE reverse-proxy + tee-parser + ai_usage INSERT в DB tx). Anchor
  1500 LOC. Все зависимости сняты. Acceptance criteria — в § 9.

Стиль:
- Отвечай по-русски, коротко, без over-formatting
- Decisions-first (что делать → почему)
- Видишь риск — говори сразу
- Файлы создавай в D:\СТАРТАП\docs\
- Верифицируй через Read перед confirm (state loss уже был)

Начни с того, что прочитал PO_HANDOFF.md и скажи готов.
Потом ждём GAP REPORT от CC или мои новые вводные.
```
