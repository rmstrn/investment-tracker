"""Shared test fixtures.

Two mock layers:

- **Anthropic SDK** — a fake ``AnthropicClient`` that replays pre-scripted
  stream events and final messages. Built on ``SimpleNamespace`` because the
  agent code only reads event attributes by name; for tool-use detection the
  agent uses ``isinstance(block, ToolUseBlock)`` so we use the real SDK
  classes for final-message content blocks.
- **Core API** — a real ``httpx.AsyncClient`` with ``MockTransport`` handling
  routes via ``routes["/portfolio"] = lambda: ...``.
"""

from __future__ import annotations

import asyncio
import json
from collections.abc import Callable, Iterator
from dataclasses import dataclass, field
from types import SimpleNamespace
from typing import Any
from uuid import UUID

import httpx
import pytest
from anthropic.types import TextBlock, ToolUseBlock
from fastapi.testclient import TestClient

from ai_service.agents.behavioral_coach import BehavioralCoach
from ai_service.agents.chat_agent import ChatAgent
from ai_service.agents.explainer import Explainer
from ai_service.agents.insight_generator import InsightGenerator
from ai_service.clients.core_api import CoreAPIClient
from ai_service.config import Settings, get_settings

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

INTERNAL_TOKEN = "test-internal-token"
CORE_TOKEN = "test-core-token"
ANTHROPIC_KEY = "test-anthropic-key"

TEST_USER_ID = UUID("11111111-1111-1111-1111-111111111111")
TEST_CONVERSATION_ID = UUID("22222222-2222-2222-2222-222222222222")


# ---------------------------------------------------------------------------
# Settings
# ---------------------------------------------------------------------------


@pytest.fixture(autouse=True)
def _test_env(monkeypatch: pytest.MonkeyPatch) -> Iterator[None]:
    """Install deterministic env vars and clear the settings cache per test."""
    monkeypatch.setenv("INTERNAL_API_TOKEN", INTERNAL_TOKEN)
    monkeypatch.setenv("CORE_API_INTERNAL_TOKEN", CORE_TOKEN)
    monkeypatch.setenv("ANTHROPIC_API_KEY", ANTHROPIC_KEY)
    monkeypatch.setenv("ENVIRONMENT", "test")
    monkeypatch.setenv("LOG_LEVEL", "WARNING")
    # PostHog disabled in tests — no capture calls.
    monkeypatch.delenv("POSTHOG_API_KEY", raising=False)
    monkeypatch.delenv("SENTRY_DSN", raising=False)
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


@pytest.fixture
def settings() -> Settings:
    return get_settings()


@pytest.fixture
def auth_headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {INTERNAL_TOKEN}",
        "X-User-Id": str(TEST_USER_ID),
    }


# ---------------------------------------------------------------------------
# Fake Anthropic SDK
# ---------------------------------------------------------------------------


@dataclass
class FakeCall:
    """One scripted Claude API call — events stream + final message."""

    events: list[Any] = field(default_factory=list)
    final_content: list[Any] = field(default_factory=list)
    stop_reason: str = "end_turn"
    message_id: str = "msg_test"
    input_tokens: int = 100
    output_tokens: int = 50

    def final_message(self) -> SimpleNamespace:
        return SimpleNamespace(
            id=self.message_id,
            content=self.final_content,
            stop_reason=self.stop_reason,
            usage=SimpleNamespace(
                input_tokens=self.input_tokens,
                output_tokens=self.output_tokens,
            ),
        )


class _FakeStreamCtx:
    def __init__(self, call: FakeCall) -> None:
        self._call = call

    async def __aenter__(self) -> _FakeStreamCtx:
        return self

    async def __aexit__(self, *_args: Any) -> None:
        return None

    def __aiter__(self) -> Any:
        return self._iter()

    async def _iter(self) -> Any:
        for event in self._call.events:
            yield event

    async def get_final_message(self) -> SimpleNamespace:
        return self._call.final_message()


class _FakeMessages:
    def __init__(self, calls: list[FakeCall]) -> None:
        self._calls = calls

    def stream(self, **_kwargs: Any) -> _FakeStreamCtx:
        if not self._calls:
            raise RuntimeError("No more scripted stream calls")
        return _FakeStreamCtx(self._calls.pop(0))

    async def create(self, **_kwargs: Any) -> SimpleNamespace:
        if not self._calls:
            raise RuntimeError("No more scripted create calls")
        return self._calls.pop(0).final_message()


class FakeAnthropicClient:
    """Drop-in for :class:`AnthropicClient` in tests."""

    def __init__(self, calls: list[FakeCall]) -> None:
        self._calls = calls
        self.raw = SimpleNamespace(messages=_FakeMessages(calls))
        self._sem = asyncio.Semaphore(10)

    def concurrency_slot(self) -> asyncio.Semaphore:
        return self._sem

    async def aclose(self) -> None:
        return None


# Event / block helpers -----------------------------------------------------


def text_delta(text: str, index: int = 0) -> SimpleNamespace:
    return SimpleNamespace(
        type="content_block_delta",
        index=index,
        delta=SimpleNamespace(type="text_delta", text=text),
    )


def content_block_start(index: int, block_type: str = "text") -> SimpleNamespace:
    return SimpleNamespace(
        type="content_block_start",
        index=index,
        content_block=SimpleNamespace(type=block_type),
    )


def content_block_stop(index: int) -> SimpleNamespace:
    return SimpleNamespace(type="content_block_stop", index=index)


def message_start(message_id: str = "msg_test") -> SimpleNamespace:
    return SimpleNamespace(type="message_start", message=SimpleNamespace(id=message_id))


def text_block(text: str) -> TextBlock:
    return TextBlock(text=text, type="text", citations=None)


def tool_use_block(name: str, inputs: dict[str, Any], tool_use_id: str = "toolu_1") -> ToolUseBlock:
    return ToolUseBlock(id=tool_use_id, name=name, input=inputs, type="tool_use")


# ---------------------------------------------------------------------------
# Core API via httpx MockTransport
# ---------------------------------------------------------------------------


class CoreAPIRecorder:
    """Records Core API requests and routes them by method+path."""

    def __init__(self) -> None:
        self.calls: list[httpx.Request] = []
        self._routes: dict[tuple[str, str], Callable[[httpx.Request], httpx.Response]] = {}

    def route(
        self,
        method: str,
        path: str,
        handler: Callable[[httpx.Request], httpx.Response],
    ) -> None:
        self._routes[(method.upper(), path)] = handler

    def json_route(self, method: str, path: str, body: Any, status: int = 200) -> None:
        self.route(method, path, lambda _req: httpx.Response(status, json=body))

    def default_404(self) -> None:
        self._default = lambda req: httpx.Response(
            404, json={"error": {"code": "not_found", "path": req.url.path}}
        )

    def __call__(self, request: httpx.Request) -> httpx.Response:
        self.calls.append(request)
        handler = self._routes.get((request.method, request.url.path))
        if handler is None:
            return httpx.Response(404, json={"error": {"code": "not_found"}})
        return handler(request)


@pytest.fixture
def core_api_recorder() -> CoreAPIRecorder:
    return CoreAPIRecorder()


@pytest.fixture
async def core_api_client(
    core_api_recorder: CoreAPIRecorder,
    settings: Settings,
) -> CoreAPIClient:
    http = httpx.AsyncClient(
        transport=httpx.MockTransport(core_api_recorder),
        base_url=settings.core_api_url,
    )
    return CoreAPIClient(http, settings)


# ---------------------------------------------------------------------------
# App-level fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def test_app(
    core_api_recorder: CoreAPIRecorder,
    settings: Settings,
) -> Iterator[Any]:
    """A FastAPI app whose lifespan is overridden with test doubles.

    ``app.state.fake_calls`` is a mutable list of :class:`FakeCall`; tests
    append scripted Claude responses to it before making requests.
    """
    from fastapi import FastAPI

    from ai_service.api.behavioral import router as behavioral_router
    from ai_service.api.chat import router as chat_router
    from ai_service.api.explain import router as explain_router
    from ai_service.api.insights import router as insights_router
    from ai_service.api.middleware import RequestIdMiddleware

    app = FastAPI()
    app.add_middleware(RequestIdMiddleware)
    app.include_router(chat_router)
    app.include_router(insights_router)
    app.include_router(behavioral_router)
    app.include_router(explain_router)

    fake_calls: list[FakeCall] = []
    http = httpx.AsyncClient(
        transport=httpx.MockTransport(core_api_recorder),
        base_url=settings.core_api_url,
    )
    core_api = CoreAPIClient(http, settings)
    llm = FakeAnthropicClient(fake_calls)

    app.state.settings = settings
    app.state.http_client = http
    app.state.core_api = core_api
    app.state.llm = llm
    app.state.fake_calls = fake_calls
    app.state.chat_agent = ChatAgent(llm, core_api, settings)  # type: ignore[arg-type]
    app.state.insight_generator = InsightGenerator(llm, core_api, settings)  # type: ignore[arg-type]
    app.state.behavioral_coach = BehavioralCoach(llm, core_api, settings)  # type: ignore[arg-type]
    app.state.explainer = Explainer(llm, core_api, settings)  # type: ignore[arg-type]

    yield app
    # httpx.AsyncClient backed by MockTransport doesn't open real sockets, so
    # leaking it at teardown is harmless and avoids event-loop juggling.


@pytest.fixture
def client(test_app: Any) -> Iterator[TestClient]:
    with TestClient(test_app) as c:
        yield c


# ---------------------------------------------------------------------------
# Common scripted responses
# ---------------------------------------------------------------------------


def plain_text_call(text: str) -> FakeCall:
    """Scripted Claude call that produces a single text block, no tools."""
    return FakeCall(
        events=[
            message_start(),
            content_block_start(0, "text"),
            text_delta(text),
            content_block_stop(0),
        ],
        final_content=[text_block(text)],
        stop_reason="end_turn",
    )


def tool_use_then_text_call(
    tool_name: str,
    tool_input: dict[str, Any],
    followup_text: str,
) -> list[FakeCall]:
    """Two-round script: tool_use request, then a text answer."""
    first = FakeCall(
        events=[
            message_start(),
            content_block_start(0, "tool_use"),
            content_block_stop(0),
        ],
        final_content=[tool_use_block(tool_name, tool_input, tool_use_id="toolu_1")],
        stop_reason="tool_use",
    )
    second = FakeCall(
        events=[
            message_start("msg_test_2"),
            content_block_start(0, "text"),
            text_delta(followup_text),
            content_block_stop(0),
        ],
        final_content=[text_block(followup_text)],
        stop_reason="end_turn",
    )
    return [first, second]


def json_call(payload: dict[str, Any]) -> FakeCall:
    """A single ``messages.create`` call returning a TextBlock with JSON content."""
    return FakeCall(
        events=[],  # unused for non-stream create
        final_content=[text_block(json.dumps(payload))],
        stop_reason="end_turn",
    )
