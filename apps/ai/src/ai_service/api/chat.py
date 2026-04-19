"""``POST /internal/chat/stream`` — SSE streaming AI Chat.

Core API proxies end-user chat traffic through this endpoint. The handler
takes a :class:`ChatRequest`, asks the :class:`ChatAgent` for an event
stream, and serialises each event into the SSE wire format.
"""

from __future__ import annotations

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from ai_service.api.auth import InternalUserId
from ai_service.api.deps import ChatAgentDep
from ai_service.llm.streaming import sse_stream
from ai_service.models import ChatRequest

router = APIRouter(prefix="/internal/chat", tags=["chat"])


@router.post("/stream")
async def stream_chat(
    payload: ChatRequest,
    user_id: InternalUserId,
    agent: ChatAgentDep,
) -> StreamingResponse:
    events = agent.stream(
        user_id=user_id,
        conversation_id=payload.conversation_id,
        message=payload.message,
        history=payload.history,
    )
    return StreamingResponse(
        sse_stream(events),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # disable nginx proxy buffering
        },
    )
