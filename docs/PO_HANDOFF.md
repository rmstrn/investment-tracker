# Product Owner Handoff — investment-tracker

**Что это:** документ для передачи состояния между сессиями Claude. Когда чат лагает / переполнен контекстом / теряется фокус — открыть новый чат, дать промт (внизу документа), Claude поднимает весь проект по этому файлу и доп.документам.

**Last updated:** 2026-04-20 (вечер — PR #49 PR C Core API deploy infra merged (`fa9c9dc`), main tip = `fa9c9dc` + this docs pass on top. **TASK_04 closed 10 of 10.** Wave 2 code-complete. Впереди — post-merge operational setup (Doppler/Fly apps/DNS/first deploys) + AI 404-swallow flip + TASK_07 Slice 3 + PR D (workers).)

---

## 0. Кто я, что за проект

**Ruslan, Product Owner.** Не разработчик. Оркеструю параллельные Claude Code (CC) сессии — каждая CC-сессия работает свой PR в своём worktree (D:\investment-tracker-b3, и т.д.). Главный документный репозиторий — `D:\СТАРТАП\docs\`.

**Investment-tracker** — AI-native агрегатор инвест-портфеля. Стек: Next.js 15 (web), Go 1.25 (Core API), Python (AI Service), Postgres (Neon), Redis (Upstash), Clerk auth, Stripe billing, Fly.io deploy. MVP для EU retail investors.

**Полный brief:** `D:\СТАРТАП\docs\00_PROJECT_BRIEF.md`.

---

## 1. Текущий статус (2026-04-20)

### Волна 1 — ✅ закрыта
TASK_01 (monorepo+CI), TASK_02 (design system), TASK_03 (API contract + schema).

### Волна 2 — ✅ code-complete (10/10 PRs merged; operational setup впереди)
- **TASK_04 Core API (Go):** 10 of 10 PRs merged.
  - ✅ A (skeleton), B1, B2a, B2b, B2c (read path), **B3-i (write path mutations, 2026-04-19, SHA `11d6098`, PR #40)**, **B3-ii-a (AI foundation + 5 handlers, 2026-04-20, SHA `8c52a4d`, PR #42)**, **B3-ii-b (AI chat sync + SSE reverse-proxy + single-writer ai_usage, 2026-04-20, SHA `c2a2afe`, PR #44)**, **B3-iii (Clerk/Stripe webhooks + webhook_events idempotency + 14 scope-cut 501 stubs, 2026-04-20, SHA `08e09f4`, PR #46)**, **PR C (deploy infrastructure — Dockerfile polish + fly.toml prod/staging + deploy-api.yml pipeline + k6 smoke + Doppler-first secrets + RUNBOOK_deploy, 2026-04-20, SHA `fa9c9dc`, PR #49)**.
  - ⏳ Post-merge operational: PO setup Doppler project + Fly apps + GitHub environments/secrets + DNS + первый staging deploy + 24-48h soak + prod cutover. Roadmap — `RUNBOOK_deploy.md § Prerequisites`.
- **TASK_05 AI Service (Python):** ✅ merged (PR #34) + ✅ cleanup merged (PR #43, 2026-04-20, SHA `b6108a4`) — `record_ai_usage` dual-write удалён. Core API теперь single-writer для `ai_usage` ledger (см. PR #44 B3-ii-b для persist implementation). 404-swallow flip на strict propagation — после PR C prod soak (см. `RUNBOOK_ai_flip.md`).

### Волна 3 — 🟢 в работе
- **TASK_07 (Web Frontend):** **Slice 1 + Slice 2 merged**. Slice 1 (PR #45, SHA `a622bd3`, 2026-04-20) — Clerk auth + `(app)/dashboard` vertical slice с `PortfolioValueCardLive` + TanStack Query `usePortfolio` + 1 Vitest smoke. ~551 LOC. Slice 2 (PR #48, SHA `366d12f`, 2026-04-20) — `(app)/positions` list + `(app)/positions/[id]` detail read-only: toolbar (sort/group/filter) + desktop/mobile table + Overview/Transactions tabs + price chart поверх `@investment-tracker/ui/charts` subpath (Recharts zero direct dep в apps/web → zero drift с параллельным PR C) + 4 TanStack Query хука (`usePositions` / `usePosition` / `usePositionTransactions` infinite / `useMarketHistory`) + 3 Vitest smoke + sidebar activation. 1443 LOC. Slice 3+ pending (Chat UI streaming / Insights / Accounts CRUD / Settings / Paywall / Pricing marketing / PWA / Vercel deploy / scope-cut header UI).
- **TASK_06 (Broker Integrations):** ⏳ starts после PR C close.

### Волна 4 — 🧊 отложено
TASK_08 iOS (нужен Mac + Xcode, отдельный репо).

---

## 2. Ключевые PR SHAs

| PR | Scope | SHA | Дата |
|---|---|---|---|
| **main tip** | (после post-merge docs pass PR #49 — обновится этим коммитом) | TBD | 2026-04-20 |
| #49 | PR C: Core API deploy infrastructure — migrate subcommand + /metrics + fly.toml (prod + staging) + deploy-api.yml pipeline (staging→smoke→approval→prod) + k6 smoke suite (5) + Doppler-first secrets (`ops/secrets.keys.yaml` + verify script) + `RUNBOOK_deploy.md` + TD-060..064 + TD-066 + TD-067. TASK_04 closed 10/10. | `fa9c9dc` | 2026-04-20 |
| #48 | TASK_07 Slice 2: Positions list + Position Detail read-only — `(app)/positions` + `(app)/positions/[id]` + toolbar + Recharts price chart (через `@investment-tracker/ui/charts` subpath, zero apps/web direct dep) + infinite transactions + 4 hooks + 3 Vitest smoke + sidebar activation + TD-065 opened | `366d12f` | 2026-04-20 |
| docs-only | post-merge pass PR #45 TASK_07 Slice 1 | `4e7c67a` | 2026-04-20 |
| docs-only | kickoffs TASK_07 Slice 2 + PR C, renumber PR C follow-up TDs | `fd3b5c5` | 2026-04-20 |
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

**Track 1 — Core API (TASK_04): CODE-COMPLETE** ✅
10 of 10 PRs merged — PR C (deploy infrastructure) landed 2026-04-20
as `fa9c9dc` (PR #49). Ship'нуто: migrate subcommand (atomic
release_command), /metrics на prometheus client_golang default
registry, `fly.toml` (prod) + `fly.staging.toml`, `deploy-api.yml`
pipeline (verify-secrets → staging → k6 smoke → verify-secrets →
prod с GitHub environment approval → k6 smoke-prod → tag release),
Doppler-first secrets (`ops/secrets.keys.yaml` + `ops/scripts/
verify-prod-secrets.sh`), 5 k6 scenarios, `RUNBOOK_deploy.md` (8
headings + Prerequisites). Workers deploy dispatch target удалён
защитно — см. **TD-066 (P1)** как PR D blocker.

Следующий шаг по TASK_04 — **operational, не code**: PO выполняет
prereq-list из `RUNBOOK_deploy.md § Prerequisites` (Doppler project +
Fly apps + DNS + GitHub env/secrets + первый staging deploy → 24-48h
soak → prod cutover).

**Track 2 — Web Frontend (TASK_07): Wave 3 🟢 in flight**
Slice 1 merged (PR #45, squash `a622bd3`) — Clerk auth + `(app)/dashboard`
vertical slice + `PortfolioValueCardLive` + 1 Vitest. LOC ~551.
Slice 2 merged (PR #48, squash `366d12f`, 2026-04-20) — `(app)/positions`
list + `(app)/positions/[id]` detail read-only. Toolbar (sort
`SegmentedControl` / group + asset-type filter `Dropdown`s), desktop HTML
table + mobile `AssetRow` cards через `md:` breakpoint, Overview +
Transactions tabs, price chart поверх `@investment-tracker/ui/charts`
subpath (Recharts через transit dep `packages/ui` → **zero direct dep в
apps/web → zero drift `pnpm-lock.yaml` с параллельным PR C**), infinite
transactions tab (first page hydrated через
`initialData: { pages:[firstPage], pageParams:[undefined] }`, no
setQueryData-в-useEffect anti-pattern), split events filtered с footnote
(TD-065 opened). 4 TanStack Query хука: `usePositions` / `usePosition` /
`usePositionTransactions` infinite / `useMarketHistory` (period живёт в
query key + client state — OpenAPI response не эхоит period обратно).
3 Vitest smoke. Sidebar activation. LOC 1443 (в anchor 1400-1800).
Main tip post-docs = этот docs-pass commit.

### Next

- **Core API operational setup (PO solo, 8-12h).** Canonical roadmap
  — `RUNBOOK_deploy.md § Prerequisites`. Порядок: Doppler project
  `investment-tracker-api` с configs dev/stg/prd → populate 15
  required secrets per `ops/secrets.keys.yaml` → GitHub repo secrets
  (`FLY_API_TOKEN`, `DOPPLER_TOKEN_STG`, `DOPPLER_TOKEN_PRD`,
  `STAGING_TEST_USER_TOKEN`, `PROD_TEST_USER_TOKEN`) + Environments
  (`staging` no-gate, `production` 1 required reviewer) → `fly apps
  create` обеих apps → dispatch `doppler-sync.yml target=api` →
  `tools/k6/seed-user.sh` против staging Clerk → dispatch
  `deploy-api.yml` → DNS pointing после первого успешного deploy →
  24-48h staging soak → prod cutover.
- **PR D — workers deploy + asynq consumer.** **Blocker: TD-066.**
  Before PR D opens: restore `target=workers|both` options в
  `.github/workflows/deploy-api.yml` dispatch inputs. PR C disabled
  их защитно (placeholder workers binary would've shipped a no-op
  heartbeat to prod by click-mistake). PR D CC kickoff должен читать
  **TD-066 first** — re-enable + mirror staging→smoke→approve→prod
  pipeline для workers (параллельно с api jobs в том же workflow).
  Затем реальный asynq consumer (hard-delete worker TD-041/TD-045,
  CSV export TD-039, broker sync через SnapTrade/Plaid — TASK_06).
- **TASK_07 Slice 3** — candidate scope: Chat UI streaming (priority
  — feature differentiator) либо Insights feed + Accounts CRUD
  (pre-GA dashboard completeness). Kickoff пишется когда PO
  определит приоритет + после Slice 2 runtime smoke (docker compose
  + Go API + real Clerk dev project + `/positions` + `/positions/
  [id]`).
- **AI Service 404-swallow flip** — после prod soak PR C
  (`RUNBOOK_ai_flip.md`).

**Key reference points (предыдущие PRs):**
- PR #49 (PR C) `fa9c9dc` — Core API deploy infrastructure (см. merge-log entry наверху). TD-060..064, TD-066 (PR D blocker), TD-067 opened.
- PR #48 (TASK_07 Slice 2) `366d12f` — Positions list + Position Detail read-only. TD-065 opened.
- PR #46 (B3-iii) `08e09f4` — Clerk/Stripe webhooks + webhook_events idempotency + 14 scope-cut 501 stubs. TD-056..059 opened.
- PR #45 (TASK_07 Slice 1) `a622bd3` — web vertical slice.
- PR #44 (B3-ii-b) `c2a2afe` — AI chat sync + SSE reverse-proxy + single-writer `ai_usage`. TD-055 opened.
- PR #42 (B3-ii-a) `8c52a4d` — AI client foundation + rate-limit middleware + 5 handlers.
- PR #43 (TASK_05 cleanup) `b6108a4` — Python `record_ai_usage` dual-write удалён.

**Worktree cleanup (на PO):**
- `D:/investment-tracker-b3iii` — `git worktree remove --force D:/investment-tracker-b3iii && git worktree prune`.
- `D:/investment-tracker-task07-s1` — `git worktree remove --force D:/investment-tracker-task07-s1 && git worktree prune` + локальную ветку `feature/task07-slice1` уже нет на remote, локально можно снести `git branch -D feature/task07-slice1 post-merge-task07-s1` из D:\СТАРТАП.
- `D:/investment-tracker-task07-s2` — `git worktree remove --force D:/investment-tracker-task07-s2 && git worktree prune` + локальную ветку `feature/task07-slice2` (уже удалена на remote через `--delete-branch`) можно снести локально `git branch -D feature/task07-slice2` из `D:\СТАРТАП`.
- `D:/investment-tracker-pr-c` — `git worktree remove --force D:/investment-tracker-pr-c && git worktree prune` + локальную ветку `feature/pr-c-deploy` (уже удалена на remote через `--delete-branch`) можно снести локально `git branch -D feature/pr-c-deploy` из `D:\СТАРТАП`.

**Ключевая архитектурная точка:** AI chat + persistence полностью в main; web vertical slice готов против `/portfolio`. Клиенты (web/iOS) строятся против стабильного OpenAPI контракта.

### Что НЕ готово в UI (scope Slice 3+)

- Chat UI (streaming) — Slice 3 candidate.
- Insights feed, Accounts CRUD, Settings, Paywall, Pricing marketing — Slice 3+.
- Visual disabled state для placeholder nav-слотов Sidebar — требует расширения `NavItem` API в `packages/ui` (добавить `disabled?: boolean` + render logic), отдельным micro-slice.
- `usePortfolioHistory` + period toggle + sparkline на Dashboard — Slice 3+.
- Scope-cut header UI (`X-Partial-Portfolio` / `X-FX-Unavailable`) на `/positions` и `/dashboard` — отдельный micro-slice.
- `TransactionRow.kind` extension для split events (TD-065) — P3, post-user-feedback.
- Real account-name lookup (broker label вместо `Account #<short-uuid>`) — требует `/accounts` endpoint wiring, Slice 5 Accounts.
- Vercel preview на PR — отдельный setup PR.
- Real Sentry/PostHog DSN wiring — после publishable DSN выданы.
- Real Clerk dev project + runtime smoke на `/positions` + `/positions/[id]` — PO post-merge.

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
