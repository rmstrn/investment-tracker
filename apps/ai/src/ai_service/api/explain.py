"""``POST /internal/explain`` — plain-language term explanation."""

from __future__ import annotations

from fastapi import APIRouter

from ai_service.api.auth import InternalUserId
from ai_service.api.deps import ExplainerDep
from ai_service.models import ExplainRequest, ExplainResponse

router = APIRouter(prefix="/internal/explain", tags=["explain"])


@router.post("", response_model=ExplainResponse)
async def explain_term(
    payload: ExplainRequest,
    user_id: InternalUserId,
    explainer: ExplainerDep,
) -> ExplainResponse:
    # Usage is recorded inside Explainer.explain() itself.
    return await explainer.explain(user_id=user_id, req=payload)
