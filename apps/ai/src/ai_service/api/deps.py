"""FastAPI dependencies that pull shared agents off ``app.state``.

All the heavy singletons (httpx pool, Anthropic client, Core API client,
agents) are constructed once in the lifespan and stashed on ``app.state``.
Endpoints pull them back through these tiny ``Depends`` shims so handlers
stay framework-free.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Request

from ai_service.agents.behavioral_coach import BehavioralCoach
from ai_service.agents.chat_agent import ChatAgent
from ai_service.agents.explainer import Explainer
from ai_service.agents.insight_generator import InsightGenerator
from ai_service.clients.core_api import CoreAPIClient


def _chat_agent(request: Request) -> ChatAgent:
    return request.app.state.chat_agent  # type: ignore[no-any-return]


def _insight_generator(request: Request) -> InsightGenerator:
    return request.app.state.insight_generator  # type: ignore[no-any-return]


def _behavioral_coach(request: Request) -> BehavioralCoach:
    return request.app.state.behavioral_coach  # type: ignore[no-any-return]


def _explainer(request: Request) -> Explainer:
    return request.app.state.explainer  # type: ignore[no-any-return]


def _core_api(request: Request) -> CoreAPIClient:
    return request.app.state.core_api  # type: ignore[no-any-return]


ChatAgentDep = Annotated[ChatAgent, Depends(_chat_agent)]
InsightGeneratorDep = Annotated[InsightGenerator, Depends(_insight_generator)]
BehavioralCoachDep = Annotated[BehavioralCoach, Depends(_behavioral_coach)]
ExplainerDep = Annotated[Explainer, Depends(_explainer)]
CoreAPIDep = Annotated[CoreAPIClient, Depends(_core_api)]
