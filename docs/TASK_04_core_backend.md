# TASK 04 — Core Backend API (Go)

**Волна:** 2
**Зависит от:** TASK_01 (monorepo), TASK_03 (API contract + DB schema)
**Блокирует:** TASK_05 (AI Service нужны портфельные данные), TASK_06 (интеграции), TASK_07 (Web), TASK_08 (iOS)
**Срок:** 4-6 недель (параллельно с другими)

## Цель

Реализовать основной REST API на Go. Это "мозги" приложения:
аутентификация, портфель, сделки, подписки. Должен быть быстрым, надёжным
и правильно обрабатывать деньги и чувствительные данные.

## Стек

- **Go 1.23+**
- **Fiber v3** — web framework
- **huma v2** — auto-OpenAPI + валидация
- **sqlc** — типобезопасные запросы из SQL
- **pgx v5** — Postgres driver
- **goose** — миграции (запускается отдельно)
- **asynq** — публикация задач в очередь (для workers)
- **go-playground/validator v10** — валидация структур
- **zerolog** — structured logging
- **go-redis/v9** — Redis client
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

Токены брокеров, API-ключи бирж — чувствительные данные. Шифруем:

```go
// internal/crypto/envelope.go

// KEK (Key Encryption Key) в ENV/Doppler, один на проект
// DEK (Data Encryption Key) генерится на каждую запись и шифруется KEK

func Encrypt(plaintext []byte, kek []byte) ([]byte, error) {
    dek := generateDEK(32)
    ciphertext := aesGCMEncrypt(plaintext, dek)
    encryptedDEK := aesGCMEncrypt(dek, kek)
    return combine(encryptedDEK, ciphertext), nil
}
```

В проде KEK храним в AWS KMS. В MVP — в Doppler.

### 6. Tier-based authorization

Middleware проверяет тариф перед определёнными endpoints:

```go
func RequireTier(tier string) fiber.Handler {
    return func(c *fiber.Ctx) error {
        user := c.Locals("user").(*User)
        if !user.HasTier(tier) {
            return httpError(c, 403, "TIER_LIMIT_EXCEEDED", 
                "This feature requires "+tier+" tier", 
                map[string]string{"upgrade_url": "/pricing"})
        }
        return c.Next()
    }
}

// Использование:
app.Get("/portfolio/tax-report", AuthMiddleware, RequireTier("pro"), taxReportHandler)
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
