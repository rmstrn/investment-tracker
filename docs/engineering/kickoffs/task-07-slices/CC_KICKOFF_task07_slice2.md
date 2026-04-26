# CC Kickoff — TASK_07 Web Frontend (Slice 2)

> **Status:** ✅ merged as PR #48, squash `366d12f`, 2026-04-20. Actual LOC 1443, 24 files. См. `merge-log.md` PR #48 entry.
>
> **Correction (post-merge, docs consistency):** секция "OpenAPI surface (confirmed)" ниже описывает `GET /market/history` response как содержащий `period` — это неточно. По `tools/openapi/openapi.yaml` response shape = `{ symbol, asset_type, currency, interval, points }`, **без** `period`. Requested period — query param only. `useMarketHistory` хранит period в query key + client state; response не эхоит его обратно. Остальной kickoff accurate.

**Scope:** Positions list + Position Detail (read-only). Расширяет apps/web Slice 1.
**Anchor:** 1400-1800 LOC.
**Worktree:** `D:/investment-tracker-task07-s2` (feature/task07-slice2 branch from main).
**Base:** main tip = `4e7c67a` (или свежее).
**Parallels with:** PR C (Fly.io deploy) в другом worktree. Не пересекается по файлам (apps/web/** vs apps/api/Dockerfile + fly.toml + .github/workflows/**).

---

## Pre-flight: что уже на main (post-Slice 1)

Проверено на `4e7c67a`. Что есть:

- **apps/web Slice 1 merged** (PR #45, squash `a622bd3`) — Clerk middleware, `(app)/layout.tsx` с AppShellClient + Sidebar + UserButton, `(app)/dashboard/page.tsx` Server Component, `PortfolioValueCardLive`, TanStack Query provider, `usePortfolio()`, `lib/format.ts` (Intl wrappers), `lib/api/server.ts` + `lib/api/browser.ts` фабрики, Vitest + happy-dom + @testing-library setup.
- **packages/ui** имеет готовые: `AssetRow`, `TransactionRow`, `Badge`, `Button`, `Card`, `Dropdown`, `SegmentedControl`, `Skeleton`, `EmptyState`, `AreaChart`, `BarChart`, `DonutChart`, `CountUpNumber`, `Tabs`, `Sheet`, `Tooltip`, `ExplainerTooltip`.
- **packages/design-tokens** — `portfolio.gain.default` / `portfolio.loss.default` токены работают через `text-portfolio-gain-default` / `text-portfolio-loss-default` utilities.
- **Sidebar** в Slice 1 имеет все nav слоты visible, но все кроме Dashboard указывают на `/dashboard` (no-op placeholder). Slice 2 активирует **Positions** слот: href = `/positions`, active-slug logic уже через `usePathname` в `AppShellClient`.
- **@investment-tracker/api-client** — полный wrapper с middleware (Bearer + Idempotency-Key). Расширять не надо, просто добавить methods через openapi-fetch paths.
- **Recharts пока НЕ установлен** в apps/web (был под вопросом в Slice 1, отложили). Slice 2 добавляет как dep — нужен для price chart на Position Detail.

## OpenAPI surface (confirmed)

```
GET /positions
  Query: group_by=account|symbol|asset_type (default symbol)
         sort=value_desc|value_asc|pnl_desc|pnl_asc|alpha (default value_desc)
         display_currency=EUR|USD|...
  Response 200: { data: Position[] }
  Response 401: (Clerk middleware уже редиректит)

GET /positions/{id}
  Query: display_currency
  Response 200: Position
  Response 404: если не принадлежит user

GET /positions/{id}/transactions
  Query: cursor (opaque), limit (default 50)
  Response 200: PaginatedEnvelope<Transaction[]> (next_cursor если есть)

GET /market/history
  Query: symbol (required), asset_type (required), period=1d|5d|1m|3m|6m|1y|5y|max,
         interval=1m|5m|15m|1h|1d|1wk|1mo (default 1d)
  Response 200: MarketHistoryResponse { symbol, asset_type, period, interval, points: MarketHistoryPoint[] }
```

`Position` shape: `{ id, account_id, symbol, asset_type, quantity: Money, avg_cost: Money|null, currency, values: PortfolioValues, pnl_absolute: {base, display}, pnl_percent: number, last_calculated_at }`

`Transaction` shape: `{ id, account_id, symbol, asset_type, transaction_type, quantity: Money, price: Money|null, currency, fee: Money, executed_at, source, notes }`

`MarketHistoryPoint`: `{ time: datetime, open, high, low, close: Money, volume: string }`

Note on `pnl_percent`: float, where `0.123` = +12.3%. Matches Slice 1 `PortfolioSnapshot.pnl_percent` convention — `lib/format.ts` уже умеет через `formatPercent`.

---

## Detailed scope

### 1. Positions list route

**File:** `src/app/(app)/positions/page.tsx` (Server Component).

- `createServerApiClient()` → `GET /positions?sort=value_desc&group_by=symbol` (default query).
- Pass `initialData` в `<PositionsListLive>` (client, TanStack Query hydrate).
- Page title: "Positions". Breadcrumb hierarchy не нужен пока.
- Header row: filter/sort/group controls (все в одном toolbar).

### 2. PositionsListLive + PositionsTable components

**Files:**
- `src/components/positions/positions-list-live.tsx` — TanStack Query bridge (client). Hooks: `usePositions(params)`. Query key: `["positions", params]`. staleTime 60s, refetchOnWindowFocus true.
- `src/components/positions/positions-table.tsx` — pure presentation. Desktop: HTML table. Mobile (md breakpoint): vertical `<AssetRow>` cards.
- `src/components/positions/positions-toolbar.tsx` — filter/sort/group controls. Group `Dropdown`, Sort `SegmentedControl` (три опции: Value / P&L / A-Z), Filter by asset_type `Dropdown` (multi-select chips опционально — если простая UX, single-select ok).
- `src/components/positions/positions-row.tsx` — desktop table row component. Columns: Symbol | Quantity | Avg Cost | Current Value | P&L (abs + %).
- Skeleton state (5 rows placeholder), error card (pattern из Slice 1 `PortfolioValueCardError`), empty state (`EmptyState` primitive → "No positions yet. Connect an account to start tracking." + disabled CTA).

Click row → `router.push('/positions/' + id)` (Next.js client navigation).

### 3. Position Detail route

**File:** `src/app/(app)/positions/[id]/page.tsx` (Server Component).

- Server-side parallel fetch: `GET /positions/{id}` + `GET /positions/{id}/transactions?limit=20` (первая страница).
- Pass `initialPosition` + `initialTransactions` в `<PositionDetailLive>`.
- 404 handling: если API отдаёт 404 → Next.js `notFound()`.

### 4. PositionDetailLive + sub-components

**Files:**
- `src/components/positions/position-detail-live.tsx` — TanStack Query bridge. Hooks: `usePosition(id)`, `usePositionTransactions(id)` (infinite query), `useMarketHistory(symbol, asset_type, period)`.
- `src/components/positions/position-header.tsx` — большое Symbol + asset_type `Badge` + current value (`CountUpNumber`) + daily P&L pill.
- `src/components/positions/position-overview-tab.tsx` — two cards:
  - **P&L card**: `pnl_absolute.display` + `pnl_percent` с gain/loss colors.
  - **Metadata card**: account name (пока через account_id string — account lookup из /accounts вне scope Slice 2, показываем UUID short form или "Account #xxxxxx"), avg_cost, last_calculated_at (relative time "2h ago").
- `src/components/positions/position-price-chart.tsx` — Recharts `AreaChart` (или переиспользуем `packages/ui/charts/AreaChart` — проверь API первым делом). Period SegmentedControl (1W/1M/3M/6M/1Y/All → map на openapi `5d`/`1m`/`3m`/`6m`/`1y`/`max`). Dispatches `useMarketHistory` с нужным period. Skeleton + error card.
- `src/components/positions/position-transactions-tab.tsx` — infinite scroll list via `TransactionRow` primitive. "Load more" CTA (не auto-infinite — проще UX).
- `Tabs` primitive (из packages/ui) для Overview / Transactions toggle.

### 5. Hooks (TanStack Query)

**Files:**
- `src/hooks/usePositions.ts` — list query, accepts `{ sort, group_by, display_currency }`.
- `src/hooks/usePosition.ts` — detail query, keyed by id.
- `src/hooks/usePositionTransactions.ts` — infinite query, queryKey `["position-transactions", id]`, pageParam = cursor.
- `src/hooks/useMarketHistory.ts` — by symbol+asset_type+period. staleTime 5 min (market data не двигается каждую секунду).

Все через `createBrowserApiClient()` + `useAuth().getToken()` pattern установленный в Slice 1.

### 6. API client methods

**File:** `src/lib/api/positions.ts` — thin wrappers around `client.GET("/positions", ...)` etc. Используем typed `paths` из `@investment-tracker/shared-types`. Factor out в helpers если будет повтор: Slice 1 уже делал inline вызовы, для Slice 2 оправдано выделить.

### 7. Activate Positions in Sidebar

`AppShellClient` (Slice 1) уже читает `usePathname()` для active-slug. Sidebar nav items — добавь / активируй `positions` entry. Если готовая UI pkg API требует href + label + icon — просто укажи `href="/positions"` и `disabled={false}`. Остальные non-Dashboard/non-Positions слоты остаются disabled (placeholder href).

### 8. Tests (Vitest)

Три smoke теста:
1. `positions-row.test.tsx` — renders with gain/loss/zero P&L variants.
2. `position-header.test.tsx` — renders symbol, value, positive/negative P&L pill.
3. `position-price-chart.test.tsx` — renders skeleton → mock data → chart (без real Recharts assertion, просто non-error render).

Не добавляем интеграционные тесты (SSR Server Component + Clerk + mock API — overkill для Slice 2, отложим на Slice 3+ когда накопятся компоненты).

### 9. Recharts dep

Добавь `recharts` в `apps/web/package.json` deps. Проверь что чарт из `@investment-tracker/ui/charts/AreaChart` уже тянет Recharts транзитивно — если yes, можно не добавлять напрямую в apps/web (re-export из ui package достаточно).

## Slice 2 — что НЕ делаем

- Add/Edit/Delete position — требует mutations middleware + idempotency, отдельный slice.
- Add transaction — Slice 3+.
- Position watchlist / alerts — Slice 4+.
- Candle chart / volume overlay — MVP достаточно простого area chart.
- Export CSV — отдельный slice.
- Compare position vs benchmark (S&P 500) — Slice 3+.
- Related AI insights / chat context — требует AI Chat UI Slice.
- Real account name lookup (от account_id к broker name) — требует `/accounts` endpoint wiring, Slice 5.

## Acceptance

- `pnpm --filter @investment-tracker/web build` зелёный, TS strict, new `[id]` route typed.
- `pnpm --filter @investment-tracker/web typecheck` + `pnpm --filter @investment-tracker/web lint` + `pnpm --filter @investment-tracker/web test` зелёные.
- Turborepo root `pnpm typecheck` — 13/13 green.
- `/positions` redirect'ит на `/sign-in` без Clerk session (middleware уже из Slice 1).
- После sign-in → `/positions` рендерит table с sort/group/filter controls. Empty state работает.
- Click row → `/positions/[id]` показывает header + tabs (Overview + Transactions).
- Price chart рендерится с skeleton → mock/real data (Recharts).
- Sidebar подсвечивает active slot при переходе между Dashboard и Positions.
- Dark mode работает (system preference via design-tokens).
- CI 8/8 green на squash commit.

## Dependencies проверить до write-phase

1. `ls packages/ui/src/domain/AssetRow.tsx` + `cat` для props API — понять можно ли переиспользовать напрямую или нужен свой `PositionsRow`.
2. `cat packages/ui/src/charts/AreaChart.tsx` — Recharts или Visx / D3? Если Recharts — хорошо, Slice 2 добавит recharts в apps/web/deps только если напрямую импортит (иначе транзитивная достаточно).
3. `grep -n "TransactionRow" packages/ui/src/index.ts` — экспорт в index.
4. `grep -n "Tabs" packages/ui/src/index.ts` — Tabs primitive export.
5. `cat tools/openapi/openapi.yaml | grep -A 10 "^    PortfolioValues:"` — shape для `position.values.display`.
6. Slice 1 acceptance smoke (Clerk dev project + Core API live) — НЕ блокер для Slice 2 write-phase, проверяется post-merge. Твой CI прогон = build + typecheck + lint + unit tests.
7. **Параллельный PR C**: если он смержится раньше твоего PR — routine rebase. OpenAPI surface не трогается (PR C infra only), types regen не потребуется.

## Parallelization note

Пока ты делаешь Slice 2, в другом worktree идёт PR C (Fly.io deploy). Drift risk по файлам = 0.

Единственная точка возможного пересечения — `package.json` / `pnpm-lock.yaml` в root если оба worktree добавляют deps одновременно. Маловероятно для PR C (он трогает apps/api/Dockerfile + fly.toml + .github/workflows). Твой dep (recharts) — в apps/web/package.json only.

Если PR C смержится раньше — rebase, `pnpm install` (lockfile rebase), `pnpm --filter web build` — минутная операция.

---

## Continuation prompt (копировать в новый CC чат)

```
Привет. Я Ruslan, Product Owner проекта investment-tracker
(AI-инвест-трекер: Next.js web + Go Core API + Python AI Service).
Оркеструю параллельные Claude Code сессии — каждая CC работает
свой PR в отдельном worktree. Главный проект: D:\СТАРТАП.

Первым делом читай:

  D:\СТАРТАП\docs\PO_HANDOFF.md                   (полный handoff)
  D:\СТАРТАП\docs\README.md                       (wave status)
  D:\СТАРТАП\docs\CC_KICKOFF_task07_slice2.md     (ТВОЙ scope —
                                                    читай особо
                                                    внимательно)
  D:\СТАРТАП\docs\TASK_07_web_frontend.md         (full TASK 07 —
                                                    Positions section 5+6)
  D:\СТАРТАП\docs\04_DESIGN_BRIEF.md              (дизайн-система,
                                                    positions patterns)
  D:\СТАРТАП\docs\02_ARCHITECTURE.md              (patterns)
  D:\СТАРТАП\docs\DECISIONS.md                    (ADR log)
  D:\СТАРТАП\docs\merge-log.md                    (последний entry —
                                                    PR #45 Slice 1 —
                                                    scaffold context)

Текущий статус:
- main tip = 4e7c67a (проверь fetch — может быть свежее).
- TASK_04 Core API: 9/9 PRs merged ✅. AI chat end-to-end в main,
  webhook pipeline (Clerk + Stripe + idempotency) в main.
- TASK_07 Slice 1 merged (PR #45, squash a622bd3):
  Clerk + (app)/dashboard + PortfolioValueCardLive + 1 Vitest.
- Параллельно сейчас идёт PR C (Fly.io deploy) в другом worktree —
  apps/api/Dockerfile + fly.toml + .github/workflows/. Не пересекается
  с твоим scope (apps/web/** vs apps/api/infra).

Ты делаешь TASK_07 Slice 2: Positions list + Position Detail.
Полный scope в CC_KICKOFF_task07_slice2.md. Кратко:
- (app)/positions/page.tsx — Server Component + PositionsListLive
  (table с sort/group/filter, пагинация не нужна — список весь
  приходит одним запросом).
- (app)/positions/[id]/page.tsx — Server Component + PositionDetailLive
  (header + Overview tab с P&L + price chart через /market/history
  + Metadata card, Transactions tab через infinite query).
- 4 hooks (TanStack Query): usePositions, usePosition,
  usePositionTransactions (infinite), useMarketHistory.
- Recharts dep для price chart (проверь — может быть уже тянется
  транзитивно через packages/ui/charts/AreaChart).
- Active Positions slot в Sidebar.
- 3 Vitest smoke tests.

Anchor 1400-1800 LOC. Scaffold делает половину (готовые UI primitives:
AssetRow, TransactionRow, Badge, Tabs, SegmentedControl, EmptyState,
CountUpNumber, AreaChart, design-tokens gain/loss colors).

НЕ делаем: Add/Edit/Delete/transactions (mutations), candle chart,
benchmark compare, AI insights linkage, real account-name lookup
(oт account_id к broker) — Slice 5 Accounts.

Стиль общения (из PO_HANDOFF):
- Русский, коротко, без over-formatting.
- Decisions-first (что делать → почему).
- Видишь риск — говори сразу.
- Верифицируй через Read перед confirm (state loss бывал).
- Squash-only merge policy (TD-006).
- GAP REPORT перед write-phase.

Cycle:
1) Прочти docs в указанном порядке.
2) Pre-flight audit: `ls apps/web/src/components/` (что есть после
   Slice 1), `grep -n "export" packages/ui/src/index.ts` (что
   экспортировано из ui pkg), подтверди OpenAPI /positions + detail +
   transactions + market/history shapes актуальны, проверь Recharts
   situation (direct dep vs транзитивная).
3) GAP REPORT: scope delta vs Slice 1, LOC прогноз, риски
   (recharts weight, typedRoutes dynamic [id] typing, infinite query
   cursor handling, account name lookup gap).
4) Я оцениваю → даю отмашку.
5) Write-phase.
6) GAP REPORT v2 (write-phase done): LOC actual, AC mapping, CI
   status, branch SHA, out-of-spec touches (если добавляешь deps),
   merge readiness.
7) Я даю go/no-go.
8) Ты сам мерджишь (gh pr create + gh pr merge --squash
   --delete-branch).
9) Post-merge docs pass (merge-log entry + TASK_07 row status
   "Slice 2 merged" + README wave 3 note).
10) Final report мне: PR number, squash SHA, docs SHA, diff stat,
    opened TDs (если есть), worktree cleanup status.

Start: прочти все указанные docs, потом подтверди готов к pre-flight.
```
