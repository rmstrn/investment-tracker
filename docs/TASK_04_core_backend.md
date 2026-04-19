# TASK 04 — Core Backend API (Go)

**Волна:** 2
**Зависит от:** TASK_01 (monorepo), TASK_03 (API contract + DB schema)
**Блокирует:** TASK_05 (AI Service нужны портфельные данные), TASK_06 (интеграции), TASK_07 (Web), TASK_08 (iOS)
**Срок:** 4-6 недель (параллельно с другими)

**Статус (2026-04-19):** 🚧 6 of ~8 PRs merged.

| PR | Scope | Status |
|---|---|---|
| A | skeleton, config, middleware basics | ✅ merged (14f95468) |
| B1 | first read handlers | ✅ merged (462d2993) |
| B2a | read handlers batch 2 | ✅ merged (272e5fe6) |
| B2b | read handlers batch 3 | ✅ merged (fdcf39f4) |
| B2c | final read handlers (30 GET authenticated) | ✅ merged (fb16525) |
| **B3-i** | **write-path mutations + asynq + idempotency lock** | **✅ merged 2026-04-19 (11d6098, PR #40)** |
| B3-ii | AI mutations + SSE reverse-proxy + tier rate-limit | 🚧 next (anchor ~2000-2500 LOC) |
| B3-iii | Clerk/Stripe webhooks + webhook_events idempotency | ⏳ queued |
| C | Dockerfile + fly.toml + k6 smoke + deploy runbook | ⏳ queued (см. PR_C_preflight.md) |

## Цель

Реализовать основной REST API на Go. Это "мозги" приложения:
аутентификация, портфель, сделки, подписки. Должен быть быстрым, надёжным
и правильно обрабатывать деньги и чувствительные данные.

## Стек

- **Go 1.25+** (требуется `go tool` для pinned dev deps)
- **Fiber v3** — web framework
- **oapi-codegen** — spec-first codegen (не huma v2 — см. DECISIONS.md 2026-04-19); генерит `types.gen.go` + `server.gen.go` (ServerInterface) из `tools/openapi/openapi.yaml`. TD-007: preprocessor конвертит OpenAPI 3.1 `type: [X, "null"]` → 3.0 `nullable: true`
- **sqlc** — типобезопасные запросы из SQL (pinned via `go tool`)
- **pgx v5** — Postgres driver
- **goose** — миграции (запускается отдельно)
- **asynq** — публикация задач в очередь (для workers); wrapper в `internal/clients/asynqpub` с nil-safe `Enabled()`
- **shopspring/decimal** — decimal arithmetic для денег (никогда float64)
- **svix** — Clerk webhook signature verification
- **stripe-go** — Stripe SDK + webhook verification
- **zerolog** — structured logging
- **go-redis v9** — Redis client
- **jwt-go v5** — JWT валидация (для Clerk)

## Структура проекта

```
apps/api/
├── cmd/
│   └── api/
│       └── main.go                 # entrypoint
├── internal/
│   ├── config/                     # env config
│   ├── server/                     # Fiber server setup
│   ├── middleware/                 # auth, rate limit, logging, cors
│   ├── handlers/                   # HTTP handlers
│   │   ├── users.go
│   │   ├── accounts.go
│   │   ├── transactions.go
│   │   ├── portfolio.go
│   │   ├── positions.go
│   │   ├── market.go
│   │   ├── ai.go                   # proxy к AI service
│   │   └── billing.go
│   ├── domain/                     # бизнес-логика и типы
│   │   ├── portfolio/
│   │   ├── transactions/
│   │   └── users/
│   ├── db/
│   │   ├── migrations/             # goose .sql файлы
│   │   ├── queries/                # .sql для sqlc
│   │   └── generated/              # sqlc output
│   ├── integrations/               # клиенты внешних API
│   │   ├── clerk/
│   │   ├── stripe/
│   │   ├── polygon/
│   │   ├── coingecko/
│   │   └── snaptrade/
│   ├── queue/                      # asynq publisher
│   ├── cache/                      # Redis wrappers
│   ├── crypto/                     # envelope encryption для credentials
│   └── errors/                     # стандартизация ошибок
├── go.mod
├── go.sum
├── Dockerfile
└── fly.toml
```

## Ключевые компоненты

### 1. Конфигурация

Читаем через envconfig из env переменных. Все секреты — из Doppler в проде.

```go
type Config struct {
    Port                 string `envconfig:"PORT" default:"8080"`
    Env                  string `envconfig:"ENV" default:"development"`
    DatabaseURL          string `envconfig:"DATABASE_URL" required:"true"`
    RedisURL             string `envconfig:"REDIS_URL" required:"true"`
    ClerkSecretKey       string `envconfig:"CLERK_SECRET_KEY" required:"true"`
    ClerkJWKSUrl         string `envconfig:"CLERK_JWKS_URL" required:"true"`
    StripeSecretKey      string `envconfig:"STRIPE_SECRET_KEY" required:"true"`
    StripeWebhookSecret  string `envconfig:"STRIPE_WEBHOOK_SECRET" required:"true"`
    AIServiceURL         string `envconfig:"AI_SERVICE_URL" required:"true"`
    AIServiceToken       string `envconfig:"AI_SERVICE_TOKEN" required:"true"`
    SnapTradeClientID    string `envconfig:"SNAPTRADE_CLIENT_ID" required:"true"`
    SnapTradeConsumerKey string `envconfig:"SNAPTRADE_CONSUMER_KEY" required:"true"`
    PolygonAPIKey        string `envconfig:"POLYGON_API_KEY" required:"true"`
    EncryptionKEK        string `envconfig:"ENCRYPTION_KEK" required:"true"` // base64
    SentryDSN            string `envconfig:"SENTRY_DSN"`
    LogLevel             string `envconfig:"LOG_LEVEL" default:"info"`
}
```

### 2. Authentication middleware

Валидируем JWT от Clerk на каждый запрос (кроме webhooks):

```go
func AuthMiddleware(jwks *keyfunc.JWKS) fiber.Handler {
    return func(c *fiber.Ctx) error {
        token := extractBearer(c)
        claims, err := parseClerkJWT(token, jwks)
        if err != nil {
            return httpError(c, 401, "UNAUTHENTICATED", "Invalid token")
        }
        
        // clerk_user_id → user_id из нашей БД
        user, err := userRepo.GetOrCreateByClerkID(claims.Sub)
        if err != nil {
            return err
        }
        
        c.Locals("user", user)
        return c.Next()
    }
}
```

### 3. Portfolio calculation logic

Это критичная бизнес-логика. Кеширование и корректность важны.

```go
// domain/portfolio/calculator.go

// CalculatePortfolio собирает снапшот портфеля из positions + current prices
func (c *Calculator) CalculatePortfolio(ctx context.Context, userID uuid.UUID) (*Portfolio, error) {
    positions := c.repo.GetPositions(ctx, userID)
    prices := c.prices.GetBatch(ctx, symbols(positions))
    fxRates := c.fx.GetLatest(ctx, ...)
    
    // Конвертируем каждую позицию в display_currency юзера
    // Считаем total_value, total_cost, P&L, P&L %
    // Группируем по asset_type, sector, currency
}
```

**Важно:**
- Всегда работаем с `decimal.Decimal` (shopspring/decimal), НЕ с float64 для денег
- Кешируем результат в Redis на 60 секунд (user-level cache)
- Инвалидируем кеш при новой транзакции

### 4. Fingerprint-based дедупликация

```go
// domain/transactions/fingerprint.go

func Fingerprint(accountID uuid.UUID, symbol string, qty, price decimal.Decimal, 
                 txType string, executedAt time.Time) string {
    // Округляем executedAt до минуты для устойчивости к timezone shifts
    minute := executedAt.Truncate(time.Minute)
    
    data := fmt.Sprintf("%s|%s|%s|%s|%s|%s", 
        accountID, symbol, qty.String(), price.String(), txType, minute.Format(time.RFC3339))
    
    hash := sha256.Sum256([]byte(data))
    return hex.EncodeToString(hash[:])
}
```

При INSERT используем ON CONFLICT DO NOTHING по unique index на fingerprint.

### 5. Envelope encryption для credentials

Токены брокеров, API-ключи бирж — чувствительные данные. Шифруем AES-256-GCM envelope:

- **KEK (Key Encryption Key):** 32-байтный мастер-ключ в env (`KEK_MASTER_V1`), с индикатором текущей версии `KEK_PRIMARY_ID`. Ротация — через добавление `KEK_MASTER_V2` и bump `KEK_PRIMARY_ID` без вайпа старых записей (они расшифровываются по своему `kek_id`).
- **DEK (Data Encryption Key):** 32 байта, генерится на каждую запись.
- **Nonce:** 12 байт для каждого AES-GCM (outer и inner — два отдельных nonce).

```go
// internal/crypto/envelope.go

// BYTEA blob format в БД (credentials_encrypted column):
// [kek_id (1 byte) || nonce_outer (12) || encrypted_dek (32+16 tag) || nonce_inner (12) || ciphertext || auth_tag (16)]

func Encrypt(plaintext []byte, kekPrimaryID byte, keks map[byte][]byte) ([]byte, error) {
    dek := randomBytes(32)
    nonceOuter := randomBytes(12)
    nonceInner := randomBytes(12)

    // outer: encrypt DEK with KEK
    encryptedDEK := aesGCMSeal(keks[kekPrimaryID], nonceOuter, dek, nil)

    // inner: encrypt plaintext with DEK
    ciphertext := aesGCMSeal(dek, nonceInner, plaintext, nil)

    return bytes.Join([][]byte{
        {kekPrimaryID},
        nonceOuter,
        encryptedDEK,
        nonceInner,
        ciphertext,
    }, nil), nil
}
```

**TD на миграцию в KMS/HSM** (записан): когда будет compliance-давление (SOC 2 type 2), переедем на AWS KMS для KEK. Сейчас env-KEK приемлем до public GA.

### 6. Tier-based authorization

Единый источник правды — shared Go module `internal/domain/tiers/limits.go`. Ни один handler не должен хардкодить строковое сравнение `user.Tier == "pro"` — это anti-pattern, ломается при rebranding тарифов и trial-экспериментах.

```go
// internal/domain/tiers/limits.go

type TierLimits struct {
    MaxAccounts             int
    MaxTransactionsPerMonth int
    AIMessagesPerDay        int
    AIMonthlyBudgetCents    int
    InsightsEnabled         bool
    InsightsPerWeek         int
    ExportsEnabled          bool     // см. TD-047 — P1 pre-GA
    CSVExport               bool     // TD-047 target: дискретный флаг
    AdvancedAnalytics       bool
    TaxReports              bool
}

func For(tier string) TierLimits {
    switch tier {
    case "pro":
        return TierLimits{MaxAccounts: -1, AIMessagesPerDay: 100, InsightsEnabled: true, ExportsEnabled: true, AdvancedAnalytics: true, TaxReports: true, ...}
    case "plus":
        return TierLimits{MaxAccounts: 10, AIMessagesPerDay: 20, InsightsEnabled: true, ExportsEnabled: true, ...}
    default: // free
        return TierLimits{MaxAccounts: 2, AIMessagesPerDay: 3, InsightsEnabled: false, ExportsEnabled: false, ...}
    }
}

// Middleware factory принимает функцию-предикат, не строку
func RequireTier(flag func(TierLimits) bool) fiber.Handler {
    return func(c *fiber.Ctx) error {
        user := c.Locals("user").(*User)
        limits := tiers.For(user.SubscriptionTier)
        if !flag(limits) {
            return httpError(c, 403, "TIER_LIMIT_EXCEEDED",
                "This feature requires an upgraded plan",
                map[string]string{"upgrade_url": "/pricing"})
        }
        return c.Next()
    }
}

// Использование:
app.Get("/portfolio/tax-report", AuthMiddleware,
    RequireTier(func(l TierLimits) bool { return l.TaxReports }),
    taxReportHandler)
```

**Anti-pattern (НЕ делаем):**

```go
// ❌ никогда
if user.Tier == "pro" { ... }
if user.HasTier("pro") { ... }

// ✅ всегда через tiers.For + предикат
if tiers.For(user.Tier).TaxReports { ... }
```

### 7. Rate limiting

Два уровня:
- **Global IP** через Cloudflare (не трогаем в коде)
- **Per user + endpoint** через Redis counter

```go
func RateLimit(key string, limit int, window time.Duration) fiber.Handler {
    return func(c *fiber.Ctx) error {
        user := c.Locals("user").(*User)
        redisKey := fmt.Sprintf("rl:%s:%s", key, user.ID)
        
        count, _ := redis.Incr(ctx, redisKey).Result()
        if count == 1 {
            redis.Expire(ctx, redisKey, window)
        }
        
        if int(count) > limit {
            return httpError(c, 429, "RATE_LIMIT_EXCEEDED", "Too many requests")
        }
        
        c.Set("X-RateLimit-Limit", strconv.Itoa(limit))
        c.Set("X-RateLimit-Remaining", strconv.Itoa(limit-int(count)))
        
        return c.Next()
    }
}
```

### 8. Stripe webhook handler

```go
func handleStripeWebhook(c *fiber.Ctx) error {
    payload := c.Body()
    signature := c.Get("Stripe-Signature")
    
    event, err := webhook.ConstructEvent(payload, signature, webhookSecret)
    if err != nil {
        return httpError(c, 400, "INVALID_SIGNATURE", "")
    }
    
    switch event.Type {
    case "customer.subscription.created", "customer.subscription.updated":
        updateUserSubscription(event)
    case "customer.subscription.deleted":
        downgradeToFree(event)
    case "invoice.payment_failed":
        notifyUser(event)
    }
    
    return c.SendStatus(200)
}
```

### 9. AI Chat proxy

Core API НЕ общается с Claude напрямую. Проксирует в AI Service с SSE-стримингом:

```go
func aiChatStream(c *fiber.Ctx) error {
    user := c.Locals("user").(*User)
    
    // Проверяем rate limit по тарифу
    if !checkAIRateLimit(user) {
        return httpError(c, 429, "AI_LIMIT_EXCEEDED", "")
    }
    
    // Стримим ответ от AI Service к клиенту
    c.Set("Content-Type", "text/event-stream")
    c.Set("Cache-Control", "no-cache")
    
    resp, _ := aiClient.StreamMessage(ctx, user.ID, message)
    defer resp.Body.Close()
    
    return c.SendStream(resp.Body)
}
```

### 10. Background jobs через asynq

API публикует задачи в очередь, воркеры их исполняют (TASK_06):

```go
func syncAccountHandler(c *fiber.Ctx) error {
    accountID := c.Params("id")
    
    task := asynq.NewTask("account:sync", []byte(accountID))
    _, err := asynqClient.Enqueue(task, asynq.MaxRetry(5))
    
    return c.JSON(fiber.Map{"queued": true})
}
```

## Definition of Done

- [ ] Все endpoints из OpenAPI спеки реализованы
- [ ] Valid JWT от Clerk принимается, invalid — 401
- [ ] Миграции применяются без ошибок на чистой БД
- [ ] sqlc генерирует запросы без ошибок
- [ ] Unit-тесты для всех бизнес-правил (portfolio calculation, fingerprint, encryption)
- [ ] Integration-тесты для всех handlers (с testcontainers Postgres)
- [ ] Rate limiting работает
- [ ] Tier-based authorization работает
- [ ] Stripe webhook проверен (dev-mode Stripe, triggering через `stripe trigger`)
- [ ] Sentry ловит необработанные ошибки
- [ ] Structured JSON логи со всех endpoint'ов
- [ ] Дашборд в Grafana с базовыми метриками (RPS, P95 latency, error rate)
- [ ] Docker image собирается, <50MB
- [ ] Деплоится на Fly.io, health check зелёный
- [ ] Нагрузочный тест: 500 RPS на /portfolio выдерживает с P95 < 200ms

## Тесты — что покрыть

Обязательно:
- Portfolio calculation (разные валюты, разные активы, edge cases)
- Fingerprint стабильность (те же входы → тот же выход)
- Encryption/decryption round-trip
- Tier authorization (free юзер не может получить pro endpoint)
- Rate limiting
- Transaction deduplication
- P&L calculation

Используем `testify` + `testcontainers-go` для Postgres в тестах.

## Важные решения

- **shopspring/decimal для всех денег** — никаких float64
- **UUID v7** для ID (не v4)
- **TIMESTAMPTZ** везде, храним в UTC, конвертируем на клиенте
- **pgx connection pool** настроен: 20-50 соединений на инстанс
- **Graceful shutdown** — ждём завершения текущих запросов перед остановкой
- **Context cancellation** — все запросы к БД и внешним сервисам с timeout

## Что НЕ делаем

- Не пишем tree-shakeable клиентов (Go компилируется в бинарник)
- Не используем ORM (sqlc + raw SQL — ясность важнее DSL)
- Не пишем сами очереди (asynq уже есть)
- Не используем GraphQL

## Deployment

- **Fly.io** в 2-3 регионах (близко к Постгресу — Neon или Supabase региональность)
- **2 инстанса минимум** (auto-scaling to 10 по CPU)
- **Health check** на `/health`
- **Prometheus metrics** на `/metrics`

## Следующие шаги

Когда готово:
- TASK_07 (Web) может использовать реальные endpoints
- TASK_08 (iOS) может использовать реальные endpoints
- TASK_05 (AI Service) использует Core API как источник портфельных данных
- TASK_06 (интеграции) публикует задачи и пишет в те же таблицы
