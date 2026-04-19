"""SSE wire-format tests."""

from __future__ import annotations

import json

from ai_service.llm.streaming import format_sse_event
from ai_service.models import (
    ContentDeltaEvent,
    ErrorEvent,
    MessageStopEvent,
    TokenUsage,
)


def test_format_sse_event_text_delta() -> None:
    event = ContentDeltaEvent(text="hello")
    frame = format_sse_event(event)
    assert frame.startswith("event: content_delta\n")
    assert frame.endswith("\n\n")
    # data line is a valid JSON with the text field
    data_line = frame.split("\n")[1]
    assert data_line.startswith("data: ")
    payload = json.loads(data_line.removeprefix("data: "))
    assert payload["type"] == "content_delta"
    assert payload["text"] == "hello"


def test_format_sse_event_message_stop_includes_usage() -> None:
    event = MessageStopEvent(
        stop_reason="end_turn",
        usage=TokenUsage(
            model="claude-sonnet-4-6",
            input_tokens=100,
            output_tokens=20,
            cost_usd=0.0006,
        ),
    )
    frame = format_sse_event(event)
    assert "event: message_stop" in frame
    payload = json.loads(frame.split("data: ", 1)[1].rstrip("\n"))
    assert payload["usage"]["input_tokens"] == 100
    assert payload["usage"]["output_tokens"] == 20


def test_format_sse_event_error() -> None:
    frame = format_sse_event(ErrorEvent(message="boom", code="TestError"))
    assert "event: error" in frame
    payload = json.loads(frame.split("data: ", 1)[1].rstrip("\n"))
    assert payload["message"] == "boom"
    assert payload["code"] == "TestError"
