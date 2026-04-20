# CC Kickoff — TASK_07 Web Frontend (Slice 1)

**Scope:** `apps/web/` scaffold + Clerk auth + Dashboard read-only vertical slice.
**Anchor:** 2000-2500 LOC (много scaffold boilerplate).
**Worktree:** `D:/investment-tracker-task07-s1` (новый).
**Base:** main tip (проверить).
**Parallels with:** B3-iii в другом worktree. Не пересекается по файлам (apps/web/** vs apps/api/**).

---

## Why slice 1, not full TASK_07

TASK_07 — 5-7 недель работы. Разбиваем на slice'ы, первый закладывает pipeline
end-to-end (Clerk → Core API → render). Last 5 features (Chat UI, Insights,
Accounts CRUD, Settings, Paywall) — отдельные slice'ы в будущем.

## Slice 1 scope (минимум жизнеспособный)

1. **Monorepo scaffold check** — `apps/web/` пока нет; `packages/shared-types`
   и `packages/ui` существуют со времён TASK_01/02. Verify через `ls packages/`.
2. **Next.js 15 scaffold** в `apps/web/`: App Router, TS 5.7 strict, Tailwind v4,
   Biome, pnpm workspace.
3. **Clerk integration:**
   - `middleware.ts` — protected routes (все кроме /, /pricing, /sign-in, /sign-up).
   - `(auth)/sign-in/page.tsx` и `(auth)/sign-up/page.tsx` — Clerk components.
   - `(app)/layout.tsx` — sidebar skeleton.
   - Interceptor в API client — добавляет `Authorization: Bearer <clerkToken>`.
4. **API client:** openapi-fetch из `@investment-tracker/shared-types` (уже должен
   быть сгенерирован из openapi.yaml в TASK_03). Если нет — regenerate в pre-flight.
5. **TanStack Query provider** + hook `usePortfolio()` (GET /portfolio).
6. **Dashboard skeleton:**
   - `(app)/dashboard/page.tsx` — Server Component где можно.
   - Portfolio value card (крупное число, P&L за день, mini-sparkline через Recharts).
   - Loading skeleton, error boundary.
   - Empty state если нет accounts ("Connect your first account" CTA — пока disabled).
7. **Global layout** — root `layout.tsx` с ClerkProvider + QueryClientProvider + dark mode.
8. **Env + secrets:** `.env.example` с `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`,
   `CLERK_SECRET_KEY`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY`. Doppler wiring
   — отдельная задача, здесь только example.
9. **Observability stubs:** Sentry init (`sentry.client.config.ts` + `sentry.server.config.ts`),
   PostHog client init. Минимально — page_view + sign_in events.
10. **PWA manifest stub** — `public/manifest.json` + icons (placeholder SVG ок для slice 1).
11. **Vercel preview wire** — `vercel.json` или GitHub Actions workflow `.github/workflows/deploy-web-preview.yml`
    если Vercel integration не настроен напрямую.
12. **CI:** typecheck + Biome + unit тест "renders dashboard with mock data" (Vitest + RTL). Один smoke тест достаточен.

## Slice 1 — что НЕ делаем

- AI Chat UI (отдельный slice — зависит от streaming client работы).
- Insights page.
- Accounts CRUD, Settings, Paywall, Pricing page.
- Marketing landing (`(marketing)/page.tsx`).
- E2E Playwright (ещё нет чем тестить).
- Lighthouse оптимизации (в отдельный slice в конце).

## Acceptance

- `pnpm --filter web dev` → localhost:3000 → redirect на /sign-in (Clerk).
- Sign-up → redirect в /dashboard → рендерится portfolio card со статическим "0,00 €" если GET /portfolio вернул empty (или реальные данные если seeded).
- Invalid JWT / expired → redirect обратно в /sign-in (Clerk handles).
- Dark mode через system preference работает.
- `pnpm --filter web build` зелёный (TS strict, Biome, no warnings).
- Vercel preview deploys на PR.
- CI green (typecheck, lint, unit, build).

## Dependencies проверить до write-phase

1. `packages/shared-types` содержит актуальный `paths` тип из openapi.yaml (с AI endpoints после PR #44). Если stale — regenerate.
2. `packages/ui` или `packages/design-tokens` содержат Tailwind config pieces и/или shadcn base. Если другое разбиение — адаптироваться под то что есть.
3. `tools/openapi/openapi.yaml` — source of truth для API client codegen.
4. pnpm workspace root имеет правильные scripts для `--filter web`.

## Parallelization note

Пока ты делаешь slice 1, в другом worktree идёт B3-iii (webhooks + write-path).
Новых API endpoints slice 1 не требует — только GET /portfolio которое давно в main.
Риск drift'а нулевой для slice 1.

После B3-iii merge — regenerate shared-types (если что-то добавилось в OpenAPI spec),
проверить что web build всё ещё зелёный, при конфликте подтянуть regen в финальный
slice 1 commit.

---

## Continuation prompt (копировать в новый CC чат)

```
Привет. Я Ruslan, Product Owner проекта investment-tracker
(AI-инвест-трекер: Next.js web + Go Core API + Python AI Service).
Оркеструю параллельные Claude Code сессии — каждая CC работает
свой PR в отдельном worktree. Главный проект: D:\СТАРТАП.

Первым делом читай:

  D:\СТАРТАП\docs\PO_HANDOFF.md            (полный handoff)
  D:\СТАРТАП\docs\README.md                (wave status)
  D:\СТАРТАП\docs\TASK_07_web_frontend.md  (твоя таска — full scope)
  D:\СТАРТАП\docs\CC_KICKOFF_task07_slice1.md  (этот slice — читай
                                                  особенно внимательно)
  D:\СТАРТАП\docs\04_DESIGN_BRIEF.md       (дизайн-система)
  D:\СТАРТАП\docs\02_ARCHITECTURE.md       (scope-cut headers, patterns)
  D:\СТАРТАП\docs\DECISIONS.md             (ADR log)

Текущий статус:
- main tip ~ cf5ae55 (может быть свежее — проверь fetch + log).
- AI chat end-to-end в main (PR #42/#43/#44). OpenAPI контракт стабилен.
- TASK_04 (Core API): 8 of ~9 PRs merged. Параллельно идёт B3-iii в
  другом worktree — НЕ пересекается с твоим scope (apps/web/** vs
  apps/api/**).

Ты делаешь TASK_07 Slice 1: scaffold + auth + dashboard vertical
slice. Полный scope и acceptance — в CC_KICKOFF_task07_slice1.md.

Ключевое ограничение scope'а:
- ТОЛЬКО slice 1 из TASK_07. Не рендерить Chat, Insights, Accounts,
  Settings, Paywall, Pricing landing — это следующие slice'ы.
- Vertical: один экран (Dashboard) end-to-end через Clerk → API → render.
- Anchor 2000-2500 LOC (scaffold boilerplate).

Стиль общения (из PO_HANDOFF):
- Русский, коротко, без over-formatting.
- Decisions-first (что делать → почему).
- Видишь риск — говори сразу.
- Верифицируй через Read перед confirm (state loss бывал).
- Squash-only merge policy (TD-006).
- GAP REPORT перед write-phase.

Cycle:
1) Прочти docs (порядок выше).
2) Pre-flight audit: `ls packages/` — подтверди что shared-types
   и ui существуют. Проверь `tools/openapi/openapi.yaml` актуальна
   (grep aichat endpoints — должны быть). Проверь pnpm workspace.
3) GAP REPORT: scope (что именно рендерим), LOC прогноз, риски,
   подтверждение что slice ограничен, вопросы если есть.
4) Я оцениваю → даю отмашку.
5) Write-phase.
6) GAP REPORT v2 (write-phase done): LOC actual, AC mapping, CI
   status, branch SHA, Vercel preview URL (если настроен), merge readiness.
7) Я даю go/no-go.
8) Ты сам мерджишь (gh pr create + gh pr merge --squash
   --delete-branch).
9) Post-merge docs pass (merge-log entry + TASK_07 row status
   "Slice 1 merged" + README wave 3 note "🟢 in flight").
10) Final report мне.

Start: прочти все указанные docs, потом подтверди готов к pre-flight.
```
