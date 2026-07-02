"""Backend verification for /api/insights: shape, validation, model whitelist (#3).

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
"""
import requests

BASE = TARGET_URL.rstrip("/")
DEFAULT_MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free"


def login():
    s = requests.Session()
    r = s.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


def test_insights_returns_metrics_and_insight():
    s = login()
    r = s.post(
        f"{BASE}/api/insights",
        json={
            "projectName": "Beta Client A",
            "totalUsers": 1000,
            "activeUsers": 700,
            "churnedUsers": 300,
            "monthlyRevenue": 9000,
        },
    )
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    body = r.json()
    assert body["success"] is True, body
    assert body["metrics"]["churnRate"] == 0.3, body["metrics"]
    insight = body["insight"]
    assert isinstance(insight["summary"], str) and insight["summary"], insight
    assert isinstance(insight["recommendation"], str) and insight["recommendation"], insight
    assert insight["riskLevel"] in ("Low", "Medium", "High"), insight


def test_insights_rejects_invalid_input():
    s = login()
    r = s.post(
        f"{BASE}/api/insights",
        json={"projectName": "Invalid", "totalUsers": 0, "activeUsers": 0,
              "churnedUsers": 0, "monthlyRevenue": 0},
    )
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


def test_insights_rejects_unknown_model_falls_back_to_default():
    # A client-supplied model not on the allow-list must NOT be used; the
    # server should fall back to the default (#3).
    s = login()
    r = s.post(
        f"{BASE}/api/insights",
        json={
            "projectName": "Model Check",
            "totalUsers": 1000,
            "activeUsers": 700,
            "churnedUsers": 300,
            "monthlyRevenue": 9000,
            "model": "evil/expensive-model-999",
        },
    )
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    used = r.json().get("model")
    assert used == DEFAULT_MODEL, f"unknown model should fall back to default, got: {used}"


def test_login_accepts_valid_email():
    r = requests.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    assert r.json().get("success") is True, r.text


def test_login_rejects_bad_email():
    r = requests.post(f"{BASE}/api/auth/login", json={"email": "not-an-email"})
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


test_insights_returns_metrics_and_insight()
test_insights_rejects_invalid_input()
test_insights_rejects_unknown_model_falls_back_to_default()
test_login_accepts_valid_email()
test_login_rejects_bad_email()
