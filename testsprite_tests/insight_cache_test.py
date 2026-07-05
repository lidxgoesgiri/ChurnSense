"""Backend: /api/insights caching + schema (#23).

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
"""
import requests

BASE = TARGET_URL.rstrip("/")


def login():
    s = requests.Session()
    r = s.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


PAYLOAD = {
    "projectName": "Cache Suite",
    "totalUsers": 1000,
    "activeUsers": 700,
    "churnedUsers": 300,
    "monthlyRevenue": 9000,
}


def test_insight_schema_and_cache():
    s = login()
    r1 = s.post(f"{BASE}/api/insights", json=PAYLOAD)
    assert r1.status_code == 200, r1.text
    b1 = r1.json()
    assert b1["success"] is True, b1
    insight = b1["insight"]
    for key in ("summary", "recommendation", "riskLevel"):
        assert isinstance(insight[key], str) and insight[key], insight
    assert insight["riskLevel"] in ("Low", "Medium", "High"), insight
    # First identical call primes the cache (cached == False).
    assert b1.get("cached") is False, f"first call should not be cached: {b1.get('cached')}"

    # Second identical call is served from cache.
    r2 = s.post(f"{BASE}/api/insights", json=PAYLOAD)
    assert r2.status_code == 200, r2.text
    assert r2.json().get("cached") is True, f"second call should be cached: {r2.json().get('cached')}"


test_insight_schema_and_cache()
