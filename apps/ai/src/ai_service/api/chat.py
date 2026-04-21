"""``POST /internal/chat/stream`` — SSE streaming AI Chat.

Core API proxies end-user chat traffic through this endpoint. The handler
takes a :class:`ChatRequest`, asks the :class:`ChatAgent` for an event
stream, and serialises each event into the SSE wire format.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Header
from fastapi.responses import StreamingResponse

from ai_service.api.auth import InternalUserId
from ai_service.api.deps import ChatAgentDep
from ai_service.http_headers import REQUEST_ID as _REQUEST_ID_HEADER
from ai_service.llm.streaming import sse_stream
from ai_service.models import ChatRequest

router = APIRouter(prefix="/internal/chat", tags=["chat"])

# FastAPI Header(alias=...) must be a literal string; assert the
# wire-canonical spelling stays wired to the shared constant at
# import time so drift in ai_service.http_headers fails fast.
assert _REQUEST_ID_HEADER == "X-Request-ID", (
    "ai_service.http_headers.REQUEST_ID drifted; update Header alias below"
)


@router.post("/stream")
async def stream_chat(
    payload: ChatRequest,
    user_id: InternalUserId,
    agent: ChatAgentDep,
    x_request_id: Annotated[str | None, Header(alias="X-Request-ID")] = None,
) -> StreamingResponse:
    # Threaded into the agent so any mid-stream ErrorEvent carries
    # the same request_id the HTTP envelope uses (TD-R048). Absent
    # when Core API didn't stamp a header — direct local-dev curl,
    # tests without middleware.RequestID, etc.
    events = agent.stream(
        user_id=user_id,
        conversation_id=payload.conversation_id,
        message=payload.message,
        history=payload.history,
        request_id=x_request_id,
    )
    return StreamingResponse(
        sse_stream(events),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # disable nginx proxy buffering
        },
    )
