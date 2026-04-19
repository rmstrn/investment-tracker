"""Smoke tests for the placeholder FastAPI app."""

from __future__ import annotations

from fastapi.testclient import TestClient

from ai_service.main import app


def test_root_returns_placeholder_message() -> None:
    client = TestClient(app)
    resp = client.get("/")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert "placeholder" in body["message"]


def test_healthz_returns_ok() -> None:
    client = TestClient(app)
    resp = client.get("/healthz")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_ready_returns_ready() -> None:
    client = TestClient(app)
    resp = client.get("/ready")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ready"
