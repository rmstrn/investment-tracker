# 03 — Roadmap: 4 месяца до MVP

## Статус

**Wave 1: ✅ completed** (2026-04-19)

Параллельные таски TASK_01 (monorepo), TASK_02 (design system), TASK_03 (API contract + DB schema) смержены в main. Детали и merge commits — в `merge-log.md`. Design brief v1.1 — `04_DESIGN_BRIEF.md`. Накопленные tech-debt items — `TECH_DEBT.md`.

**Wave 2: 5 of ~8 PRs merged** (2026-04-19) — TASK_05 + TASK_04 A/B1/B2a/B2b/B2c all in. TASK_04 read-path closed end-to-end. Remaining: PR B3 (split into B3-i/ii/iii, sequential) + PR C (ops).

- **TASK_05 (Python AI service)** — ✅ merged as PR #34 (`1d46ed9`). 40 tests green, ruff + mypy --strict clean. Follow-ups в `TECH_DEBT.md` (TD-013..TD-017).
- **TASK_04 (Go Core API)** — 🚧 split PR A → B1/B2/B3 → C.
  - **PR A ✅ merged as PR #35 → `14f95468`** (12 commits squashed, 8/8 CI green, no admin bypass): foundation layer — config, sqlc, oapi-codegen+TD-007 preprocessor, Clerk auth+errors, Redis middleware (cache/rate-limit/idempotency), AES-GCM envelope, fingerprint+portfolio calculator. TD-012 speculative "Go 1.25 CI bump" never materialized (CI already on Go 1.26 from wave 1).
  - **PR B1 ✅ merged as PR #36 → `462d2993`** (11 commits squashed, 8/8 CI green, no admin bypass): ai_usage migration, sqlc queries, dual-mode auth middleware, UUIDv7 request-id + level-by-status log, Sentry + Deps cycle-break, `/internal/ai/usage` handler, unit + testcontainers integration tests. **TD-013 closed.** AI Service 404-swallow flip queued as non-blocking follow-up in `apps/ai`.
  - **PR B2a ✅ merged as PR #37 → `272e5fe6`** (16 commits squashed, 8/8 CI green, no admin bypass): foundation (cursor pagination helper, FX resolver Redis→PG→inverse, rate-limit + idempotency GET passthrough, shared testcontainers harness) + 6 AI-facing GETs (`/portfolio`, `/positions`, `/transactions`, `/portfolio/performance`, `/market/quote`, `/portfolio/dividends`) + cross-handler AI-auth integration test + 3 pre-merge fixes (benchmark nullable openapi spec fix, `?display_currency=` rename per spec, `errs.ErrQuoteNotAvailable` sentinel promotion). **TD-025 closed.** New debt: TD-020 (benchmark ingest), TD-021 (asynq publisher wire-in), TD-022 (dividends table), TD-024 (previous_close modeling).
  - **PR B2b ✅ merged as PR #38 → `fdcf39f4`** (18 commits squashed, 8/8 CI green, no admin bypass): 20 handlers across 8 domain groups (`/me*` ×6, `/accounts*` ×3, detail GETs ×3, portfolio history/allocation/performance-compare ×3, market search/history ×2, plumbing `/fx_rates`+`/prices`, AI conversations/insights ×3, glossary ×2) + extended cross-handler AI-auth integration test (17/18 authenticated endpoints) + new `internal/domain/tiers/limits.go` shared per-tier caps module (reads + B3 mutation gates) + benchmark nullable openapi fix. 14 stubs/degraded responses signal via response headers or explicit 501 NOT_IMPLEMENTED — no placeholder data. Read path complete end-to-end for AI Service. New debt: TD-027 (Clerk Backend SDK — closes in B3), TD-028 (monthly rollup), TD-029 (symbol-master provider), TD-030 (OHLC ingest pipeline).
  - **PR B2c ✅ merged as PR #39 → `fb16525`** (7 commits + pre-merge compliance fix `ce23519` for `X-Tax-Advisory: mvp-estimate` header, 8/8 CI green, no admin bypass). Spec-compliant: period enum `3m/6m/1y/3y/all`, tax params `jurisdiction + year` (cost-basis method became internal — FIFO hardcoded). Pro-only via `tiers.Limit.AdvancedAnalytics` + `.TaxReports`. US + DE jurisdictions; others → 400 `JURISDICTION_NOT_SUPPORTED`. Scope-cuts signal via `X-Analytics-Partial` + `X-Withholding-Unavailable` headers + openapi nullable (same pattern as B2a/B2b). ~1600 LOC (~7% overshoot). **TASK_04 read-path closed end-to-end: 30 GET endpoints (28 authenticated + 2 public glossary).** New debt: TD-031..TD-038.
  - **PR B3 — split into B3-i/B3-ii/B3-iii by coherent surface** (per DECISIONS 2026-04-19). Pre-flight audit found 36 mutation endpoints (not 50-60) + 5 deferred GETs + 3 infra blocks. Sequential merge ordering — no parallel feature branches.
    - **PR B3-i (Data-path + asynq, ~2200 LOC, 19 handlers)** — accounts/transactions/me data mutations + notifications reads + exports async stub + asynq publisher wire-in + SETNX idempotency lock. Closes **TD-011** + **TD-021**.
    - **PR B3-ii (AI bundle, ~1400 LOC, 7 handlers)** — AI conversations + chat (POST + SSE stream) + insights mutations, AI Service reverse-proxy.
    - **PR B3-iii (Auth + billing, ~2400 LOC, 11 handlers + 2 webhooks)** — 2FA + sessions DELETE + Clerk SDK + Clerk webhook + billing mutations + billing reads + Stripe SDK + Stripe webhook + `webhook_events` migration. Closes **TD-027**.
  - **PR C** — Dockerfile + fly.toml + k6 load-test + deploy runbook.
- **TASK_06/07/08** — unblock after TASK_04 PR B merges (Core API surface complete).

---

## Месяц 1 — Фундамент

### Инфраструктура
- [x] Турборепо с apps/web, apps/api, apps/ai, apps/ios, packages/shared — TASK_01
- [x] GitHub репозиторий + Actions CI/CD — TASK_01
- [x] Docker Compose для локальной разработки — TASK_01
- [ ] Secrets management (Doppler) — отложено до wave 2/3
- [ ] Sentry + PostHog интеграция — TASK_07

### Backend Core
- [ ] Go проект с Fiber
- [ ] Схема БД v1 (migrations через goose)
- [ ] Clerk JWT валидация middleware
- [ ] CRUD для users, accounts, transactions
- [ ] Базовые endpoints портфеля (GET /portfolio, GET /positions)
- [ ] Unit-тесты для критичных путей

### Web
- [x] Next.js 15 проект, Tailwind v4, shadcn/ui — TASK_01 + TASK_02
- [ ] Интеграция Clerk (регистрация, логин, email verification) — TASK_07
- [ ] Эмпти дашборд — TASK_07
- [ ] UI для ручного добавления сделок — TASK_07
- [ ] Список позиций (мок-данные) — TASK_07

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
- [ ] Paywall UI

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
