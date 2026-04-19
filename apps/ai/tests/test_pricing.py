"""Pricing math tests."""

from __future__ import annotations

import pytest

from ai_service.llm.pricing import PRICING, calculate_cost_usd


def test_all_pinned_models_have_prices() -> None:
    for model in ("claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"):
        assert model in PRICING, f"missing pricing for {model}"


def test_sonnet_cost_calculation() -> None:
    # 2000 in + 500 out at $3/$15 per MTok → 0.006 + 0.0075 = 0.0135
    cost = calculate_cost_usd("claude-sonnet-4-6", 2000, 500)
    assert cost == pytest.approx(0.0135, rel=1e-3)


def test_haiku_cheaper_than_sonnet() -> None:
    haiku = calculate_cost_usd("claude-haiku-4-5-20251001", 10_000, 1_000)
    sonnet = calculate_cost_usd("claude-sonnet-4-6", 10_000, 1_000)
    assert haiku < sonnet


def test_unknown_model_falls_back_to_sonnet_pricing() -> None:
    expected = calculate_cost_usd("claude-sonnet-4-6", 1_000, 200)
    fallback = calculate_cost_usd("claude-fantasy-17", 1_000, 200)
    assert fallback == expected
