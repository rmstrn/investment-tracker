"""Explainer — on-the-fly plain-language explanations of financial terms.

Runs on Haiku (cheap + fast). No tool calls; pure text generation.
"""

from __future__ import annotations

from typing import Any, cast

from ai_service.config import Settings
from ai_service.llm.client import AnthropicClient
from ai_service.llm.pricing import calculate_cost_usd
from ai_service.llm.prompts import EXPLAIN_SYSTEM_PROMPT
from ai_service.models import ExplainRequest, ExplainResponse, TokenUsage


class Explainer:
    def __init__(
        self,
        llm: AnthropicClient,
        settings: Settings,
    ) -> None:
        self._llm = llm
        self._settings = settings

    async def explain(self, req: ExplainRequest) -> ExplainResponse:
        user_content = f"Term: {req.term}\nUser level: {req.user_level}"
        if req.context:
            user_content += f"\nContext: {req.context}"

        model = self._settings.anthropic_model_haiku
        async with self._llm.concurrency_slot():
            message = await self._llm.raw.messages.create(
                model=model,
                system=EXPLAIN_SYSTEM_PROMPT,
                messages=cast(Any, [{"role": "user", "content": user_content}]),
                max_tokens=400,
            )

        explanation = _extract_text(message)
        usage = TokenUsage(
            model=model,
            input_tokens=message.usage.input_tokens,
            output_tokens=message.usage.output_tokens,
            cost_usd=calculate_cost_usd(
                model, message.usage.input_tokens, message.usage.output_tokens
            ),
        )

        return ExplainResponse(term=req.term, explanation=explanation, usage=usage)


def _extract_text(message: Any) -> str:
    blocks = getattr(message, "content", []) or []
    parts: list[str] = []
    for block in blocks:
        if getattr(block, "type", None) == "text":
            parts.append(block.text)
    return "".join(parts).strip()
