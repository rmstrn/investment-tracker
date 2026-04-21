"""Pydantic schemas shared across AI Service agents and endpoints.

These are the public request/response shapes for the internal API plus the
wire format for the SSE stream. Anthropic-specific types stay inside
``ai_service.llm`` and don't leak out of the module boundary.
"""

from __future__ import annotations

from typing import Annotated, Any, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

# ---------------------------------------------------------------------------
# Chat
# ---------------------------------------------------------------------------

ChatRole = Literal["user", "assistant"]


class ChatMessage(BaseModel):
    """Single turn in a conversation (user or assistant)."""

    model_config = ConfigDict(extra="forbid")

    role: ChatRole
    content: str


class ChatRequest(BaseModel):
    """Incoming chat request from Core API."""

    model_config = ConfigDict(extra="forbid")

    conversation_id: UUID
    # min_length/max_length MUST stay in sync with
    # apps/api/internal/handlers/ai_chat_request.go userMessageMaxChars
    # (Sprint C cluster 3a will collapse this duplication; until
    # then any change here needs the same edit on the Go side).
    message: str = Field(min_length=1, max_length=8000)
    # max_length MUST stay in sync with
    # apps/api/internal/handlers/ai_chat_request.go historyCap (40).
    history: list[ChatMessage] = Field(default_factory=list, max_length=40)


# ---- SSE stream events ----------------------------------------------------


class TokenUsage(BaseModel):
    """Token accounting for one Claude call."""

    model_config = ConfigDict(extra="forbid")

    model: str
    input_tokens: int = Field(ge=0)
    output_tokens: int = Field(ge=0)
    cost_usd: float = Field(ge=0.0)


class MessageStartEvent(BaseModel):
    type: Literal["message_start"] = "message_start"
    message_id: str


class ContentBlockStartEvent(BaseModel):
    type: Literal["content_block_start"] = "content_block_start"
    index: int
    block_type: Literal["text", "tool_use"]


class ContentDeltaEvent(BaseModel):
    type: Literal["content_delta"] = "content_delta"
    text: str


class ContentBlockStopEvent(BaseModel):
    type: Literal["content_block_stop"] = "content_block_stop"
    index: int


class ToolUseEvent(BaseModel):
    type: Literal["tool_use"] = "tool_use"
    tool_use_id: str
    name: str
    input: dict[str, Any]


class ToolResultEvent(BaseModel):
    type: Literal["tool_result"] = "tool_result"
    tool_use_id: str
    is_error: bool = False
    # Stringified JSON payload — Anthropic tool_result blocks accept free-form
    # text, and Core API's openapi schema models this as a string too.
    content: str


class MessageStopEvent(BaseModel):
    type: Literal["message_stop"] = "message_stop"
    stop_reason: Literal["end_turn", "max_tokens", "tool_use", "error"]
    usage: TokenUsage


class ErrorEvent(BaseModel):
    type: Literal["error"] = "error"
    message: str
    code: str | None = None


ChatStreamEvent = Annotated[
    MessageStartEvent
    | ContentBlockStartEvent
    | ContentDeltaEvent
    | ContentBlockStopEvent
    | ToolUseEvent
    | ToolResultEvent
    | MessageStopEvent
    | ErrorEvent,
    Field(discriminator="type"),
]


# ---------------------------------------------------------------------------
# Insights
# ---------------------------------------------------------------------------

InsightType = Literal[
    "concentration_risk",
    "behavioral_pattern",
    "upcoming_dividend",
    "performance_anomaly",
    "allocation_drift",
]

InsightSeverity = Literal["info", "warning", "critical"]


class Insight(BaseModel):
    """One proactive insight. Matches the Core API `Insight` schema shape."""

    model_config = ConfigDict(extra="forbid")

    insight_type: InsightType
    title: str = Field(min_length=1, max_length=120)
    body: str = Field(min_length=1, max_length=2000)
    severity: InsightSeverity = "info"
    data: dict[str, Any] | None = None


class InsightGenerationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    insight_type: InsightType | None = None
    period_days: int = Field(default=30, ge=1, le=365)


class InsightGenerationResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    insights: list[Insight]
    usage: list[TokenUsage] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Behavioral coach
# ---------------------------------------------------------------------------


class BehavioralPattern(BaseModel):
    model_config = ConfigDict(extra="forbid")

    pattern: str  # e.g. "buying_local_highs", "over_trading", "panic_selling"
    description: str
    evidence: list[str] = Field(default_factory=list)
    severity: InsightSeverity = "info"


class BehavioralAnalysisRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    period_days: int = Field(default=90, ge=7, le=365)


class BehavioralAnalysisResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    summary: str
    patterns: list[BehavioralPattern]
    usage: TokenUsage


# ---------------------------------------------------------------------------
# Explainer
# ---------------------------------------------------------------------------

UserLevel = Literal["novice", "intermediate", "advanced"]


class ExplainRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    term: str = Field(min_length=1, max_length=100)
    user_level: UserLevel = "novice"
    context: str | None = Field(default=None, max_length=500)


class ExplainResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    term: str
    explanation: str
    usage: TokenUsage
