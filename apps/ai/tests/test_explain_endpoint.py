"""Explain endpoint end-to-end."""

from __future__ import annotations

from typing import Any

from fastapi.testclient import TestClient

from tests.conftest import plain_text_call


def test_explain_returns_explanation_text(
    client: TestClient,
    auth_headers: dict[str, str],
    test_app: Any,
) -> None:
    test_app.state.fake_calls.append(
        plain_text_call("Price-to-earnings is the ratio of market price to earnings per share.")
    )
    resp = client.post(
        "/internal/explain",
        json={"term": "P/E", "user_level": "novice"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["term"] == "P/E"
    assert "earnings" in body["explanation"].lower()
    assert body["usage"]["model"]  # model id populated
