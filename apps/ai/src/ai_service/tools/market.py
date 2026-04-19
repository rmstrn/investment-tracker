"""Market-data tool: single-symbol quote."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from ai_service.clients.core_api import CoreAPIClient

MARKET_QUOTE_TOOL: dict[str, Any] = {
    "name": "get_market_quote",
    "description": (
        "Get the current price quote for a single symbol. Use when the user "
        "asks about the latest price of a specific ticker or coin."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "symbol": {
                "type": "string",
                "description": "Ticker or crypto symbol, e.g. 'AAPL' or 'BTC'.",
            },
            "asset_type": {
                "type": "string",
                "enum": ["stock", "etf", "crypto"],
            },
        },
        "required": ["symbol", "asset_type"],
        "additionalProperties": False,
    },
}


async def execute_market_quote(
    inputs: dict[str, Any],
    user_id: UUID,
    core_api: CoreAPIClient,
) -> dict[str, Any]:
    return await core_api.get_market_quote(
        user_id,
        symbol=inputs["symbol"],
        asset_type=inputs["asset_type"],
    )
