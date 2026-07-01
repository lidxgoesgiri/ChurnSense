"""Backend verification for the /api/metrics and /api/health endpoints.

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
Test functions are invoked explicitly at the bottom — the runner does NOT
auto-discover them.
"""
import requests

BASE = TARGET_URL.rstrip("/")


def test_health_ok():
    r = requests.get(f"{BASE}/api/health")
    assert r.status_code == 200, f"health status {r.status_code}"
    body = r.json()
    assert body.get("status") == "ok", body


def test_metrics_valid_computes_churn():
    r = requests.post(
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
    # Spec (project brief): totalUsers=0 must be a 400 with a clear,
    # domain-specific message, not a generic validation error.
    r = requests.post(
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
        f"expected clear domain message, got: {r.text}"
    )


def test_metrics_missing_field_rejected():
    r = requests.post(
        f"{BASE}/api/metrics",
        json={
            "totalUsers": 500,
            "activeUsers": 400,
            "churnedUsers": 100,
            "monthlyRevenue": 2000,
        },
    )
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


# Required: actually invoke the tests so their assertions run.
test_health_ok()
test_metrics_valid_computes_churn()
test_metrics_zero_users_rejected_with_clear_message()
test_metrics_missing_field_rejected()
