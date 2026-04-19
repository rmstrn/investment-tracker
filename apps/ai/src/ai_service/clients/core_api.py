"""HTTP client for Core API tool calls.

Auth model (see memory note / docs/DECISIONS.md):

    Authorization: Bearer {CORE_API_INTERNAL_TOKEN}
    X-User-Id: {uuid}

Core API recognises the bearer token as internal-caller mode and uses
``X-User-Id`` as identity instead of validating a Clerk JWT. Endpoints used
are the **public** ones from ``tools/openapi/openapi.yaml`` — there is no
separate ``/internal/*`` tool surface on Core API side.

One exception: ``record_ai_usage`` targets ``POST /internal/ai/usage`` which
Core API has **not yet exposed** (tracked in TASK_04 follow-up). Until it
lands, the stub logs structurally and emits a PostHog event, and silently
swallows a 404/connection error from Core API so chat flow is not blocked by
an observability pipeline that isn't wired up yet.
"""

from __future__ import annotations

from typing import Any
from uuid import UUID

import httpx
import structlog

from ai_service.config import Settings
from ai_service.observability import capture_ai_usage

log = structlog.get_logger(__name__)


class CoreAPIError(Exception):
    """Core API returned a non-2xx response."""

    def __init__(self, status_code: int, body: str) -> None:
        super().__init__(f"Core API error {status_code}: {body[:500]}")
        self.status_code = status_code
        self.body = body


class CoreAPIClient:
    """Thin async client over ``httpx.AsyncClient``. Stateless between calls.

    The underlying ``httpx.AsyncClient`` is created once per process at
    startup (FastAPI lifespan) and injected here so connection pooling and
    transport (including ``MockTransport`` for tests) stay swappable.
    """

    def __init__(self, http_client: httpx.AsyncClient, settings: Settings) -> None:
        self._client = http_client
        self._base_url = settings.core_api_url.rstrip("/")
        self._token = settings.core_api_internal_token.get_secret_value()

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _headers(self, user_id: UUID) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self._token}",
            "X-User-Id": str(user_id),
            "Accept": "application/json",
        }

    async def _get(
        self,
        path: str,
        user_id: UUID,
        params: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        url = f"{self._base_url}{path}"
        resp = await self._client.get(
            url,
            headers=self._headers(user_id),
            params={k: v for k, v in (params or {}).items() if v is not None},
        )
        if resp.status_code >= 400:
            raise CoreAPIError(resp.status_code, resp.text)
        data: dict[str, Any] = resp.json()
        return data

    # ------------------------------------------------------------------
    # Tool-backing reads
    # ------------------------------------------------------------------

    async def get_portfolio(
        self,
        user_id: UUID,
        currency: str | None = None,
    ) -> dict[str, Any]:
        return await self._get("/portfolio", user_id, {"currency": currency})

    async def list_positions(
        self,
        user_id: UUID,
        group_by: str = "symbol",
        sort: str = "value_desc",
        currency: str | None = None,
    ) -> dict[str, Any]:
        return await self._get(
            "/positions",
            user_id,
            {"group_by": group_by, "sort": sort, "currency": currency},
        )

    async def list_transactions(
        self,
        user_id: UUID,
        symbol: str | None = None,
        asset_type: str | None = None,
        from_: str | None = None,
        to: str | None = None,
        limit: int | None = None,
    ) -> dict[str, Any]:
        return await self._get(
            "/transactions",
            user_id,
            {
                "symbol": symbol,
                "asset_type": asset_type,
                "from": from_,
                "to": to,
                "limit": limit,
            },
        )

    async def get_portfolio_performance(
        self,
        user_id: UUID,
        period: str,
        benchmark: str,
        currency: str | None = None,
    ) -> dict[str, Any]:
        return await self._get(
            "/portfolio/performance",
            user_id,
            {"period": period, "benchmark": benchmark, "currency": currency},
        )

    async def get_market_quote(
        self,
        user_id: UUID,
        symbol: str,
        asset_type: str,
    ) -> dict[str, Any]:
        return await self._get(
            "/market/quote",
            user_id,
            {"symbol": symbol, "asset_type": asset_type},
        )

    async def get_portfolio_dividends(
        self,
        user_id: UUID,
        from_: str | None = None,
        to: str | None = None,
        limit: int | None = None,
    ) -> dict[str, Any]:
        return await self._get(
            "/portfolio/dividends",
            user_id,
            {"from": from_, "to": to, "limit": limit},
        )

    # ------------------------------------------------------------------
    # Writes
    # ------------------------------------------------------------------

    async def record_ai_usage(
        self,
        user_id: UUID,
        conversation_id: UUID | None,
        model: str,
        input_tokens: int,
        output_tokens: int,
        cost_usd: float,
    ) -> None:
        """Record token usage. STUB — real endpoint is TASK_04 follow-up.

        Target endpoint (not yet exposed by Core API):
            POST /internal/ai/usage
            body: {user_id, conversation_id, input_tokens, output_tokens,
                   cost_usd, model}
        """
        log.info(
            "ai_usage_recorded",
            user_id=str(user_id),
            conversation_id=str(conversation_id) if conversation_id else None,
            model=model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            cost_usd=cost_usd,
        )
        capture_ai_usage(
            user_id=str(user_id),
            conversation_id=str(conversation_id) if conversation_id else None,
            model=model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            cost_usd=cost_usd,
        )

        body = {
            "user_id": str(user_id),
            "conversation_id": str(conversation_id) if conversation_id else None,
            "model": model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost_usd": cost_usd,
        }
        try:
            resp = await self._client.post(
                f"{self._base_url}/internal/ai/usage",
                headers=self._headers(user_id),
                json=body,
            )
            if resp.status_code == 404:
                # Endpoint not exposed yet — expected during TASK_04 parallel dev.
                log.debug("core_api_ai_usage_endpoint_missing")
            elif resp.status_code >= 400:
                log.warning(
                    "core_api_ai_usage_failed",
                    status_code=resp.status_code,
                    body=resp.text[:500],
                )
        except httpx.HTTPError as exc:
            # Don't fail the chat flow because the usage sink is down.
            log.warning("core_api_ai_usage_error", error=str(exc))
