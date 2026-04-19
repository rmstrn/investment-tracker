"""Rule-based pre-filter unit tests for InsightGenerator.

These cover the *decision* to call Claude — the actual LLM formatting is
exercised in ``test_insights_endpoint.py`` with a scripted response.
"""

from __future__ import annotations

from ai_service.agents.insight_generator import InsightGenerator


def test_concentration_triggers_when_top_over_threshold() -> None:
    portfolio = {
        "currency": "USD",
        "total_value": {"amount": 10_000, "currency": "USD"},
        "top_positions": [
            {"symbol": "AAPL", "market_value": {"amount": 3_500}},
            {"symbol": "VTI", "market_value": {"amount": 2_000}},
        ],
    }
    evidence = InsightGenerator._check_concentration(portfolio)
    assert evidence is not None
    assert evidence["symbol"] == "AAPL"
    assert evidence["percentage"] == 35.0


def test_concentration_does_not_trigger_when_diversified() -> None:
    portfolio = {
        "currency": "USD",
        "total_value": 10_000,
        "top_positions": [
            {"symbol": "AAPL", "market_value": 2_000},
            {"symbol": "VTI", "market_value": 2_000},
        ],
    }
    assert InsightGenerator._check_concentration(portfolio) is None


def test_concentration_returns_none_for_empty_portfolio() -> None:
    assert InsightGenerator._check_concentration({}) is None
    assert (
        InsightGenerator._check_concentration(
            {"total_value": 0, "top_positions": [{"symbol": "A", "market_value": 0}]}
        )
        is None
    )


def test_over_trading_triggers_on_more_than_threshold_trades(monkeypatch) -> None:
    from datetime import UTC, datetime

    # Fix "now" so the 7-day window is deterministic.
    class _FakeDateTime(datetime):
        @classmethod
        def now(cls, tz=None):  # type: ignore[override]
            return datetime(2026, 4, 19, 12, 0, tzinfo=UTC)

    monkeypatch.setattr(
        "ai_service.agents.insight_generator.datetime",
        _FakeDateTime,
    )
    transactions = {
        "data": [
            {
                "executed_at": "2026-04-18T10:00:00Z",
                "transaction_type": "buy",
                "symbol": "AAPL",
                "quantity": 5,
            },
            {
                "executed_at": "2026-04-17T10:00:00Z",
                "transaction_type": "sell",
                "symbol": "AAPL",
                "quantity": 5,
            },
            {
                "executed_at": "2026-04-16T10:00:00Z",
                "transaction_type": "buy",
                "symbol": "TSLA",
                "quantity": 2,
            },
            {
                "executed_at": "2026-04-14T10:00:00Z",
                "transaction_type": "buy",
                "symbol": "NVDA",
                "quantity": 1,
            },
        ]
    }
    evidence = InsightGenerator._check_over_trading(transactions)
    assert evidence is not None
    assert evidence["pattern"] == "over_trading"


def test_over_trading_does_not_trigger_with_few_trades() -> None:
    transactions = {
        "data": [
            {
                "executed_at": "2020-01-01T00:00:00Z",
                "transaction_type": "buy",
                "symbol": "A",
                "quantity": 1,
            },
        ]
    }
    assert InsightGenerator._check_over_trading(transactions) is None


def test_performance_anomaly_triggers_on_large_divergence() -> None:
    perf = {
        "period": "1m",
        "benchmark": "SPX",
        "return_pct": 8.0,
        "benchmark_return_pct": 1.0,
        "contributors": [
            {"symbol": "AAPL", "contribution_pct": 5.5},
            {"symbol": "TSLA", "contribution_pct": 1.0},
        ],
    }
    evidence = InsightGenerator._check_performance_anomaly(perf)
    assert evidence is not None
    assert evidence["top_mover"] == "AAPL"


def test_performance_anomaly_respects_threshold() -> None:
    perf = {"return_pct": 1.5, "benchmark_return_pct": 1.0}
    assert InsightGenerator._check_performance_anomaly(perf) is None


def test_allocation_drift_uses_heavy_asset_class_threshold() -> None:
    portfolio = {"by_asset_type": {"stock": 0.72, "crypto": 0.28}}
    evidence = InsightGenerator._check_allocation_drift(portfolio)
    assert evidence is not None
    assert evidence["asset_class"] == "stock"
    assert evidence["current_pct"] == 72.0


def test_allocation_drift_skipped_when_balanced() -> None:
    portfolio = {"by_asset_type": {"stock": 0.5, "crypto": 0.5}}
    assert InsightGenerator._check_allocation_drift(portfolio) is None
