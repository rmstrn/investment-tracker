"""Health endpoint smoke tests.

Keeps the FastAPI app importable in CI without Anthropic / Core API secrets.
Real end-to-end tests live in ``test_chat_endpoint.py`` etc.
"""

from __future__ import annotations

from fastapi.testclient import TestClient

from ai_service.main import app


def test_root_returns_ok() -> None:
    with TestClient(app) as client:
        resp = client.get("/")
    assert resp.status_code == 200
    body = resp.json()
    assert body["service"] == "ai-service"
    assert body["status"] == "ok"


def test_health_returns_ok() -> None:
    with TestClient(app) as client:
        resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_healthz_alias_returns_ok() -> None:
    with TestClient(app) as client:
        resp = client.get("/healthz")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_ready_reports_secret_state() -> None:
    with TestClient(app) as client:
        resp = client.get("/ready")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] in {"ready", "degraded"}
    assert body["anthropic_key"] in {"set", "missing"}
    assert body["core_api_token"] in {"set", "missing"}
