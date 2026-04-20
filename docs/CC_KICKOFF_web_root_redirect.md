# CC Kickoff — Web Root Redirect (micro-slice)

**Scope:** заменить TASK_02 placeholder splash на `apps/web/src/app/page.tsx` auth-aware редиректом: залогинен → `/dashboard`, нет → `/sign-in`. Плюс 1 Vitest smoke. Больше ничего.
**Anchor:** 20-40 LOC (single-file change + 1 test).
**Worktree:** `D:/investment-tracker-web-root` (branch `feature/web-root-redirect` from main).
**Base:** main tip = `cdfca5d` (после TD-075 k6 fixes).
**Parallels with:** ничего — никакие другие worktree сейчас не открыты, drift risk = 0.

---

## Context

TASK_02 оставил `apps/web/src/app/page.tsx` как дизайн-превью splash: Logo + productName + tagline + Link на `/design`. На проде (Vercel deployment) корень `/` лэндит на этот splash — любой первый визит ведёт на design preview вместо auth flow. Это был known gotcha из последней сессии перед power outage.

Backend auth готов и merged в main (Slice 1 PR #45 `a622bd3`): Clerk middleware, `(auth)/sign-in`, `(auth)/sign-up`, `(app)/dashboard` существуют. `@clerk/nextjs/server` `auth()` helper доступен в server components. `redirect()` из `next/navigation` работает.

Middleware (`apps/web/src/middleware.ts`) сейчас:

```ts
const isPublic = createRouteMatcher(['/', '/design(.*)', '/sign-in(.*)', '/sign-up(.*)']);
```

Root `/` — публичный. Оставляем таким: `auth()` на сервере сам вернёт `userId` если залогинен, и `redirect()` отправит куда надо. Делать `/` protected смысла нет — редирект в любом случае произойдёт до рендеринга страницы.

---

## Current state of apps/web (main tip `cdfca5d`)

### Что есть
- Slice 1+2+3 merged (auth, dashboard, positions, chat, все hooks/providers).
- `apps/web/src/app/page.tsx` — 25 LOC TASK_02 placeholder (Logo + heading + Link to `/design`).
- `apps/web/src/middleware.ts` — Clerk middleware, `isPublic` matcher включает `/`, `/design(.*)`, `/sign-in(.*)`, `/sign-up(.*)`.
- `(app)/dashboard/page.tsx` — работает.
- `(auth)/sign-in/[[...sign-in]]/page.tsx` — работает.

### Что Slice добавит
1. Переписать `apps/web/src/app/page.tsx`:
   - Async server component.
   - `const { userId } = await auth();`
   - `if (userId) redirect('/dashboard'); else redirect('/sign-in');`
2. 1 Vitest smoke (если тестируемо без тяжёлого Clerk mock'а — иначе сноска в PR описании почему skipped).

Старые импорты (`brand`, `Logo`, `Link`) становятся dead — удалить.

---

## Что НЕ делаем

1. **`/design` НЕ трогаем.** Остаётся public route (PO использует его для ручного превью дизайн-системы). Удалим позже, отдельным PR, когда PO даст отмашку.
2. **Middleware НЕ меняем.** `/` остаётся в `isPublic` matcher — это семантически корректно (страница сама редиректит до вывода контента, protected-режим здесь избыточен).
3. **FloatingAiFab / ChatContext deep-links** — это Slice 4 scope.
4. **PaywallModal / `/pricing`** — Slice 5 scope.
5. **Custom domain setup на Vercel / Cloudflare DNS** — operational (PO), не code.
6. **Unused dependency cleanup в `package.json`** — не нужен, `brand`/`Logo`/`Link` импорты используются в других файлах.
7. **Новые компоненты / hooks / utils** — scope = ровно `page.tsx` + test.

---

## Acceptance criteria

- `apps/web/src/app/page.tsx` — server component, async, использует `auth()` + `redirect()`.
- Залогиненный пользователь при заходе на `/` → редирект на `/dashboard`.
- Незалогиненный пользователь при заходе на `/` → редирект на `/sign-in`.
- `/design` остаётся доступен напрямую (public route сохранён).
- `pnpm --filter web lint` — green.
- `pnpm --filter web typecheck` — green.
- `pnpm --filter web build` — green (Next.js build без warnings на root route).
- `pnpm --filter web test` — 38 (Slice 3 baseline) + Δ (новый test если добавлен).
- Vitest smoke (если добавлен) — mock'ает `@clerk/nextjs/server` `auth()`, проверяет что `redirect()` вызван с правильным path для userId / null userId.

Если smoke test невозможен без тяжёлого mock'а Next.js runtime — допустимо skip с явной сноской в PR description: "rely on Playwright e2e in future when prod auth wired". CC решает сам.

---

## Open questions (не блокеры — CC решает в процессе)

1. Добавлять ли comment в `page.tsx` про то что `/` намеренно остаётся public route? → **Yes**, 1 строка `// Keeping '/' as public route in middleware — page itself handles redirect via Clerk auth()`.
2. Если Clerk `auth()` бросит на unauth user вместо возврата `{userId: null}` — fallback через try/catch? → **No**, `auth()` в App Router возвращает `{userId: null}` для публичного роута, не бросает. Если CC столкнётся с исключением — значит middleware protected роутом считает, тогда поправить middleware (но это не должно произойти — `/` в `isPublic`).

---

## Deliverables

1. PR в main: `feat(web): root / redirects to dashboard or sign-in`.
2. GAP REPORT в чат PO перед mergre — scope, LOC, CI status, unused imports удалены, test added/skipped + rationale.
3. Post-merge: PO обновит `merge-log.md` + `PO_HANDOFF.md § 1` / § 2 (main tip SHA).

---

## PO notes

- Squash-only merge, как обычно.
- Vercel auto-deploy на main — после merge ~60 секунд, проверим `investment-tracker-kjanlq4qf-ruslan-maistrenko1.vercel.app` (или любой другой актуальный production URL) → должен редиректить на `/sign-in`.
- После merge появится возможность нормально протестить `/sign-in → /sign-up → /dashboard` flow на проде без splash-loop.
