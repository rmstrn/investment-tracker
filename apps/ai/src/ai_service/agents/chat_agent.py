"""ChatAgent — streaming Claude chat with a tool-use loop.

Per-request behaviour:

1. Start a streaming ``messages.stream`` call to Claude with the 5 portfolio
   tools attached. Relay text deltas to the caller as ``ContentDeltaEvent``
   (plus block start/stop framing) so the UI shows a typing effect.
2. When the model stops with ``stop_reason == "tool_use"``, execute each
   requested tool via the registry, emit ``ToolUseEvent`` + ``ToolResultEvent``
   to the caller, and loop back with the tool results appended to the
   message history.
3. Stop when ``stop_reason`` is terminal (``end_turn`` / ``max_tokens`` /
   ``stop_sequence``) or after ``MAX_TOOL_ROUNDS`` iterations as a guard
   against runaway loops.
4. Emit a final ``MessageStopEvent`` with accumulated ``TokenUsage``.

Any exception raised inside the generator surfaces as a single ``ErrorEvent``
so the SSE consumer always gets a terminal frame.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from typing import Any, Literal, cast
from uuid import UUID

import structlog
from anthropic.types import ToolUseBlock

from ai_service.clients.core_api import CoreAPIClient
from ai_service.config import Settings
from ai_service.llm.client import AnthropicClient
from ai_service.llm.pricing import calculate_cost_usd
from ai_service.llm.prompts import CHAT_SYSTEM_PROMPT
from ai_service.models import (
    ChatMessage,
    ChatStreamEvent,
    ContentBlockStartEvent,
    ContentBlockStopEvent,
    ContentDeltaEvent,
    ErrorEvent,
    MessageStartEvent,
    MessageStopEvent,
    TokenUsage,
    ToolResultEvent,
    ToolUseEvent,
)
from ai_service.tools.registry import TOOL_SCHEMAS, execute_tool

log = structlog.get_logger(__name__)

# Guard against infinite tool-use loops. 6 rounds easily covers the "fetch
# portfolio → fetch a quote → answer" patterns we expect; anything beyond
# is a model misbehaviour we'd rather cut short.
MAX_TOOL_ROUNDS = 6

StopReason = Literal["end_turn", "max_tokens", "tool_use", "error"]


def _history_to_anthropic(history: list[ChatMessage]) -> list[dict[str, Any]]:
    return [{"role": m.role, "content": m.content} for m in history]


def _block_to_anthropic(block: Any) -> dict[str, Any]:
    """Convert an Anthropic SDK content block back to the wire dict shape.

    Used when re-sending the assistant's last turn as part of the next
    request in a tool-use loop.
    """
    if hasattr(block, "model_dump"):
        # pydantic-backed SDK blocks
        dumped = block.model_dump(exclude_none=True)
        return dict(dumped)
    # Best-effort fallback for dict-shaped blocks.
    return dict(block)


def _normalise_stop_reason(reason: str | None) -> StopReason:
    # ``stop_sequence`` doesn't exist in our public model — treat as end_turn.
    if reason == "tool_use":
        return "tool_use"
    if reason == "max_tokens":
        return "max_tokens"
    return "end_turn"


class ChatAgent:
    """Stateless chat agent — one instance per process, shared across requests."""

    def __init__(
        self,
        llm: AnthropicClient,
        core_api: CoreAPIClient,
        settings: Settings,
    ) -> None:
        self._llm = llm
        self._core_api = core_api
        self._settings = settings

    async def stream(
        self,
        user_id: UUID,
        conversation_id: UUID,
        message: str,
        history: list[ChatMessage] | None = None,
    ) -> AsyncIterator[ChatStreamEvent]:
        """Yield wire-format stream events for a single chat turn."""
        model = self._settings.anthropic_model_sonnet
        messages: list[dict[str, Any]] = [
            *_history_to_anthropic(history or []),
            {"role": "user", "content": message},
        ]

        total_input_tokens = 0
        total_output_tokens = 0
        final_stop_reason: StopReason = "end_turn"

        try:
            for _round in range(MAX_TOOL_ROUNDS):
                async with (
                    self._llm.concurrency_slot(),
                    self._llm.raw.messages.stream(
                        model=model,
                        system=CHAT_SYSTEM_PROMPT,
                        messages=cast(Any, messages),
                        tools=cast(Any, TOOL_SCHEMAS),
                        max_tokens=2048,
                    ) as stream,
                ):
                    async for event in stream:
                        wire_event = self._translate_event(event)
                        if wire_event is not None:
                            yield wire_event

                    final_msg = await stream.get_final_message()

                total_input_tokens += final_msg.usage.input_tokens
                total_output_tokens += final_msg.usage.output_tokens
                final_stop_reason = _normalise_stop_reason(final_msg.stop_reason)

                tool_use_blocks: list[ToolUseBlock] = [
                    b for b in final_msg.content if isinstance(b, ToolUseBlock)
                ]
                if final_stop_reason != "tool_use" or not tool_use_blocks:
                    break

                # Append the assistant's full turn (text + tool_use blocks).
                messages.append(
                    {
                        "role": "assistant",
                        "content": [_block_to_anthropic(b) for b in final_msg.content],
                    }
                )
                tool_result_blocks: list[dict[str, Any]] = []
                for block in tool_use_blocks:
                    block_input = dict(block.input) if block.input else {}
                    yield ToolUseEvent(
                        tool_use_id=block.id,
                        name=block.name,
                        input=block_input,
                    )
                    result = await execute_tool(block.name, block_input, user_id, self._core_api)
                    yield ToolResultEvent(
                        tool_use_id=block.id,
                        content=result.content,
                        is_error=result.is_error,
                    )
                    tool_result_blocks.append(
                        {
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result.content,
                            "is_error": result.is_error,
                        }
                    )
                messages.append({"role": "user", "content": tool_result_blocks})
            else:
                # Loop exhausted without a terminal stop_reason.
                log.warning(
                    "chat_agent_tool_loop_exhausted",
                    user_id=str(user_id),
                    conversation_id=str(conversation_id),
                    rounds=MAX_TOOL_ROUNDS,
                )
                final_stop_reason = "max_tokens"

            usage = TokenUsage(
                model=model,
                input_tokens=total_input_tokens,
                output_tokens=total_output_tokens,
                cost_usd=calculate_cost_usd(model, total_input_tokens, total_output_tokens),
            )
            yield MessageStopEvent(stop_reason=final_stop_reason, usage=usage)

            # ai_usage tracking owned by Core API (TASK_04 B3-ii-b).
            # See docs/PO_HANDOFF.md § 9 (ai_usage dual-write resolution).

        except Exception as exc:  # noqa: BLE001 — stream must always terminate.
            log.exception(
                "chat_agent_stream_failed",
                user_id=str(user_id),
                conversation_id=str(conversation_id),
            )
            yield ErrorEvent(message=str(exc)[:500], code=type(exc).__name__)

    # ------------------------------------------------------------------
    # Event translation
    # ------------------------------------------------------------------

    def _translate_event(self, event: Any) -> ChatStreamEvent | None:
        """Map an Anthropic SDK stream event to our wire format."""
        event_type = getattr(event, "type", None)

        if event_type == "message_start":
            return MessageStartEvent(message_id=event.message.id)

        if event_type == "content_block_start":
            block = event.content_block
            block_type: Literal["text", "tool_use"] = (
                "tool_use" if getattr(block, "type", None) == "tool_use" else "text"
            )
            return ContentBlockStartEvent(index=event.index, block_type=block_type)

        if event_type == "content_block_delta":
            delta = event.delta
            if getattr(delta, "type", None) == "text_delta":
                return ContentDeltaEvent(text=delta.text)
            # Suppress input_json_delta — the full tool input arrives in the
            # final message and is emitted as a single ToolUseEvent.
            return None

        if event_type == "content_block_stop":
            return ContentBlockStopEvent(index=event.index)

        # message_delta / message_stop are handled via get_final_message().
        return None
