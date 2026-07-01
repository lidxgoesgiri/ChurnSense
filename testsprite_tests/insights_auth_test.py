"""Backend verification for /api/insights and the dummy auth endpoints.

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
Test functions are invoked explicitly at the bottom — no auto-discovery.
"""
import requests

BASE = TARGET_URL.rstrip("/")


def test_insights_returns_metrics_and_insight():
    r = requests.post(
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
    r = requests.post(
        f"{BASE}/api/insights",
        json={
            "projectName": "Invalid",
            "totalUsers": 0,
            "activeUsers": 0,
            "churnedUsers": 0,
            "monthlyRevenue": 0,
        },
    )
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


def test_login_accepts_valid_email():
    r = requests.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    assert r.json().get("success") is True, r.text


def test_login_rejects_bad_email():
    r = requests.post(f"{BASE}/api/auth/login", json={"email": "not-an-email"})
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


# Required: actually invoke the tests so their assertions run.
test_insights_returns_metrics_and_insight()
test_insights_rejects_invalid_input()
test_login_accepts_valid_email()
test_login_rejects_bad_email()
