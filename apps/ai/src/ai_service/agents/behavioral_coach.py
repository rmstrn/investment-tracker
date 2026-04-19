"""Behavioural coach — transaction-pattern analysis.

Reads the user's last ``period_days`` of transactions via Core API and asks
Sonnet to spot emotional patterns (local-high buying, panic-selling,
over-trading, FOMO, tax-inefficient moves). Output is a structured JSON
document validated into :class:`BehavioralAnalysisResponse`.
"""

from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from typing import Any, cast
from uuid import UUID

import structlog

from ai_service.clients.core_api import CoreAPIClient, CoreAPIError
from ai_service.config import Settings
from ai_service.llm.client import AnthropicClient
from ai_service.llm.pricing import calculate_cost_usd
from ai_service.llm.prompts import BEHAVIORAL_SYSTEM_PROMPT
from ai_service.models import (
    BehavioralAnalysisResponse,
    BehavioralPattern,
    InsightSeverity,
    TokenUsage,
)

log = structlog.get_logger(__name__)

_MAX_TRANSACTIONS = 80


class BehavioralCoach:
    def __init__(
        self,
        llm: AnthropicClient,
        core_api: CoreAPIClient,
        settings: Settings,
    ) -> None:
        self._llm = llm
        self._core_api = core_api
        self._settings = settings

    async def analyze(
        self,
        user_id: UUID,
        period_days: int = 90,
    ) -> BehavioralAnalysisResponse:
        from_ = (datetime.now(UTC) - timedelta(days=period_days)).isoformat()
        try:
            resp = await self._core_api.list_transactions(
                user_id, from_=from_, limit=_MAX_TRANSACTIONS
            )
        except CoreAPIError as exc:
            log.warning("behavioral_fetch_failed", status=exc.status_code)
            return _empty_response(self._settings.anthropic_model_sonnet)

        rows = resp.get("data") if isinstance(resp, dict) else None
        if not isinstance(rows, list) or not rows:
            return _empty_response(self._settings.anthropic_model_sonnet)

        # Trim to keep the prompt small & predictable.
        trimmed = [
            {
                "executed_at": r.get("executed_at"),
                "symbol": r.get("symbol"),
                "type": r.get("transaction_type"),
                "quantity": r.get("quantity"),
                "price": r.get("price"),
                "currency": r.get("currency"),
            }
            for r in rows[:_MAX_TRANSACTIONS]
        ]
        user_content = (
            f"Analyse these {len(trimmed)} transactions covering the past "
            f"{period_days} days:\n\n{json.dumps(trimmed, default=str)}"
        )

        model = self._settings.anthropic_model_sonnet
        async with self._llm.concurrency_slot():
            message = await self._llm.raw.messages.create(
                model=model,
                system=BEHAVIORAL_SYSTEM_PROMPT,
                messages=cast(Any, [{"role": "user", "content": user_content}]),
                max_tokens=800,
            )

        text = _extract_text(message)
        parsed = _parse_json(text)
        summary = ""
        patterns: list[BehavioralPattern] = []
        if isinstance(parsed, dict):
            summary = str(parsed.get("summary", "")).strip()[:240]
            raw_patterns = parsed.get("patterns", [])
            if isinstance(raw_patterns, list):
                for raw in raw_patterns:
                    if not isinstance(raw, dict):
                        continue
                    severity_raw = raw.get("severity", "info")
                    severity: InsightSeverity = (
                        severity_raw if severity_raw in ("info", "warning", "critical") else "info"
                    )
                    evidence_raw = raw.get("evidence", [])
                    evidence = (
                        [str(e) for e in evidence_raw if isinstance(e, str)]
                        if isinstance(evidence_raw, list)
                        else []
                    )
                    patterns.append(
                        BehavioralPattern(
                            pattern=str(raw.get("pattern", "unknown"))[:60],
                            description=str(raw.get("description", ""))[:200],
                            evidence=evidence,
                            severity=severity,
                        )
                    )

        usage = TokenUsage(
            model=model,
            input_tokens=message.usage.input_tokens,
            output_tokens=message.usage.output_tokens,
            cost_usd=calculate_cost_usd(
                model, message.usage.input_tokens, message.usage.output_tokens
            ),
        )
        return BehavioralAnalysisResponse(
            summary=summary or "No material behavioural patterns detected.",
            patterns=patterns,
            usage=usage,
        )


def _empty_response(model: str) -> BehavioralAnalysisResponse:
    return BehavioralAnalysisResponse(
        summary="No transactions in the analysis window.",
        patterns=[],
        usage=TokenUsage(model=model, input_tokens=0, output_tokens=0, cost_usd=0.0),
    )


def _extract_text(message: Any) -> str:
    blocks = getattr(message, "content", []) or []
    parts: list[str] = []
    for block in blocks:
        if getattr(block, "type", None) == "text":
            parts.append(block.text)
    return "".join(parts).strip()


def _parse_json(text: str) -> Any:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
        cleaned = cleaned.strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None
