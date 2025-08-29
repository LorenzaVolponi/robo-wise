from fastapi.testclient import TestClient
from api.health import app


def test_health_returns_ok():
    client = TestClient(app)
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}
