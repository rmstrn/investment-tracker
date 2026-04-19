"""FastAPI entrypoint for the AI service.

Placeholder — TASK_05 replaces this with AI chat + insight endpoints wired to
Claude via the Anthropic SDK, with tool calling into the Core API.
"""

from __future__ import annotations

from typing import Any

import uvicorn
from fastapi import FastAPI

from ai_service.config import get_settings

app = FastAPI(
    title="investment-tracker ai-service",
    description="LLM layer for investment-tracker. Scaffold only — TASK_05 pending.",
    version="0.0.0",
)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "ai-service placeholder", "status": "ok"}


@app.get("/healthz")
async def healthz() -> dict[str, Any]:
    return {
        "status": "ok",
        "service": "ai",
        "note": "placeholder — TASK_05 pending",
    }


@app.get("/ready")
async def ready() -> dict[str, str]:
    # Real implementation will check Anthropic API key, DB pool, Redis.
    return {"status": "ready"}


def run() -> None:
    """Entrypoint for `uv run ai-service` / container CMD."""
    settings = get_settings()
    uvicorn.run(
        "ai_service.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.environment == "development",
    )


if __name__ == "__main__":
    run()
