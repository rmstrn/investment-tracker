"""Internal-caller auth for the AI service.

Every endpoint under ``/internal/*`` requires two headers, both supplied by
Core API after it has validated the end-user's Clerk JWT:

- ``Authorization: Bearer {INTERNAL_API_TOKEN}`` — proves the caller is Core API.
- ``X-User-Id: {uuid}`` — identifies the end-user on whose behalf the call is made.

The header names are pinned in ``ai_service.http_headers``. FastAPI's
``Header(alias=...)`` requires a literal string so we assert at import
time that the alias matches the shared constant; the
``tools/scripts/check-header-symmetry.py`` CI step is the
authoritative cross-language drift guard.

The AI service never faces the public internet, but we still compare tokens
with ``secrets.compare_digest`` to stop leaking length via timing.
"""

from __future__ import annotations

import secrets
from typing import Annotated
from uuid import UUID

from fastapi import Depends, Header, HTTPException, status

from ai_service.config import Settings, get_settings
from ai_service.http_headers import AUTHORIZATION as _AUTHORIZATION_HEADER
from ai_service.http_headers import USER_ID as _USER_ID_HEADER

# FastAPI Header(alias=...) must be a literal string (validated at
# decorator time, not runtime). Assert the literal stays wired to
# the shared constants so a rename in ``ai_service.http_headers``
# without a matching edit here fails at import time rather than at
# first request.
assert _USER_ID_HEADER == "X-User-Id", (
    "ai_service.http_headers.UserID drifted; update Header alias below"
)
assert _AUTHORIZATION_HEADER == "Authorization", (
    "ai_service.http_headers.Authorization drifted; update Header alias below"
)


def _verify_bearer(
    authorization: str,
    settings: Settings,
) -> None:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )
    presented = authorization.removeprefix("Bearer ").strip()
    expected = settings.internal_api_token.get_secret_value()
    if not expected or not secrets.compare_digest(presented, expected):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal token",
        )


def internal_user_id(
    settings: Annotated[Settings, Depends(get_settings)],
    authorization: Annotated[str, Header(alias="Authorization")] = "",
    x_user_id: Annotated[str, Header(alias="X-User-Id")] = "",
) -> UUID:
    """FastAPI dependency: verify internal bearer + parse X-User-Id as UUID."""
    _verify_bearer(authorization, settings)

    if not x_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing X-User-Id header",
        )
    try:
        return UUID(x_user_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="X-User-Id must be a UUID",
        ) from exc


InternalUserId = Annotated[UUID, Depends(internal_user_id)]
