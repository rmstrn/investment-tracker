"""``POST /internal/behavioral/analyze`` — behavioural pattern analysis."""

from __future__ import annotations

from fastapi import APIRouter

from ai_service.api.auth import InternalUserId
from ai_service.api.deps import BehavioralCoachDep, CoreAPIDep
from ai_service.models import BehavioralAnalysisRequest, BehavioralAnalysisResponse

router = APIRouter(prefix="/internal/behavioral", tags=["behavioral"])


@router.post("/analyze", response_model=BehavioralAnalysisResponse)
async def analyze_behaviour(
    payload: BehavioralAnalysisRequest,
    user_id: InternalUserId,
    coach: BehavioralCoachDep,
    core_api: CoreAPIDep,
) -> BehavioralAnalysisResponse:
    response = await coach.analyze(user_id=user_id, period_days=payload.period_days)
    await core_api.record_ai_usage(
        user_id=user_id,
        conversation_id=None,
        model=response.usage.model,
        input_tokens=response.usage.input_tokens,
        output_tokens=response.usage.output_tokens,
        cost_usd=response.usage.cost_usd,
    )
    return response
