# TASK 06 — Broker Integrations & Workers

**Волна:** 3 (стартует после закрытия TASK_04: PR A / B1 / B2a / B2b / B2c / B3-i / B3-ii / B3-iii / C)
**Зависит от:** TASK_01, TASK_04 (Core API — где хранятся данные, `tiers.Limits` shared module, asynq task-types)
**Блокирует:** демонстрация реальных данных в TASK_07 (Web), TASK_08 (iOS)
**Срок:** 4-6 недель

**Inherits open TDs:** TD-039 (CSV export worker), TD-041 + TD-045 (hard_delete worker + undo re-check), TD-046 (aggregator clients).

## Цель

Подключение реальных брокерских счетов и криптобирж. Фоновая синхронизация.
Регулярное обновление рыночных цен. Эта часть делает из "калькулятора с
ручным вводом" — реальный продукт.

## Приоритетный список интеграций для MVP

### Через SnapTrade (агрегатор)
Одна интеграция даёт десятки брокеров:
- **США:** Interactive Brokers, Robinhood, Fidelity, Charles Schwab, E*TRADE
- **UK:** Trading212, Hargreaves Lansdown
- **Канада:** Questrade, Wealthsimple

### Прямые API (важно для Европы, где SnapTrade слабо)
- **Trading212** (если есть public API, иначе через SnapTrade)
- **Degiro** (нет API, откладываем — нужен парсинг CSV позже)
- **Revolut** (Open Banking API)

### Крипта (прямые API)
- **Binance** — самая популярная, read-only API keys
- **Coinbase** — для американских клиентов
- **Kraken** — для европейских клиентов

### Рыночные данные
- **Polygon.io** — акции и ETF (США)
- **CoinGecko** — крипта (бесплатный tier хорош)
- **ECB / openexchangerates** — валютные курсы

## Стек

- **Go 1.25+** (те же технологии, что Core API; `tiers.Limits` shared module + `internal/clients/asynqpub` task-types из Core API)
- **asynq** — задачи и воркеры
- **resty** или стандартный `net/http` — HTTP клиенты
- **snaptrade-go** или собственный wrapper над REST API SnapTrade
- **go-binance** для Binance
- **go-coinbase** для Coinbase (или свой wrapper)

## Структура

Воркеры живут в том же репозитории что Core API, отдельный бинарник:

```
apps/api/
├── cmd/
│   ├── api/main.go           # HTTP сервер (TASK_04)
│   └── worker/main.go        # ← воркер-процесс
├── internal/
│   ├── workers/
│   │   ├── account_sync.go       # синк счета
│   │   ├── price_update.go       # обновление цен
│   │   ├── snapshot_daily.go     # дневной снапшот
│   │   ├── insight_daily.go      # вызов AI для инсайтов
│   │   └── registry.go           # регистрация handlers
│   ├── integrations/
│   │   ├── snaptrade/
│   │   ├── binance/
│   │   ├── coinbase/
│   │   ├── polygon/
│   │   ├── coingecko/
│   │   └── ecb/
│   └── ...
```

## Ключевые воркеры

### 1. Account Sync Worker

Синхронизирует конкретный счёт с брокером.

```go
// workers/account_sync.go

func HandleAccountSync(ctx context.Context, t *asynq.Task) error {
    var payload AccountSyncPayload
    json.Unmarshal(t.Payload(), &payload)
    
    account := repo.GetAccount(ctx, payload.AccountID)
    
    // Получаем сделки из брокера
    transactions, err := fetchTransactionsByAccount(ctx, account)
    if err != nil {
        // asynq retry с экспоненциальным бэкоффом
        return err
    }
    
    // Дедупликация по fingerprint
    newTxns := filterNew(transactions, account.UserID)
    
    // Вставляем новые
    for _, txn := range newTxns {
        repo.InsertTransaction(ctx, txn)
    }
    
    // Пересчитываем positions
    positionCalc.RecomputeForAccount(ctx, account.ID)
    
    // Инвалидируем кеш портфеля
    cache.InvalidatePortfolio(ctx, account.UserID)
    
    // Обновляем last_synced_at
    repo.UpdateAccountSyncStatus(ctx, account.ID, "ok", nil)
    
    return nil
}
```

**Расписание:**
- Cron: каждый час для всех активных счетов
- On-demand: когда юзер жмёт "Sync now"
- On-connect: сразу после подключения счёта (импорт истории)

### 2. Price Update Worker

Обновляет рыночные цены для всех активных символов.

```go
func HandlePriceUpdate(ctx context.Context, t *asynq.Task) error {
    symbols := repo.GetActiveSymbols(ctx)  // все уникальные символы из positions
    
    stockSymbols := filterByType(symbols, "stock", "etf")
    cryptoSymbols := filterByType(symbols, "crypto")
    
    // Батчевый запрос
    stockPrices, _ := polygon.GetQuotesBatch(ctx, stockSymbols)
    cryptoPrices, _ := coingecko.GetPricesBatch(ctx, cryptoSymbols)
    
    // Сохраняем в Postgres (upsert)
    for _, p := range stockPrices { repo.UpsertPrice(ctx, p) }
    for _, p := range cryptoPrices { repo.UpsertPrice(ctx, p) }
    
    // Кешируем в Redis с TTL 60s
    cache.SetPrices(ctx, allPrices, 60*time.Second)
    
    return nil
}
```

**Расписание:** каждые 5 минут в рабочие часы рынка, каждые 15 минут ночью.

### 3. Daily Snapshot Worker

Дневной снапшот стоимости портфеля для графиков.

```go
func HandleDailySnapshot(ctx context.Context, t *asynq.Task) error {
    // Запускается один раз в 23:59 UTC
    
    users := repo.GetAllActiveUsers(ctx)
    
    for _, user := range users {
        portfolio := calc.ComputePortfolio(ctx, user.ID)
        
        snapshot := PortfolioSnapshot{
            UserID:        user.ID,
            Date:          time.Now().UTC(),
            TotalValueUSD: portfolio.TotalValueUSD,
            TotalCostUSD:  portfolio.TotalCostUSD,
            Allocation:    portfolio.AllocationJSON,
            ByAssetType:   portfolio.ByTypeJSON,
            ByCurrency:    portfolio.ByCurrencyJSON,
        }
        
        repo.InsertSnapshot(ctx, snapshot)
    }
    
    return nil
}
```

### 4. Daily Insights Worker

Вызывает AI Service для генерации инсайтов.

```go
func HandleDailyInsights(ctx context.Context, t *asynq.Task) error {
    // Запускается раз в день
    
    users := repo.GetUsersWithInsightsTier(ctx)  // Plus и Pro
    
    for _, user := range users {
        insights, err := aiClient.GenerateInsights(ctx, user.ID)
        if err != nil {
            log.Error().Err(err).Str("user_id", user.ID).Send()
            continue
        }
        
        for _, insight := range insights {
            repo.InsertInsight(ctx, insight)
        }
        
        // Опционально: push-уведомление если есть critical
        if hasCritical(insights) {
            pushNotification(user, "New insight about your portfolio")
        }
    }
    
    return nil
}
```

## Интеграции — детали

### SnapTrade

```go
// integrations/snaptrade/client.go

type Client struct {
    clientID      string
    consumerKey   string
    http          *http.Client
}

// RegisterUser — SnapTrade требует регистрации юзера в их системе
func (c *Client) RegisterUser(ctx context.Context, userID string) (*SnapUser, error)

// GetConnectionURL — возвращает OAuth URL, на который редиректим юзера
func (c *Client) GetConnectionURL(ctx context.Context, userID string) (string, error)

// ListAccounts — список подключённых счетов юзера
func (c *Client) ListAccounts(ctx context.Context, userID string) ([]Account, error)

// GetTransactions — все сделки по счёту
func (c *Client) GetTransactions(ctx context.Context, userID string, accountID string, from time.Time) ([]Transaction, error)

// GetHoldings — текущие позиции (для верификации)
func (c *Client) GetHoldings(ctx context.Context, userID string, accountID string) ([]Holding, error)
```

**Нюансы:**
- SnapTrade ID юзера ≠ наш user_id. Маппинг храним в accounts.external_account_id
- Secrets в SnapTrade (их userSecret) — шифруем в нашей БД
- Rate limits есть, встроить retry с экспоненциальным бэкоффом

### Binance

```go
// integrations/binance/client.go

type Client struct {
    apiKey    string
    apiSecret string
    http      *http.Client
}

// GetAccount — балансы
func (c *Client) GetAccount(ctx context.Context) (*Account, error)

// GetMyTrades — исполненные сделки по символу
func (c *Client) GetMyTrades(ctx context.Context, symbol string, from time.Time) ([]Trade, error)

// GetDepositHistory — депозиты (для transfers)
func (c *Client) GetDepositHistory(ctx context.Context, from time.Time) ([]Deposit, error)
```

**Нюансы:**
- Binance API keys — **read-only**. Юзер создаёт в своём аккаунте и вставляет. НЕ OAuth.
- API secret — шифруем envelope encryption
- Rate limit 1200 запросов/мин по весам
- Хранить server timestamp offset (Binance строгий по времени)

### Polygon.io (акции)

```go
// integrations/polygon/client.go

// GetLatestQuote — последняя цена
func (c *Client) GetLatestQuote(ctx context.Context, symbol string) (*Quote, error)

// GetQuotesBatch — батчевый запрос (до 100 символов)
func (c *Client) GetQuotesBatch(ctx context.Context, symbols []string) ([]Quote, error)

// GetHistoricalBars — свечи для исторических графиков
func (c *Client) GetHistoricalBars(ctx context.Context, symbol string, from, to time.Time, interval string) ([]Bar, error)

// GetDividends — дивиденды (для календаря)
func (c *Client) GetDividends(ctx context.Context, symbol string) ([]Dividend, error)
```

**Тариф:** стартуем с Starter ($29/мес) = 100 req/min. Хватит на первые сотни юзеров.

### CoinGecko (крипта)

Free tier: 10-50 req/min. Premium с $129/мес.

```go
// GetPricesBatch — батч цен (по ID: "bitcoin", "ethereum")
func (c *Client) GetPricesBatch(ctx context.Context, coinIDs []string, currencies []string) (map[string]map[string]float64, error)

// GetHistoricalData — исторические цены
func (c *Client) GetHistoricalData(ctx context.Context, coinID string, days int) (*Chart, error)
```

**Нюанс:** CoinGecko использует свои ID (`bitcoin`, `ethereum`), не тикеры.
Нужен маппинг symbol → coingecko_id.

## Reliability patterns

### 1. Retry с экспоненциальным бэкоффом

asynq поддерживает это из коробки:
```go
asynqClient.Enqueue(task, asynq.MaxRetry(5), asynq.Retention(7*24*time.Hour))
```

### 2. Circuit breaker для внешних API

Когда брокер отвечает с ошибками подряд — не бомбим его запросами.
Используем `sony/gobreaker`.

### 3. Idempotency

Все воркеры идемпотентны. Двойной вызов = то же состояние.
Обеспечивается fingerprint-дедупликацией на уровне БД.

### 4. Outbox pattern для критичных операций

При подключении счёта:
1. В транзакции: создаём account + запись в outbox
2. Outbox-воркер читает запись и вызывает SnapTrade
3. Если SnapTrade недоступен — ретраим

### 5. Graceful degradation

Если Polygon лежит — показываем вчерашние цены с badge "stale".
Лучше показать устаревшее, чем ошибку.

## Конкурентное выполнение

Go = конкурентность дешёвая. Воркер обрабатывает 50-100 юзеров параллельно:

```go
sem := semaphore.NewWeighted(50)

for _, user := range users {
    sem.Acquire(ctx, 1)
    go func(u User) {
        defer sem.Release(1)
        syncUser(ctx, u)
    }(user)
}
```

## Мониторинг

Метрики (Prometheus):
- `sync_duration_seconds{broker=..., status=ok/error}`
- `sync_transactions_imported_total{broker=...}`
- `external_api_calls_total{service=..., status=...}`
- `queue_depth{queue=account_sync}` (задач в очереди)

Dashboards в Grafana: ошибки по брокерам, длительность синков, размер очереди.

## Definition of Done

- [ ] SnapTrade интеграция работает: OAuth-флоу → счёт подключён → сделки импортированы
- [ ] Binance: юзер вводит API keys, сделки подтягиваются
- [ ] Coinbase: как Binance
- [ ] Polygon: цены обновляются для всех активных акций
- [ ] CoinGecko: цены обновляются для всей крипты
- [ ] ECB: FX-курсы обновляются раз в день
- [ ] Fingerprint-дедупликация работает (двойной импорт не даёт дубликатов)
- [ ] Source priority при конфликте (API > import > manual)
- [ ] Дневные снапшоты создаются для всех активных юзеров
- [ ] Воркер масштабируется: 1000 юзеров синхронизируется за <10 минут
- [ ] Circuit breaker работает (тестируется падением dependency)
- [ ] Sentry ловит ошибки с user_id контекстом
- [ ] Graceful shutdown: in-flight задачи дописываются до остановки
- [ ] Integration tests с мок-серверами для всех интеграций
- [ ] Дашборд в Grafana для мониторинга синков

## Безопасность

**Критично для этого таска:**

1. **API keys брокеров** — envelope encryption, никогда не логируем
2. **Read-only доступ** — никогда не запрашиваем trading permissions
3. **Минимальные scopes** — просим только нужное
4. **Rate limit на нашей стороне** — защита от компрометации ключей
5. **Уведомление при добавлении счёта** — email юзеру
6. **Периодическая валидация токенов** — если брокер отозвал доступ, уведомляем

## Важные решения

- **SnapTrade первым** — один интеграция = много брокеров. Начинаем с него.
- **Прямые API для крипты** — биржи дают хорошие API, агрегатор не нужен
- **Batch-запросы везде** — один запрос на 100 символов, а не 100 запросов
- **Hourly sync — достаточно для MVP** — никто не трейдит HFT через наш трекер
- **Webhook-based sync добавим в v2** — когда брокеры поддерживают

## Что НЕ делаем

- Не поддерживаем real-time trade streaming (hourly sync достаточно)
- Не делаем свой API-агрегатор "как SnapTrade" (нам хватит их)
- Не парсим PDF-выписки на MVP (Import AI — v2)
- Не добавляем 20 брокеров сразу — 5-7 на MVP

## Следующие шаги

Когда готово:
- Реальные данные видны в TASK_07 (Web) и TASK_08 (iOS)
- TASK_05 (AI Service) может давать релевантные ответы на реальных данных
- Можно звать beta-тестеров — есть что показать
