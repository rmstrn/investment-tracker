# 03 — Roadmap: 4 месяца до MVP

## Статус

**Wave 1: ✅ completed** (2026-04-19)

Параллельные таски TASK_01 (monorepo), TASK_02 (design system), TASK_03 (API contract + DB schema) смержены в main. Детали и merge commits — в `merge-log.md`. Design brief v1.1 — `04_DESIGN_BRIEF.md`. Накопленные tech-debt items — `TECH_DEBT.md`.

**Wave 2: ✅ code-complete + staging deploy live** (2026-04-21)

TASK_04 Core API (10 PRs + CORS micro-slice + staging deploy `api-staging.investment-tracker.app`). TASK_05 AI Service (PR #34 + PR #43 cleanup; staging deploy pending — TD-070).

**Wave 3: 🟢 in flight** — TASK_07 Web Frontend Slice 1+2+3+7a+7b+4a+5a merged (auth + dashboard + positions + AI chat + landing/pricing + manual accounts CRUD + transactions CRUD для buy/sell/dividend); web на `staging.investment-tracker.app`. **Manual MVP end-to-end flow замкнут.** Slice 5b (split/transfer/fee) / 4b/4c / 6 scope — см. `UI_BACKLOG.md` (canonical source). Critical path до alpha: Slice 6a (Insights, ждёт TD-070) + Slice 12 (Empty/Error states). TASK_06 broker integrations разблокированы — manual-only flow готов end-to-end, OAuth-providers ждут TD-046.

**Wave 4: 🧊 deferred** — TASK_08 iOS (out of MVP scope, отдельный репо).

---

## Месяц 1 — Фундамент

### Инфраструктура
- [x] Турборепо с apps/web, apps/api, apps/ai, apps/ios, packages/shared — TASK_01
- [x] GitHub репозиторий + Actions CI/CD — TASK_01
- [x] Docker Compose для локальной разработки — TASK_01
- [x] Secrets management (Doppler) — закрыто PR C (`fa9c9dc`, 2026-04-20). Project `investment-tracker-api` с configs dev/stg/prd, secrets bootstrap через `ops/secrets.keys.yaml`, `doppler-sync.yml` workflow. ALLOWED_ORIGINS добавлен 2026-04-21 в stg.
- [ ] Sentry + PostHog интеграция — UI_BACKLOG Slice 17 (P3 polish)

### Backend Core
- [ ] Go проект с Fiber
- [ ] Схема БД v1 (migrations через goose)
- [ ] Clerk JWT валидация middleware
- [ ] CRUD для users, accounts, transactions
- [ ] Базовые endpoints портфеля (GET /portfolio, GET /positions)
- [ ] Unit-тесты для критичных путей

### Web
- [x] Next.js 15 проект, Tailwind v4, shadcn/ui — TASK_01 + TASK_02
- [x] Интеграция Clerk (регистрация, логин, email verification) — TASK_07 Slice 1 (PR #45 `a622bd3`)
- [x] Эмпти дашборд — TASK_07 Slice 1 (`PortfolioValueCardLive`)
- [x] UI для ручного добавления сделок — TASK_07 Slice 5a (PR #60 `5e556a9`, 2026-04-21) — add/edit/delete для buy/sell/dividend на Position Detail; split/transfer/fee в Slice 5b
- [x] Список позиций (мок-данные) — TASK_07 Slice 2 (PR #48 `366d12f`, с реальными данными вместо mock)

### Design System — ✅ wave 1 completed (TASK_02, PRs #29/#31/#32)
- [x] Дизайн-токены (цвета, типографика, spacing) в `packages/design-tokens`
- [x] Style Dictionary экспорт в Tailwind tokens + `{types, default}` subpath exports
- [x] Ключевые компоненты: Button, Input, Card, Dialog, Tabs, Badge, Tooltip, Dropdown, Sheet, SegmentedControl, Popover + AI-specific (ChatInputPill, ToolUseCard, TrustRow, SuggestedPrompt, ExplainerTooltip, InsightCard, BellDropdown, PaywallModal, UsageMeter)
- [x] Light + Dark WCAG-audited токены (PR #31 contrast fix)
- [x] Design brief v1.1 — `04_DESIGN_BRIEF.md`
- [ ] Макеты главных экранов (Figma) — параллельно с TASK_07

## Месяц 2 — Данные и интеграции

### Market Data
- [ ] Polygon.io wrapper (акции/ETF)
- [ ] CoinGecko wrapper (крипта)
- [ ] ECB wrapper (FX-курсы)
- [ ] Redis-кэш с TTL 60s
- [ ] Воркер обновления цен раз в 5 минут

### Broker Integrations (приоритет)
- [ ] SnapTrade SDK интеграция
- [ ] OAuth-флоу подключения счёта
- [ ] Хранение зашифрованных токенов
- [ ] Импорт исторических сделок при первом подключении
- [ ] Бинанс read-only API (крипта)
- [ ] Coinbase read-only API (крипта)

### Workers
- [ ] asynq setup
- [ ] Задача "sync_account" — повтор с экспоненциальным бэкоффом
- [ ] Задача "update_prices" — батчево
- [ ] Задача "compute_snapshot" — ежедневно в 23:59 UTC
- [ ] Дедупликация по fingerprint
- [ ] Priority-merge при конфликте источников

### Web (реальные данные)
- [ ] Подключение счёта UI
- [ ] Реальный дашборд: стоимость, P&L за день/неделю/месяц/год/всё время
- [ ] Pie chart аллокации (актив, сектор, валюта)
- [ ] Line chart портфеля во времени
- [ ] Сравнение с S&P 500
- [ ] Детальная карточка позиции

## Месяц 3 — ИИ и iOS

### AI Service (параллельный трек)
- [ ] FastAPI проект, Anthropic SDK
- [ ] Tools для доступа к портфелю пользователя (REST к Core API)
- [ ] AI Chat endpoint с SSE-стримингом
- [ ] Session management для разговоров
- [ ] Rate limiting по тарифам
- [ ] Prompts для 5 типов инсайтов:
  - Concentration risk (переконцентрация в одном активе/секторе)
  - Behavioral pattern (покупки на локальных максимумах)
  - Dividend upcoming (ближайшие дивиденды)
  - Performance anomaly (необычное движение позиции)
  - Rebalance suggestion (отклонение от целевой аллокации)
- [ ] Воркер daily_insights (запускается раз в день)

### iOS App (параллельный трек)
- [ ] Xcode проект, SwiftUI
- [ ] Clerk iOS SDK, auth flow
- [ ] Главный экран Portfolio
- [ ] Список позиций
- [ ] Детали позиции
- [ ] Подключение счёта (через Safari View Controller для OAuth)
- [ ] Свiч Charts для графиков
- [ ] AI Chat экран (SSE-стриминг ответов)
- [ ] Dark mode

### Web
- [ ] AI Chat UI (стриминг, markdown-рендер)
- [ ] Лента инсайтов на дашборде
- [ ] Настройки пользователя (display currency, locale)

## Месяц 4 — Монетизация и запуск

### Stripe + Тарифы
- [ ] Stripe Products + Prices (Plus, Pro)
- [ ] Checkout flow
- [ ] Billing portal
- [ ] Webhooks (подписка создана / отменена / failed payment)
- [ ] Feature gates по тарифам (middleware в API)
- [x] Paywall UI (PaywallModal primitive + `/pricing` + `(marketing)/` landing — PR #58 `528333b`, 2026-04-21; real feature-gate wiring tracked in TD-080 with Stripe slice 7c)

### Onboarding
- [ ] Welcome-flow с 5-7 вопросами (цели, опыт)
- [ ] Помощник подключения первого счёта
- [ ] Tour dashboard'а
- [ ] Первый AI-инсайт сразу после подключения

### Полировка
- [ ] Empty states для всех экранов
- [ ] Error states с понятными CTA
- [ ] Loading states (skeletons)
- [ ] 404, 500 страницы
- [ ] Performance: Lighthouse >90 на всех страницах
- [ ] Accessibility: WCAG 2.1 AA
- [ ] SEO: meta-теги, sitemap, robots.txt

### Pre-launch
- [ ] Pentest (заказать у подрядчика)
- [ ] Legal: Terms of Service, Privacy Policy, Cookies
- [ ] GDPR compliance: согласия, экспорт/удаление
- [ ] Status page (BetterStack или StatusPage.io)
- [ ] Backup + disaster recovery runbook
- [ ] Incident response plan

### Launch
- [ ] TestFlight iOS beta (50-100 юзеров из wait-list)
- [ ] Публичный веб-бета (Product Hunt upcoming, wait-list)
- [ ] Sentry + PostHog dashboards
- [ ] On-call rotation

## Месяц 5–6 — Расширение

### iOS App Store
- [ ] App Store submission
- [ ] Screenshots, описание
- [ ] Ответы на review comments

### Android
- [ ] Kotlin + Jetpack Compose проект
- [ ] Переиспользование бекенда (API контракт один)
- [ ] Первый релиз в Google Play

### Pro-функции
- [ ] Налоговые отчёты (начинаем с US: форма 8949)
- [ ] Налоги для Германии (Anlage KAP)
- [ ] Продвинутая аналитика: Sharpe, Sortino, max drawdown, factor exposure
- [ ] Кастомные алерты
- [ ] API доступ (для power-users)

### Доп. интеграции
- [ ] 5-10 дополнительных брокеров на основе user requests
- [ ] Plaid как второй агрегатор
- [ ] Kraken, Bybit (крипта)

### Маркетинг
- [ ] Блог (контент-маркетинг)
- [ ] Referral program
- [ ] Интеграция с r/investing, r/personalfinance, fintwit

## Критерии готовности к публичному запуску

Не запускаемся, пока не выполнено всё это:

1. **Надёжность:** 99.9% uptime за 2 недели на бета
2. **Производительность:** P99 API <200ms, FCP web <1.2s, cold start iOS <400ms
3. **Безопасность:** pentest пройден, критичные и высокие уязвимости закрыты
4. **UX:** 20+ beta-пользователей прошли полный онбординг без help-тикета
5. **Данные:** нет расхождений портфеля с брокером (кроме известных edge-cases)
6. **Legal:** ToS, Privacy Policy, GDPR-ready
7. **Поддержка:** email support < 24h ответ, help центр с 10+ статьями
8. **Аналитика:** воронка от регистрации до платежа трекается корректно

## Что ПОСЛЕ MVP (v2 идеи, не трогаем пока)

- Недвижимость, депозиты, пенсионные счета
- P2P и альтернативные инвестиции
- Net worth tracker (весь капитал, включая долги)
- Семейные счета (shared portfolios)
- Социальные фичи (follow других инвесторов — но осторожно с регуляцией)
- Import AI (автопарсинг любых PDF)
- Голосовой ввод в мобильном
- Widgets на iOS/Android home screen
- Apple Watch / Wear OS companion
- API для интеграции в сторонние приложения
- Self-hosted версия для корпоративных клиентов
