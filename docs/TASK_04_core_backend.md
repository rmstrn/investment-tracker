# TASK 04 — Core Backend API (Go)

**Status:** 🚧 IN PROGRESS — PR A ✅ merged (PR #35 → `14f95468`). PR B1 ✅ merged (PR #36 → `462d2993`) — TD-013 closed. PR B2a ✅ merged (PR #37 → `272e5fe6`) — TD-025 closed. PR B2b ✅ merged (PR #38 → `fdcf39f4`). PR B2c ✅ merged (PR #39 → `fb16525`, 2026-04-19) — analytics + tax domain modules, X-Tax-Advisory compliance header, 7 new TDs (31-37) + TD-038. **Read path is now closed end-to-end: 30 GET endpoints (28 authenticated + 2 public glossary) under full cross-handler AI-auth coverage.** PR B3 starting (mutations + webhooks + SSE + async — closes TD-021 and TD-027).
**Volна:** 2
**Зависит от:** TASK_01 (monorepo), TASK_03 (API contract + DB schema)
**Блокирует:** TASK_05 (AI Service нужны портфельные данные), TASK_06 (интеграции), TASK_07 (Web), TASK_08 (iOS)
**Срок:** 4-6 недель (параллельно с другими)

**PR plan:**
- **PR A (foundation)** — config+logger+Fiber, sqlc+queries, oapi-codegen+TD-007 preprocessor, Clerk auth+user repo+errors, Redis cache+rate-limit+idempotency, AES-GCM envelope, fingerprint+portfolio calculator. No handlers. ✅ **merged as PR #35 → `14f95468`** (12 commits squashed, 8/8 CI green, no admin bypass).
- **PR B — split into B1/B2/B3:**
  - **PR B1 (AI Service unblock)** — ✅ **merged as PR #36 → `462d2993`** (11 commits: migration + sqlc + dual-mode auth + UUIDv7 request-id + Sentry + handler + unit + integration + 3 chore CI fixes). Closes TD-013 on Core API side. New TD-019 entered (integration tests not in CI). Follow-up: AI Service flip 404-swallow in `apps/ai/src/ai_service/clients/core_api.py` — separate PR in apps/ai, non-blocking.
  - **PR B2a (foundation + 6 AI-facing GETs)** — ✅ **merged as PR #37 → `272e5fe6`** (16 commits: commit 0 fail-fast JWKS + 4 foundation + 6 AI-facing GETs + cross-handler AI-auth test + gosec silence + 3 pre-merge fixes: benchmark nullable openapi spec, `?display_currency=` rename, `errs.ErrQuoteNotAvailable` sentinel). Closed TD-025 pre-merge. New TD-020/021/022/024 entered.
  - **PR B2b (rest of read path)** — ✅ **merged as PR #38 → `fdcf39f4`** (18 commits: 20 handlers across 8 domain groups — `/me*` ×6, `/accounts*` ×3, detail GETs ×3, portfolio history/allocation/performance-compare ×3, market search/history ×2, plumbing `/fx_rates`+`/prices`, AI conversations/insights ×3, glossary ×2 — + extended cross-handler AI-auth test + gosec G109 silence). Scope landed at ~3700 LOC (vs 1700-1800 est — integration test per endpoint doubled volume, accepted pattern from B2a). Scope-adjacent: 14 new sqlc queries, nullable openapi fix for `PortfolioPerformanceBenchmark` (same pattern as PR #37, parallel to TD-020), new `internal/domain/tiers/limits.go` shared per-tier caps module (reads + B3 mutation gates), `/glossary*` mounted outside authenticated group per `security: []` spec. 14 stubs/degraded responses all signal via response headers (`X-Clerk-Unavailable`, `X-Search-Provider`, `X-Benchmark-Unavailable`) or explicit 501 NOT_IMPLEMENTED — no placeholder data anywhere. New TD entered: TD-027 (Clerk Backend SDK for sessions), TD-028 (monthly rollup for best_month/worst_month), TD-029 (symbol-master provider for `/market/search`), TD-030 (OHLC ingest pipeline — `/market/history` returns 501 with working validation).
  - **PR B2c (analytics + tax domain)** — ✅ **merged as PR #39 → `fb16525`** (7 commits + pre-merge compliance fix `ce23519` for `X-Tax-Advisory: mvp-estimate` header, 8/8 CI green, no admin bypass). Spec-compliant (period enum `3m/6m/1y/3y/all`, tax params `jurisdiction + year` — cost-basis method became internal detail per spec). `internal/domain/analytics/` — pure Sharpe/Sortino/MaxDD/Volatility/underwater_series. `internal/domain/tax/` — FIFO hardcoded in handler, LIFO in pkg for future. Pro-only via `tiers.Limit.AdvancedAnalytics` + `tiers.Limit.TaxReports`. US + DE jurisdictions; others → 400 `JURISDICTION_NOT_SUPPORTED`. Scope-cuts signal via `X-Analytics-Partial` + `X-Withholding-Unavailable` headers + openapi nullable fields (same pattern as PR #37 benchmark, PR #38 performance). ~1600 LOC (~7% overshoot). New TDs 31-37 + TD-038 (ListAllTransactionsByUser unbounded).
  - **PR B3 — split into B3-i/B3-ii/B3-iii** (per DECISIONS 2026-04-19 "PR B3 split by coherent surface"). Pre-flight scope audit: 36 mutation endpoints + 5 deferred GETs + 3 infra blocks (SSE proxy, Clerk+SDK, Stripe+SDK) + asynq publisher + TD-011 close. One-PR was ~5500-6500 LOC / 40-50 commits — unreviewable.
    - **PR B3-i (Data-path + asynq, ~2200 LOC)** — 19 handlers: accounts mutations (7: POST, PATCH/DELETE /{id}, POST /{id}/sync|reconnect|pause|resume), transactions (3: POST, PATCH/DELETE /{id}), /me data mutations (5: PATCH/DELETE /me, POST /paywalls/{t}/dismiss, POST /undo-deletion, PATCH /notification-preferences), notifications reads (2: GET list + unread_count), exports (1 GET /{id} + 1 POST async 202 stub). Infra: asynq publisher thin wrapper + deps wire-in, SETNX idempotency lock middleware with 30s TTL + 409 `IDEMPOTENCY_IN_PROGRESS`. Closes **TD-011** (idempotency race) and **TD-021** (asynq publisher). Expected new TDs: TD-039 (CSV export worker consumer — handler ships 202 stub), TD-041 (hard_delete_user consumer for DELETE /me 7-day delayed purge), TD-045 (undo-deletion worker idempotency re-check).
    - **PR B3-ii (AI bundle, ~1400 LOC)** — 7 handlers: ai conversations POST+DELETE (2), `POST /ai/chat` (JSON response), `POST /ai/chat/stream` (SSE reverse-proxy to AI Service via `httputil.ReverseProxy` with `FlushInterval: -1`, token flow = Clerk JWT in → internal Bearer + `X-User-Id` out), `POST /ai/insights/generate`, `POST /ai/insights/{id}/dismiss`, `POST /ai/insights/{id}/viewed`. Tier rate-limits via `tiers.Limit.AIMessagesPerDay` + `InsightsPerWeek`. Backpressure through shared `context.Context`; AI Service error framing protocol confirmed pre-start. Expected new TDs: TD-040 (SSE reconnect/resume event-ID replay — MVP fail-fast on disconnect), TD-044 (concurrent AI chat cap per user — currently 10 tabs = 10 parallel Claude streams).
    - **PR B3-iii (Auth + billing, ~2400 LOC)** — 11 mutation handlers + 2 webhooks + 2 billing GETs: /me/2fa enroll/verify/disable + backup-codes/regenerate (4), DELETE /me/sessions/{id} + /me/sessions/others (2), billing checkout + portal + cancellation-feedback (3), GET /billing/subscription + /billing/invoices (2), POST /auth/webhook (Clerk via Svix library with `svix-id`+`svix-timestamp`+`svix-signature` HMAC-SHA256 + 5-min tolerance, events: user.{created,updated,deleted} handled, session.{created,revoked} skip-200 + TD, org/role.* skip-200), POST /billing/webhook (Stripe via stripe-go webhook package, events: customer.subscription.{created,updated,deleted} + invoice.payment_{succeeded,failed} + checkout.session.completed). Infra: Clerk Backend SDK wire-up + Stripe SDK wire-up + `webhook_events(source, event_id)` migration for idempotency. Closes **TD-027** (Clerk Backend SDK — enables real /me/sessions list via SDK). Expected new TDs: TD-042 (Stripe invoice.payment_failed notification wiring — needs notifications mutation pipeline not in B3-iii scope), TD-043 (2FA backup codes storage — Clerk SDK self-hosted vs managed will decide).
    - **Sequential merge ordering is hard:** B3-ii depends on B3-i's idempotency middleware + asynq pattern landing first; B3-iii depends on both (shared DB namespace for `webhook_events` migration). No parallel feature branches.
- **PR C (ops)** — Dockerfile (<50MB distroless), fly.toml, k6 load-test script, deploy runbook.

**Follow-ups tracked:** `TECH_DEBT.md` → TD-007 (oapi-codegen 3.1 nullable), TD-011 (idempotency race), TD-018 (KEK rotation uncovered by test), TD-019 (integration tests not in CI), TD-020 (benchmark ingest), TD-021 (asynq publisher wire-in — closes in B3), TD-022 (dividends/corporate_actions table), TD-024 (previous_close modeling), TD-027 (Clerk Backend SDK — closes in B3), TD-028 (monthly rollup best/worst month), TD-029 (symbol-master provider), TD-030 (OHLC ingest pipeline), TD-031 (withholding_amount per-tx schema), TD-032 (factor-model + style feeds), TD-033 (correlation_matrix from prices — depends on TD-030), TD-034 (cost-basis method UI + tax_lots migration), TD-035 (IT/FR/UK/PL/ES/NL jurisdictions), TD-036 (full tax rule set incl wash-sale, long/short split, DE couples), TD-037 (short-sale / uncovered-qty handling), TD-038 (paginate/stream ListAllTransactionsByUser). `DECISIONS.md` → 2026-04-19 entries for oapi-codegen vs huma, Go 1.25, go-tool deps, preprocessor, idempotency plumbing, portfolio pure function, Core API dual-mode auth, AI usage telemetry, tiers.limits as shared per-tier caps module.

## Цель

Реализовать основной REST API на Go. Это "мозги" приложения:
аутентификация, портфель, сделки, подписки. Должен быть быстрым, надёжным
и правильно обрабатывать деньги и чувствительные данные.

## Стек

- **Go 1.25** — hard floor (Fiber v3.1.0 requirement); see DECISIONS 2026-04-19 "Go 1.25 as minimum version"
- **Fiber v3** — web framework
- **oapi-codegen** — server interfaces + types from `openapi.yaml` (spec-first; huma is out, see DECISIONS 2026-04-19 "Core API: spec-first via oapi-codegen")
- **sqlc** — типобезопасные запросы из SQL
- **pgx v5** — Postgres driver
- **goose** — миграции (запускается отдельно)
- **asynq** — публикация задач в очередь (для workers)
- **go-playground/validator v10** — валидация структур
- **zerolog** — structured logging
- **go-redis/v9** — Redis client
- **jwt-go v5** — JWT валидация (для Clerk)

**Tooling via `go tool`:** `sqlc` and `oapi-codegen` pinned in `go.mod` / `go.sum`, invoked as `go tool sqlc generate` / `go tool oapi-codegen`. No PATH installs. (DECISIONS 2026-04-19.)

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

### 2b. Internal-caller auth mode (for AI Service)

The same middleware also accepts internal callers (currently just the AI
Service) for tool-execution requests to the public endpoints. Distinguished by
the token value:

```go
// Inside AuthMiddleware, before Clerk JWT parse:
if token == cfg.CoreAPIInternalToken {
    userIDStr := c.Get("X-User-Id")
    if userIDStr == "" {
        return httpError(c, 401, "MISSING_USER_ID", "X-User-Id header required for internal caller")
    }
    userID, err := uuid.Parse(userIDStr)
    if err != nil {
        return httpError(c, 401, "INVALID_USER_ID", "X-User-Id must be a valid UUID")
    }
    user, err := userRepo.GetByID(userID)
    if err != nil {
        return httpError(c, 404, "USER_NOT_FOUND", "")
    }
    c.Locals("user", user)
    c.Locals("caller", "internal")   // for audit logging
    return c.Next()
}
// else fall through to Clerk JWT validation
```

Result: handlers are agnostic to caller type — tier middleware, rate limits,
and repository code all use `c.Locals("user")` identically. The `caller`
local lets us tag audit logs / metrics with "internal" for traceability.

Config: `CORE_API_INTERNAL_TOKEN` is a ≥32-byte random string, stored in
Doppler, shared only with the AI Service deployment.

(See DECISIONS 2026-04-19 "Core API ↔ AI Service auth: dual-mode middleware".)

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

Токены брокеров, API-ключи бирж — чувствительные данные. Шифруем **AES-256-GCM** envelope (см. `02_ARCHITECTURE.md` секция «5. Encryption at rest для credentials» — полный формат BYTEA blob):

```go
// internal/crypto/envelope.go

// KEK (Key Encryption Key) — 256-bit, из env: KEK_MASTER_V1 + KEK_PRIMARY_ID.
// На MVP одна версия ключа. Ротация = добавить KEK_MASTER_V2 и ре-энкрипт существующих записей.
// DEK (Data Encryption Key) — генерится случайно per credential, шифруется KEK через AES-256-GCM.

func Encrypt(plaintext []byte, kek []byte) ([]byte, error) {
    dek := generateDEK(32)
    ciphertext := aesGCMEncrypt(plaintext, dek)
    encryptedDEK := aesGCMEncrypt(dek, kek)
    // BYTEA blob: [kek_id || nonce_outer || encrypted_dek || nonce_inner || ciphertext || auth_tag]
    return combine(encryptedDEK, ciphertext), nil
}
```

Плейнтекст декодируется только в памяти воркера в момент HTTP-вызова брокера — никогда не пишется в лог. В MVP KEK хранится в Doppler/env; перевод на AWS KMS / GCP KMS отложен в TD (infra-hardening после MVP).

### 6. Tier-based authorization

Все гейтинг-решения (feature flags + численные caps) идут через единый модуль **`internal/domain/tiers/limits.go`** (см. DECISIONS 2026-04-19 «`internal/domain/tiers/limits.go` as shared per-tier caps module»). Это shared источник правды для read-path (gating) и write-path (mutation caps) — изменил число в одном месте, везде согласовано.

```go
// internal/domain/tiers/limits.go
type TierLimits struct {
    MaxAccounts            int
    MaxTransactionsPerMonth int
    AIMessagesPerDay       int
    AIMonthlyBudgetCents   int
    InsightsEnabled        bool
    InsightsPerWeek        int
    ExportsEnabled         bool
    AdvancedAnalytics      bool      // Sharpe/Sortino/MaxDD — B2c
    TaxReports             bool      // FIFO/LIFO realized gains — B2c
}

func For(tier string) TierLimits { /* free | plus | pro */ }

// Middleware:
func RequireTier(flag func(TierLimits) bool) fiber.Handler {
    return func(c *fiber.Ctx) error {
        user := c.Locals("user").(*User)
        if !flag(tiers.For(user.SubscriptionTier)) {
            return httpError(c, 403, "TIER_LIMIT_EXCEEDED",
                "This feature requires a higher tier",
                map[string]string{"upgrade_url": "/pricing"})
        }
        return c.Next()
    }
}

// Использование:
app.Get("/portfolio/tax-report", AuthMiddleware, RequireTier(func(l TierLimits) bool { return l.TaxReports }), taxReportHandler)
```

**Важно:** не хардкодить строковое сравнение `user.Tier == "pro"` в handler-ах — всё через `tiers.For(tier).<Flag>`. Тесты tier-авторизации тоже читают из этого же модуля.

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

### 9b. AI usage telemetry endpoint (`POST /internal/ai/usage`)

Internal-only endpoint that AI Service calls after each Claude API call.
Writes usage to `ai_usage` table and updates `usage_counters` (used by the
AI rate-limit tier middleware).

Route: `POST /internal/ai/usage` — gated by internal-caller mode from §2b
(no Clerk JWT, requires `CORE_API_INTERNAL_TOKEN` + `X-User-Id`).

Request body:

```json
{
  "user_id": "uuid",
  "conversation_id": "uuid",
  "input_tokens": 1234,
  "output_tokens": 567,
  "cost_usd": "0.0042",
  "model": "claude-sonnet-4-6"
}
```

Handler:

```go
func recordAIUsage(c *fiber.Ctx) error {
    // Middleware already validated internal token + set X-User-Id on locals
    var body AIUsageRequest
    if err := c.BodyParser(&body); err != nil {
        return httpError(c, 400, "INVALID_REQUEST", err.Error())
    }
    
    // Write to ai_usage table (append-only)
    if err := aiUsageRepo.Insert(ctx, body); err != nil {
        return httpError(c, 500, "INTERNAL_ERROR", "")
    }
    
    // Bump rolling counter (key: usage:ai:{user_id}:{YYYY-MM-DD})
    if err := usageCounter.IncrAI(ctx, body.UserID, body.InputTokens+body.OutputTokens); err != nil {
        // Non-fatal — log and continue
        log.Warn().Err(err).Msg("failed to bump ai usage counter")
    }
    
    return c.SendStatus(202)   // accepted
}
```

Note: `202 Accepted` (not `200`) — signals fire-and-forget semantics, AI
Service shouldn't block on the write.

Schema: `ai_usage` table should already exist from TASK_03 migrations;
verify in PR B and add if missing. `usage_counters` updates use the same
Redis counter key pattern as AI rate limiting (§7).

(See DECISIONS 2026-04-19 "AI usage telemetry via dedicated internal endpoint".)

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
