# internal/clients

External API clients (read-only):

- `polygon/` — stock prices (TASK_04)
- `coingecko/` — crypto prices (TASK_04)
- `ecb/` — FX rates (TASK_04)
- `snaptrade/` — broker aggregator (TASK_06)
- `binance/`, `coinbase/`, `kraken/` — direct crypto exchange clients (TASK_06)
- `anthropic/` — proxied via apps/ai; kept here for any Go-side LLM calls

All clients follow the same pattern: constructor takes `http.Client` + base URL,
retry/backoff via `backoff/v4`, circuit breaker via `sony/gobreaker`.
