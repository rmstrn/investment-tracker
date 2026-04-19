# Claude Code Prompts for investment-tracker

Готовые промты для запуска каждой TASK_XX в Claude Code. Копируешь блок целиком, вставляешь в новую CC-сессию, жмёшь enter.

---

## Как использовать

**Setup (один раз):**
```bash
cd D:\СТАРТАП
# установи CC если ещё не стоит
npm install -g @anthropic-ai/claude-code
# залогинься
claude login
```

**Для каждой TASK_XX:**
```bash
cd D:\СТАРТАП
git checkout -b task-XX-<short-name>   # или git worktree если нужна параллель
claude
```
Затем вставь промт из соответствующей секции ниже.

**Коммуникация с PO (этот Cowork-чат):**
- Если CC задаёт блокирующий вопрос — копируешь его сюда с префиксом `[TASK_XX]`
- Я отвечаю — ты копируешь ответ обратно в CC
- Не блокирующее CC должен решать сам по best practices

**Dependencies:**
- Волна 1 (можно параллельно): TASK_01, TASK_02, TASK_03
- Волна 2 (после TASK_03): TASK_04, TASK_05
- Волна 3 (после TASK_04): TASK_06, TASK_07
- Отложено: TASK_08 (iOS, нужен Mac + Xcode)

---

## TASK_01: Monorepo Setup

```
Ты работаешь над стартапом investment-tracker — AI-native трекер инвестиционного портфеля.
Я стартап-основатель, общаюсь с Product Owner в параллельном чате.

КОНТЕКСТ:
- Монорепо root: текущая директория (D:\СТАРТАП). НЕ создавай подпапку investment-tracker/.
- Git remote: https://github.com/rmstrn/investment-tracker.git (уже создан, пустой)
- В папке уже есть: docs/ (project docs), packages/design-tokens/ (TASK_02 начал — не трогай его).
- Детали задачи: docs/TASK_01_monorepo_setup.md (прочитай первым делом)
- Общий контекст: docs/00_PROJECT_BRIEF.md, docs/01_TECH_STACK.md, docs/02_ARCHITECTURE.md

ЗАБЛОКИРОВАННЫЕ РЕШЕНИЯ PO:
- Root монорепы = D:\СТАРТАП (не подпапка)
- Package scope: @investment-tracker/*
- CI/CD Hybrid: lint/typecheck/test/build/security работают по-настоящему, deploy jobs написаны но с TODO секретами и workflow_dispatch only
- iOS отложено в отдельный репо github.com/rmstrn/investment-tracker-ios — в этой монорепе никакого apps/ios/
- Go layout: single module apps/api с go.mod (module github.com/rmstrn/investment-tracker/apps/api), два бинаря cmd/api и cmd/workers, shared internal/
- Первый коммит: "chore: initial monorepo scaffold"
- README в корне + секция "Secrets to configure before first deploy" (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, FLY_API_TOKEN, DOPPLER_TOKEN, SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT)
- LICENSE: MIT
- Branch protection на main — TODO в README если не можешь настроить автоматически

ЗАДАЧА:
1. Сначала прочитай docs/TASK_01_monorepo_setup.md, 00_PROJECT_BRIEF, 01_TECH_STACK целиком
2. Проверь текущее состояние D:\СТАРТАП (git init, remote, что уже лежит)
3. Выполни DoD из TASK_01 — не ломая существующее (docs/, packages/design-tokens/)
4. packages/design-tokens УЖЕ существует — только убедись что pnpm workspace его подхватит
5. Создай scaffolds apps/{api,ai,web}, packages/{shared-types,api-client,ui,config}, tools/
6. docker-compose.yml (postgres 17 + pgvector, redis 7)
7. .github/workflows — все jobs как описано выше
8. Проверь что всё собирается: pnpm install, pnpm lint, pnpm build, go build ./..., uv sync
9. Первый коммит + push на remote

ПРАВИЛА РАБОТЫ:
- Читай docs/00_PROJECT_BRIEF.md, 01_TECH_STACK.md, 02_ARCHITECTURE.md первым делом
- Если решение есть в docs — следуй. Если нет — best practices своего стека
- Не ломай чужое (другие TASK_XX могли оставить файлы — не перезаписывай без нужды)
- Коммиты часто, Conventional Commits: feat/fix/chore/docs/refactor/test
- Перед "готово" — прогони lint, typecheck, build, tests локально
- Блокирующие вопросы формулируй кратко с вариантами (a/b/c) и рекомендацией. Не задавай то, что можешь решить сам
- В конце — PR в main через gh pr create с описанием DoD

Стартуй.
```

---

## TASK_02: Design System (code-first)

```
Ты работаешь над дизайн-системой стартапа investment-tracker.
Я стартап-основатель, общаюсь с Product Owner в параллельном чате.

КОНТЕКСТ:
- Монорепо root: D:\СТАРТАП (текущая директория)
- Детали задачи: docs/TASK_02_design_system.md
- Общий контекст: docs/00_PROJECT_BRIEF.md, docs/01_TECH_STACK.md
- Важно: ты УЖЕ мог что-то начать — в packages/design-tokens/ может быть состояние. Изучи что там, продолжай оттуда, НЕ перезаписывай.

ЗАБЛОКИРОВАННЫЕ РЕШЕНИЯ PO (переопределяют TASK_02.md если расходятся):
- Роль: code-first design system (react/typescript компоненты — источник правды). Figma — опционально, НЕ блокирует разработку. Нет human-дизайнера в команде.
- Product name: "Portfolio" (placeholder на весь MVP). Хранится в design tokens как brand.productName = "Portfolio". Нигде не хардкодь строкой в компонентах.
- Accent color: #6D28D9 (violet-700, deep violet)
- Typography: Geist Sans + Geist Mono
- Package scope: @investment-tracker/design-tokens, @investment-tracker/ui
- DoD order: tokens → primitives → components → screens → Figma mirror (в конце, опционально)
- Logo = SVG-компонент <Logo /> с вариантами full/mark/wordmark (НЕ растр)
- Tailwind v4, shadcn/ui, Style Dictionary для генерации Tailwind + Swift tokens

ЗАДАЧА:
1. Прочитай docs/TASK_02_design_system.md и общий контекст
2. Изучи что уже в packages/design-tokens/ — продолжай, не перезаписывай
3. Если TASK_01 ещё не раскатал apps/web — создай минимальный Next.js 15 App Router scaffold в apps/web только для превью компонентов
4. Tokens: colors (включая accent #6D28D9 как violet семейство), typography (Geist), spacing, radius, shadows, motion
5. Style Dictionary конфиг → генерит CSS variables + Tailwind v4 @theme + Swift tokens (Swift часть пока не интегрируется, но файлы генерятся)
6. Примитивы: Button, Input, Card, Dialog, Sheet, Toast, Dropdown, Tooltip, Tabs, Badge, Avatar, Skeleton — shadcn/ui стиль
7. Ключевые доменные компоненты: PortfolioCard, AssetRow, TransactionRow, InsightCard, ChatMessage, AccountConnectCard
8. Storybook ИЛИ простая /design страница в apps/web со всеми компонентами
9. Темы: light + dark
10. Accessibility baseline: focus states, ARIA, цветовые контрасты WCAG AA

ПРАВИЛА РАБОТЫ:
- Читай docs/00_PROJECT_BRIEF.md, 01_TECH_STACK.md, 02_ARCHITECTURE.md первым делом
- Если решение есть в docs — следуй. Если нет — best practices своего стека (Material/Apple HIG/shadcn)
- Не ломай чужое (другие TASK_XX могли оставить файлы — не перезаписывай без нужды)
- Коммиты часто, Conventional Commits: feat/fix/chore/docs/refactor/test
- Перед "готово" — прогони lint, typecheck, build, tests локально
- Блокирующие вопросы формулируй кратко с вариантами (a/b/c) и рекомендацией. Не задавай то, что можешь решить сам
- В конце — PR в main через gh pr create с описанием DoD

Стартуй.
```

---

## TASK_03: API Contract (spec-first)

```
Ты работаешь над API-контрактом стартапа investment-tracker.
Я стартап-основатель, общаюсь с Product Owner в параллельном чате.

КОНТЕКСТ:
- Монорепо root: D:\СТАРТАП (текущая директория)
- Детали задачи: docs/TASK_03_api_contract.md
- Архитектура: docs/02_ARCHITECTURE.md (схема БД, слои, domain model)
- Стек: docs/01_TECH_STACK.md
- Бриф: docs/00_PROJECT_BRIEF.md

ЗАБЛОКИРОВАННЫЕ РЕШЕНИЯ PO:
- Подход: spec-first. `tools/openapi/openapi.yaml` = source of truth; Go-код генерится через **oapi-codegen** (не huma v2 — см. DECISIONS.md 2026-04-19). Генерит `types.gen.go` + `server.gen.go` (ServerInterface). TD-007 препроцессор конвертит OpenAPI 3.1 `type: [X, "null"]` → 3.0 `nullable: true` до feed'а в oapi-codegen
- Все пути под /v1/ префиксом
- UUIDv7 генерится в приложении (Go: github.com/google/uuid v1.6+, Python: uuid_utils). В миграциях НЕТ DEFAULT gen_random_uuid() — id UUID PRIMARY KEY NOT NULL без default
- JSONB formal schemas (в components/schemas):
  * PortfolioAllocation (allocation, by_asset_type, by_currency)
  * AIMessageContent (discriminated union по type: text/tool_use/tool_result)
  * InsightData (generic object + TODO если TASK_05 ещё не зафиксировал структуры 5 типов инсайтов)
- JSONB loose (type: object, additionalProperties: true):
  * audit_log.metadata
  * transactions.source_details
  * usage_counters.details
- Multi-currency: USD baseline. Переименуй total_value_usd → total_value_base, total_cost_usd → total_cost_base. Добавь portfolio_snapshots.base_currency CHAR(3) NOT NULL DEFAULT 'USD'. API response values = { base: {...}, display: {currency, total_value, total_cost, fx_rate, fx_date} }
- Soft delete accounts: deleted_at TIMESTAMPTZ NULL + partial index WHERE deleted_at IS NULL. Transactions связанные с soft-deleted аккаунтом НЕ трогаем (нужны для исторических снапшотов)
- На transactions soft delete НЕ нужен
- AI Chat: два endpoint — POST /v1/ai/chat/stream (text/event-stream, SSE: event: + data: JSON) и POST /v1/ai/chat (обычный JSON)
- Idempotency-Key header (optional) для всех POST/PUT меняющих данные. Сервер хранит ответ 24ч.
- Cursor pagination, error envelope стандартный (см. TASK_03.md)
- Rate limits в headers

ЗАДАЧА:
1. Прочитай docs/TASK_03_api_contract.md, 02_ARCHITECTURE.md целиком
2. Создай tools/openapi/openapi.yaml (OpenAPI 3.1) со всеми MVP endpoints
3. Стандарты: pagination, error envelope, auth (Clerk JWT), rate limit headers, Idempotency-Key
4. Все endpoints из TASK_03.md (auth нет — Clerk handles; accounts, transactions, positions, snapshots, insights, ai/chat, ai/chat/stream, fx_rates, prices, billing, usage)
5. components/schemas для всех DTO + formal JSONB schemas выше
6. Goose миграции в apps/api/db/migrations/ (с учётом всех решений PO выше)
7. Скрипты автогенерации:
   - tools/openapi/generate-ts.sh → packages/shared-types/ (TS types) + packages/api-client/ (fetch client)
   - tools/openapi/generate-go.sh → apps/api/internal/api/ (oapi-codegen: types.gen.go + server.gen.go с ServerInterface)
   - tools/openapi/generate-swift.sh → generated Swift types (в tools/openapi/generated/swift/)
8. Bruno или Postman коллекция (выбери Bruno — git-friendly)
9. Scalar UI для preview спеки
10. tools/openapi/README.md: workflow "как менять API" (edit YAML → regen → PR)

ПРАВИЛА РАБОТЫ:
- Читай docs/00_PROJECT_BRIEF.md, 01_TECH_STACK.md, 02_ARCHITECTURE.md первым делом
- Если решение есть в docs — следуй. Если нет — best practices своего стека
- Не ломай чужое (другие TASK_XX могли оставить файлы — не перезаписывай без нужды)
- Коммиты часто, Conventional Commits: feat/fix/chore/docs/refactor/test
- Перед "готово" — прогони lint, typecheck, build, tests локально
- Блокирующие вопросы формулируй кратко с вариантами (a/b/c) и рекомендацией. Не задавай то, что можешь решить сам
- В конце — PR в main через gh pr create с описанием DoD

Стартуй.
```

---

## TASK_04: Core Backend (Go)

```
Ты работаешь над Go бэкендом стартапа investment-tracker.
Я стартап-основатель, общаюсь с Product Owner в параллельном чате.

ВАЖНО: эта задача зависит от TASK_03 (API contract). Проверь что tools/openapi/openapi.yaml и apps/api/db/migrations/ существуют и актуальны. Если нет — остановись и сообщи PO, что TASK_03 не готов.

КОНТЕКСТ:
- Монорепо root: D:\СТАРТАП (текущая директория)
- Детали задачи: docs/TASK_04_core_backend.md
- Архитектура: docs/02_ARCHITECTURE.md
- API спека: tools/openapi/openapi.yaml (source of truth)
- Стек: Go 1.25+, Fiber v3, oapi-codegen (spec-first, не huma), sqlc, pgx v5, goose, asynq, zerolog, shopspring/decimal, go-redis v9, svix, stripe-go

ЗАБЛОКИРОВАННЫЕ РЕШЕНИЯ PO:
- Go single module: apps/api/go.mod, module github.com/rmstrn/investment-tracker/apps/api
- Два бинаря: cmd/api/main.go (HTTP), cmd/workers/main.go (asynq)
- Shared internal/: config, db (sqlc output + pgx pool), models, clients, auth (Clerk JWT), crypto (envelope encryption)
- Domain: internal/domain/{portfolio,transactions,accounts,insights,ai,billing}
- oapi-codegen handlers: имплементируем `ServerInterface` (метод per-operation), dual-mode auth middleware (Clerk JWT ИЛИ internal-token + X-User-Id для AI Service/workers), idempotency middleware с SETNX + 24h кэш, cursor pagination base64, FX resolver (Redis→PG→inverse), tiers.Limits shared module (не хардкодить `user.Tier == "pro"`)
- UUIDv7 через github.com/google/uuid (NewV7)
- Envelope encryption для broker credentials: KEK из env (пока одна), DEK per credential, AES-256-GCM
- Fingerprint для dedup транзакций: SHA-256 от (account_id, external_id || (date, amount, symbol, type))
- Positions вычисляются из transactions on-demand + кэшируются в таблицу positions, перерасчёт в воркере
- Daily snapshots — cron job в workers
- Logging: zerolog, structured, request_id из middleware
- Config: env vars через github.com/caarlos0/env/v11
- Тесты: testcontainers-go для Postgres integration tests
- Dockerfile: multi-stage, финальные stages api и workers (один Dockerfile)

ЗАДАЧА:
1. Прочитай docs/TASK_04_core_backend.md, 02_ARCHITECTURE.md, tools/openapi/openapi.yaml
2. Если scaffold apps/api уже есть от TASK_01 — продолжай, не перезаписывай
3. Имплементируй всё по TASK_04 DoD
4. Используй sqlc для генерации Go кода из миграций (sqlc.yaml в apps/api/)
5. Все endpoints из openapi.yaml через `ServerInterface` реализацию (oapi-codegen)
6. Integration тесты на критичный path (auth, CRUD transactions, positions compute, snapshot)
7. make api, make workers, make test — должны работать
8. Dockerfile + docker-compose.yml в корне уже должен быть от TASK_01 — добавь api и workers services

ПРАВИЛА РАБОТЫ:
- Читай docs/00_PROJECT_BRIEF.md, 01_TECH_STACK.md, 02_ARCHITECTURE.md первым делом
- Если решение есть в docs — следуй. Если нет — best practices своего стека
- Не ломай чужое (другие TASK_XX могли оставить файлы — не перезаписывай без нужды)
- Коммиты часто, Conventional Commits: feat/fix/chore/docs/refactor/test
- Перед "готово" — прогони lint, typecheck, build, tests локально
- Блокирующие вопросы формулируй кратко с вариантами (a/b/c) и рекомендацией. Не задавай то, что можешь решить сам
- В конце — PR в main через gh pr create с описанием DoD

Стартуй.
```

---

## TASK_05: AI Service (Python)

```
Ты работаешь над AI сервисом стартапа investment-tracker.
Я стартап-основатель, общаюсь с Product Owner в параллельном чате.

ВАЖНО: эта задача зависит от TASK_03 (API contract). openapi.yaml должен существовать.

КОНТЕКСТ:
- Монорепо root: D:\СТАРТАП (текущая директория)
- Детали задачи: docs/TASK_05_ai_service.md
- Архитектура: docs/02_ARCHITECTURE.md
- Стек: Python 3.13, FastAPI, Pydantic v2, Anthropic SDK, uv, LangGraph опционально

ЗАБЛОКИРОВАННЫЕ РЕШЕНИЯ PO:
- Модель: claude-sonnet-4-6 для chat, claude-haiku-4-5 для инсайтов/дешёвых задач
- Подход: tool calling, НЕ RAG (данные пользователя извлекаются через tool-вызовы в Core API)
- SSE streaming для chat response (endpoint POST /v1/ai/chat/stream)
- 5 типов инсайтов: diversification, risk, performance, rebalance, cost
- Tools для AI: get_portfolio_summary, get_positions, get_transactions, get_insights, get_market_data
- Все tools — это HTTP calls в Core Go API с service-to-service auth (shared secret header)
- Prompt caching где возможно (system prompt, tool definitions)
- Python package layout: apps/ai/ с pyproject.toml, uv sync
- apps/ai/src/ai_service/{api,agents,tools,prompts,insights,config}
- FastAPI + uvicorn
- Тесты: pytest + httpx.AsyncClient
- Dockerfile отдельный для apps/ai

ЗАДАЧА:
1. Прочитай docs/TASK_05_ai_service.md, 02_ARCHITECTURE.md, tools/openapi/openapi.yaml (секции /ai/*)
2. Если scaffold apps/ai есть от TASK_01 — продолжай
3. FastAPI app: POST /v1/ai/chat (JSON), POST /v1/ai/chat/stream (SSE), POST /v1/ai/insights/generate (async, возвращает task_id)
4. Agent с tool calling — bindings в Core API через httpx
5. Все 5 типов инсайтов имплементированы
6. SSE формат event: message_delta | tool_use | tool_result | done, data: JSON
7. Prompt caching на system + tool definitions
8. Тесты: моки Anthropic API, реальные вызовы Core API через testcontainers если нужно

ПРАВИЛА РАБОТЫ:
- Читай docs/00_PROJECT_BRIEF.md, 01_TECH_STACK.md, 02_ARCHITECTURE.md первым делом
- Если решение есть в docs — следуй. Если нет — best practices своего стека
- Не ломай чужое (другие TASK_XX могли оставить файлы — не перезаписывай без нужды)
- Коммиты часто, Conventional Commits: feat/fix/chore/docs/refactor/test
- Перед "готово" — прогони lint, typecheck, build, tests локально
- Блокирующие вопросы формулируй кратко с вариантами (a/b/c) и рекомендацией. Не задавай то, что можешь решить сам
- В конце — PR в main через gh pr create с описанием DoD

Стартуй.
```

---

## TASK_06: Broker Integrations

```
Ты работаешь над broker-интеграциями стартапа investment-tracker.
Я стартап-основатель, общаюсь с Product Owner в параллельном чате.

ВАЖНО: зависит от TASK_04 (Core Backend). internal/domain/accounts и transactions должны существовать.

КОНТЕКСТ:
- Монорепо root: D:\СТАРТАП (текущая директория)
- Детали задачи: docs/TASK_06_broker_integrations.md
- Архитектура: docs/02_ARCHITECTURE.md
- Код идёт в apps/api/internal/clients/ и apps/api/internal/domain/accounts/
- Воркеры: apps/api/cmd/workers + asynq tasks

ЗАБЛОКИРОВАННЫЕ РЕШЕНИЯ PO:
- MVP брокеры: SnapTrade (US/EU акции/ETF), Binance (крипта), Coinbase (крипта)
- SnapTrade — third-party аггрегатор (single point of failure, но для MVP ок)
- Credentials: envelope encryption (KEK из env, DEK per credential, AES-256-GCM)
- Sync cadence: initial sync при подключении, далее каждые 6 часов + manual trigger
- Dedup: fingerprint SHA-256 от (account_id, external_id) если есть, иначе (account_id, date, amount, symbol, type)
- Workers queue: sync-broker (per account), rate limits из асинка
- Webhook support где доступно (SnapTrade шлёт уведомления)
- Graceful degradation: если broker API down — retry с exp backoff, статус account.sync_status = error + last_error
- Manual transaction entry всегда доступна как fallback

ЗАДАЧА:
1. Прочитай docs/TASK_06_broker_integrations.md, 02_ARCHITECTURE.md
2. internal/clients/snaptrade, internal/clients/binance, internal/clients/coinbase — клиенты с ретраями
3. internal/domain/accounts/linking — OAuth-flow для SnapTrade, API key entry для Binance/Coinbase
4. internal/domain/transactions/sync — normalizer из broker → наша domain model
5. cmd/workers tasks: sync_account(account_id)
6. Webhook handlers для SnapTrade
7. Тесты: VCR cassettes для реальных API ответов, unit-тесты на normalizers

ПРАВИЛА РАБОТЫ:
- Читай docs/00_PROJECT_BRIEF.md, 01_TECH_STACK.md, 02_ARCHITECTURE.md первым делом
- Если решение есть в docs — следуй. Если нет — best practices своего стека
- Не ломай чужое (другие TASK_XX могли оставить файлы — не перезаписывай без нужды)
- Коммиты часто, Conventional Commits: feat/fix/chore/docs/refactor/test
- Перед "готово" — прогони lint, typecheck, build, tests локально
- Блокирующие вопросы формулируй кратко с вариантами (a/b/c) и рекомендацией. Не задавай то, что можешь решить сам
- В конце — PR в main через gh pr create с описанием DoD

Стартуй.
```

---

## TASK_07: Web Frontend (Next.js)

```
Ты работаешь над веб-фронтом стартапа investment-tracker.
Я стартап-основатель, общаюсь с Product Owner в параллельном чате.

ВАЖНО: зависит от TASK_03 (packages/api-client должен быть сгенерён) и TASK_02 (design-tokens + ui).

КОНТЕКСТ:
- Монорепо root: D:\СТАРТАП (текущая директория)
- Детали задачи: docs/TASK_07_web_frontend.md
- Стек: Next.js 15 App Router, React 19, TypeScript 5.7, Tailwind v4, shadcn/ui, TanStack Query, Clerk, Stripe

ЗАБЛОКИРОВАННЫЕ РЕШЕНИЯ PO:
- apps/web — Next.js 15 App Router, RSC где имеет смысл
- Auth: Clerk (ClerkProvider, middleware.ts, protected routes)
- Billing: Stripe Checkout + Customer Portal (server actions)
- Data fetching: TanStack Query + сгенерённый packages/api-client, SSR для initial page load
- UI: @investment-tracker/ui (из TASK_02)
- Product name: "Portfolio" (placeholder) — все через @investment-tracker/design-tokens config, не хардкодь
- Accent: #6D28D9 (через tokens)
- Domain: пока localhost, переменные окружения APP_URL/API_URL — placeholders
- Темы: light + dark, системная по умолчанию
- Accessibility WCAG AA
- i18n: на MVP только английский, но структурно закладываем next-intl
- AI Chat: SSE через native EventSource или Fetch streams

ЗАДАЧА:
1. Прочитай docs/TASK_07_web_frontend.md, используй @investment-tracker/ui и design-tokens
2. Страницы: /, /sign-in, /sign-up, /dashboard (portfolio overview), /accounts, /accounts/connect, /transactions, /insights, /chat, /settings, /billing
3. AI Chat UI: стримящийся response, tool use визуализация
4. Onboarding flow: empty state → connect first broker → first sync → dashboard
5. Dashboard: KPI cards (total value display currency, day change, allocation chart, recent transactions, insights preview)
6. Charts: Recharts с design tokens
7. Clerk middleware + server actions для Stripe
8. Тесты: Playwright для критичных flows (sign-up, connect broker, view portfolio, chat)

ПРАВИЛА РАБОТЫ:
- Читай docs/00_PROJECT_BRIEF.md, 01_TECH_STACK.md, 02_ARCHITECTURE.md первым делом
- Если решение есть в docs — следуй. Если нет — best practices своего стека
- Не ломай чужое (другие TASK_XX могли оставить файлы — не перезаписывай без нужды)
- Коммиты часто, Conventional Commits: feat/fix/chore/docs/refactor/test
- Перед "готово" — прогони lint, typecheck, build, tests локально
- Блокирующие вопросы формулируй кратко с вариантами (a/b/c) и рекомендацией. Не задавай то, что можешь решить сам
- В конце — PR в main через gh pr create с описанием DoD

Стартуй.
```

---

## TASK_08: iOS App (deferred)

```
ОТЛОЖЕНО — нужен Mac + Xcode. Запустишь позже в отдельном репо github.com/rmstrn/investment-tracker-ios.

Когда будешь готов стартовать — скажи PO, получишь свежий промт с актуальным состоянием API.

Текущий стек (справочно):
- Swift 6, SwiftUI, SwiftData, Swift Charts
- iOS 17+ минимум, target iOS 26 (Liquid Glass)
- Observable макро, структурированная concurrency
- Widgets + Live Activities
- Auth через Clerk iOS SDK
- API через сгенерённый Swift client из openapi.yaml
```

---

_Правила работы встроены в каждый промт — копируй блок целиком, всё внутри._
