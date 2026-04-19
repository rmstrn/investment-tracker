"""Proactive insights generator.

Implements the rule-based pre-filter → LLM formatting flow from TASK_05 §4.
Keeping the decision of *whether* there's something to say out of the LLM's
mouth is a hard requirement — it keeps per-user AI spend bounded and stops us
from generating generic "watch your portfolio" filler.

Five insight types:

| type                   | rule                                             | model  |
|------------------------|--------------------------------------------------|--------|
| concentration_risk     | single position > 25% of portfolio value         | Haiku  |
| behavioral_pattern     | more than 3 trades in the last 7 days            | Sonnet |
| upcoming_dividend      | a dividend ex-date within the next 14 days       | Haiku  |
| performance_anomaly    | ≥5pp vs SPX benchmark over 1m                    | Haiku  |
| allocation_drift       | any asset class > 60% of total (drift proxy)     | Haiku  |

``allocation_drift`` is a MVP approximation — without a historical allocation
baseline exposed by Core API we can't compare current vs N-days-ago weights.
Tracked as a gap for a follow-up once ``/portfolio/snapshots`` or similar is
available.
"""

from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from typing import Any, cast
from uuid import UUID

import structlog
from pydantic import ValidationError

from ai_service.clients.core_api import CoreAPIClient, CoreAPIError
from ai_service.config import Settings
from ai_service.llm.client import AnthropicClient
from ai_service.llm.pricing import calculate_cost_usd
from ai_service.llm.prompts import INSIGHT_SYSTEM_PROMPT, INSIGHT_USER_TEMPLATES
from ai_service.models import Insight, InsightSeverity, InsightType, TokenUsage

log = structlog.get_logger(__name__)

# Rule-based thresholds — pulled to the top so they're easy to tune.
CONCENTRATION_THRESHOLD = 25.0  # percent of total portfolio value
OVER_TRADING_TRADES = 3
OVER_TRADING_WINDOW_DAYS = 7
DIVIDEND_LOOKAHEAD_DAYS = 14
PERFORMANCE_DIVERGENCE_PP = 5.0
ALLOCATION_HEAVY_ASSET_CLASS_PCT = 60.0


class InsightGenerator:
    def __init__(
        self,
        llm: AnthropicClient,
        core_api: CoreAPIClient,
        settings: Settings,
    ) -> None:
        self._llm = llm
        self._core_api = core_api
        self._settings = settings

    async def generate(
        self,
        user_id: UUID,
        insight_type: InsightType | None = None,
        period_days: int = 30,
    ) -> tuple[list[Insight], list[TokenUsage]]:
        """Run rule-based pre-filter + LLM formatting for each matched type.

        Returns the list of generated insights plus per-call usage records
        (caller is responsible for persisting/emitting them).
        """
        portfolio = await self._safe_fetch(self._core_api.get_portfolio(user_id))
        transactions = await self._safe_fetch(self._core_api.list_transactions(user_id, limit=100))

        candidates: list[tuple[InsightType, dict[str, Any], str, InsightSeverity]] = []

        if (
            insight_type in (None, "concentration_risk")
            and portfolio is not None
            and (evidence := self._check_concentration(portfolio)) is not None
        ):
            candidates.append(
                (
                    "concentration_risk",
                    evidence,
                    self._settings.anthropic_model_haiku,
                    "warning",
                )
            )

        if (
            insight_type in (None, "behavioral_pattern")
            and transactions is not None
            and (evidence := self._check_over_trading(transactions)) is not None
        ):
            candidates.append(
                (
                    "behavioral_pattern",
                    evidence,
                    self._settings.anthropic_model_sonnet,
                    "info",
                )
            )

        if insight_type in (None, "upcoming_dividend"):
            dividends = await self._fetch_upcoming_dividends(user_id)
            if dividends is not None and (evidence := self._check_dividend(dividends)):
                candidates.append(
                    (
                        "upcoming_dividend",
                        evidence,
                        self._settings.anthropic_model_haiku,
                        "info",
                    )
                )

        if insight_type in (None, "performance_anomaly"):
            perf = await self._fetch_performance(user_id)
            if perf is not None and (evidence := self._check_performance_anomaly(perf)):
                candidates.append(
                    (
                        "performance_anomaly",
                        evidence,
                        self._settings.anthropic_model_haiku,
                        "info",
                    )
                )

        if (
            insight_type in (None, "allocation_drift")
            and portfolio is not None
            and (evidence := self._check_allocation_drift(portfolio)) is not None
        ):
            candidates.append(
                (
                    "allocation_drift",
                    evidence,
                    self._settings.anthropic_model_haiku,
                    "info",
                )
            )

        insights: list[Insight] = []
        usages: list[TokenUsage] = []
        for itype, evidence, model, default_severity in candidates:
            pair = await self._format_insight(
                itype=itype,
                evidence=evidence,
                model=model,
                default_severity=default_severity,
            )
            if pair is None:
                continue
            insight, usage = pair
            insights.append(insight)
            usages.append(usage)

        return insights, usages

    # ------------------------------------------------------------------
    # Rule-based pre-filters
    # ------------------------------------------------------------------

    @staticmethod
    def _check_concentration(portfolio: dict[str, Any]) -> dict[str, Any] | None:
        total_value = _money_amount(portfolio.get("total_value"))
        currency = portfolio.get("currency", "USD")
        positions = _as_list(portfolio.get("top_positions"))
        if total_value <= 0 or not positions:
            return None

        top = max(
            positions,
            key=lambda p: _money_amount(p.get("market_value")),
            default=None,
        )
        if top is None:
            return None
        top_value = _money_amount(top.get("market_value"))
        if top_value <= 0:
            return None
        percentage = (top_value / total_value) * 100
        if percentage < CONCENTRATION_THRESHOLD:
            return None
        return {
            "symbol": top.get("symbol", "?"),
            "percentage": percentage,
            "total_value": total_value,
            "currency": currency,
        }

    @staticmethod
    def _check_over_trading(transactions: dict[str, Any]) -> dict[str, Any] | None:
        rows = _as_list(transactions.get("data"))
        if not rows:
            return None
        now = datetime.now(UTC)
        cutoff = now - timedelta(days=OVER_TRADING_WINDOW_DAYS)
        recent = [
            r
            for r in rows
            if _parse_dt(r.get("executed_at")) >= cutoff
            and r.get("transaction_type") in {"buy", "sell"}
        ]
        if len(recent) <= OVER_TRADING_TRADES:
            return None
        evidence_lines = [
            f"{r.get('executed_at')}: {r.get('transaction_type')} "
            f"{r.get('quantity')} {r.get('symbol')}"
            for r in recent[:8]
        ]
        return {
            "pattern": "over_trading",
            "evidence": " | ".join(evidence_lines),
        }

    @staticmethod
    def _check_dividend(dividends: list[dict[str, Any]]) -> dict[str, Any] | None:
        today = datetime.now(UTC).date()
        horizon = today + timedelta(days=DIVIDEND_LOOKAHEAD_DAYS)
        upcoming = []
        for d in dividends:
            raw = d.get("ex_date")
            if not isinstance(raw, str):
                continue
            try:
                ex_date = datetime.strptime(raw, "%Y-%m-%d").date()
            except ValueError:
                continue
            if today <= ex_date <= horizon:
                upcoming.append((ex_date, d))
        if not upcoming:
            return None
        ex_date, d = min(upcoming, key=lambda t: t[0])
        return {
            "symbol": d.get("symbol", "?"),
            "ex_date": ex_date.isoformat(),
            "amount": d.get("amount") or d.get("estimated_amount") or "",
            "currency": d.get("currency", "USD"),
        }

    @staticmethod
    def _check_performance_anomaly(perf: dict[str, Any]) -> dict[str, Any] | None:
        portfolio_ret = _float(perf.get("return_pct"))
        benchmark_ret = _float(perf.get("benchmark_return_pct"))
        if portfolio_ret is None or benchmark_ret is None:
            return None
        if abs(portfolio_ret - benchmark_ret) < PERFORMANCE_DIVERGENCE_PP:
            return None
        contributors = _as_list(perf.get("contributors"))
        top = max(
            contributors,
            key=lambda c: abs(_float(c.get("contribution_pct")) or 0.0),
            default={"symbol": "?", "contribution_pct": 0.0},
        )
        return {
            "period": perf.get("period", "1m"),
            "benchmark": perf.get("benchmark", "SPX"),
            "return_pct": portfolio_ret,
            "benchmark_return_pct": benchmark_ret,
            "top_mover": top.get("symbol", "?"),
            "top_mover_pct": _float(top.get("contribution_pct")) or 0.0,
        }

    @staticmethod
    def _check_allocation_drift(portfolio: dict[str, Any]) -> dict[str, Any] | None:
        by_asset_type = portfolio.get("by_asset_type")
        if not isinstance(by_asset_type, dict) or not by_asset_type:
            return None
        # Pick the heaviest class; emit if it exceeds the drift threshold.
        # MVP proxy — see module docstring.
        top_class, top_weight = max(
            ((k, _float(v) or 0.0) for k, v in by_asset_type.items()),
            key=lambda t: t[1],
        )
        pct = top_weight * 100 if top_weight <= 1.0 else top_weight
        if pct < ALLOCATION_HEAVY_ASSET_CLASS_PCT:
            return None
        return {
            "asset_class": top_class,
            "current_pct": pct,
            "baseline_pct": 50.0,  # placeholder baseline until historical snapshots are exposed
            "drift_pct": pct - 50.0,
        }

    # ------------------------------------------------------------------
    # LLM formatting
    # ------------------------------------------------------------------

    async def _format_insight(
        self,
        *,
        itype: InsightType,
        evidence: dict[str, Any],
        model: str,
        default_severity: InsightSeverity,
    ) -> tuple[Insight, TokenUsage] | None:
        template = INSIGHT_USER_TEMPLATES.get(itype)
        if template is None:
            return None
        user_content = template.format(**evidence)

        async with self._llm.concurrency_slot():
            response = await self._llm.raw.messages.create(
                model=model,
                system=INSIGHT_SYSTEM_PROMPT,
                messages=cast(
                    Any,
                    [{"role": "user", "content": user_content}],
                ),
                max_tokens=400,
            )

        text = _extract_text(response)
        parsed = _parse_insight_json(text)
        if parsed is None:
            log.warning("insight_parse_failed", insight_type=itype, raw=text[:200])
            return None

        severity: InsightSeverity = parsed.get("severity", default_severity)
        insight = Insight(
            insight_type=itype,
            title=str(parsed.get("title", "")).strip()[:120] or _fallback_title(itype),
            body=str(parsed.get("body", "")).strip()[:2000],
            severity=severity if severity in ("info", "warning", "critical") else default_severity,
            data=evidence,
        )
        if not insight.body:
            return None

        usage = TokenUsage(
            model=model,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
            cost_usd=calculate_cost_usd(
                model, response.usage.input_tokens, response.usage.output_tokens
            ),
        )
        return insight, usage

    # ------------------------------------------------------------------
    # Data fetch helpers
    # ------------------------------------------------------------------

    async def _fetch_upcoming_dividends(self, user_id: UUID) -> list[dict[str, Any]] | None:
        today = datetime.now(UTC).date().isoformat()
        horizon = (datetime.now(UTC) + timedelta(days=DIVIDEND_LOOKAHEAD_DAYS)).date().isoformat()
        try:
            resp = await self._core_api.get_portfolio_dividends(
                user_id, from_=today, to=horizon, limit=20
            )
        except CoreAPIError as exc:
            # 403 FEATURE_LOCKED for Free users is expected — skip silently.
            if exc.status_code == 403:
                return None
            log.warning("dividends_fetch_failed", status=exc.status_code)
            return None
        rows = resp.get("data")
        return rows if isinstance(rows, list) else None

    async def _fetch_performance(self, user_id: UUID) -> dict[str, Any] | None:
        try:
            return await self._core_api.get_portfolio_performance(
                user_id, period="1m", benchmark="SPX"
            )
        except CoreAPIError as exc:
            if exc.status_code in (403, 404):
                return None
            log.warning("performance_fetch_failed", status=exc.status_code)
            return None

    @staticmethod
    async def _safe_fetch(coro: Any) -> dict[str, Any] | None:
        try:
            return cast(dict[str, Any], await coro)
        except CoreAPIError as exc:
            log.warning("core_api_fetch_failed", status=exc.status_code)
            return None


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------


def _money_amount(value: Any) -> float:
    """Accept either a number or a {amount, currency} Money object."""
    if value is None:
        return 0.0
    if isinstance(value, int | float):
        return float(value)
    if isinstance(value, dict):
        amount = value.get("amount")
        if isinstance(amount, int | float):
            return float(amount)
        if isinstance(amount, str):
            try:
                return float(amount)
            except ValueError:
                return 0.0
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return 0.0
    return 0.0


def _as_list(value: Any) -> list[dict[str, Any]]:
    if isinstance(value, list):
        return [v for v in value if isinstance(v, dict)]
    return []


def _float(value: Any) -> float | None:
    if isinstance(value, int | float):
        return float(value)
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return None
    return None


def _parse_dt(value: Any) -> datetime:
    if not isinstance(value, str):
        return datetime.min.replace(tzinfo=UTC)
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return datetime.min.replace(tzinfo=UTC)
    return dt if dt.tzinfo is not None else dt.replace(tzinfo=UTC)


def _extract_text(message: Any) -> str:
    """Pull plain text out of an Anthropic ``Message.content`` list."""
    blocks = getattr(message, "content", []) or []
    parts: list[str] = []
    for block in blocks:
        if getattr(block, "type", None) == "text":
            parts.append(block.text)
    return "".join(parts).strip()


def _parse_insight_json(text: str) -> dict[str, Any] | None:
    """Best-effort JSON extract. Handles code-fenced output."""
    if not text:
        return None
    cleaned = text.strip()
    if cleaned.startswith("```"):
        # strip ```json ... ``` fences
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
        cleaned = cleaned.strip()
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        return None
    return data if isinstance(data, dict) else None


def _fallback_title(itype: InsightType) -> str:
    titles: dict[InsightType, str] = {
        "concentration_risk": "Heavy concentration in one position",
        "behavioral_pattern": "Pattern in recent trading",
        "upcoming_dividend": "Upcoming dividend",
        "performance_anomaly": "Performance stands out vs benchmark",
        "allocation_drift": "Asset-class allocation weight is high",
    }
    return titles[itype]


# ``ValidationError`` imported for its side effect — Pydantic surfaces it in
# public typing even though we catch via ``try``/``except`` above in callers
# that may land here. Keep the reference so type-checkers see the import.
_ = ValidationError
