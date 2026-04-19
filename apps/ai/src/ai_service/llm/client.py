"""Thin wrapper around the Anthropic Python SDK.

Adds:
- process-local concurrency cap (semaphore) so one pod can't exhaust our
  Anthropic rate limit in a burst;
- standard timeout / retry config driven from ``Settings``;
- explicit ``aclose()`` for graceful shutdown.

Higher-level orchestration (tool-use loop, streaming translation) lives in
``ai_service.agents.chat_agent``. This module stays agnostic of agents.
"""

from __future__ import annotations

import asyncio

from anthropic import AsyncAnthropic

from ai_service.config import Settings


class AnthropicClient:
    """Wraps ``AsyncAnthropic`` with a shared concurrency semaphore."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client = AsyncAnthropic(
            api_key=settings.anthropic_api_key.get_secret_value(),
            timeout=settings.anthropic_timeout_seconds,
            max_retries=settings.anthropic_max_retries,
        )
        self._semaphore = asyncio.Semaphore(settings.anthropic_max_concurrent)

    @property
    def raw(self) -> AsyncAnthropic:
        """Access the underlying SDK client (``.raw.messages.stream/.create``)."""
        return self._client

    def concurrency_slot(self) -> asyncio.Semaphore:
        """Async context manager reserving one concurrency slot."""
        return self._semaphore

    async def aclose(self) -> None:
        """Close the underlying HTTP client."""
        await self._client.close()
