"""Tool-registry dispatch tests."""

from __future__ import annotations

import json
from typing import Any
from uuid import UUID

import pytest

from ai_service.tools.registry import TOOL_SCHEMAS, execute_tool
from tests.conftest import TEST_USER_ID, CoreAPIRecorder


def test_tool_schemas_exposes_exactly_five_tools() -> None:
    names = {schema["name"] for schema in TOOL_SCHEMAS}
    assert names == {
        "get_portfolio_snapshot",
        "get_positions",
        "get_transaction_history",
        "get_performance",
        "get_market_quote",
    }


def test_all_tool_schemas_have_description_and_object_schema() -> None:
    for schema in TOOL_SCHEMAS:
        assert schema.get("description")
        input_schema = schema["input_schema"]
        assert input_schema["type"] == "object"


@pytest.mark.asyncio
async def test_unknown_tool_returns_is_error(core_api_client: Any) -> None:
    result = await execute_tool("ghost_tool", {}, TEST_USER_ID, core_api_client)
    assert result.is_error is True
    body = json.loads(result.content)
    assert "Unknown tool" in body["error"]


@pytest.mark.asyncio
async def test_portfolio_snapshot_executes_successfully(
    core_api_recorder: CoreAPIRecorder,
    core_api_client: Any,
) -> None:
    core_api_recorder.json_route(
        "GET",
        "/portfolio",
        body={"currency": "USD", "total_value": 10000},
    )
    result = await execute_tool(
        "get_portfolio_snapshot",
        {"currency": "USD"},
        TEST_USER_ID,
        core_api_client,
    )
    assert result.is_error is False
    body = json.loads(result.content)
    assert body["total_value"] == 10000

    # Verify auth headers propagated through the client.
    req = core_api_recorder.calls[0]
    assert req.headers["Authorization"].startswith("Bearer ")
    assert req.headers["X-User-Id"] == str(TEST_USER_ID)


@pytest.mark.asyncio
async def test_core_api_error_returned_as_structured_tool_result(
    core_api_recorder: CoreAPIRecorder,
    core_api_client: Any,
) -> None:
    import httpx

    core_api_recorder.route(
        "GET",
        "/portfolio",
        lambda _req: httpx.Response(500, json={"error": "boom"}),
    )
    result = await execute_tool(
        "get_portfolio_snapshot",
        {},
        TEST_USER_ID,
        core_api_client,
    )
    assert result.is_error is True
    body = json.loads(result.content)
    assert body["error"] == "core_api_error"
    assert body["status"] == 500


@pytest.mark.asyncio
async def test_positions_tool_applies_client_side_asset_filter(
    core_api_recorder: CoreAPIRecorder,
    core_api_client: Any,
) -> None:
    core_api_recorder.json_route(
        "GET",
        "/positions",
        body={
            "data": [
                {"symbol": "AAPL", "asset_type": "stock"},
                {"symbol": "BTC", "asset_type": "crypto"},
            ]
        },
    )
    result = await execute_tool(
        "get_positions",
        {"filter_asset_type": "crypto"},
        TEST_USER_ID,
        core_api_client,
    )
    body = json.loads(result.content)
    assert [p["symbol"] for p in body["data"]] == ["BTC"]


@pytest.mark.asyncio
async def test_transactions_tool_normalises_dates(
    core_api_recorder: CoreAPIRecorder,
    core_api_client: Any,
) -> None:
    core_api_recorder.json_route("GET", "/transactions", body={"data": []})
    await execute_tool(
        "get_transaction_history",
        {"from_date": "2026-01-01", "to_date": "2026-01-31"},
        TEST_USER_ID,
        core_api_client,
    )
    req = core_api_recorder.calls[0]
    assert req.url.params["from"] == "2026-01-01T00:00:00Z"
    assert req.url.params["to"] == "2026-01-31T23:59:59Z"


@pytest.mark.asyncio
async def test_market_quote_requires_symbol_and_asset_type(
    core_api_recorder: CoreAPIRecorder,
    core_api_client: Any,
) -> None:
    core_api_recorder.json_route(
        "GET",
        "/market/quote",
        body={"symbol": "AAPL", "price": 192.5, "currency": "USD"},
    )
    result = await execute_tool(
        "get_market_quote",
        {"symbol": "AAPL", "asset_type": "stock"},
        TEST_USER_ID,
        core_api_client,
    )
    assert result.is_error is False
    req = core_api_recorder.calls[0]
    assert req.url.params["symbol"] == "AAPL"
    assert req.url.params["asset_type"] == "stock"


# Keep UUID import used so ruff doesn't flag it after refactors.
_ = UUID
