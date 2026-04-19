"""SSE wire-format helpers.

Each ``ChatStreamEvent`` is rendered as two lines — ``event: <type>`` and
``data: <json>`` — followed by a blank line, matching the Core API SSE schema
(see ``tools/openapi/openapi.yaml`` `/ai/chat/stream`).
"""

from __future__ import annotations

from collections.abc import AsyncIterator

from pydantic import BaseModel

from ai_service.models import ChatStreamEvent


def format_sse_event(event: BaseModel) -> str:
    """Render a single ``ChatStreamEvent`` as an SSE frame."""
    # ``type`` is the discriminator on the union — every event carries it.
    event_type = getattr(event, "type", "message")
    payload = event.model_dump_json(exclude_none=False)
    return f"event: {event_type}\ndata: {payload}\n\n"


async def sse_stream(
    events: AsyncIterator[ChatStreamEvent],
) -> AsyncIterator[str]:
    """Turn an async iterator of events into SSE-formatted strings."""
    async for event in events:
        yield format_sse_event(event)
