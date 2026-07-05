"""Backend: /api/projects pagination schema + advanced SaaS metrics (#15, #18).

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
Verifies HTTP status, JSON schema shape, and computed-value accuracy.
"""
import requests

BASE = TARGET_URL.rstrip("/")
CSRF = {"X-Requested-With": "ChurnSense"}


def login():
    s = requests.Session()
    r = s.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


def test_pagination_schema():
    s = login()
    # Ensure at least one row exists.
    s.post(
        f"{BASE}/api/projects",
        json={"projectName": "Pagination Seed", "totalUsers": 1000, "activeUsers": 800,
              "churnedUsers": 200, "monthlyRevenue": 8000},
        headers=CSRF,
    )
    r = s.get(f"{BASE}/api/projects?page=1&limit=2")
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    body = r.json()
    for key in ("success", "count", "total", "page", "limit", "hasMore", "projects"):
        assert key in body, f"missing '{key}' in pagination response: {body.keys()}"
    assert body["page"] == 1 and body["limit"] == 2, body
    assert isinstance(body["projects"], list) and len(body["projects"]) <= 2, body
    assert isinstance(body["hasMore"], bool), body


def test_projects_include_mrr_and_ltv():
    s = login()
    r = s.get(f"{BASE}/api/projects?page=1&limit=1")
    assert r.status_code == 200, r.text
    projects = r.json()["projects"]
    if projects:
        m = projects[0]["metrics"]
        for key in ("churnRate", "retentionRate", "arpu", "riskStatus", "mrr", "estimatedLtv"):
            assert key in m, f"metrics missing '{key}': {m}"


def test_metrics_mrr_ltv_values():
    s = login()
    r = s.post(
        f"{BASE}/api/metrics",
        json={"projectName": "MRR Check", "totalUsers": 1000, "activeUsers": 850,
              "churnedUsers": 150, "monthlyRevenue": 5000},
    )
    assert r.status_code == 200, r.text
    m = r.json()["metrics"]
    assert m["mrr"] == 5000, m
    # LTV = ARPU / churnRate = 5 / 0.15 = 33.33
    assert abs(m["estimatedLtv"] - 33.33) < 0.01, m


def test_extreme_decimal_rejected():
    s = login()
    r = s.post(
        f"{BASE}/api/metrics",
        json={"projectName": "X", "totalUsers": 1000.5, "activeUsers": 500,
              "churnedUsers": 100, "monthlyRevenue": 5000},
    )
    assert r.status_code == 400, f"expected 400 for non-integer users, got {r.status_code}"


test_pagination_schema()
test_projects_include_mrr_and_ltv()
test_metrics_mrr_ltv_values()
test_extreme_decimal_rejected()
