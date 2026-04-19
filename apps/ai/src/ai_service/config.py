"""Runtime configuration for the AI service.

Real Settings schema lands in TASK_05 (Anthropic key, Postgres, Redis, limits, etc.).
This scaffold keeps just what the placeholder app needs.
"""

from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment-backed settings."""

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "ai-service"
    environment: str = Field(default="development", alias="ENVIRONMENT")
    host: str = Field(default="0.0.0.0", alias="AI_LISTEN_HOST")  # noqa: S104
    port: int = Field(default=8000, alias="AI_LISTEN_PORT")


def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()
