"""Tool registry — the single source of truth for what Claude can call.

Anthropic receives ``TOOL_SCHEMAS`` at stream time; when the model emits a
``tool_use`` block, ``execute_tool`` is invoked with the tool name, input
dict, user id, and a ``CoreAPIClient`` to dispatch against.
"""

from __future__ import annotations

import json
from collections.abc import Awaitable, Callable
from typing import Any
from uuid import UUID

from ai_service.clients.core_api import CoreAPIClient, CoreAPIError
from ai_service.tools.market import MARKET_QUOTE_TOOL, execute_market_quote
from ai_service.tools.portfolio import (
    PERFORMANCE_TOOL,
    PORTFOLIO_SNAPSHOT_TOOL,
    POSITIONS_TOOL,
    TRANSACTIONS_TOOL,
    execute_performance,
    execute_portfolio_snapshot,
    execute_positions,
    execute_transactions,
)

TOOL_SCHEMAS: list[dict[str, Any]] = [
    PORTFOLIO_SNAPSHOT_TOOL,
    POSITIONS_TOOL,
    TRANSACTIONS_TOOL,
    PERFORMANCE_TOOL,
    MARKET_QUOTE_TOOL,
]


ToolExecutor = Callable[
    [dict[str, Any], UUID, CoreAPIClient],
    Awaitable[dict[str, Any]],
]

_DISPATCH: dict[str, ToolExecutor] = {
    "get_portfolio_snapshot": execute_portfolio_snapshot,
    "get_positions": execute_positions,
    "get_transaction_history": execute_transactions,
    "get_performance": execute_performance,
    "get_market_quote": execute_market_quote,
}


class ToolExecutionResult:
    """Outcome of a single tool call — either data or a structured error."""

    __slots__ = ("content", "is_error")

    def __init__(self, content: str, is_error: bool) -> None:
        self.content = content
        self.is_error = is_error


async def execute_tool(
    name: str,
    inputs: dict[str, Any],
    user_id: UUID,
    core_api: CoreAPIClient,
) -> ToolExecutionResult:
    """Dispatch a tool call, returning a wire-ready ``tool_result`` payload.

    Errors are caught and returned as ``is_error=True`` tool results so the
    model can react in-context (ask a clarifying question, apologise, pick a
    different tool) rather than tearing the whole stream down.
    """
    executor = _DISPATCH.get(name)
    if executor is None:
        return ToolExecutionResult(
            content=json.dumps({"error": f"Unknown tool: {name}"}),
            is_error=True,
        )

    try:
        result = await executor(inputs, user_id, core_api)
        return ToolExecutionResult(content=json.dumps(result), is_error=False)
    except CoreAPIError as exc:
        return ToolExecutionResult(
            content=json.dumps(
                {"error": "core_api_error", "status": exc.status_code, "detail": exc.body[:500]}
            ),
            is_error=True,
        )
    except Exception as exc:  # pragma: no cover — defensive
        return ToolExecutionResult(
            content=json.dumps({"error": "tool_execution_failed", "detail": str(exc)[:500]}),
            is_error=True,
        )
