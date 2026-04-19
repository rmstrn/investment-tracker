"""Insights endpoint end-to-end — rule-based pre-filter + scripted LLM."""

from __future__ import annotations

from typing import Any

from fastapi.testclient import TestClient

from tests.conftest import CoreAPIRecorder, json_call


def test_insights_generate_returns_concentration_when_portfolio_concentrated(
    client: TestClient,
    auth_headers: dict[str, str],
    test_app: Any,
    core_api_recorder: CoreAPIRecorder,
) -> None:
    # Rule triggers: AAPL is 40% of portfolio.
    core_api_recorder.json_route(
        "GET",
        "/portfolio",
        body={
            "currency": "USD",
            "total_value": {"amount": 10_000, "currency": "USD"},
            "top_positions": [
                {"symbol": "AAPL", "market_value": {"amount": 4_000}},
            ],
            "by_asset_type": {"stock": 1.0},
        },
    )
    core_api_recorder.json_route("GET", "/transactions", body={"data": []})
    core_api_recorder.route(
        "GET",
        "/portfolio/dividends",
        lambda _req: __import__("httpx").Response(403, json={"error": {"code": "feature_locked"}}),
    )
    core_api_recorder.route(
        "GET",
        "/portfolio/performance",
        lambda _req: __import__("httpx").Response(404, json={"error": "no_data"}),
    )

    # Queue a scripted Claude response for each candidate the rules produce.
    # Here: concentration_risk + allocation_drift (stocks = 100%).
    test_app.state.fake_calls.extend(
        [
            json_call(
                {
                    "title": "AAPL is 40% of your portfolio",
                    "body": "One position makes up 40% of your portfolio.",
                    "severity": "warning",
                }
            ),
            json_call(
                {
                    "title": "All eggs in the stock basket",
                    "body": "100% of your portfolio is stocks.",
                    "severity": "info",
                }
            ),
        ]
    )

    resp = client.post(
        "/internal/insights/generate",
        json={"period_days": 30},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    body = resp.json()
    types = {i["insight_type"] for i in body["insights"]}
    assert "concentration_risk" in types
    assert len(body["usage"]) >= 1
    first_usage = body["usage"][0]
    assert first_usage["input_tokens"] >= 0
    assert first_usage["cost_usd"] >= 0


def test_insights_generate_returns_empty_for_clean_portfolio(
    client: TestClient,
    auth_headers: dict[str, str],
    core_api_recorder: CoreAPIRecorder,
) -> None:
    core_api_recorder.json_route(
        "GET",
        "/portfolio",
        body={
            "currency": "USD",
            "total_value": {"amount": 10_000},
            "top_positions": [
                {"symbol": "VTI", "market_value": {"amount": 1_000}},
                {"symbol": "VXUS", "market_value": {"amount": 1_000}},
            ],
            "by_asset_type": {"stock": 0.5, "crypto": 0.5},
        },
    )
    core_api_recorder.json_route("GET", "/transactions", body={"data": []})
    core_api_recorder.route(
        "GET",
        "/portfolio/dividends",
        lambda _req: __import__("httpx").Response(403, json={"error": "locked"}),
    )
    core_api_recorder.route(
        "GET",
        "/portfolio/performance",
        lambda _req: __import__("httpx").Response(404, json={"error": "no_data"}),
    )

    resp = client.post(
        "/internal/insights/generate",
        json={"period_days": 30},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["insights"] == []
