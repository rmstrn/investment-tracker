# CC KICKOFF — TASK_07 Slice 7a + 7b: Landing + Pricing + Paywall (без Stripe)

**Owner:** Claude Code (CC) session #2 (parallel to Slice 4a)
**Worktree:** `D:/investment-tracker-landing-7ab` от main tip `0a0d437`
**Branch:** `feature/task07-slice7ab`
**Source of truth для scope:** `docs/UI_BACKLOG.md` Slice 7a + 7b
**PR ownership:** CC owns merge + cleanup + docs pass (см. `docs/CC_KICKOFF_api_cors.md` как reference)

---

## 1. Зачем

Сейчас `/` — это серверный redirect (`apps/web/src/app/page.tsx`): authed → `/dashboard`, остальные → `/sign-in`. У продукта **нет публичного лица** — никто, кто пришёл по ссылке, не понимает, что это и зачем платить. Pricing/paywall существует только в `/design` playground.

Slice 7a + 7b закрывает обе дыры одним PR'ом, потому что копирайтинг и шейринг tokens между Landing и Pricing делать в один присест дешевле, чем дробить.

**Не делаем:** Stripe checkout flow, billing portal, webhooks. Только UI + переход «Upgrade → /pricing → выбор тарифа → click `Subscribe` (no-op stub с TODO)». Stripe wiring — отдельный слайс после прихода живых тарифов (см. UI_BACKLOG Slice 7c, TD-057).

---

## 2. Pre-flight checks (CC: пробежать ДО кода)

1. **Текущий `/` redirect.** `apps/web/src/app/page.tsx` сейчас redirect-only (server component с `auth()` + `redirect()`). После Slice 7a:
   - Authed user → продолжаем редиректить на `/dashboard` (НЕ ломаем существующий flow)
   - Anon user → показываем landing (НЕ редиректим на `/sign-in`)
2. **Middleware.** `apps/web/src/middleware.ts` уже считает `/` публичным. Добавить `/pricing` в `isPublic` matcher.
3. **PaywallModal.** Уже существует в `packages/ui/src/primitives/PaywallModal.tsx` — purely presentational, готов к использованию. Не пересобирай.
4. **UsageIndicator + PlanBadge.** Тоже в `packages/ui` (см. `apps/web/src/app/design/_sections/freemium.tsx` — там живой пример wiring'а).
5. **Дизайн-токены.** Tailwind v4 + `@investment-tracker/design-tokens` уже подключены. Не вводи hardcoded цвета — используй semantic tokens (`text-text-primary`, `bg-surface-default`, etc.). Если нужного токена нет — спроси у PO в GAP REPORT, не хардкодь.
6. **Бренд-копирайт.** Brand voice guidelines пока **не финализированы** (см. `docs/PO_HANDOFF.md`). Пиши простую, прямую копию: «AI-нативный трекер инвестиций для серьёзных частных инвесторов» — без markеtinговой истерики и без хвастовства фичами, которых нет (например, не пиши «работает с 50+ брокерами», у нас пока 0 в проде).

---

## 3. Декомпозиция (7 шагов)

### Шаг 1 — `/` Landing page
**Файлы:** `apps/web/src/app/page.tsx` (rewrite), `apps/web/src/app/(public)/_landing/*.tsx` (новый route group или просто co-located components — на твоё усмотрение).

- Server component с `auth()` check: authed → `redirect('/dashboard')`, иначе render landing.
- Структура (брать дизайн-bricks из `packages/ui`, не свои):
  - **Header** — лого + «Sign in» + «Get started» CTA.
  - **Hero** — H1 («What you actually own. Why it moved. What to do next.» — это product brief tagline), 1 параграф value prop, CTA button «Get started — free».
  - **Three pillars** — 3 карточки: «Connect any broker» / «AI-explained moves» / «Honest insights, no churn». Используй `Card` из `@investment-tracker/ui`.
  - **Trust strip** — пустой плейсхолдер «Built by ex-fintech engineers» (без врать про logos, которых нет).
  - **Footer** — links: Pricing, Sign in, ToS (/legal/terms — placeholder route OK), Privacy (/legal/privacy — placeholder OK).
- Адаптивно: mobile-first, breakpoints как в дизайн-системе.

### Шаг 2 — `/pricing` Pricing page
**Файлы:** `apps/web/src/app/pricing/page.tsx` + co-located components.

- Public route (добавить в middleware matcher).
- Если authed — рендерь ту же страницу, но передавай в `PricingTable` проп `currentPlan: 'free' | 'plus' | 'pro'` (получай через Clerk session metadata, fallback `'free'`).
- 3 колонки: **Free / Plus / Pro**. Цены — placeholder: Free $0, Plus $8/mo, Pro $15/mo. Если эти цифры не совпадают с тем, что в `04_DESIGN_BRIEF.md` или `00_PROJECT_BRIEF.md` — используй те, что в brief, и подсветь несовпадение в GAP REPORT.
- Comparison-фичи (как минимум 5 строк): Connected accounts (1 / 3 / unlimited), AI chat messages/mo (10 / 200 / unlimited), Insights (basic / full / advanced), Tax reports (—/ Plus / Pro), Priority support (— / — / Pro).
- Под каждой колонкой — CTA:
  - Free → «Get started» (→ `/sign-up`)
  - Plus / Pro → «Subscribe» (no-op stub: `console.log('TODO: Stripe checkout', tier)`. **НЕ** вызывай реальный Stripe SDK).
- Authed user, у которого `currentPlan === 'plus'` → на колонке Plus вместо «Subscribe» — disabled badge «Current plan».

### Шаг 3 — Paywall trigger wiring (демо)
**Файлы:** `apps/web/src/app/(app)/dashboard/page.tsx` (минимальный edit) + `packages/ui/src/primitives/PaywallModal.tsx` (НЕ трогать, он готов).

Цель — показать, что paywall физически работает (не только в playground'e):
- На `/dashboard` добавь невидимый `useState` для `paywallOpen`.
- Кнопка/баннер «You've hit your free limit» с триггером — необязательно. Минимум: один dev-only handler где `PaywallModal` открывается, нажатие «Upgrade» делает `router.push('/pricing')`.
- НЕ замораживай реальные feature gates на free-tier (это уйдёт в Slice 7c с реальными лимитами в DB). Сейчас — pure UI demo.

Если кажется, что Шаг 3 размывает scope — выноси в open question ниже. PO может зарезать его и оставить paywall только в `/design`.

### Шаг 4 — Public route group cleanup
- `apps/web/src/middleware.ts` — добавить `/pricing` в `isPublic` matcher.
- Если ты создал `(public)/` route group — убедись, что `(app)/` shell к нему не applies (отдельный layout).
- Лого/Header в landing/pricing не должен использовать `app-shell-client.tsx` (это для authed area). Сделай минимальный `MarketingHeader` компонент.

### Шаг 5 — Vitest smoke tests
**Файлы:** `apps/web/src/app/page.test.tsx` (расширить — он уже существует), `apps/web/src/app/pricing/page.test.tsx` (новый).

- `page.test.tsx`:
  - anon user → renders «Get started» CTA, не редиректит
  - authed user → calls `redirect('/dashboard')` (mock Clerk `auth()`)
- `pricing/page.test.tsx`:
  - renders 3 tier cards
  - Plus/Pro CTAs are present
  - clicking «Subscribe» does NOT throw / does NOT call any external (стаб OK)

Не пиши e2e — это уйдёт в Playwright slice позже (TD-061).

### Шаг 6 — Lighthouse / a11y sanity
- Locally: `pnpm --filter web build && pnpm --filter web start` → открой `/` и `/pricing` в Chrome DevTools.
- Lighthouse Mobile target: Perf > 80, A11y > 95, Best Practices > 95. Не блокер для merge — reports go в GAP REPORT, фиксы в follow-up TD если что-то < 80.
- a11y must-haves: H1 на каждой странице один, all CTAs are `<button>` или `<a>` с aria-labels, контраст по WCAG AA (тут tokens уже audited).

### Шаг 7 — GAP REPORT + self-merge + cleanup + docs
По шаблону `docs/CC_KICKOFF_api_cors.md` § «CC ownership»:
1. Open PR с заголовком `feat(web): slice 7a+7b — landing + pricing + paywall ui`.
2. `gh pr checks --watch` (mandatory per TD-078).
3. После всех ✅ — GAP REPORT в PR description (что сделано, что НЕ сделано, новые TD).
4. PO approves в чате → CC сам мержит: `gh pr merge --squash --delete-branch`.
5. Cleanup worktree: `git worktree remove D:/investment-tracker-landing-7ab` (на хост-машине после merge).
6. Docs pass:
   - `docs/UI_BACKLOG.md` — отметить Slice 7a + 7b как ✅ merged + SHA
   - `docs/03_ROADMAP.md` — Месяц 4 / Stripe + Тарифы — отметить «Paywall UI» как [x]
   - `docs/PO_HANDOFF.md` § 12 — обновить «main tip» SHA
   - Если новые TD — `docs/TECH_DEBT.md` + `docs/DECISIONS.md`
7. Push docs commit прямо в main (`--no-verify` если lefthook не подцепился — это docs-only allowed по PO_HANDOFF § 3).

---

## 4. What we DON'T do (anti-scope)

- ❌ Stripe SDK / checkout flow / billing portal (Slice 7c, TD-057)
- ❌ Real feature gates по тарифам в DB / API (TD-082 — пока даже не заведён)
- ❌ Email capture / waitlist (out of MVP — пока CTAs ведут прямо в `/sign-up`)
- ❌ Marketing animations / Lottie / videos (P3 polish, UI_BACKLOG Slice 17)
- ❌ Blog / changelog / about pages (вне scope MVP)
- ❌ Localization (только en-US пока, см. ROADMAP)
- ❌ SEO meta-tags beyond basic `<title>` + `<meta description>` (P2 polish)
- ❌ Social previews (Open Graph cards) — P3
- ❌ Cookie banner / consent UI (Месяц 4 GDPR slice, не сейчас)

---

## 5. Acceptance criteria (PO smoke на staging после merge)

1. `https://staging.investment-tracker.app/` (anon) — landing рендерится, есть hero + 3 pillar cards + footer, CTAs кликабельны.
2. `https://staging.investment-tracker.app/` (authed via Clerk dev account) — редиректит на `/dashboard`.
3. `https://staging.investment-tracker.app/pricing` (anon) — 3 tier cards, цены видны, «Get started» ведёт на `/sign-up`, «Subscribe» не падает в консоль с ошибкой.
4. `https://staging.investment-tracker.app/pricing` (authed) — те же 3 tier cards. Free колонка = «Current plan» badge для нового аккаунта.
5. Lighthouse mobile `/` и `/pricing` ≥ 80 Perf, ≥ 95 A11y.
6. На `/dashboard` (Шаг 3) — paywall минимум открывается через dev-trigger; «Upgrade» внутри ведёт на `/pricing`.
7. Vitest все зелёные, CI зелёный, `gh pr checks --watch` без warnings.

---

## 6. Open questions (CC: задать в первом сообщении до начала кода)

1. **Цены тарифов** — Free $0 / Plus $8 / Pro $15 — это placeholder? Или есть финализированные? (Если в `00_PROJECT_BRIEF.md` или `04_DESIGN_BRIEF.md` указаны другие — используй их и подсветь.)
2. **Pricing route group** — `(public)/pricing/` или просто `pricing/` без группы? У нас уже есть `(app)/`, `(auth)/`. Я бы выбрал `(marketing)/` для landing+pricing+future (about/blog), но решай сам — главное не сломать `(app)/` shell.
3. **Paywall demo на /dashboard (Шаг 3)** — оставляем как dev-only trigger или вообще выносим в follow-up slice? Если кажется, что размывает scope — режь и пиши в GAP REPORT.
4. **Header лого** — у нас есть SVG лого в `packages/ui` или `apps/web/public`? Если нет — text-only «Investment Tracker» wordmark OK.
5. **ToS / Privacy linkи в footer** — куда вести? `/legal/terms` placeholder с `<h1>Terms of Service — coming soon</h1>` OK, или вообще убрать footer-линки до Месяца 4 legal slice?

---

## 7. PO post-merge actions (для рефа, CC не делает)

1. Vercel auto-deploys main → `staging.investment-tracker.app` (~2 мин).
2. Smoke по acceptance criteria § 5 выше.
3. Если что-то критичное — открыть hotfix PR, не roll back (Slice 7a/7b — cosmetic, не блокирует core flow).
4. Anonymous Lighthouse run + record в GAP REPORT issue если показатели < target.

---

## 8. Что разблокирует этот slice

- Visitor → sign-up funnel (сейчас ноль, потому что landing нет).
- Slice 7c (Stripe wiring) — UI готов, останется webhook + checkout API.
- Pre-alpha pre-launch waitlist (можно заменить «Get started» CTA на email capture за 1 час позже, если решим делать closed beta).
- Месяц 4 onboarding flow — есть точка входа для маркетинговых кампаний.
