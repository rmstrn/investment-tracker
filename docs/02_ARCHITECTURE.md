# 02 — Architecture & Data Model

## Высокоуровневая архитектура

Четыре слоя:

```
┌─────────────────────────────────────────────┐
│ CLIENTS: Web (Next.js), iOS (Swift)         │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│ BACKEND:                                    │
│  • Core API (Go + Fiber)                    │
│  • AI Service (Python + FastAPI)            │
│  • Workers (Go + asynq)                     │
└─────────────────────────────────────────────┘
                     ↓                    ↓
┌──────────────────────────┐  ┌────────────────────────┐
│ DATA:                    │  │ EXTERNAL APIs:         │
│  • PostgreSQL            │  │  • Broker aggregators  │
│  • Redis                 │  │  • Market data         │
│  • R2 object storage     │  │  • LLM (Claude)        │
└──────────────────────────┘  └────────────────────────┘
```

## Принципы масштабирования

1. **Бекенд без состояния.** Любую копию Core API можно убить и поднять заново.
2. **Тяжёлая работа асинхронная.** Парсинг, синк, расчёты — в воркерах.
3. **Кэш всего, что можно.** Цены, FX, скомпилированные данные портфеля.
4. **Managed services.** Не администрируем БД, Redis, CDN сами.
5. **Разделение по ответственности.** API, AI-сервис, воркеры — независимые процессы.

## Компоненты бекенда

### Core API (Go)
**Ответственность:** всё, что делает пользователь по клику.
- Аутентификация (валидация Clerk JWT)
- CRUD счетов, позиций, сделок
- Чтение портфеля, расчёт метрик
- Управление подпиской (webhook'и Stripe)
- Rate limiting

**Характеристики:** низкая латентность (P99 < 100ms), высокая пропускная способность.

### AI Service (Python)
**Ответственность:** всё, что связано с LLM.
- AI Chat (с доступом к портфелю через tool calling)
- Генерация проактивных инсайтов
- Парсинг неструктурированных данных (на будущее)

**Характеристики:** высокая латентность (2-10s на ответ), отдельное масштабирование.

### Workers (Go)
**Ответственность:** фоновые задачи.
- Синхронизация с брокерами (раз в час)
- Обновление рыночных цен (каждые 5 минут)
- Расчёт дневных снапшотов портфеля (раз в день)
- Генерация еженедельных инсайтов
- Отправка email-уведомлений

## Поток данных: синхронизация портфеля

```
[Пользователь подключил IB через SnapTrade]
     ↓
[Core API] сохраняет account_id + зашифрованный токен
     ↓
[Workers] получают задачу "sync account X"
     ↓
[Workers] → SnapTrade API → получают сделки
     ↓
[Workers] применяют дедупликацию по fingerprint
     ↓
[Postgres] вставляются новые сделки (transactions table)
     ↓
[Workers] пересчитывают позиции (positions table)
     ↓
[Workers] делают снапшот портфеля (portfolio_snapshots)
     ↓
[Redis] инвалидируют кэш портфеля для этого юзера
```

## Поток данных: AI Chat

```
[Пользователь пишет "почему я в минусе сегодня?"]
     ↓
[Web/iOS] → [Core API] (валидация, rate limit)
     ↓
[Core API] → [AI Service] (прокси с контекстом user_id)
     ↓
[AI Service] строит контекст:
  • Текущий портфель (через tool call к Core API)
  • Дневное изменение (через tool call)
  • Рыночный контекст (через tool call)
     ↓
[AI Service] → [Claude API] с tool definitions
     ↓
Claude вызывает нужные tools, AI Service исполняет
     ↓
[AI Service] стримит ответ обратно через SSE
     ↓
[Web/iOS] показывает ответ по мере генерации
```

## Модель данных — основные сущности

### users
Пользователи приложения.

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id   TEXT UNIQUE NOT NULL,           -- ID из Clerk
  email           TEXT NOT NULL,
  display_currency TEXT NOT NULL DEFAULT 'USD',   -- в какой валюте показывать
  locale          TEXT NOT NULL DEFAULT 'en',
  subscription_tier TEXT NOT NULL DEFAULT 'free', -- free | plus | pro
  stripe_customer_id TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### accounts
Подключённые брокерские счета и кошельки.

```sql
CREATE TABLE accounts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  broker_name         TEXT NOT NULL,              -- 'interactive_brokers', 'binance', etc.
  display_name        TEXT NOT NULL,              -- "IB Taxable" etc (user-editable)
  account_type        TEXT NOT NULL,              -- 'broker' | 'crypto' | 'manual'
  connection_type     TEXT NOT NULL,              -- 'api' | 'aggregator' | 'import' | 'manual'
  external_account_id TEXT,                       -- ID в SnapTrade или брокере
  credentials_encrypted BYTEA,                    -- зашифрованные API-ключи/токены
  base_currency       TEXT NOT NULL,              -- нативная валюта счёта
  last_synced_at      TIMESTAMPTZ,
  sync_status         TEXT DEFAULT 'pending',     -- 'pending' | 'ok' | 'error'
  sync_error          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_accounts_user ON accounts(user_id);
```

### transactions
**Иммутабельный ledger всех операций.** Источник истины.

```sql
CREATE TABLE transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id      UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  -- Что
  symbol          TEXT NOT NULL,                  -- 'AAPL', 'BTC', etc.
  asset_type      TEXT NOT NULL,                  -- 'stock' | 'etf' | 'crypto'
  transaction_type TEXT NOT NULL,                 -- 'buy'|'sell'|'dividend'|'split'|'transfer_in'|'transfer_out'|'fee'
  
  -- Сколько
  quantity        NUMERIC(30, 10) NOT NULL,       -- высокая точность для крипты
  price           NUMERIC(30, 10),                -- может быть NULL для split
  currency        TEXT NOT NULL,                  -- валюта сделки
  fee             NUMERIC(30, 10) DEFAULT 0,
  
  -- Когда
  executed_at     TIMESTAMPTZ NOT NULL,
  
  -- Откуда
  source          TEXT NOT NULL,                  -- 'manual' | 'api' | 'aggregator' | 'import'
  source_details  JSONB,                          -- доп. инфо об источнике
  fingerprint     TEXT NOT NULL,                  -- хэш для дедупликации
  
  -- Meta
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_txn_fingerprint ON transactions(user_id, fingerprint);
CREATE INDEX idx_txn_user_time ON transactions(user_id, executed_at DESC);
CREATE INDEX idx_txn_account ON transactions(account_id);
```

**Fingerprint** — SHA256 из: `account_id || symbol || quantity || price || transaction_type || executed_at_minute`. Обеспечивает дедупликацию между ручным вводом, импортом и API.

### positions
**Текущие позиции, ВЫЧИСЛЯЕМЫЕ из transactions.** Материализованное представление для быстрого чтения.

```sql
CREATE TABLE positions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id      UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  symbol          TEXT NOT NULL,
  asset_type      TEXT NOT NULL,
  
  quantity        NUMERIC(30, 10) NOT NULL,
  avg_cost        NUMERIC(30, 10),                -- средняя цена покупки
  currency        TEXT NOT NULL,
  
  last_calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_pos_unique ON positions(user_id, account_id, symbol);
CREATE INDEX idx_pos_user ON positions(user_id);
```

Пересчитывается воркерами после каждой новой транзакции.

### portfolio_snapshots
Дневные снапшоты стоимости портфеля — для графиков по времени.

```sql
CREATE TABLE portfolio_snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  snapshot_date   DATE NOT NULL,
  
  total_value_usd NUMERIC(30, 10) NOT NULL,
  total_cost_usd  NUMERIC(30, 10) NOT NULL,       -- сумма закупок
  
  allocation      JSONB NOT NULL,                 -- {"AAPL": 0.15, "BTC": 0.25, ...}
  by_asset_type   JSONB NOT NULL,                 -- {"stock": 0.6, "crypto": 0.4}
  by_currency     JSONB NOT NULL,
  
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_snap_unique ON portfolio_snapshots(user_id, snapshot_date);
```

### prices
Кэш рыночных цен.

```sql
CREATE TABLE prices (
  symbol          TEXT NOT NULL,
  asset_type      TEXT NOT NULL,
  currency        TEXT NOT NULL,
  price           NUMERIC(30, 10) NOT NULL,
  as_of           TIMESTAMPTZ NOT NULL,
  source          TEXT NOT NULL,                  -- 'polygon' | 'coingecko' | 'ecb'
  
  PRIMARY KEY (symbol, asset_type, currency)
);
```

Обновляется воркерами. В Redis также лежит hot cache с TTL 60 секунд.

### fx_rates
Курсы валют.

```sql
CREATE TABLE fx_rates (
  base_currency   TEXT NOT NULL,
  quote_currency  TEXT NOT NULL,
  rate            NUMERIC(20, 10) NOT NULL,
  as_of           DATE NOT NULL,
  
  PRIMARY KEY (base_currency, quote_currency, as_of)
);
```

Исторические курсы — для точного расчёта P&L в любой валюте.

### ai_conversations + ai_messages
История AI-чатов.

```sql
CREATE TABLE ai_conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT,                           -- автогенерируется из первого сообщения
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ai_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL,                  -- 'user' | 'assistant' | 'tool'
  content         JSONB NOT NULL,                 -- текст, tool calls, tool results
  tokens_used     INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### insights
Проактивные инсайты от ИИ.

```sql
CREATE TABLE insights (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  insight_type    TEXT NOT NULL,                  -- 'concentration_risk' | 'behavioral_pattern' | etc.
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  severity        TEXT NOT NULL DEFAULT 'info',   -- 'info' | 'warning' | 'critical'
  data            JSONB,                          -- структурированные данные для UI
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  viewed_at       TIMESTAMPTZ,
  dismissed_at    TIMESTAMPTZ
);

CREATE INDEX idx_insights_user_active ON insights(user_id, generated_at DESC) 
  WHERE dismissed_at IS NULL;
```

### usage_counters
Для free-тарифа: счётчики AI-сообщений и прочего.

```sql
CREATE TABLE usage_counters (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  counter_type    TEXT NOT NULL,                  -- 'ai_messages_daily' | etc.
  counter_date    DATE NOT NULL,
  count           INTEGER NOT NULL DEFAULT 0,
  
  PRIMARY KEY (user_id, counter_type, counter_date)
);
```

### audit_log
Важные действия для безопасности и compliance.

```sql
CREATE TABLE audit_log (
  id              BIGSERIAL PRIMARY KEY,
  user_id         UUID REFERENCES users(id),
  action          TEXT NOT NULL,                  -- 'account_connected' | 'account_removed' | etc.
  metadata        JSONB,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Ключевые архитектурные решения

### 1. Transactions как источник истины
Positions ВЫЧИСЛЯЮТСЯ из transactions, не хранятся независимо. Это позволяет:
- Пересчитать портфель на любую дату в прошлом
- Исправить ошибочную сделку и автоматически пересчитать всё дальше
- Отдельный процесс "аудита" может проверить, сходится ли state

### 2. Fingerprint-based дедупликация
Каждая сделка имеет fingerprint = hash(account_id + symbol + quantity + price + type + minute). При импорте или синке — если fingerprint уже есть, пропускаем.

### 3. Source priority
При конфликте источников: `api > aggregator > import > manual`. Если API пришёл с более точной ценой ($150.2347 вместо $150.23 из PDF) — перезаписываем.

### 4. Мультивалютность от края до края
Все суммы хранятся в нативной валюте сделки. Конвертация в display_currency — только на чтении, с использованием fx_rates на дату сделки или текущих (по выбору).

### 5. Encryption at rest для credentials
Токены брокеров и API-ключи шифруются envelope encryption: KEK в AWS KMS, DEK в БД. Плейнтекст никогда не пишется в лог.

### 6. Read-only только
Никогда не запрашиваем OAuth scopes или права, которые позволили бы торговать. Если интеграция предлагает только "read+trade" — обходимся без неё.

## Общение между сервисами

- **Web/iOS ↔ Core API:** REST (JSON, OpenAPI-спека), SSE для стриминга
- **Core API ↔ AI Service:** REST (внутренний)
- **Core API ↔ Workers:** через Redis (asynq)
- **Workers ↔ внешние API:** HTTPS с retry + circuit breaker
- **AI Service ↔ Claude:** Anthropic SDK

## Observability

- **Трейсинг:** OpenTelemetry, единый trace_id от клика до внешнего API
- **Логи:** structured JSON, все сервисы пишут в Grafana Loki
- **Метрики:** Prometheus-совместимые, дашборды в Grafana
- **Ошибки:** Sentry (фронт + бек)
- **Продуктовая аналитика:** PostHog

## Безопасность

1. **Все секреты в Doppler/AWS Secrets Manager**, не в .env в репозитории
2. **Rate limiting** на уровне API Gateway (Cloudflare) + per-user в Core API
3. **CSRF + SameSite cookies** для веб-сессий
4. **HTTPS везде**, HSTS, TLS 1.3 only
5. **RBAC внутри приложения:** каждый запрос проверяет, что user_id совпадает с владельцем данных
6. **Audit log** для всех чувствительных операций
7. **GDPR-готовность:** экспорт и удаление данных по запросу через API
