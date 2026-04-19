"""Internal auth middleware tests.

Exercise the dep through /internal/explain because it's the cheapest route
to reach the auth layer — no Core API calls required when auth rejects the
request.
"""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_missing_authorization_returns_401(client: TestClient) -> None:
    resp = client.post(
        "/internal/explain",
        json={"term": "P/E"},
        headers={"X-User-Id": "11111111-1111-1111-1111-111111111111"},
    )
    assert resp.status_code == 401


def test_wrong_bearer_returns_401(client: TestClient) -> None:
    resp = client.post(
        "/internal/explain",
        json={"term": "P/E"},
        headers={
            "Authorization": "Bearer nope",
            "X-User-Id": "11111111-1111-1111-1111-111111111111",
        },
    )
    assert resp.status_code == 401


def test_non_bearer_prefix_returns_401(client: TestClient) -> None:
    resp = client.post(
        "/internal/explain",
        json={"term": "P/E"},
        headers={
            "Authorization": "Basic dXNlcjpwYXNz",
            "X-User-Id": "11111111-1111-1111-1111-111111111111",
        },
    )
    assert resp.status_code == 401


def test_missing_user_id_header_returns_400(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    headers = dict(auth_headers)
    headers.pop("X-User-Id")
    resp = client.post("/internal/explain", json={"term": "P/E"}, headers=headers)
    assert resp.status_code == 400


def test_malformed_user_id_returns_400(client: TestClient, auth_headers: dict[str, str]) -> None:
    headers = dict(auth_headers)
    headers["X-User-Id"] = "not-a-uuid"
    resp = client.post("/internal/explain", json={"term": "P/E"}, headers=headers)
    assert resp.status_code == 400
