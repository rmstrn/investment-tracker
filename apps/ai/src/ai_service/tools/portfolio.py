"""Portfolio-shaped tools: snapshot, positions, transactions, performance."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from ai_service.clients.core_api import CoreAPIClient

PORTFOLIO_SNAPSHOT_TOOL: dict[str, Any] = {
    "name": "get_portfolio_snapshot",
    "description": (
        "Get the user's current portfolio total value, total cost, unrealised "
        "P&L, and allocation breakdown. Use this first for most questions about "
        "how the portfolio is doing overall."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "currency": {
                "type": "string",
                "description": "ISO-4217 display currency (e.g. 'USD'). Defaults to the user's preferred.",
            }
        },
        "additionalProperties": False,
    },
}


POSITIONS_TOOL: dict[str, Any] = {
    "name": "get_positions",
    "description": (
        "List all current positions with quantity, average cost, market value, "
        "and unrealised P&L. Use when the user asks 'what do I hold' or wants "
        "details on individual holdings."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "sort_by": {
                "type": "string",
                "enum": ["value_desc", "value_asc", "pnl_desc", "pnl_asc", "alpha"],
                "description": "Ordering. Defaults to value_desc.",
            },
            "filter_asset_type": {
                "type": "string",
                "enum": ["stock", "etf", "crypto"],
                "description": "If set, only positions of this asset type are returned.",
            },
            "currency": {
                "type": "string",
                "description": "ISO-4217 display currency.",
            },
        },
        "additionalProperties": False,
    },
}


TRANSACTIONS_TOOL: dict[str, Any] = {
    "name": "get_transaction_history",
    "description": (
        "Get transaction history for a symbol, an asset type, or the whole "
        "portfolio within a date window. Use when the user asks what they "
        "bought or sold or to back up a claim with receipts."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "symbol": {"type": "string", "description": "Optional ticker (e.g. 'AAPL')."},
            "asset_type": {
                "type": "string",
                "enum": ["stock", "etf", "crypto"],
            },
            "from_date": {
                "type": "string",
                "format": "date",
                "description": "Start date (inclusive), YYYY-MM-DD.",
            },
            "to_date": {
                "type": "string",
                "format": "date",
                "description": "End date (inclusive), YYYY-MM-DD.",
            },
            "limit": {
                "type": "integer",
                "minimum": 1,
                "maximum": 200,
                "default": 50,
            },
        },
        "additionalProperties": False,
    },
}


PERFORMANCE_TOOL: dict[str, Any] = {
    "name": "get_performance",
    "description": (
        "Get portfolio return over a period with a benchmark comparison. Use "
        "for questions like 'how am I doing vs the S&P 500 this year'."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "period": {
                "type": "string",
                "enum": ["1m", "3m", "6m", "1y", "all"],
            },
            "benchmark": {
                "type": "string",
                "enum": ["SPX", "QQQ", "ACWI", "BTC"],
            },
            "currency": {"type": "string"},
        },
        "required": ["period", "benchmark"],
        "additionalProperties": False,
    },
}


# ------------------------------ execution ---------------------------------


async def execute_portfolio_snapshot(
    inputs: dict[str, Any],
    user_id: UUID,
    core_api: CoreAPIClient,
) -> dict[str, Any]:
    return await core_api.get_portfolio(user_id, currency=inputs.get("currency"))


async def execute_positions(
    inputs: dict[str, Any],
    user_id: UUID,
    core_api: CoreAPIClient,
) -> dict[str, Any]:
    response = await core_api.list_positions(
        user_id,
        sort=inputs.get("sort_by", "value_desc"),
        currency=inputs.get("currency"),
    )
    # Core API /positions has no asset_type filter; apply client-side if requested.
    asset_type = inputs.get("filter_asset_type")
    if asset_type and isinstance(response.get("data"), list):
        response = {
            **response,
            "data": [p for p in response["data"] if p.get("asset_type") == asset_type],
        }
    return response


async def execute_transactions(
    inputs: dict[str, Any],
    user_id: UUID,
    core_api: CoreAPIClient,
) -> dict[str, Any]:
    from_ = inputs.get("from_date")
    to = inputs.get("to_date")
    # Core API accepts date-time on /transactions; normalise YYYY-MM-DD → ISO.
    if from_ and len(from_) == 10:
        from_ = f"{from_}T00:00:00Z"
    if to and len(to) == 10:
        to = f"{to}T23:59:59Z"
    return await core_api.list_transactions(
        user_id,
        symbol=inputs.get("symbol"),
        asset_type=inputs.get("asset_type"),
        from_=from_,
        to=to,
        limit=inputs.get("limit"),
    )


async def execute_performance(
    inputs: dict[str, Any],
    user_id: UUID,
    core_api: CoreAPIClient,
) -> dict[str, Any]:
    return await core_api.get_portfolio_performance(
        user_id,
        period=inputs["period"],
        benchmark=inputs["benchmark"],
        currency=inputs.get("currency"),
    )
