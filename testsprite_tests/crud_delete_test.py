"""Backend: /api/projects DELETE lifecycle with auth + CSRF (#16).

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
"""
import requests

BASE = TARGET_URL.rstrip("/")
CSRF = {"X-Requested-With": "ChurnSense"}
PAYLOAD = {
    "projectName": "Delete Me",
    "totalUsers": 1000,
    "activeUsers": 800,
    "churnedUsers": 200,
    "monthlyRevenue": 8000,
}


def login():
    s = requests.Session()
    r = s.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


def test_delete_requires_auth():
    r = requests.delete(f"{BASE}/api/projects?id=1")
    assert r.status_code == 401, f"expected 401, got {r.status_code}"


def test_delete_lifecycle():
    s = login()
    created = s.post(f"{BASE}/api/projects", json=PAYLOAD, headers=CSRF)
    assert created.status_code == 201, created.text
    pid = created.json()["project"]["id"]

    # Missing CSRF header -> 403.
    r = s.delete(f"{BASE}/api/projects?id={pid}")
    assert r.status_code == 403, f"expected 403 without CSRF, got {r.status_code}: {r.text}"

    # Proper delete -> 200 with deletedId.
    r = s.delete(f"{BASE}/api/projects?id={pid}", headers=CSRF)
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    assert r.json().get("deletedId") == pid, r.text

    # Deleting again -> 404.
    r = s.delete(f"{BASE}/api/projects?id={pid}", headers=CSRF)
    assert r.status_code == 404, f"expected 404 on re-delete, got {r.status_code}"


def test_delete_invalid_id():
    s = login()
    r = s.delete(f"{BASE}/api/projects?id=not-a-number", headers=CSRF)
    assert r.status_code == 400, f"expected 400 for invalid id, got {r.status_code}: {r.text}"


test_delete_requires_auth()
test_delete_lifecycle()
test_delete_invalid_id()
