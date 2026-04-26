# CC Kickoff — TASK_07 Slice 6a (Insights Feed UI — read-only + local dismiss)

**Scope:** новый route `(app)/insights` — лента карточек AI-инсайтов. Severity + type фильтры. Dismiss через local-state (в 6a не шлём backend request — это Slice 6b scope). Empty / loading / error states. Клик на card с `action_url` ведёт в соответствующий in-app route.

**Anchor:** один micro-PR, ~6–8 файлов. Критерий завершённости = acceptance criteria + CI green. **LOC не трекаем.**

**Worktree:** `D:\investment-tracker-insights-6a` (branch `feature/task07-slice6a` from `origin/main` tip `d6e3441`).
**Base:** main tip = post-Sprint-D (2026-04-22, commit `d6e3441`).
**Parallels:** Claude Design работает над landing — отдельный marketing surface, не пересекается. На бэкенде параллельных слайсов нет.

---

## Context

### Зачем этот slice критичен

AI insights — один из двух основных value prop'ов продукта (второй — chat). Сейчас они существуют только в БД и на бэке (`GET /ai/insights` работает на AI Service staging с TD-070 closure), но user их не видит. После Slice 6a alpha flow замыкается:

- Slice 4a (manual Accounts CRUD) — ✅
- Slice 5a (Transactions CRUD) — ✅
- **Slice 6a (Insights Feed — THIS ONE)** — последний P1 MVP-blocker до alpha.
- Slice 12 (Empty/Error states polish) — P2, не блокер.

После этого слайса критический путь до alpha — только Slice 12.

### Что готово на бэкенде

Эндпоинты полностью спекнуты в `tools/openapi/openapi.yaml` (линии 1301-1395):

- `GET /ai/insights` — query params: `include_dismissed` (default `false`), `cursor`, `limit`. Response = `PaginatedEnvelope<Insight>`.
- `POST /ai/insights/{id}/dismiss` — **НЕ вызываем в 6a** (Slice 6b scope).
- `POST /ai/insights/{id}/viewed` — **НЕ вызываем в 6a** (Slice 6b scope).
- `POST /ai/insights/generate` — **НЕ вызываем в 6a** (Slice 6b scope, нужен tier-gate TD-053).

AI Service deployed на staging (`investment-tracker-ai-staging.fly.dev`, TD-070 closed 2026-04-21). Core API proxy работает.

### Insight schema (из OpenAPI `components.schemas.Insight`)

```yaml
Insight:
  required: [id, insight_type, title, body, severity, generated_at]
  properties:
    id: uuid
    insight_type: InsightType              # enum: diversification | risk | performance | rebalance | cost | behavioral
    title: string (maxLength 200)
    body: string
    severity: InsightSeverity              # enum: info | warning | critical  (ТОЛЬКО 3 значения!)
    data: InsightData                      # additionalProperties: true — shape зависит от insight_type, может содержать action_url
    generated_at: date-time
    viewed_at: date-time | null
    dismissed_at: date-time | null
```

**Важные constraints:**

- `InsightSeverity` на бэке — **3 значения**: `info | warning | critical`. `InsightCard` в `packages/ui` принимает **4**: `info | positive | warning | negative`. Mapping — обязан (см. Decomposition §4). Варианта два: либо mapping функция (`critical → negative`, `info → info`, `warning → warning`, нет маппинга для `positive` потому что бэк не шлёт positive insights), либо расширить `InsightCardProps` типы в packages/ui. **Рекомендация: mapping функция в apps/web — не трогаем packages/ui в этом slice.**
- `InsightData.additionalProperties: true` — shape не типизирован. В 6a читаем только optional `action_url: string` (если present — рендерим View CTA). Остальные поля игнорируем до Slice 6b/6c.
- `InsightType` = 6 enum values. Нужна human-readable label map (см. Decomposition §5 pre-flight).

### Что готово на фронтенде

- `packages/ui/src/domain/InsightCard.tsx` — готовый компонент (`title`, `body`, `severity: info|positive|warning|negative`, `action: ReactNode`, `kicker: string`). Используем as-is, не модифицируем.
- `@investment-tracker/api-client` generated. `Insight` type уже reexport'нут (`packages/api-client/src/index.ts:104`). `InsightType` и `InsightSeverity` доступны через `components['schemas']['InsightType' | 'InsightSeverity']` из `@investment-tracker/shared-types`.
- `listInsights` operation — **проверена** в `tools/openapi/openapi.yaml:1304`. В generated client доступ через `client.GET('/ai/insights', {...})` (same pattern как `ai.ts` использует для `/ai/conversations`).
- `apps/web/src/lib/api/ai.ts` — pattern на openapi-fetch client calls. Используем тот же pattern.
- `apps/web/src/lib/api/` — существующие модули: `accounts.ts`, `positions.ts`, `transactions.ts`, `ai.ts`, `browser.ts`, `server.ts`, `errors.ts`. **Decision:** положить insights helpers в **новый файл** `apps/web/src/lib/api/insights.ts` (по pattern'у `accounts.ts` / `transactions.ts`), а не extend'ить `ai.ts` — read-only flow отдельной вертикали, чище.
- shadcn: `DropdownMenu`, `Select`, `Badge`, `Button`, `Skeleton`, `Toast` — установлены (подтверждено через Slices 3/5a).
- `useAccounts()` hook существует (Slice 4a) — используется для empty-state logic ("Connect account first" если нет accounts).

### Что CC делает (decomposition)

1. **Route + page.** `apps/web/src/app/(app)/insights/page.tsx` — client component (`'use client'`). Layout: `PageHeader` (title "Insights" + optional subtitle) → `InsightFilters` → `InsightsFeed`. Использует URL search params для фильтров (см. §5).

2. **TanStack hook.** `apps/web/src/lib/api/insights.ts`:
   - `useInsights({ includeDismissed, severity?, insightType? })` — `useInfiniteQuery` с queryKey `['insights', { includeDismissed, severity, insightType }]`. Cursor pagination через `pageParam`, extract `nextCursor` из `meta`.
   - Типы: `Insight` reexport из api-client, `InsightSeverity` / `InsightType` из shared-types.
   - **НЕ добавляем dismiss/viewed/generate mutations в 6a.**

3. **Local dismiss state.** `apps/web/src/hooks/useLocalDismissedInsights.ts`:
   - `Set<string>` в React state + mirror в `sessionStorage` (key `insights.dismissed.v1`). sessionStorage — чтобы reload страницы сбрасывал (иначе юзер не поймёт что бэк не знает о dismiss'е).
   - Exposes: `dismiss(id: string): void`, `isDismissed(id: string): boolean`, `reset(): void`.
   - Hydration-safe: первый read sessionStorage только в `useEffect`, initial render = empty set.

4. **InsightsFeed component.** `apps/web/src/components/insights/insights-feed.tsx`:
   - Рендерит `InsightCard` (из `@investment-tracker/ui`) в flex column layout с gap.
   - Mapping `Insight → InsightCardProps`:
     - `title`: `insight.title`.
     - `body`: `insight.body`.
     - `severity`: через mapping function `mapSeverity(insight.severity)` — `info → info`, `warning → warning`, `critical → negative`. (Нет `positive` потому что бэк не генерит positive insights per enum.)
     - `kicker`: human label из `insightTypeLabels[insight.insight_type]` (см. §5 pre-flight map).
     - `action`:
       - Если `insight.data.action_url` присутствует (string, in-app route like `/positions/{id}`) → `<Button asChild variant="outline"><Link href={action_url}>View</Link></Button>`. Next.js `Link` для client-side navigation.
       - PLUS kebab menu (`DropdownMenu`) с одним item "Dismiss" → `dismiss(insight.id)`. Kebab показываем всегда (даже без action_url).
   - Фильтрация локально dismissed'нутых: `insights.filter(i => !isDismissed(i.id))` перед рендером.
   - Infinite scroll через `IntersectionObserver` на sentinel div в конце списка → `fetchNextPage` когда intersection + `hasNextPage && !isFetchingNextPage`.

5. **InsightFilters component.** `apps/web/src/components/insights/insight-filters.tsx`:
   - Severity chips: 3 toggle buttons (Info / Warning / Critical) — multi-select (user может выбрать несколько или ни одного = все). **3 chip'а, не 4** — соответствует бэк-enum.
   - Type select: `<Select>` с 6 options (Diversification / Risk / Performance / Rebalance / Cost / Behavioral) + "All types" default.
   - "Show dismissed" toggle (checkbox или Switch) — контролирует `include_dismissed` query param.
   - State синхронизируется с URL search params (`useSearchParams` + `useRouter().replace`) чтобы юзер мог share ссылку с фильтрами.

6. **States.**
   - **Empty (no insights).** Если `useAccounts().data.length === 0` — "Connect an account to get personalized insights." + CTA → `/accounts`. Иначе generic: "No insights yet. Check back soon — we generate insights as data accumulates." (Generate CTA — 6b scope, не в этом slice.)
   - **Loading.** 3 `<Skeleton>` карточек в shape of InsightCard.
   - **Error.** Generic fallback card с retry button → `refetch()`. Сообщение: "Couldn't load insights. Try again."

7. **Sidebar wiring.** `apps/web/src/app/(app)/layout.tsx` — enable Insights item в sidebar (route `/insights`, icon TBD — вероятно `Sparkles` из lucide-react по аналогии с InsightCard). `activeSlugFor` case обновить.

8. **Vitest smoke (3-4 tests минимум).**
   - Feed renders cards с правильным mapping severity (`critical` → `negative` в InsightCard props).
   - Severity filter chip toggles — `useInsights` вызван с правильным severity param.
   - Dismiss click убирает card из DOM (через `useLocalDismissedInsights`).
   - Empty state: no accounts → "Connect account" CTA; has accounts + zero insights → generic empty copy.
   - Больше тестов — на усмотрение CC, без gold-plating.

### Что CC проверяет pre-flight

1. **api-client generated symbols.** Убедиться что:
   - `Insight` type exported (подтверждено: `packages/api-client/src/index.ts:104`).
   - `InsightSeverity` и `InsightType` доступны. Если reexport отсутствует — либо добавить в `packages/api-client/src/index.ts`, либо использовать `components['schemas']['...']` pattern. **Не запускать `pnpm api:generate` без нужды** — spec не менялся.
   - `client.GET('/ai/insights', ...)` работает (openapi-fetch auto-generated paths).
2. **`insightTypeLabels` map.** Создать в `apps/web/src/lib/insights-labels.ts`:
   ```ts
   export const insightTypeLabels: Record<InsightType, string> = {
     diversification: 'Diversification',
     risk: 'Risk',
     performance: 'Performance',
     rebalance: 'Rebalance',
     cost: 'Cost',
     behavioral: 'Behavioral',
   };
   ```
   (English only per MVP locale.)
3. **Sidebar layout файл.** Найти где `activeSlugFor` определён (скорее всего `apps/web/src/app/(app)/layout.tsx` или отдельный sidebar component) и включить Insights route + icon.
4. **`useAccounts` hook location** — проверить где живёт (`apps/web/src/lib/api/accounts.ts` или `hooks/`) для empty-state wiring.
5. **`InsightData.action_url` usage pattern** — поле не в typed schema (`additionalProperties: true`), читаем через `(insight.data as { action_url?: string })?.action_url` с type guard. Если undefined — action button не рендерится.

---

## Что НЕ делаем (out of scope)

1. **Generate CTA / `POST /ai/insights/generate`.** Slice 6b. Нужен tier-gate (TD-053) + jobs polling UX.
2. **Backend dismiss/viewed mutations** (`POST /ai/insights/{id}/dismiss` + `/viewed`). Slice 6b. В 6a — только local sessionStorage state.
3. **Insight Detail page** (`/insights/[id]`). Не в MVP — action_url уводит в позицию или настройки, сам insight отдельной страницы не имеет.
4. **Auto-refresh / SSE stream для new insights.** Не в MVP. TanStack Query default stale behaviour acceptable.
5. **Rich `insight.data` rendering** (charts, structured advice blocks). Кроме `action_url` — 6b/6c scope. В 6a `data` trip otherwise ignored.
6. **Paywall / tier gating на insights list.** Все tiers видят свой feed. Gate только на generate — 6b.
7. **`InsightCard` расширение в `packages/ui`.** Не трогаем. Severity mapping живёт в apps/web.
8. **Generic pagination cursor UI** (page numbers, jump to end). Infinite scroll only.

---

## Acceptance criteria

- [ ] `/insights` route доступен, появляется в sidebar `(app)/layout.tsx` с корректной активацией.
- [ ] Feed рендерит cards из `GET /ai/insights` с правильным severity bar color (`critical → negative`, `warning → warning`, `info → info`).
- [ ] Severity multi-chip filter работает (URL search params обновляются, `useInfiniteQuery` refetch'ит с новым queryKey).
- [ ] Type select filter работает (URL sync + refetch).
- [ ] "Show dismissed" toggle работает (обновляет `include_dismissed` query param).
- [ ] Dismiss через kebab menu убирает card без backend call. После page reload — card снова появляется (sessionStorage только, не persistent).
- [ ] Card с `data.action_url` показывает "View" CTA которая ведёт в in-app route (client-side nav через Next.js `Link`).
- [ ] Infinite scroll работает — при скролле в конец fetch'ится next page.
- [ ] Empty state: если у юзера нет accounts → "Connect account" copy + CTA в `/accounts`. Иначе generic empty copy.
- [ ] Loading state: 3x Skeleton карточек пока first page грузится.
- [ ] Error state: fallback card с retry button.
- [ ] 3-4 Vitest smoke passing.
- [ ] `pnpm -r lint && pnpm -r typecheck && pnpm -r test` green в worktree.
- [ ] CI green (8/8 jobs). **Mandatory pre-merge `gh pr checks <N> --watch`** (TD-R078 policy).
- [ ] Никаких backend / OpenAPI / generated client ручных правок. Если обнаружен spec drift — остановиться, обсудить с PO, открыть TD, НЕ править inline.
- [ ] Если CC обнаруживает genuine TD — **TD-089 зарезервирован** за этим слайсом (TD-088 зарезервирован за TD-004 refresh если понадобится позже).

---

## Pre-flight checks (MANDATORY — выполнить до первого write)

1. `git status` в worktree — clean, на `feature/task07-slice6a`, HEAD == `d6e3441`.
2. `pnpm install` — dependencies fresh.
3. `pnpm -r typecheck` — baseline green перед любыми changes (иначе есть риск tangled failure mode).
4. Read (just for verification — не модифицировать):
   - `packages/api-client/src/index.ts` — подтвердить `Insight` reexport.
   - `packages/shared-types/src/generated/openapi.d.ts` — найти `InsightSeverity` и `InsightType` enum lines (1364, 1370).
   - `packages/ui/src/domain/InsightCard.tsx` — component API confirmed.
   - `apps/web/src/lib/api/ai.ts` — reference pattern (client.GET, error handling).
   - `apps/web/src/lib/api/accounts.ts` — hook + invalidation pattern для `useInsights`.
   - `apps/web/src/app/(app)/layout.tsx` — sidebar / activeSlugFor location.
5. Grep `tools/openapi/openapi.yaml` линии 1301-1395 — подтвердить эндпоинты + schema всё ещё те же (защита от stale kickoff).
6. Если ЛЮБОЙ из п.1-5 не матчит kickoff — остановиться, сообщить PO, НЕ двигаться.

---

## Commit structure

- **Commit 1** (implementation): `feat(web): Slice 6a — Insights Feed UI (list + filter + local dismiss)`
  - Body: краткое summary (route + hook + components + vitest), acceptance checkboxes, "closes Slice 6a".
- **Commit 2** (docs): `docs: close Slice 6a — UI_BACKLOG + merge-log + TECH_DEBT (if any)`
  - Docs touched ONLY в post-merge detached HEAD flow (см. Deliverables §3). В feature branch docs не трогать — кроме, если CC опен'ит новый TD, добавить в `TECH_DEBT.md` в commit 2 ДО merge.

---

## Open questions (CC решает в процессе)

1. **Icon для Insights sidebar item.** `Sparkles` (из lucide-react, уже используется в `InsightCard`) — предпочтительный. Если не подходит стилистически — `Lightbulb` / `Brain` acceptable. Decision CC.
2. **Severity chip design.** Shadcn `Badge` с variant'ами или custom toggle buttons? Предпочтительнее shadcn Toggle / ToggleGroup если установлен, иначе custom `<button>` с `data-active` атрибутом и CSS стилями. Decision CC.
3. **`InsightData` type guard.** `action_url` через runtime check (`typeof data?.action_url === 'string'`) vs Zod schema. Для 6a — runtime check достаточен, Zod избыточен пока нет discriminated union.
4. **Mapping `critical → negative`.** Альтернатива: `critical → warning` (более soft). PO preference: `negative` — critical insights должны выделяться красным, не жёлтым. **Decision:** `critical → negative`.
5. **InsightType labels локализация.** English-only per MVP. i18n — post-launch.
6. **Infinite scroll sentinel vs button.** Предпочтительнее IntersectionObserver (modern UX), fallback "Load more" button если IO не работает в тестах (Vitest jsdom может не support). CC может начать с button если IO усложняет.

---

## Deliverables

1. PR в `main`: `feat(web): TASK_07 Slice 6a — Insights Feed UI (read-only + local dismiss)`.
2. **GAP REPORT перед merge** (в чат PO):
   - CI status (8/8 green; обязательный `gh pr checks <N> --watch`).
   - File list (что добавлено / изменено).
   - TDs opened/closed (не ожидаю новых; TD-089 зарезервирован).
   - Scope-adjacent changes (если пришлось трогать layout.tsx — это нормально per §7).
   - Скриншоты (опционально — feed / empty / filter / dismiss states).
3. **После PO approval — CC сам делает merge + cleanup + docs pass** (PO_HANDOFF §10 codified 7-step flow):
   1. `gh pr merge <N> --squash --delete-branch`.
   2. `git fetch origin && git checkout origin/main` — **detached HEAD в СВОЁМ worktree** (`D:\investment-tracker-insights-6a`), НЕ в main worktree.
   3. Edit docs append-only (из списка доступного Code Team post-merge scope — см. MEMORY rule):
      - `docs/merge-log.md` — entry для PR Slice 6a с squash SHA + scope в 1-2 предложениях.
      - `docs/TECH_DEBT.md` — добавить TD-089 если opened (иначе не трогать).
      - `docs/DECISIONS.md` — ADR если уместно (например "Slice 6a: local sessionStorage dismiss — rationale: MVP без backend latency; 6b заменит на real mutation").
      - `docs/03_ROADMAP.md` — Wave 3 status update если нужен.
      - **НЕ ТРОГАТЬ** (PO-only территория per MEMORY): `docs/PO_HANDOFF.md`, `docs/UI_BACKLOG.md`, `docs/TASK_07_web_frontend.md`, `README.md`.
   4. `git add docs/ && git commit -m "docs: slice-6a post-merge pass" && git push origin HEAD:main`.
   5. Non-fast-forward → `git pull --rebase origin main` + append-only resolve + push. **Никогда force-push.**
   6. Cleanup из main worktree: `cd D:\investment-tracker && git worktree remove D:\investment-tracker-insights-6a && git branch -D feature/task07-slice6a`. Remote branch остался из-за race → `gh api -X DELETE repos/<owner>/<repo>/git/refs/heads/feature/task07-slice6a`.
   7. Ping PO: «merged + cleaned + docs done, main tip now `<SHA>`. Готово к runtime smoke на staging.»

**Pre-approved actions** (CC не спрашивает отдельно): detached HEAD docs workflow, remote branch force-delete, rebase+append conflict resolve. Любое отклонение от списка выше — стоп + вопрос.

---

## Report format (when done — GAP REPORT to PO)

Структура ответа builder'а после merge+docs:

```
1. git log --oneline -5                          # последние 5 commits на main
2. Acceptance checklist — [x] / [ ] по каждому пункту §Acceptance criteria
3. Files changed (git diff --stat <base>..HEAD) # сводка по файлам
4. CI final state                                # 8/8 green confirmed via gh pr checks
5. TDs opened/closed (TD-089 status)
6. Surprise findings — each as a new TD proposal (не inline fix!)
   Формат: "TD-XXX (Pproposed): <short desc> — trigger: <when to revisit>"
7. Screenshots (опционально): feed-happy.png, feed-empty.png, feed-filters.png
```

**Anti-pattern reminders:**

- Не "улучшаем" код вне scope'а (InsightCard, accounts hooks, shadcn primitives) — нашёл плохое → TD, не inline fix.
- Не правим backend / OpenAPI / generated client вручную. `pnpm api:generate` не запускаем без необходимости (spec не менялся).
- Не расширяем severity до 4 значений в `packages/ui` в этом slice — mapping в apps/web достаточно.
- Красный CI = rollback commit, не "поправим в след PR".

---

## Стиль работы CC (напоминание)

- Русский, коротко, без over-formatting.
- Decisions-first: сначала что делаешь, потом почему.
- Видишь риск — говори сразу.
- Верифицируй каждый Edit через Read (state loss бывал).
- **LOC не трекать** как scope metric — критерий = acceptance criteria + CI green.
- Pre-merge обязательный `gh pr checks <N> --watch` (TD-R078 policy).
- CC docs pass — **всегда** в собственном worktree (detached HEAD), **никогда** в main worktree `D:\investment-tracker` (PO-only territory; gotcha #10).
- Post-merge chain (merge → detached HEAD → docs → push → cleanup → ping) выполняется без вопросов по каждому шагу — весь список pre-approved в §Deliverables (gotcha #9).
- **Post-merge docs scope ограничен** (per MEMORY rule): merge-log + TECH_DEBT + DECISIONS + ROADMAP — это CC. PO_HANDOFF + UI_BACKLOG + TASK_0N + README — PO-only.
- Если что-то в scope непонятно или появилась дилемма — пиши в чат PO до того как делаешь large changes.
