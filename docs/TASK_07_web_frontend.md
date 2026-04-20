# TASK 07 — Web Frontend (Next.js)

**Волна:** 3 (стартует после закрытия TASK_04 через PR C — deploy/Dockerfile/fly.toml)
**Зависит от:** TASK_01 (monorepo + packages scaffold), TASK_02 (design system — `@investment-tracker/ui` + design-tokens), TASK_03 (API contract — `@investment-tracker/shared-types` + `@investment-tracker/api-client` из openapi.yaml), TASK_04 (Core API полностью закрыт: A / B1 / B2a / B2b / B2c / B3-i / B3-ii / B3-iii / C)
**Блокирует:** ничего (конечный продукт)
**Срок:** 5-7 недель

## Статус

| Slice | Scope | Status |
|---|---|---|
| **Slice 1** | Clerk auth (middleware + ClerkProvider + (auth) routes) + `(app)/dashboard` vertical slice с `PortfolioValueCardLive` поверх `GET /portfolio` + TanStack Query `usePortfolio` hook + 1 Vitest smoke | ✅ merged — PR #45, squash `a622bd3`, 2026-04-20, ~551 LOC |
| **Slice 2** | Positions list + Position Detail (read-only): `(app)/positions` + `(app)/positions/[id]` + toolbar (sort/group/filter) + price chart (Recharts via `@investment-tracker/ui/charts` subpath, zero apps/web dep) + infinite transactions tab + 4 hooks + 3 Vitest smoke + sidebar activation | ✅ merged — PR #48, squash `366d12f`, 2026-04-20, 1443 LOC |
| **Slice 3** | AI Chat UI: `(app)/chat` + `(app)/chat/[id]` routes, SSE client over fetch+ReadableStream, chat reducer (content-block state machine), 6 TanStack Query hooks (conversations CRUD + useChatStream + useRateLimit), rich content rendering (text/tool_use/tool_result/impact_card/callout), tier-limit toast MVP, UsageIndicator via canonical `X-RateLimit-*` (new `onRateLimitHeaders` middleware в `@investment-tracker/api-client`), sidebar activation, 4 Vitest smoke (tests 15→38) | ✅ merged — PR #50, squash `4881dfd`, 2026-04-20, 2316 LOC. Opened TD-068 (schema drift P3). |
| Slice 4+ | Insights feed (`/ai/insights/*`), FloatingAiFab activation (context-aware mini-chat), Accounts CRUD, Settings, Paywall + `/pricing` marketing + Stripe Checkout, PWA, Vercel deploy, scope-cut header UI (`X-Partial-Portfolio` / `X-FX-Unavailable`), sidebar disabled-state для placeholder nav-слотов, mid-stream reconnect (TD-049), `ChatContext` deep-links из Positions | ⏳ pending |

Детали merge — `merge-log.md` (PR #45, PR #48, PR #50 entries).

## Цель

Веб-приложение — основной интерфейс на старте. Должно ощущаться как
премиальный продукт: быстро, красиво, responsive, dark mode из коробки.
Работает как PWA на мобильных до запуска нативного iOS.

## Стек

- **Next.js 15** (App Router, Server Components, Server Actions)
- **React 19**
- **TypeScript 5.7** strict mode
- **Tailwind CSS v4**
- **shadcn/ui** (копируем компоненты в свой проект)
- **TanStack Query v5** — data fetching
- **Zustand** — global UI state (минимально)
- **React Hook Form + Zod** — формы
- **Motion** — анимации
- **Recharts** — основные графики
- **Visx / D3** — кастомные графики
- **Biome** — линт/формат
- **Clerk** — auth (web SDK)
- **Vercel** — хостинг

## Структура

```
apps/web/
├── app/                                # Next.js App Router
│   ├── (marketing)/                    # лендинг
│   │   ├── page.tsx
│   │   ├── pricing/
│   │   └── layout.tsx
│   ├── (auth)/                         # auth flow
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── layout.tsx
│   ├── (app)/                          # приложение (protected)
│   │   ├── dashboard/
│   │   ├── positions/
│   │   │   └── [id]/
│   │   ├── accounts/
│   │   ├── chat/
│   │   ├── insights/
│   │   ├── settings/
│   │   │   ├── profile/
│   │   │   ├── billing/
│   │   │   └── notifications/
│   │   └── layout.tsx                  # sidebar + top nav
│   ├── api/                            # API routes (минимально — auth webhooks)
│   ├── layout.tsx                      # root layout
│   ├── globals.css
│   └── icon.tsx / opengraph-image.tsx
├── components/
│   ├── ui/                             # shadcn компоненты
│   ├── charts/                         # портфельные графики
│   ├── portfolio/                      # композиции
│   ├── chat/                           # AI chat UI
│   └── ...
├── lib/
│   ├── api/                            # TanStack Query hooks
│   ├── utils.ts
│   ├── format.ts                       # числа, валюты, даты
│   └── types.ts                        # re-export from packages/shared-types
├── hooks/
├── public/
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Ключевые фичи

### 1. Authentication

Через Clerk. Используем их компоненты + кастомизируем стили.

```tsx
// app/(auth)/sign-in/page.tsx
import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return <SignIn appearance={clerkAppearance} />
}
```

**Middleware** для protected routes:
```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/", "/pricing", "/sign-in", "/sign-up"])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})
```

### 2. API Client

Используем сгенерированный клиент из OpenAPI:

```ts
// lib/api/client.ts
import createClient from "openapi-fetch"
import type { paths } from "@investment-tracker/shared-types"

export const api = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
})

// Интерцептор для добавления Clerk JWT
api.use({
  async onRequest({ request }) {
    const token = await getClerkToken()
    request.headers.set("Authorization", `Bearer ${token}`)
    return request
  }
})
```

### 3. TanStack Query для data fetching

```ts
// lib/api/portfolio.ts
import { useQuery } from "@tanstack/react-query"

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: () => api.GET("/portfolio"),
    staleTime: 60 * 1000,           // 1 минута
    refetchOnWindowFocus: true,     // обновлять при возврате в окно
  })
}

export function usePositions(filters?: PositionsFilters) {
  return useQuery({
    queryKey: ["positions", filters],
    queryFn: () => api.GET("/positions", { params: { query: filters } }),
  })
}
```

### 4. Dashboard — главный экран

Секции сверху вниз:

1. **Карточка "Insight of the day"** (если есть) — от AI, dismissable
2. **Portfolio value card** — крупное число, P&L за день, mini-sparkline
3. **Performance chart** — стоимость во времени (1W/1M/3M/6M/1Y/All), опция сравнить с S&P 500
4. **Allocation donut** — по asset type или sector (переключатель)
5. **Top movers** — 3 крупнейших gain и loss за день
6. **Upcoming dividends** (если есть)
7. **Recent activity** — последние 5 сделок

### 5. Positions Page

Таблица позиций (или cards на мобильном):

| Symbol | Name | Quantity | Avg Cost | Current | Value | P&L | P&L % |

- Сортировка по колонкам
- Группировка (по типу актива, по счёту, по валюте)
- Фильтр
- Клик → детали позиции

### 6. Position Detail

- Текущая позиция: стоимость, P&L, средняя цена
- График цены актива (1D/1W/1M/1Y)
- Ваша история по этой позиции (все buy/sell/dividend)
- Дивиденды (если ETF/акция)
- Связанные инсайты от AI

### 7. AI Chat

Отдельная страница `/chat`. Слева список бесед, справа текущая.

**UX:**
- Стриминг ответа (typing-эффект)
- Markdown-рендер (таблицы, списки)
- Показываем tool calls ("Looking at your portfolio...") для прозрачности
- Suggested prompts для новых юзеров
- Kbd-shortcut (⌘K или /) для быстрого открытия из любого экрана

**Technical:**
- Используем EventSource (SSE) для стрима
- Store conversation in state, persist в бекенд после каждого message
- Показываем rate limit из response headers `X-RateLimit-*` — лимиты исходят из `tiers.Limit.AIMessagesPerDay` (shared Go module `internal/domain/tiers/limits.go`). Не хардкодим число в UI

### 8. Insights Page

Лента проактивных инсайтов:

- Карточка = один инсайт (title, body, severity icon)
- Для некоторых — actionable (кнопка "Посмотреть позицию", "Настроить DCA")
- Dismiss / mark as read
- Фильтр по типу и severity

### 9. Accounts Page

Список подключённых счетов:

- Имя, брокер, тип (acctype), статус синка, last_synced
- Кнопки: Sync now, Rename, Disconnect
- Большая кнопка "Add Account" → модалка с вариантами:
  - Через SnapTrade (OAuth flow)
  - Binance/Coinbase (API keys flow)
  - Manual (просто создаём account для ручного ведения)

### 10. Settings

- **Profile:** display name, email (disabled), avatar
- **Preferences:** display currency, locale, timezone, dark mode override
- **Billing:** current tier, link to Stripe Customer Portal, upgrade CTA
- **Notifications:** email preferences
- **Security:** sessions, 2FA (через Clerk)
- **Data:** export data (GDPR), delete account

### 11. Pricing & Paywall

**Lending /pricing page:**
- 3 тарифа visually compared
- FAQ
- Clear CTA "Start free"

**Paywall modal** (когда Free юзер жмёт Pro-фичу):
- Short explanation "Эта фича доступна в Plus"
- Что даёт Plus
- "Upgrade to Plus" CTA → Stripe Checkout
- "Maybe later" close

### 12. Empty states

Ключевой UX-момент. Новый юзер видит "пусто":

- **Пустой dashboard** — "Let's add your first account" CTA
- **Пустые positions** — "Connect a broker or add a trade manually"
- **Пустой chat** — suggested prompts
- **Пустые insights** — "AI needs some data to generate insights, sync your account first"

### 13. Error states

- **Network error** — retry button
- **Sync failed** — что делать
- **No data available** — что это значит
- **500 page** — "Something broke, we're on it. request_id: xxx"

## Performance

- **FCP < 1.2s** на 3G
- **LCP < 2s**
- **CLS < 0.1**
- **Bundle size < 200KB gzipped** для первого экрана

**Как достичь:**
- Server Components для первого рендера (dashboard данные приходят на сервере)
- Streaming HTML (React Suspense)
- Preload критичных fonts
- Code splitting по роутам (автоматический в App Router)
- Image optimization через Next.js
- Lazy load графиков (Recharts увесистый)

## Accessibility

- WCAG 2.1 AA
- Semantic HTML (article, nav, main, aside)
- ARIA labels где нужно
- Keyboard navigation everywhere
- Focus indicators видимые
- Color contrast AA для всех текстов
- `prefers-reduced-motion` уважаем

## Мобильный web (до iOS релиза)

- Responsive dashboard (сайдбар → bottom tab bar на мобильном)
- Touch-friendly targets (44×44 min)
- PWA manifest.json + service worker
- Install prompt после 2-3 визита
- Offline fallback для уже загруженного контента

## SEO

- Мета-теги на лендинге
- OG-image, Twitter cards
- Sitemap.xml, robots.txt
- Structured data (Organization, Product for pricing)

## Observability

- Sentry для ошибок фронта
- PostHog для продуктовой аналитики:
  - Page views
  - Feature usage (chat messages, insight dismissed, filter applied)
  - Funnel (signup → first account → first ai chat)
  - Session replay на opt-in

## Анимации

- Tab-switching — 200ms slide
- Modal open/close — scale + fade
- Chart rendering — animated draw (Recharts встроено)
- Number changes — count-up анимация
- Skeleton loading
- **Нет:** spinners в бесконечность, bouncy анимации, parallax

## Definition of Done

- [ ] Все экраны из design system реализованы
- [ ] Dark mode работает (system preference + manual override)
- [ ] Все data-fetching через TanStack Query, proper loading/error states
- [ ] Все формы через React Hook Form + Zod
- [ ] AI Chat стримится, показывает tool calls
- [ ] Stripe Checkout и Customer Portal работают end-to-end
- [ ] Clerk auth полностью интегрирован
- [ ] PWA manifest работает, install prompt появляется
- [ ] Lighthouse: Performance >90, Accessibility >95, SEO >95, Best Practices >95
- [ ] Sentry + PostHog интегрированы, события летят
- [ ] E2E тесты через Playwright для критичных путей (signup, connect account, portfolio view)
- [ ] Деплой на Vercel, preview на каждый PR
- [ ] Storybook для ключевых компонентов (опционально, но полезно)

## Важные решения

- **App Router, не Pages Router** — новый стандарт Next.js
- **Server Components где можно** — первый рендер быстрее
- **Zustand минимально** — TanStack Query держит server state, Zustand только для UI state
- **shadcn/ui, не собственная библиотека** — проще и быстрее
- **Biome, не ESLint+Prettier** — скорость

## Что НЕ делаем

- Не пишем свой state management (Redux, MobX — не нужны)
- Не используем Material UI / Ant Design / Chakra (shadcn — выбор)
- Не делаем SSR для всего (часть чисто client-side)
- Не пишем свою библиотеку графиков (Recharts хватит на MVP)

## Следующие шаги

Когда готово:
- Публичный beta-релиз веба
- iOS (TASK_08) может учиться у паттернов, согласованных в вебе
