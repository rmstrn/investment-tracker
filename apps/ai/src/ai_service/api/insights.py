"""``POST /internal/insights/generate`` — proactive insight generation."""

from __future__ import annotations

from fastapi import APIRouter

from ai_service.api.auth import InternalUserId
from ai_service.api.deps import InsightGeneratorDep
from ai_service.models import InsightGenerationRequest, InsightGenerationResponse

router = APIRouter(prefix="/internal/insights", tags=["insights"])


@router.post("/generate", response_model=InsightGenerationResponse)
async def generate_insights(
    payload: InsightGenerationRequest,
    user_id: InternalUserId,
    generator: InsightGeneratorDep,
) -> InsightGenerationResponse:
    insights, usages = await generator.generate(
        user_id=user_id,
        insight_type=payload.insight_type,
        period_days=payload.period_days,
    )
    return InsightGenerationResponse(insights=insights, usage=usages)
