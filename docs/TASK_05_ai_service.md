# TASK 05 — AI Service (Python)

**Status:** ✅ COMPLETED (2026-04-19)
**Merged:** PR #34 (1d46ed9)
**Follow-ups tracked:** `TECH_DEBT.md` → TD-013 (record_ai_usage stub), TD-014 (allocation_drift proxy), TD-015 (in-memory rate limit), TD-016 (SDK mocks), TD-017 (LLM JSON parsing).
**Integration gap:** end-to-end test against live Core API deferred until TASK_04 PR B merges (adds `/internal/ai/usage` endpoint and internal auth mode).

**Волна:** 2
**Зависит от:** TASK_01, TASK_03, TASK_04 (нужен Core API для чтения данных)
**Блокирует:** AI-фичи в TASK_07 (Web) и TASK_08 (iOS)
**Срок:** 3-4 недели

## Цель

Отдельный микросервис на Python для всего, что связано с LLM. Общается с
Claude, имеет доступ к портфелю пользователя через tool calling, стримит
ответы обратно через Core API.

## Почему отдельный сервис

- Python-экосистема для ИИ несравнимо богаче Go
- LLM-запросы медленные (2-10s) — не хотим забивать Go-поток
- Масштабируется независимо
- Если упадёт — основное приложение работает

## Стек

- **Python 3.13**
- **FastAPI** — async, auto-docs
- **Pydantic v2** — схемы
- **Anthropic SDK** — Claude API
- **httpx** — HTTP клиент к Core API
- **uv** — package manager
- **ruff** + **mypy** — линтинг и types
- **pytest** + **pytest-asyncio** — тесты
- **structlog** — structured logging
- **LangGraph** (опционально) — если понадобятся multi-step агенты

## Структура

```
apps/ai/
├── pyproject.toml
├── uv.lock
├── src/
│   └── ai_service/
│       ├── __init__.py
│       ├── main.py                 # FastAPI app
│       ├── config.py               # settings
│       ├── api/
│       │   ├── chat.py             # /chat endpoints
│       │   ├── insights.py         # /insights endpoints
│       │   └── auth.py             # internal auth middleware
│       ├── agents/
│       │   ├── chat_agent.py       # основной chat агент
│       │   ├── insight_generator.py # генератор инсайтов
│       │   └── behavioral_coach.py # паттерны поведения
│       ├── tools/
│       │   ├── portfolio.py        # tools для доступа к данным
│       │   ├── market.py           # tools для рыночных данных
│       │   └── registry.py         # общий реестр
│       ├── llm/
│       │   ├── client.py           # Anthropic wrapper
│       │   ├── prompts.py          # системные промпты
│       │   └── streaming.py        # SSE streaming utils
│       ├── clients/
│       │   └── core_api.py         # HTTP клиент к Core API
│       └── models.py               # Pydantic схемы
├── tests/
└── Dockerfile
```

## Ключевые компоненты

### 1. Chat Agent

Основная логика AI Chat. Claude с tool calling имеет доступ к портфелю
пользователя.

```python
# agents/chat_agent.py

SYSTEM_PROMPT = """You are a helpful AI assistant for an investment portfolio 
tracker. You help users understand their investments, but you DO NOT give 
financial advice or make trade recommendations.

You have tools to access the user's portfolio, positions, and market data.
Use them when needed to answer questions accurately.

Rules:
- Never predict prices or recommend buy/sell
- Always cite data sources when making claims
- If unsure, say so — don't hallucinate
- Be concise; users want clear answers
- If user asks for financial advice, redirect: explain you can share facts 
  but can't advise
"""

async def chat_stream(
    user_id: UUID,
    conversation_id: UUID,
    user_message: str,
) -> AsyncIterator[StreamEvent]:
    history = await get_conversation_history(conversation_id)
    
    async with anthropic.messages.stream(
        model="claude-sonnet-4-5",
        system=SYSTEM_PROMPT,
        messages=[*history, {"role": "user", "content": user_message}],
        tools=PORTFOLIO_TOOLS,
        max_tokens=2048,
    ) as stream:
        async for event in stream:
            if event.type == "content_block_delta":
                yield StreamEvent(type="text", content=event.delta.text)
            elif event.type == "tool_use":
                result = await execute_tool(event.name, event.input, user_id)
                # рекурсивно продолжаем со встроенным результатом
                ...
```

### 2. Tools для Claude

Claude вызывает эти tools чтобы получить данные портфеля:

```python
# tools/portfolio.py

PORTFOLIO_TOOLS = [
    {
        "name": "get_portfolio_snapshot",
        "description": "Get current portfolio total value, P&L, and allocation",
        "input_schema": {
            "type": "object",
            "properties": {
                "currency": {
                    "type": "string",
                    "description": "Display currency (default: user's preferred)"
                }
            }
        }
    },
    {
        "name": "get_positions",
        "description": "List all current positions with prices and P&L",
        "input_schema": {
            "type": "object",
            "properties": {
                "sort_by": {"enum": ["value", "pnl", "symbol"]},
                "filter_asset_type": {"enum": ["stock", "etf", "crypto"]}
            }
        }
    },
    {
        "name": "get_transaction_history",
        "description": "Get transaction history for a symbol or all",
        "input_schema": {
            "type": "object",
            "properties": {
                "symbol": {"type": "string"},
                "from_date": {"type": "string", "format": "date"},
                "to_date": {"type": "string", "format": "date"},
                "limit": {"type": "integer", "default": 50}
            }
        }
    },
    {
        "name": "get_performance",
        "description": "Get performance over a period with benchmark comparison",
        "input_schema": {
            "type": "object",
            "properties": {
                "period": {"enum": ["1w", "1m", "3m", "6m", "1y", "all"]},
                "benchmark": {"enum": ["SPX", "QQQ", "BTC"]}
            }
        }
    },
    {
        "name": "get_market_quote",
        "description": "Get current quote for a symbol",
        "input_schema": {
            "type": "object",
            "properties": {
                "symbol": {"type": "string"}
            },
            "required": ["symbol"]
        }
    }
]

async def execute_tool(tool_name: str, inputs: dict, user_id: UUID) -> dict:
    client = CoreAPIClient()
    
    match tool_name:
        case "get_portfolio_snapshot":
            return await client.get_portfolio(user_id, inputs.get("currency"))
        case "get_positions":
            return await client.get_positions(user_id, **inputs)
        # ...
```

### 3. Системные промпты

Отдельный файл `llm/prompts.py` с промптами для разных use cases:

```python
CHAT_SYSTEM_PROMPT = "..."  # описан выше

INSIGHT_GENERATION_PROMPT = """You're analyzing {user}'s portfolio for this week.
Generate up to 3 insights that are:
- SPECIFIC (mention actual positions/numbers, not generic tips)
- ACTIONABLE (user can do something with this info)
- CALM (no scare tactics, no FOMO)

Portfolio data:
{portfolio_data}

Transaction history:
{transactions}

Output JSON with this schema: ..."""

BEHAVIORAL_PATTERN_PROMPT = """Analyze these transactions for behavioral 
patterns that might hurt long-term returns:
- Buying on local highs
- Selling on panic
- Over-trading
- FOMO purchases
- Tax-inefficient moves
..."""
```

### 4. Proactive Insights generator

Запускается воркером раз в день:

```python
# agents/insight_generator.py

INSIGHT_TYPES = [
    "concentration_risk",       # переконцентрация
    "behavioral_pattern",        # поведенческий
    "upcoming_dividend",         # приближающиеся дивиденды
    "performance_anomaly",       # необычное движение
    "allocation_drift",          # отклонение от целевой аллокации
]

async def generate_daily_insights(user_id: UUID) -> list[Insight]:
    portfolio = await core_api.get_portfolio(user_id)
    transactions = await core_api.get_recent_transactions(user_id, days=30)
    
    insights = []
    
    # Rule-based pre-filtering — не всегда зовём LLM
    if is_concentrated(portfolio):
        insight = await generate_concentration_insight(portfolio)
        insights.append(insight)
    
    if has_recent_trades(transactions):
        pattern = await analyze_behavioral_pattern(transactions)
        if pattern:
            insights.append(pattern)
    
    # ... другие типы
    
    return insights
```

**Важно:** не зовём LLM для всего. Сначала rule-based проверка "есть ли что
сказать", потом LLM форматирует в хороший текст.

### 5. Internal auth

AI Service НЕ доступен снаружи. Доступ только из Core API по internal token:

```python
async def verify_internal_token(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    if not secrets.compare_digest(token, settings.INTERNAL_API_TOKEN):
        raise HTTPException(401, "Invalid internal token")
```

Core API передаёт user_id в header после того как сам валидировал Clerk JWT.

### 6. Streaming endpoint (SSE)

```python
@router.post("/chat/stream")
async def chat_stream(
    request: ChatRequest,
    user_id: UUID = Depends(get_user_id_from_header),
):
    async def event_stream():
        async for event in chat_agent.stream(user_id, request.conversation_id, 
                                              request.message):
            yield f"data: {event.model_dump_json()}\n\n"
    
    return StreamingResponse(event_stream(), media_type="text/event-stream")
```

### 7. Token usage tracking

Каждый вызов Claude — платный. Трекаем для биллинга и мониторинга:

```python
async def call_claude(messages, ...):
    response = await anthropic.messages.create(...)
    
    # Сохраняем usage
    await core_api.record_ai_usage(
        user_id=user_id,
        conversation_id=conversation_id,
        input_tokens=response.usage.input_tokens,
        output_tokens=response.usage.output_tokens,
        cost_usd=calculate_cost(response.usage, model),
    )
    
    return response
```

### 8. Контекст для Claude — RAG или tool calling?

**Выбор: tool calling, не RAG на старте.**

Почему:
- Портфель — не куча документов, а структурированные данные
- Tools дают Claude свежие данные всегда (RAG нужен reindex)
- Tools точнее (Claude сам запрашивает что нужно)

RAG добавим позже для:
- Поиска по истории AI-разговоров
- Поиска по новостям о компаниях в портфеле
- Explainer'а (база знаний про финансовые термины)

### 9. Model selection

- **Claude Sonnet (latest)** для AI Chat — хороший баланс цены/качества
- **Claude Haiku (latest)** для классификации, простых инсайтов — дёшево и быстро
- **Claude Opus** только для сложных анализов (Pro-tier)

## Endpoints (internal)

```
POST   /internal/chat/stream                 # SSE streaming chat
POST   /internal/insights/generate           # генерация инсайтов для юзера
POST   /internal/behavioral/analyze          # поведенческий анализ
POST   /internal/explain                     # объяснение термина
```

Все требуют internal token + user_id в headers.

## Definition of Done

- [ ] FastAPI проект запускается, /health работает
- [ ] Internal auth middleware блокирует всё без токена
- [ ] AI Chat stream работает end-to-end (через Core API proxy)
- [ ] Все 5 типов proactive insights генерируются
- [ ] Tools к Core API работают и отдают корректные данные
- [ ] Token usage пишется в Core API
- [ ] Structlog с trace_id во всех логах
- [ ] Sentry ловит ошибки
- [ ] Rate limiting на Anthropic API (чтобы не превышать их лимиты)
- [ ] Unit-тесты для prompts validation (schema-level)
- [ ] Integration-тесты с mock'ом Anthropic SDK
- [ ] Docker image собирается
- [ ] Деплоится на Fly.io
- [ ] Cost-per-user мониторинг работает в PostHog

## Цена в токенах — оценка

Примерный расчёт на пользователя:

**AI Chat (Plus/Pro):**
- Средняя сессия: 5 сообщений, ~2000 input tokens (context + portfolio data), 500 output
- Стоимость одной сессии: ~$0.02-0.05 с Claude Sonnet
- Активный юзер делает ~3 сессии в неделю = $0.30/мес

**Proactive Insights:**
- Раз в день, ~3000 input, 300 output
- $0.012 × 30 = $0.36/мес

**Итого на Plus-юзера:** ~$0.70/мес Anthropic cost при выручке $8-10/мес.
Маржа ~90%. Pro будет выше по use, но и по цене.

## Важные решения

- **Tool calling > RAG** на MVP
- **Internal service only** — не принимает запросы напрямую из интернета
- **Не кешируем ответы Claude** — каждый запрос свежий (иначе пользователи
  получат устаревшие данные портфеля)
- **Стриминг обязателен** — юзер должен видеть "typing" эффект
- **Rule-based pre-filtering** для инсайтов — экономит токены

## Что НЕ делаем на MVP

- Мульти-модель (несколько LLM в parallel) — Claude хватит
- Fine-tuning — не нужно на старте
- Embedding-based RAG — tool calling достаточен
- Голосовой интерфейс
- Image understanding (PDF parsing для импорта — v2)

## Следующие шаги

Когда готово:
- TASK_07 (Web) подключает AI Chat UI
- TASK_08 (iOS) подключает AI Chat UI
- Workers могут вызывать генерацию инсайтов на расписании
