"""Backend: /api/insights caching + schema (#23).

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
"""
import random
import requests

BASE = TARGET_URL.rstrip("/")

# Unique project name per run so the server's 5-minute cache is never
# pre-primed from a previous run (keeps the "first call not cached" assertion
# reliable across repeated suite runs).
RUN_ID = random.randint(1, 1_000_000_000)


def login():
    s = requests.Session()
    r = s.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


PAYLOAD = {
    "projectName": f"Cache Suite {RUN_ID}",
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


def test_changing_a_field_bypasses_cache():
    # Changing monthlyRevenue (same project name) must NOT return the stale
    # cached insight — the cache key covers every input field.
    s = login()
    base = {
        "projectName": f"Cache Key Field {RUN_ID}",
        "totalUsers": 1000,
        "activeUsers": 700,
        "churnedUsers": 300,
        "monthlyRevenue": 9000,
    }
    r1 = s.post(f"{BASE}/api/insights", json=base)
    assert r1.status_code == 200, r1.text
    assert r1.json().get("cached") is False, "first call should not be cached"

    r2 = s.post(f"{BASE}/api/insights", json={**base, "monthlyRevenue": 12000})
    assert r2.status_code == 200, r2.text
    assert r2.json().get("cached") is False, (
        "changing monthlyRevenue must bypass the cache, got cached=True"
    )


test_insight_schema_and_cache()
test_changing_a_field_bypasses_cache()
