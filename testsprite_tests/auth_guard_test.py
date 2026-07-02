"""Auth, cookie-signing, and CSRF guards (#1, #4, #14).

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
Test functions are invoked explicitly at the bottom — no auto-discovery.
"""
import requests

BASE = TARGET_URL.rstrip("/")
VALID = {
    "projectName": "Auth Check",
    "totalUsers": 1000,
    "activeUsers": 850,
    "churnedUsers": 150,
    "monthlyRevenue": 5000,
}


def login():
    """Return a session carrying a valid signed cs_session cookie."""
    s = requests.Session()
    r = s.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


def test_protected_endpoints_reject_anonymous():
    # No cookie -> every protected endpoint must answer 401.
    assert requests.get(f"{BASE}/api/projects").status_code == 401
    assert requests.post(f"{BASE}/api/metrics", json=VALID).status_code == 401
    assert requests.post(f"{BASE}/api/insights", json=VALID).status_code == 401
    assert requests.post(f"{BASE}/api/chat", json={"message": "hi"}).status_code == 401
    r = requests.post(
        f"{BASE}/api/upload-csv",
        files={"file": ("a.csv", "project_name\nA", "text/csv")},
    )
    assert r.status_code == 401, f"upload-csv anon expected 401, got {r.status_code}"


def test_health_is_public():
    assert requests.get(f"{BASE}/api/health").status_code == 200


def test_forged_unsigned_cookie_rejected():
    # A hand-set, unsigned cookie must NOT be accepted (HMAC verify fails).
    r = requests.post(
        f"{BASE}/api/metrics",
        json=VALID,
        cookies={"cs_session": "admin%40company.com"},
    )
    assert r.status_code == 401, f"forged cookie expected 401, got {r.status_code}: {r.text}"


def test_login_cookie_is_signed():
    s = login()
    val = s.cookies.get("cs_session")
    assert val and "." in val, f"cookie should be signed value.sig, got: {val}"


def test_valid_session_allows_access():
    s = login()
    r = s.post(f"{BASE}/api/metrics", json=VALID)
    assert r.status_code == 200, f"authed metrics expected 200, got {r.status_code}: {r.text}"


def test_csrf_required_on_mutations():
    s = login()
    # Missing X-Requested-With -> 403 on mutating routes.
    r = s.post(f"{BASE}/api/projects", json=VALID)
    assert r.status_code == 403, f"projects without CSRF expected 403, got {r.status_code}: {r.text}"
    r = s.post(
        f"{BASE}/api/upload-csv",
        files={"file": ("a.csv", "project_name\nA", "text/csv")},
    )
    assert r.status_code == 403, f"upload-csv without CSRF expected 403, got {r.status_code}"


test_protected_endpoints_reject_anonymous()
test_health_is_public()
test_forged_unsigned_cookie_rejected()
test_login_cookie_is_signed()
test_valid_session_allows_access()
test_csrf_required_on_mutations()
