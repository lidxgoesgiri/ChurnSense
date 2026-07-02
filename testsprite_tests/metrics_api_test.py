"""Backend verification for /api/metrics and /api/health (#8 message, #11 body size).

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
Test functions are invoked explicitly at the bottom — no auto-discovery.
"""
import requests

BASE = TARGET_URL.rstrip("/")


def login():
    s = requests.Session()
    r = s.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


def test_health_ok():
    r = requests.get(f"{BASE}/api/health")
    assert r.status_code == 200, f"health status {r.status_code}"
    assert r.json().get("status") == "ok", r.text


def test_metrics_valid_computes_churn():
    s = login()
    r = s.post(
        f"{BASE}/api/metrics",
        json={
            "projectName": "Beta Client A",
            "totalUsers": 1000,
            "activeUsers": 850,
            "churnedUsers": 150,
            "monthlyRevenue": 5000,
        },
    )
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    metrics = r.json()["metrics"]
    assert metrics["churnRate"] == 0.15, metrics
    assert metrics["retentionRate"] == 0.85, metrics
    assert metrics["arpu"] == 5, metrics


def test_metrics_zero_users_rejected_with_clear_message():
    # Spec: totalUsers=0 -> 400 with a clear English domain message (#8).
    s = login()
    r = s.post(
        f"{BASE}/api/metrics",
        json={
            "projectName": "Invalid Project",
            "totalUsers": 0,
            "activeUsers": 0,
            "churnedUsers": 0,
            "monthlyRevenue": 0,
        },
    )
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"
    assert "Total users must be greater than zero" in r.text, (
        f"expected clear English domain message, got: {r.text}"
    )


def test_metrics_missing_field_rejected():
    s = login()
    r = s.post(
        f"{BASE}/api/metrics",
        json={
            "totalUsers": 500,
            "activeUsers": 400,
            "churnedUsers": 100,
            "monthlyRevenue": 2000,
        },
    )
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


def test_metrics_oversized_body_rejected():
    # >50KB JSON body must be rejected with 413 (#11).
    s = login()
    payload = {
        "projectName": "X" * 60_000,
        "totalUsers": 1000,
        "activeUsers": 850,
        "churnedUsers": 150,
        "monthlyRevenue": 5000,
    }
    r = s.post(f"{BASE}/api/metrics", json=payload)
    assert r.status_code == 413, f"expected 413 for large body, got {r.status_code}: {r.text[:200]}"


test_health_ok()
test_metrics_valid_computes_churn()
test_metrics_zero_users_rejected_with_clear_message()
test_metrics_missing_field_rejected()
test_metrics_oversized_body_rejected()
