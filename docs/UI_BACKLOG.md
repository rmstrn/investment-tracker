# UI Backlog — Web Frontend (post-Slice 3)

**Scope:** всё что осталось сделать в `apps/web` до MVP-launch. iOS / native mobile — **out of scope** (см. TASK_08, отдельная волна).
**Status anchor:** 2026-04-21, main tip `fc44782`. TASK_07 Slice 1/2/3 merged (PR #45, #48, #50). CORS + staging deploy работают (PR #54+#55).
**Owner:** PO (приоритизация) + CC (реализация по micro-slices).
**Cadence:** один slice = один kickoff + один PR. Нет multi-slice PR.

---

## Что уже есть (baseline)

| Area | State |
|---|---|
| Auth flow | Clerk middleware + `(auth)/sign-in` + `(auth)/sign-up` live |
| Root redirect | PR #53 — `/` → `/dashboard` для signed-in, иначе landing placeholder |
| Dashboard | `PortfolioValueCardLive` + `GET /portfolio` (Slice 1) |
| Positions | List + Detail + price chart + infinite transactions (Slice 2) |
| AI Chat | `(app)/chat` + `(app)/chat/[id]`, SSE streaming, rich content blocks, rate-limit UI (Slice 3) |
| Design playground | `/design` — component catalog |
| Deploy | Vercel + custom domain `staging.investment-tracker.app`, API CORS allowlist работает |

## Что отсутствует / не работает (gap)

User-facing ощущение "UI не готов" складывается из:
- `/` показывает marketing placeholder без реального лендинга (splash-only)
- Sidebar содержит пункты которые ведут в никуда (нет disabled-state / "coming soon")
- Нет `/accounts` — нельзя подключить брокера (единственный способ добавить данные)
- Нет `/insights` — AI инсайты существуют на бэке, но не отрисованы
- Нет `/settings/*` — профиль, биллинг, нотификации недоступны
- Нет Paywall / `/pricing` — Free юзер не может апгрейднуться
- Нет скоуп-кат баннеров (X-Partial-Portfolio и ко.) — юзер не видит когда данные частичные
- Нет global 404 / 500 / error states
- Нет PWA / offline / install prompt
- Нет Sentry / PostHog — фронт-ошибки в проде сейчас слепые

---

## Приоритеты

**P1 — MVP-blocking.** Без этого продукт не юзабельный даже для alpha-тестера.
**P2 — Launch-blocking.** Нужно до публичного запуска, но alpha может стартовать без.
**P3 — Polish / post-launch.** Полезно, но не блокирует launch.

Backend dependencies указаны inline. TD-ссылки — на `docs/TECH_DEBT.md`.

---

## P1 — MVP-blocking

### Slice 4 — Accounts CRUD (list + add + disconnect)

**Scope:** `(app)/accounts` route + список подключённых счетов + "Add Account" modal с 3 вариантами (SnapTrade OAuth, Binance/Coinbase API keys, Manual). Rename / Disconnect actions. Sync-status badge + "Sync now" кнопка.

**Почему P1:** без этого у пользователя нет способа ввести данные. Dashboard / Positions показывают пустоту. Единственный MVP путь — manual accounts + ручные transactions (через API пока, UI для трансакций в Slice 5).

**Backend dep:** TASK_06 aggregator providers (TD-046) — SnapTrade + Binance + Coinbase. **Блокер для real-broker flow.** Manual-only variant можно стартовать уже сейчас через `POST /accounts` + `POST /transactions` (уже в OpenAPI).

**Recommended split:**
- 4a — Manual account CRUD (list + create modal + rename + disconnect), без OAuth. ~500 LOC.
- 4b — SnapTrade OAuth flow (OAuth init + callback handler). Ждёт TD-046. ~400 LOC.
- 4c — Binance / Coinbase API-key flow. Ждёт TD-046. ~300 LOC.

**Acceptance:** юзер может создать manual account, увидеть его в списке, удалить. Dashboard начинает показывать non-empty portfolio после добавления transactions (даже если через curl).

**Risks:**
- SnapTrade OAuth flow требует production webhook URL → нужен staging webhook tunnel (ngrok / Cloudflare tunnel) или skip до TD-046 закрытия.

---

### Slice 5 — Transactions UI (add / edit / delete)

**Scope:** Transactions tab на Position Detail уже есть (read-only, Slice 2). Добавить "Add Transaction" action + edit / delete existing. Поддержка типов `buy`, `sell`, `dividend`, `split`, `transfer`.

**Почему P1:** без ручного ввода transactions manual account бесполезен. Вместе со Slice 4a даёт полный MVP flow для ручного ведения портфеля.

**Backend dep:** TD-057 (Billing CRUD) — частично пересекается по тарификации лимитов на manual entries, но не блокирует P1. TD-065 (split events) — опционально, можно оставить split на Slice 6.

**Split:**
- 5a — Add + Edit + Delete для buy/sell/dividend. ~600 LOC.
- 5b — Split / transfer support. ~300 LOC. Зависит от TD-065.

**Acceptance:** юзер добавляет trade через UI, видит обновлённую позицию в list + detail + dashboard.

---

### Slice 6 — Insights Feed

**Scope:** `(app)/insights` route. Лента карточек от `GET /ai/insights`. Severity-иконки, dismiss / mark-as-read, фильтр по типу + severity. Actionable insights с CTA (линк на позицию / на настройку DCA).

**Почему P1:** AI-инсайты — один из двух основных value prop'ов продукта (второй — chat). Без UI они существуют только в БД.

**Backend dep:** AI Service должен быть задеплоен на staging (TD-070). Без этого `/ai/insights` возвращает 503 / timeout. **Блокер для E2E smoke** — UI можно деплоить с mock данными + флагом feature-disabled.

**Split:**
- 6a — Read-only feed (list + filter + dismiss local-state). ~400 LOC.
- 6b — Persistence (mark-as-read → backend), actionable CTAs. ~300 LOC.

**Acceptance:** юзер видит список insights, может dismiss, клик на "Посмотреть позицию" уводит в Position Detail.

---

### Slice 7 — Landing + Pricing + Paywall MVP

**Scope:** `(marketing)/page.tsx` — реальный лендинг (не splash). `(marketing)/pricing` — сравнение тарифов. Paywall modal для Free-юзера жмущего Pro-фичу. Stripe Checkout redirect из pricing + paywall.

**Почему P1:** без реального лендинга `/` выглядит недоделанным → блокирует даже sharing ссылки с друзьями. Pricing / paywall можно запускать без Stripe (Alpha = free for all), но это быстрая работа и закрывает "UI не готов" ощущение.

**Backend dep:** Stripe Checkout handler (TD-057 частично). MVP без Stripe — кнопка "Upgrade" ведёт на "Coming soon" состояние.

**Split:**
- 7a — Landing hero + features + CTA. ~400 LOC.
- 7b — `/pricing` + Paywall modal (без Stripe). ~300 LOC.
- 7c — Stripe Checkout + Billing Portal integration. ~400 LOC. Ждёт TD-057.

**Acceptance:** anon-юзер на `/` видит нормальный лендинг, signed-in — редирект на dashboard; `/pricing` рендерит 3 тарифа; paywall modal появляется на gated actions.

---

## P2 — Launch-blocking

### Slice 8 — Settings (Profile, Preferences, Security)

**Scope:** `(app)/settings/layout.tsx` с tabbed nav. `profile` (display name, avatar), `preferences` (currency, locale, timezone, dark mode), `security` (2FA через Clerk, sessions list). `data` (export / delete account — GDPR минимум).

**Backend dep:** для 2FA нужен Clerk Backend SDK (TD-056). Для data export — endpoint `GET /me/export` (не существует, создаётся попутно).

**Split:**
- 8a — Profile + Preferences. ~400 LOC.
- 8b — Security (2FA + sessions). ~300 LOC. Ждёт TD-056.
- 8c — Data (export + delete). ~200 LOC.

---

### Slice 9 — Settings Billing + Notifications

**Scope:** `(app)/settings/billing` — показать текущий тариф, ссылка на Stripe Customer Portal, usage indicators (AI messages used / limit). `(app)/settings/notifications` — email preferences.

**Backend dep:** Billing CRUD (TD-057). Без этого — placeholder "Coming soon".

---

### Slice 10 — Scope-cut header UI

**Scope:** при наличии `X-Partial-Portfolio` / `X-FX-Unavailable` / `X-Clerk-Unavailable` / `X-Benchmark-Unavailable` / `X-Analytics-Partial` / `X-Withholding-Unavailable` / `X-Async-Unavailable` — показывать non-blocking banner с explanation + retry CTA. Использовать канонический middleware (расширение `onRateLimitHeaders` из Slice 3).

**Почему P2:** запускать можно без — scope-cuts на staging редкие. Но для production-confidence нужно объяснять пользователю почему данные частичные.

**Backend dep:** middleware `onRateLimitHeaders` уже есть (Slice 3, PR #50). Расширить до ScopeCutHeaders.

**LOC:** ~300.

---

### Slice 11 — FloatingAiFab (context-aware mini-chat)

**Scope:** floating action button в нижнем правом углу (`(app)/layout.tsx`). Раскрывается в mini-chat panel. Context-aware: если юзер на Position Detail → pre-fill "Tell me about {symbol}"; на Dashboard → "What happened today?". Deep-link из Positions в full `/chat/[id]` с переданным context.

**Почему P2:** улучшает discovery AI-фичи. Без этого chat живёт в отдельной вкладке, 80% юзеров его не найдут.

**Backend dep:** нет (использует тот же `POST /ai/chat/stream`).

**LOC:** ~500.

**Note:** `ChatContext` deep-links из Positions (`/positions/[id]` → открыть новый chat с auto-prompt) — часть этого slice.

---

### Slice 12 — Empty + Error states

**Scope:** все "пусто" состояния (`/dashboard` без accounts, `/positions` без trades, `/chat` без history, `/insights` без insights). Дизайн + реализация по `TASK_07 § 12`. Network error retry, 404 page, 500 page с `request_id` (из `X-Request-ID` middleware).

**Почему P2:** сейчас empty-states инлайн-плейсхолдеры без CTA. Error-states — React error boundary default. Выглядит сыро.

**LOC:** ~400.

---

### Slice 13 — Sidebar disabled nav slots

**Scope:** sidebar в `(app)/layout.tsx` сейчас содержит живые линки только для dashboard / positions / chat. Для accounts / insights / settings пока ничего нет — или убираются из sidebar, или показываются как disabled "coming soon" пункты. После Slices 4-9 они становятся активными.

**Почему P2:** важно только до момента когда все P1/P2 slices закроются. Тогда само собой отпадает.

**LOC:** ~50. Включить в ближайший Slice который меняет layout.

---

## P3 — Polish / post-launch

### Slice 14 — Mid-stream SSE reconnect (TD-049)

**Scope:** если SSE chat connection рвётся посреди стрима — показать "Reconnecting..." indicator + auto-reconnect с resume (backend support TBD). Сейчас при обрыве чат показывает incomplete message без retry.

**Backend dep:** server-side resume (TD-049). Без этого — только client-side visual indicator + restart-from-scratch.

**LOC:** ~300.

---

### Slice 15 — PWA (manifest + service worker + install prompt)

**Scope:** `public/manifest.json`, service worker для offline fallback (Next.js PWA plugin или custom), install prompt после 2-3 визита. Icon set (из design-tokens).

**Почему P3:** не блокирует launch; desktop web достаточен для alpha. До iOS native важно, но iOS в scope следующей волны.

**LOC:** ~400.

---

### Slice 16 — SEO (sitemap, robots, OG images, structured data)

**Scope:** `app/sitemap.ts`, `app/robots.ts`, `opengraph-image.tsx` для лендинга + pricing, JSON-LD Organization / Product markup.

**LOC:** ~200.

---

### Slice 17 — Observability (Sentry + PostHog)

**Scope:** `@sentry/nextjs` wrapper, PostHog SDK + funnel tracking (signup → first account → first AI chat). Session replay — opt-in через `/settings/privacy`.

**Почему P3:** важно для post-launch feedback, но alpha-тестеров мало и фидбек идёт напрямую.

**LOC:** ~300.

---

### Slice 18 — Performance hardening

**Scope:** bundle analyzer pass, lazy-load Recharts + heavy components, preload critical fonts, image optimization audit, FCP / LCP / CLS проверка через Lighthouse CI. Цели из `TASK_07 § Performance`: FCP <1.2s, LCP <2s, CLS <0.1, bundle <200KB gz для первого экрана.

**LOC:** ~200 (в основном config + splitting, не новые features).

---

### Slice 19 — Accessibility audit (WCAG 2.1 AA)

**Scope:** axe-core автотест в Vitest, keyboard-nav audit, ARIA labels review, focus indicators, `prefers-reduced-motion` honoring для всех анимаций.

**LOC:** ~300.

---

## Dependency graph

```
Slice 4a (manual accounts)  ──┐
                              ├──► Slice 5a (tx CRUD) ──► usable MVP
                              │
                              └──► Slice 6a (insights read) ──► AI value
TD-046 ──► Slice 4b / 4c (real brokers)
TD-057 ──► Slice 5 edge cases / Slice 7c Stripe / Slice 9 Billing
TD-056 ──► Slice 8b (2FA)
TD-070 ──► Slice 6 (AI Service must be deployed for real insights)
TD-049 ──► Slice 14 (mid-stream reconnect)
Slice 7a (landing) — independent, can ship any time
Slice 10 (scope-cut banners) — independent
Slice 13 (sidebar) — bundled into next layout-touching slice
```

**Critical path to alpha launch:** Slice 4a → Slice 5a → Slice 6a → Slice 7a + 7b → Slice 12. Всё остальное — follow-ups.

---

## Open questions (PO решает до kickoff каждого slice)

1. **Manual transactions vs broker-only:** пускать alpha-тестеров только с manual accounts (Slice 4a + 5a, без TD-046) или ждать SnapTrade OAuth (Slice 4b)? **Рекомендация:** ship 4a+5a first, TD-046 параллельно. Alpha можно запускать на manual-only.
2. **Stripe в alpha:** принимаем деньги сразу или всё бесплатно до public launch? **Рекомендация:** alpha = free-for-all, Stripe в Slice 7c после обратной связи от alpha по ценам.
3. **AI Service deploy приоритет:** TD-070 это P1 backend blocker для Slice 6. Отдельный kickoff для CC или делаем частью Slice 6 prep? **Рекомендация:** отдельный BE slice (не UI) — PO открывает kickoff для AI Service staging deploy до старта Slice 6.
4. **Landing copy:** кто пишет текст лендинга? Placeholder можно у Claude запросить, но финальный — по brand voice. В kickoff Slice 7a включаем `brand-voice:brand-voice-enforcement` skill.
5. **Design polish:** `(app)` routes используют shadcn defaults. Нужен ли дизайнер-pass до launch или оставляем минимализм? **Рекомендация:** оставляем минимализм до feedback от alpha; design-pass — отдельная post-alpha волна.

---

## Не в этом backlog

- **iOS / native mobile** — TASK_08, следующая волна после web-launch.
- **Admin panel** — out of MVP scope (управление через Supabase / Doppler напрямую).
- **Multi-tenant features** — MVP single-user per workspace.
- **Real-time collaborative editing** — not a feature of this product.
- **Internationalization (i18n):** только en-US для MVP. i18n как post-launch volna если будет запрос.

---

**Next action for PO:** выбрать первый slice для kickoff — рекомендация Slice 4a (manual Accounts CRUD) как разблокирующий всю цепочку P1.
