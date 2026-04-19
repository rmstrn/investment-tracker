# TASK 03 — API Contract & Database Schema

**Status:** ✅ COMPLETED (2026-04-19)
**Merged:** PR #30 (08f44c2)
**Follow-ups tracked:** `TECH_DEBT.md` → TD-007 (oapi-codegen OpenAPI 3.1 nullable upstream bug)

**Волна:** 1 (параллельно с TASK_01, TASK_02)
**Зависит от:** ничего
**Блокирует:** TASK_04, TASK_05, TASK_07, TASK_08
**Срок:** 3-5 дней

## Цель

Зафиксировать API-контракт (OpenAPI 3.1) и схему БД. После готовности этого
таска — фронт и бек могут работать параллельно против одного контракта,
без ожидания друг друга.

## Что нужно сделать

### 1. OpenAPI 3.1 спецификация

Файл: `tools/openapi/openapi.yaml`

Должна описывать все endpoint'ы с:
- Путями и методами
- Request bodies (JSON schemas)
- Response schemas (включая ошибки)
- Authentication (Bearer JWT от Clerk)
- Error responses (стандартные коды)
- Примеры

### 2. Эндпоинты для MVP

#### Authentication (handled by Clerk, но endpoints есть)

```
POST   /auth/webhook                    # Clerk webhook (user.created)
```

#### Users

```
GET    /me                              # текущий пользователь
PATCH  /me                              # обновить профиль
DELETE /me                              # удалить аккаунт (GDPR)
GET    /me/export                       # экспорт всех данных (GDPR)
```

#### Accounts (подключённые брокеры/биржи)

```
GET    /accounts                        # список счетов
POST   /accounts                        # добавить счёт (возвращает OAuth URL для SnapTrade)
GET    /accounts/{id}                   # детали счёта
PATCH  /accounts/{id}                   # переименовать, изменить display_name
DELETE /accounts/{id}                   # отключить счёт (soft delete)
POST   /accounts/{id}/sync              # ручной запуск синка
GET    /accounts/{id}/status            # статус последнего синка
```

#### Transactions (сделки)

```
GET    /transactions                    # пагинированный список, фильтры по аккаунту/дате/символу
POST   /transactions                    # ручное добавление сделки
GET    /transactions/{id}               # детали сделки
PATCH  /transactions/{id}               # редактирование (только manual)
DELETE /transactions/{id}               # удаление (только manual)
```

#### Portfolio (агрегированное представление)

```
GET    /portfolio                       # общий снапшот портфеля
GET    /portfolio/history?period=1m|3m|6m|1y|all     # график стоимости
GET    /portfolio/allocation            # разбивка по активам/секторам/валютам
GET    /portfolio/performance?benchmark=SPX|QQQ      # сравнение с бенчмарком
GET    /portfolio/dividends             # дивидендный календарь
```

#### Positions (текущие позиции)

```
GET    /positions                       # все позиции с сортировкой/группировкой
GET    /positions/{id}                  # детали позиции
GET    /positions/{id}/transactions     # все сделки по этой позиции
```

#### Market Data (для клиента)

```
GET    /market/quote?symbol=AAPL       # текущая котировка
GET    /market/history?symbol=AAPL&period=1y    # исторические цены
GET    /market/search?q=apple          # поиск тикера
```

#### AI

```
POST   /ai/conversations                # создать новую беседу
GET    /ai/conversations                # список бесед
GET    /ai/conversations/{id}           # сообщения в беседе
POST   /ai/conversations/{id}/messages  # отправить сообщение (SSE-стрим ответа)
DELETE /ai/conversations/{id}           # удалить беседу

GET    /ai/insights                     # активные проактивные инсайты
POST   /ai/insights/{id}/dismiss        # скрыть инсайт
POST   /ai/insights/{id}/viewed         # отметить просмотренным
```

#### Subscription / Billing

```
GET    /billing/subscription            # текущая подписка
POST   /billing/checkout                # создать Stripe Checkout session
POST   /billing/portal                  # ссылка на Stripe Customer Portal
POST   /billing/webhook                 # Stripe webhook
```

#### Misc

```
GET    /health                          # health check
GET    /me/usage                        # текущее использование (AI messages today, etc.)
```

### 3. Стандарты API

**Pagination (cursor-based):**
```json
{
  "data": [...],
  "meta": {
    "next_cursor": "eyJpZCI6IjEyMyJ9",
    "has_more": true,
    "total_count": 150
  }
}
```

**Errors:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": { "field": "quantity", "issue": "must be positive" },
    "request_id": "req_abc123"
  }
}
```

**Коды ошибок:**
- `400` VALIDATION_ERROR, INVALID_REQUEST
- `401` UNAUTHENTICATED
- `403` FORBIDDEN, TIER_LIMIT_EXCEEDED
- `404` NOT_FOUND
- `409` CONFLICT (например, дубликат fingerprint)
- `429` RATE_LIMIT_EXCEEDED
- `500` INTERNAL_ERROR
- `502/503` EXTERNAL_SERVICE_ERROR (когда падает SnapTrade, Polygon и т.д.)

**Rate limits:**
- Per user: 100 req/min
- AI messages: зависят от tier (Free: 5/день, Plus/Pro: 100/день)
- Global IP: 1000 req/min (защита от ботов)

Возврат через headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1712345678
```

### 4. Схема БД + миграции

Создать файлы миграций в `apps/api/db/migrations/` через goose:

```
apps/api/db/migrations/
├── 20240101000001_initial_schema.sql
├── 20240101000002_indexes.sql
└── ...
```

Полная схема уже описана в `02_ARCHITECTURE.md`. Этот таск — превратить её
в реальные SQL-миграции:

- `users`
- `accounts`
- `transactions`
- `positions`
- `portfolio_snapshots`
- `prices`
- `fx_rates`
- `ai_conversations`
- `ai_messages`
- `insights`
- `usage_counters`
- `audit_log`

Плюс:
- Индексы (перечислены в architecture doc)
- Row-level security не используем (всё через application layer)
- Все `*_at` поля — TIMESTAMPTZ с дефолтом `now()`

### 5. Автогенерация типов и клиентов

Настроить скрипты:

```bash
# Генерация TypeScript типов из OpenAPI
pnpm generate:types
# → packages/shared-types/src/api.ts

# Генерация TS клиента
pnpm generate:client
# → packages/api-client/src/index.ts

# Генерация Go структур для типов запросов/ответов
go generate ./...

# Генерация Swift моделей для iOS
# Используем OpenAPIGenerator или swift-openapi-generator
```

**Инструменты:**
- TS: `openapi-typescript` + `openapi-fetch` (легковесно, типобезопасно)
- Go: **oapi-codegen** генерит `types.gen.go` + `server.gen.go` (ServerInterface) из `tools/openapi/openapi.yaml`. См. DECISIONS.md 2026-04-19 «Core API: spec-first via oapi-codegen, not code-first via huma». TD-007: preprocessor конвертит 3.1 nullable pattern в 3.0 `nullable: true`.
- Swift: `swift-openapi-generator` (официальный Apple)

### 6. Postman / Bruno коллекция

Для ручного тестирования. Положить в `tools/api-testing/`.

### 7. Документация API

- Swagger UI или Scalar UI на `/api/docs` в dev environment
- Короткий README в `tools/openapi/` — как обновлять спеку

## Definition of Done

- [ ] `tools/openapi/openapi.yaml` описывает все endpoints MVP
- [ ] Все error scenarios описаны
- [ ] SQL миграции созданы, `goose up` работает на чистой БД
- [ ] Скрипт генерации TS типов работает
- [ ] Скрипт генерации TS клиента работает
- [ ] Swagger/Scalar UI доступен локально
- [ ] Bruno/Postman коллекция покрывает happy-path
- [ ] README в tools/openapi/ объясняет workflow

## Важные решения

- **Spec-first — выбрано.** Изначально рассматривали code-first через huma v2, но после оценки (фронт/iOS тоже качают клиенты из этой же спеки, риск рассинхрона) переключились на spec-first: `tools/openapi/openapi.yaml` — source of truth, из неё генерятся Go (oapi-codegen), TS (openapi-typescript), Swift (swift-openapi-generator). См. полный ADR в DECISIONS.md от 2026-04-19.

- **REST, не GraphQL.** Проще, достаточно для MVP.

- **JSON, не Protobuf.** gRPC для внутренних вызовов (Core API ↔ AI Service)
  — обсуждаемо, но MVP — весь REST.

- **Cursor pagination, не offset.** Лучше для бесконечного списка транзакций.

- **Все IDs — UUID v7** (не v4). v7 монотонные по времени, лучше для индексов.

## Что НЕ делаем

- Не пишем API-клиенты вручную (генерим)
- Не проектируем gRPC (REST хватит)
- Не делаем API-версионирование (`/v1/`) сразу — добавим когда понадобится
- Не пишем бизнес-логику (только контракт и схема)

## Следующий шаг

Когда этот таск готов:
- TASK_04 начинает имплементировать endpoints в Go
- TASK_07/08 могут начать мокать запросы по типам
- TASK_05 видит схему portfolio/transactions для AI tools
