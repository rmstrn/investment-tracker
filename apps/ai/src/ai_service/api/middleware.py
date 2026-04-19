"""Request-id middleware that binds structlog contextvars for the handler.

Every inbound request gets a ``request_id`` either from the incoming
``X-Request-Id`` header (Core API propagates its trace id there) or a fresh
UUID. The id is bound into ``structlog.contextvars`` so every log line
emitted within the handler carries it, and echoed back on the response.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from uuid import uuid4

import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

_REQUEST_ID_HEADER = "X-Request-Id"


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        request_id = request.headers.get(_REQUEST_ID_HEADER) or str(uuid4())
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            request_id=request_id,
            path=request.url.path,
            method=request.method,
        )
        response = await call_next(request)
        response.headers[_REQUEST_ID_HEADER] = request_id
        return response
