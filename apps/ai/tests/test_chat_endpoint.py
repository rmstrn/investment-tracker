"""End-to-end chat stream tests.

Exercise the real ChatAgent with a scripted Anthropic SDK and a Core API
backed by httpx MockTransport.
"""

from __future__ import annotations

from typing import Any

from fastapi.testclient import TestClient

from tests.conftest import (
    CoreAPIRecorder,
    FakeCall,
    plain_text_call,
    tool_use_then_text_call,
)

_CHAT_BODY = {
    "conversation_id": "22222222-2222-2222-2222-222222222222",
    "message": "How is my portfolio doing?",
}


def _parse_sse(body: str) -> list[tuple[str, str]]:
    """Parse an SSE body into (event_type, data) tuples."""
    frames = [f for f in body.split("\n\n") if f.strip()]
    out: list[tuple[str, str]] = []
    for frame in frames:
        event_type = ""
        data = ""
        for line in frame.split("\n"):
            if line.startswith("event: "):
                event_type = line.removeprefix("event: ")
            elif line.startswith("data: "):
                data = line.removeprefix("data: ")
        out.append((event_type, data))
    return out


def test_chat_stream_text_only(
    client: TestClient,
    auth_headers: dict[str, str],
    test_app: Any,
) -> None:
    test_app.state.fake_calls.append(plain_text_call("Your portfolio is up 3% today."))

    resp = client.post("/internal/chat/stream", json=_CHAT_BODY, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("text/event-stream")

    frames = _parse_sse(resp.text)
    event_types = [t for t, _ in frames]
    assert event_types[0] == "message_start"
    assert "content_delta" in event_types
    assert event_types[-1] == "message_stop"


def test_chat_stream_tool_use_round_trip(
    client: TestClient,
    auth_headers: dict[str, str],
    test_app: Any,
    core_api_recorder: CoreAPIRecorder,
) -> None:
    # Script: model first asks for portfolio snapshot, then writes a text answer.
    test_app.state.fake_calls.extend(
        tool_use_then_text_call(
            tool_name="get_portfolio_snapshot",
            tool_input={"currency": "USD"},
            followup_text="Your portfolio total is $12,500.",
        )
    )
    core_api_recorder.json_route(
        "GET",
        "/portfolio",
        body={"total_value": 12_500, "currency": "USD"},
    )

    resp = client.post("/internal/chat/stream", json=_CHAT_BODY, headers=auth_headers)
    assert resp.status_code == 200

    frames = _parse_sse(resp.text)
    event_types = [t for t, _ in frames]
    assert "tool_use" in event_types
    assert "tool_result" in event_types
    assert event_types[-1] == "message_stop"

    # Core API was called with Bearer + X-User-Id.
    api_call = core_api_recorder.calls[0]
    assert api_call.headers["Authorization"].startswith("Bearer ")
    assert api_call.headers["X-User-Id"]


def test_chat_stream_rejects_without_auth(
    client: TestClient,
    test_app: Any,
) -> None:
    test_app.state.fake_calls.append(plain_text_call("ignored"))
    resp = client.post("/internal/chat/stream", json=_CHAT_BODY)
    assert resp.status_code == 401


def test_chat_stream_surfaces_error_as_terminal_event(
    client: TestClient,
    auth_headers: dict[str, str],
    test_app: Any,
) -> None:
    # Empty scripted-calls list → ChatAgent raises RuntimeError on the first
    # stream attempt, which must come back as an error frame, not a 500.
    resp = client.post("/internal/chat/stream", json=_CHAT_BODY, headers=auth_headers)
    assert resp.status_code == 200
    frames = _parse_sse(resp.text)
    event_types = [t for t, _ in frames]
    assert event_types[-1] == "error"


_ = FakeCall  # keep import available for extension in follow-ups
