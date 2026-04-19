"""Runtime configuration for the AI service.

Populated from environment variables (see apps/ai/.env.example). Secrets are
wrapped in ``SecretStr`` so they never leak into repr/logs accidentally.
"""

from __future__ import annotations

from functools import lru_cache

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment-backed settings."""

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # -- App ----------------------------------------------------------------
    app_name: str = "ai-service"
    environment: str = Field(default="development", alias="ENVIRONMENT")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    host: str = Field(default="0.0.0.0", alias="AI_LISTEN_HOST")  # noqa: S104
    port: int = Field(default=8000, alias="AI_LISTEN_PORT")

    # -- Incoming auth (Core API → AI Service) ------------------------------
    # Bearer token that Core API uses to authenticate its requests to us.
    internal_api_token: SecretStr = Field(
        default=SecretStr("dev-internal-token"),
        alias="INTERNAL_API_TOKEN",
    )

    # -- Anthropic ----------------------------------------------------------
    anthropic_api_key: SecretStr = Field(
        default=SecretStr(""),
        alias="ANTHROPIC_API_KEY",
    )
    # Project-pinned models. See memory note / docs/DECISIONS.md.
    anthropic_model_sonnet: str = Field(
        default="claude-sonnet-4-6",
        alias="ANTHROPIC_MODEL_SONNET",
    )
    anthropic_model_haiku: str = Field(
        default="claude-haiku-4-5-20251001",
        alias="ANTHROPIC_MODEL_HAIKU",
    )
    anthropic_model_opus: str = Field(
        default="claude-opus-4-6",
        alias="ANTHROPIC_MODEL_OPUS",
    )
    anthropic_max_concurrent: int = Field(
        default=10,
        alias="ANTHROPIC_MAX_CONCURRENT",
        description="Process-local semaphore cap for concurrent Claude requests.",
    )
    anthropic_timeout_seconds: float = Field(
        default=60.0,
        alias="ANTHROPIC_TIMEOUT_SECONDS",
    )
    anthropic_max_retries: int = Field(
        default=2,
        alias="ANTHROPIC_MAX_RETRIES",
    )

    # -- Outgoing: Core API -------------------------------------------------
    # AI Service → Core API. Auth: Authorization: Bearer {token} + X-User-Id.
    core_api_url: str = Field(
        default="http://localhost:8080",
        alias="CORE_API_URL",
    )
    core_api_internal_token: SecretStr = Field(
        default=SecretStr("dev-core-internal-token"),
        alias="CORE_API_INTERNAL_TOKEN",
    )
    core_api_timeout_seconds: float = Field(
        default=30.0,
        alias="CORE_API_TIMEOUT_SECONDS",
    )

    # -- Observability ------------------------------------------------------
    sentry_dsn: str | None = Field(default=None, alias="SENTRY_DSN")
    sentry_traces_sample_rate: float = Field(
        default=0.1,
        alias="SENTRY_TRACES_SAMPLE_RATE",
    )

    posthog_api_key: SecretStr | None = Field(default=None, alias="POSTHOG_API_KEY")
    posthog_host: str = Field(
        default="https://us.i.posthog.com",
        alias="POSTHOG_HOST",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()
