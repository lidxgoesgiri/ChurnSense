"""Edge-case & boundary verification for /api/metrics (auth-aware).

Covers invalid inputs (must be 400, never 500) and the risk-status thresholds.
Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
"""
import requests

BASE = TARGET_URL.rstrip("/")


def login():
    s = requests.Session()
    r = s.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


S = login()


def _post(body):
    return S.post(f"{BASE}/api/metrics", json=body)


def test_active_users_cannot_exceed_total():
    r = _post({"projectName": "X", "totalUsers": 1000, "activeUsers": 2000, "churnedUsers": 100, "monthlyRevenue": 5000})
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


def test_churned_users_cannot_exceed_total():
    r = _post({"projectName": "X", "totalUsers": 1000, "activeUsers": 500, "churnedUsers": 5000, "monthlyRevenue": 5000})
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


def test_negative_values_rejected():
    r = _post({"projectName": "X", "totalUsers": 1000, "activeUsers": 500, "churnedUsers": -50, "monthlyRevenue": 5000})
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


def test_non_integer_user_counts_rejected():
    r = _post({"projectName": "X", "totalUsers": 1000.5, "activeUsers": 500, "churnedUsers": 100, "monthlyRevenue": 5000})
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


def test_risk_status_low_boundary():
    r = _post({"projectName": "X", "totalUsers": 1000, "activeUsers": 950, "churnedUsers": 50, "monthlyRevenue": 5000})
    assert r.status_code == 200, r.text
    m = r.json()["metrics"]
    assert m["churnRate"] == 0.05 and m["riskStatus"] == "Low", m


def test_risk_status_medium_boundary():
    r = _post({"projectName": "X", "totalUsers": 1000, "activeUsers": 850, "churnedUsers": 150, "monthlyRevenue": 5000})
    assert r.status_code == 200, r.text
    m = r.json()["metrics"]
    assert m["churnRate"] == 0.15 and m["riskStatus"] == "Medium", m


def test_risk_status_high():
    r = _post({"projectName": "X", "totalUsers": 1000, "activeUsers": 800, "churnedUsers": 200, "monthlyRevenue": 5000})
    assert r.status_code == 200, r.text
    m = r.json()["metrics"]
    assert m["churnRate"] == 0.20 and m["riskStatus"] == "High", m


test_active_users_cannot_exceed_total()
test_churned_users_cannot_exceed_total()
test_negative_values_rejected()
test_non_integer_user_counts_rejected()
test_risk_status_low_boundary()
test_risk_status_medium_boundary()
test_risk_status_high()
