"""``POST /internal/behavioral/analyze`` — behavioural pattern analysis."""

from __future__ import annotations

from fastapi import APIRouter

from ai_service.api.auth import InternalUserId
from ai_service.api.deps import BehavioralCoachDep
from ai_service.models import BehavioralAnalysisRequest, BehavioralAnalysisResponse

router = APIRouter(prefix="/internal/behavioral", tags=["behavioral"])


@router.post("/analyze", response_model=BehavioralAnalysisResponse)
async def analyze_behaviour(
    payload: BehavioralAnalysisRequest,
    user_id: InternalUserId,
    coach: BehavioralCoachDep,
) -> BehavioralAnalysisResponse:
    return await coach.analyze(user_id=user_id, period_days=payload.period_days)
