"""Per-model Anthropic pricing for cost-per-user tracking.

Prices are quoted in USD per 1M tokens. Kept in code rather than config so a
bad env override can't silently double-bill users; update on model releases.

Matches public Anthropic pricing for the Claude 4.x family as of 2026-Q2.
"""

from __future__ import annotations

from dataclasses import dataclass

_OPUS_46 = "claude-opus-4-6"
_SONNET_46 = "claude-sonnet-4-6"
_HAIKU_45 = "claude-haiku-4-5-20251001"


@dataclass(frozen=True)
class ModelPricing:
    """Per-million-token prices in USD."""

    input_per_mtok: float
    output_per_mtok: float


# Keyed by model id. Unknown models fall back to Sonnet pricing (the default
# chat tier) so we never under-report cost.
PRICING: dict[str, ModelPricing] = {
    _OPUS_46: ModelPricing(input_per_mtok=15.00, output_per_mtok=75.00),
    _SONNET_46: ModelPricing(input_per_mtok=3.00, output_per_mtok=15.00),
    _HAIKU_45: ModelPricing(input_per_mtok=1.00, output_per_mtok=5.00),
}

_FALLBACK = PRICING[_SONNET_46]


def calculate_cost_usd(model: str, input_tokens: int, output_tokens: int) -> float:
    """Return the USD cost of a single Claude call, rounded to 6 decimals."""
    rate = PRICING.get(model, _FALLBACK)
    cost = (input_tokens * rate.input_per_mtok + output_tokens * rate.output_per_mtok) / 1_000_000
    return round(cost, 6)
