# CC Kickoff — TASK_07 Web Frontend (Slice 1)

**Scope:** Extend existing `apps/web/` scaffold with Clerk auth + Dashboard vertical slice (read-only).
**Anchor:** 1200-1600 LOC (scaffold уже есть, без boilerplate).
**Worktree:** `D:/investment-tracker-task07-s1` (feature/task07-slice1 branch from main).
**Base:** main tip = `aa4d4a5` (или свежее).
**Parallels with:** B3-iii в другом worktree. Не пересекается по файлам (apps/web/** vs apps/api/**).

---

## Current state of apps/web (already on main)

Проверено на main tip `aa4d4a5`. Что **уже есть**:

- `apps/web/package.json` — Next.js 15.1.3, React 19.2.5, Tailwind v4, Biome, TS 5.7 strict.
- Workspace deps подключены: `@investment-tracker/design-tokens`, `@investment-tracker/shared-types`, `@investment-tracker/api-client`, `@investment-tracker/ui`, `@investment-tracker/config`.
- `src/app/layout.tsx` — root layout с Geist шрифтами, brand metadata.
- `src/app/page.tsx` — home page с Logo + tagline + link на `/design`.
- `src/app/design/` — полноценная design preview страница (foundations, primitives, shells, chat, charts, freemium, domain sections) — источник визуальной истины для slice 1.
- `src/lib/sentry.ts`, `src/lib/posthog.ts` — init stubs (no-op пока пакеты не установлены).
- `.env.example` — CLERK (publishable + secret), SENTRY, POSTHOG, APP_URL, API_URL.
- `biome.json`, `postcss.config.mjs`, `next.config.ts`, `tsconfig.json`.

Что **отсутствует** и что Slice 1 добавит:

1. **Clerk integration** — пакеты не установлены, `ClerkProvider` не обёрнут, middleware нет.
2. **Auth routes** — `(auth)/sign-in`, `(auth)/sign-up`.
3. **Protected app routes** — `(app)/layout.tsx` + `(app)/dashboard/page.tsx`.
4. **API client instance** — `lib/api/client.ts` через openapi-fetch из `@investment-tracker/api-client` (или raw из shared-types если api-client — это просто types).
5. **TanStack Query** — provider + `usePortfolio()` hook.
6. **Portfolio value card** — один компонент в `components/portfolio/value-card.tsx` + использование в dashboard.
7. **Unit test** — один smoke тест dashboard с mock data (Vitest + RTL).

## Slice 1 — что НЕ делаем

- Positions / Position Detail — отдельный slice.
- AI Chat UI — отдельный slice (требует streaming client).
- Insights page.
- Accounts CRUD, Settings, Paywall, Pricing marketing page.
- Real Sentry/PostHog wiring (оставляем stubs, добавим пакеты только когда подключим DSN).
- Performance chart, allocation donut, top movers — Slice 2+.
- E2E Playwright — ещё нет критических путей для тестов.
- Vercel deploy (опционально — если уже настроен на repo, slice 1 использует autodeploy; если нет — отдельный PR).

## Detailed scope

### 1. Clerk integration

Установить `@clerk/nextjs` в `apps/web/package.json` deps. В `app/layout.tsx` обернуть `<ClerkProvider>` вокруг root. Создать `src/middleware.ts`:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher(["/", "/design(.*)", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js|jpg|jpeg|png|svg|ico|webp|woff2?|map)$).*)", "/(api|trpc)(.*)"],
};
```

### 2. Auth routes

- `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` — `<SignIn appearance={clerkAppearance} />`
- `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` — `<SignUp appearance={clerkAppearance} />`
- `src/app/(auth)/layout.tsx` — minimal centered container.
- `clerkAppearance` в `src/lib/clerk-appearance.ts` — собрать из design-tokens (brand colors, font family, border radius).

### 3. Protected app shell

- `src/app/(app)/layout.tsx` — sidebar skeleton (nav links: Dashboard, Positions, Chat, Insights, Accounts, Settings — все кроме Dashboard disabled), top bar с `<UserButton />` от Clerk.
- `src/app/(app)/dashboard/page.tsx` — Server Component. Запрашивает portfolio через api client с server-side Clerk token.

### 4. API client instance

Проверь содержимое `packages/api-client/src/`. Если там уже openapi-fetch обёртка — использовать. Если нет — создать в `apps/web/src/lib/api/client.ts`:

```ts
import createClient from "openapi-fetch";
import type { paths } from "@investment-tracker/shared-types";

export function createApiClient(token?: string) {
  return createClient<paths>({
    baseUrl: process.env.API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
```

Server Components используют `auth().getToken()` + `createApiClient(token)`. Client Components — через TanStack Query hook который зовёт Clerk `useAuth().getToken()` в queryFn.

### 5. TanStack Query

- `src/app/providers.tsx` — client component, QueryClientProvider + persister опционально (пока нет).
- `src/hooks/usePortfolio.ts` — hook который получает token через `useAuth()` и дёргает `/portfolio`. staleTime 60s.

### 6. Portfolio value card

`src/components/portfolio/value-card.tsx`:
- Input: portfolio object из API response.
- Render: крупное число (total_value в display_currency), P&L за день с цветом (gain/loss из design-tokens semantic colors), mini-sparkline через Recharts (если добавляем — можно отложить, заменить на placeholder div 40px).

Skeleton loading state + error boundary.

### 7. Test

Один Vitest smoke тест в `src/components/portfolio/value-card.test.tsx` — "renders portfolio value with gain and loss variants". Mock data, без real API.

Если Vitest не установлен в workspace — добавить как devDep в apps/web.

## Acceptance

- `pnpm --filter @investment-tracker/web dev` → localhost:3000 → `/` публична, `/dashboard` redirect на `/sign-in`.
- Sign-up через Clerk dev instance → редирект в `/dashboard`.
- `/dashboard` рендерит portfolio value card (реальные данные если backend запущен и аккаунт seed'нут, иначе empty state с "Connect your first account" disabled CTA).
- Dark mode через system preference работает (design-tokens уже поддерживают light/dark semantic).
- `pnpm --filter @investment-tracker/web build` зелёный, TS strict.
- `pnpm --filter @investment-tracker/web lint` зелёный (Biome).
- `pnpm --filter @investment-tracker/web test` зелёный (один smoke тест).
- Турборепо CI pipeline (`pnpm typecheck`, `pnpm lint`, `pnpm build`) — 8/8 green в CI.
- Pre-commit (lefthook) + pre-push (lefthook) проходят локально.

## Dependencies проверить до write-phase

1. `ls packages/api-client/src/` — есть ли openapi-fetch обёртка. Если просто re-export types — создать client в apps/web сам.
2. `ls packages/shared-types/src/` — есть ли `paths` тип из openapi.yaml. Если нет — regenerate.
3. `tools/openapi/openapi.yaml` содержит `/portfolio` endpoint с актуальной response shape.
4. Clerk инструкции dev instance: нужен `CLERK_SECRET_KEY` + `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`. Ruslan предоставит значения в .env.local вручную (не коммитить).
5. Core API должен быть доступен на `http://localhost:8080` для локальной проверки. Если нет — CC проверяет только build+typecheck+lint без реального запроса.

## Parallelization note

Пока ты делаешь slice 1, в другом worktree идёт B3-iii (webhooks + write-path). Твой scope требует только GET /portfolio, который давно в main. Drift risk = 0.

Если B3-iii обновит `openapi.yaml` во время твоей работы — после его merge regenerate `shared-types`, прогони `pnpm --filter web build`, зафиксируй в финальном commit. Это минута работы.

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
  D:\СТАРТАП\docs\CC_KICKOFF_task07_slice1.md     (ТВОЙ scope —
                                                    читай особо
                                                    внимательно)
  D:\СТАРТАП\docs\TASK_07_web_frontend.md         (full TASK 07)
  D:\СТАРТАП\docs\04_DESIGN_BRIEF.md              (дизайн-система)
  D:\СТАРТАП\docs\02_ARCHITECTURE.md              (scope-cut headers,
                                                    patterns)
  D:\СТАРТАП\docs\DECISIONS.md                    (ADR log)

Текущий статус:
- main tip = aa4d4a5 (проверь fetch — может быть свежее).
- AI chat end-to-end в main (PR #42/#43/#44). OpenAPI контракт стабилен.
- TASK_04 Core API: 8 of ~9 PRs merged. Параллельно идёт B3-iii в
  другом worktree — НЕ пересекается с твоим scope (apps/web/**
  vs apps/api/**).
- apps/web/ уже имеет scaffold Next.js 15 + Tailwind v4 + Biome
  + design-tokens/shared-types/api-client/ui deps + /design preview.

Ты делаешь TASK_07 Slice 1: Clerk auth + Dashboard vertical slice.
Полный scope в CC_KICKOFF_task07_slice1.md. Кратко:
- Clerk integration (middleware + providers + sign-in/sign-up routes)
- Protected (app) route group с sidebar skeleton
- (app)/dashboard/page.tsx с Portfolio value card
- API client instance + usePortfolio() hook (TanStack Query)
- Один Vitest smoke test

Anchor 1200-1600 LOC. НЕ scaffold'им с нуля — scaffold уже есть.
НЕ добавляем Chat UI / Insights / Accounts / Settings / Paywall
в этом slice.

Стиль общения (из PO_HANDOFF):
- Русский, коротко, без over-formatting.
- Decisions-first (что делать → почему).
- Видишь риск — говори сразу.
- Верифицируй через Read перед confirm (state loss бывал).
- Squash-only merge policy (TD-006).
- GAP REPORT перед write-phase.

Cycle:
1) Прочти docs в указанном порядке.
2) Pre-flight audit: `ls apps/web/src/` и `ls packages/api-client/src/`
   и `ls packages/shared-types/src/` — подтверди что scaffold и deps
   на месте. Проверь `tools/openapi/openapi.yaml` — есть `/portfolio`
   endpoint. Проверь pnpm workspace scripts.
3) GAP REPORT: scope delta (что добавляется, что уже есть), LOC прогноз,
   риски (Clerk dev keys есть ли в .env.local? api-client это wrapper
   или types-only? etc), вопросы если есть.
4) Я оцениваю → даю отмашку.
5) Write-phase.
6) GAP REPORT v2 (write-phase done): LOC actual, AC mapping, CI
   status, branch SHA, merge readiness, опциональный Vercel preview URL.
7) Я даю go/no-go.
8) Ты сам мерджишь (gh pr create + gh pr merge --squash
   --delete-branch).
9) Post-merge docs pass (merge-log entry + TASK_07 row status
   "Slice 1 merged" + README wave 3 note "🟢 in flight").
10) Final report мне: PR number, squash SHA, docs SHA, diff stat,
    opened TDs (если есть), worktree cleanup status.

Start: прочти все указанные docs, потом подтверди готов к pre-flight.
```
