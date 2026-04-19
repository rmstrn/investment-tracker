"""Sentry + PostHog setup helpers.

Both integrations are optional — if the corresponding secret is missing, we
no-op. This keeps local dev frictionless (no fake DSN required) and means a
misconfigured prod pod logs a warning instead of crashing.
"""

from __future__ import annotations

import structlog

from ai_service.config import Settings

log = structlog.get_logger(__name__)

# Module-global PostHog client. ``None`` when POSTHOG_API_KEY is unset.
_posthog_client: object | None = None


def init_sentry(settings: Settings) -> None:
    """Initialise Sentry if ``SENTRY_DSN`` is set."""
    if not settings.sentry_dsn:
        return
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.starlette import StarletteIntegration

    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.environment,
        traces_sample_rate=settings.sentry_traces_sample_rate,
        integrations=[StarletteIntegration(), FastApiIntegration()],
        send_default_pii=False,
    )
    log.info("sentry_initialised", environment=settings.environment)


def init_posthog(settings: Settings) -> None:
    """Initialise the PostHog client if ``POSTHOG_API_KEY`` is set."""
    global _posthog_client
    if settings.posthog_api_key is None:
        return
    from posthog import Posthog

    _posthog_client = Posthog(
        project_api_key=settings.posthog_api_key.get_secret_value(),
        host=settings.posthog_host,
    )
    log.info("posthog_initialised", host=settings.posthog_host)


def shutdown_posthog() -> None:
    global _posthog_client
    if _posthog_client is None:
        return
    try:
        _posthog_client.shutdown()  # type: ignore[attr-defined]
    except Exception:  # noqa: BLE001
        log.exception("posthog_shutdown_failed")
    _posthog_client = None
