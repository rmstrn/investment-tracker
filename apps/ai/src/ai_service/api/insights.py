"""``POST /internal/insights/generate`` — proactive insight generation."""

from __future__ import annotations

from fastapi import APIRouter

from ai_service.api.auth import InternalUserId
from ai_service.api.deps import CoreAPIDep, InsightGeneratorDep
from ai_service.models import InsightGenerationRequest, InsightGenerationResponse

router = APIRouter(prefix="/internal/insights", tags=["insights"])


@router.post("/generate", response_model=InsightGenerationResponse)
async def generate_insights(
    payload: InsightGenerationRequest,
    user_id: InternalUserId,
    generator: InsightGeneratorDep,
    core_api: CoreAPIDep,
) -> InsightGenerationResponse:
    insights, usages = await generator.generate(
        user_id=user_id,
        insight_type=payload.insight_type,
        period_days=payload.period_days,
    )
    # Record each LLM call's usage — fire-and-forget, stubbed until Core API
    # exposes /internal/ai/usage.
    for usage in usages:
        await core_api.record_ai_usage(
            user_id=user_id,
            conversation_id=None,
            model=usage.model,
            input_tokens=usage.input_tokens,
            output_tokens=usage.output_tokens,
            cost_usd=usage.cost_usd,
        )
    return InsightGenerationResponse(insights=insights, usage=usages)
