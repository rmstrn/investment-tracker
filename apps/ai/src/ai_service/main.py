"""FastAPI entrypoint for the AI service."""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

import httpx
import structlog
import uvicorn
from fastapi import FastAPI

from ai_service.agents.behavioral_coach import BehavioralCoach
from ai_service.agents.chat_agent import ChatAgent
from ai_service.agents.explainer import Explainer
from ai_service.agents.insight_generator import InsightGenerator
from ai_service.api.behavioral import router as behavioral_router
from ai_service.api.chat import router as chat_router
from ai_service.api.explain import router as explain_router
from ai_service.api.insights import router as insights_router
from ai_service.api.middleware import RequestIdMiddleware
from ai_service.clients.core_api import CoreAPIClient
from ai_service.config import Settings, get_settings
from ai_service.llm.client import AnthropicClient
from ai_service.logging_setup import configure_logging
from ai_service.observability import init_posthog, init_sentry, shutdown_posthog

log = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Wire shared singletons on startup; close them on shutdown."""
    settings: Settings = get_settings()
    configure_logging(settings)
    init_sentry(settings)
    init_posthog(settings)

    http_client = httpx.AsyncClient(timeout=settings.core_api_timeout_seconds)
    core_api = CoreAPIClient(http_client, settings)
    llm = AnthropicClient(settings)

    app.state.settings = settings
    app.state.http_client = http_client
    app.state.core_api = core_api
    app.state.llm = llm
    app.state.chat_agent = ChatAgent(llm, core_api, settings)
    app.state.insight_generator = InsightGenerator(llm, core_api, settings)
    app.state.behavioral_coach = BehavioralCoach(llm, core_api, settings)
    app.state.explainer = Explainer(llm, settings)

    log.info(
        "ai_service_started",
        environment=settings.environment,
        sonnet=settings.anthropic_model_sonnet,
        haiku=settings.anthropic_model_haiku,
        opus=settings.anthropic_model_opus,
    )

    try:
        yield
    finally:
        await llm.aclose()
        await http_client.aclose()
        shutdown_posthog()
        log.info("ai_service_stopped")


app = FastAPI(
    title="investment-tracker ai-service",
    description="LLM layer for investment-tracker: chat, insights, behavioural coach, explainer.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(RequestIdMiddleware)

app.include_router(chat_router)
app.include_router(insights_router)
app.include_router(behavioral_router)
app.include_router(explain_router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"service": "ai-service", "status": "ok"}


@app.get("/health")
@app.get("/healthz")
async def health() -> dict[str, Any]:
    """Liveness probe. ``/healthz`` kept as an alias — fly.toml checks it."""
    return {"status": "ok", "service": "ai"}


@app.get("/ready")
async def ready() -> dict[str, str]:
    settings = get_settings()
    # Minimal readiness — presence of required secrets. Real pings to
    # Anthropic / Core API would cost money on every probe.
    anthropic_ok = bool(settings.anthropic_api_key.get_secret_value())
    core_token_ok = bool(settings.core_api_internal_token.get_secret_value())
    return {
        "status": "ready" if anthropic_ok and core_token_ok else "degraded",
        "anthropic_key": "set" if anthropic_ok else "missing",
        "core_api_token": "set" if core_token_ok else "missing",
    }


def run() -> None:
    """Entrypoint for ``uv run ai-service`` / container CMD."""
    settings = get_settings()
    uvicorn.run(
        "ai_service.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.environment == "development",
    )


if __name__ == "__main__":
    run()
