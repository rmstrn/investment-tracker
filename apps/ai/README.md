# @investment-tracker/ai

AI service — Python 3.13, FastAPI, Pydantic v2, Anthropic SDK. Managed with **uv**.

This is a scaffold. Real AI chat + proactive insights land in **TASK_05**.

## Run locally

```bash
cd apps/ai
uv sync                           # install deps into .venv
uv run ai-service                 # → http://localhost:8000/healthz
```

Or from root: `pnpm --filter @investment-tracker/ai dev`.

## Project layout

```
apps/ai/
├── pyproject.toml
├── src/
│   └── ai_service/
│       ├── __init__.py
│       ├── config.py            Settings (pydantic-settings)
│       └── main.py              FastAPI app
├── tests/
│   └── test_health.py
├── Dockerfile                   Multi-stage uv build
└── fly.toml                     Fly.io deploy config
```

## Commands

| Command                | What it does                             |
| ---------------------- | ---------------------------------------- |
| `uv sync`              | Install deps (lockfile-reproducible)     |
| `uv run ai-service`    | Run the FastAPI server                   |
| `uv run pytest`        | Unit tests                               |
| `uv run ruff check .`  | Lint                                     |
| `uv run ruff format .` | Format                                   |
| `uv run mypy src`      | Type-check                               |

## Status

Scaffold only. Endpoints: `/`, `/healthz`, `/ready`. TASK_05 adds:

- `POST /chat` — streaming AI chat (SSE) with tool calling
- `POST /insights/generate` — batch insight generation
- `GET  /insights/:user_id` — fetch cached insights
