"""Backend verification for /api/projects (Neon-backed, auth + CSRF aware).

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
"""
import requests

BASE = TARGET_URL.rstrip("/")
CSRF = {"X-Requested-With": "ChurnSense"}


def login():
    s = requests.Session()
    r = s.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


def test_created_project_persists_and_is_listed():
    s = login()
    payload = {
        "projectName": "Persistence Check Co",
        "totalUsers": 1200,
        "activeUsers": 900,
        "churnedUsers": 300,
        "monthlyRevenue": 7200,
    }
    created = s.post(f"{BASE}/api/projects", json=payload, headers=CSRF)
    assert created.status_code == 201, f"expected 201, got {created.status_code}: {created.text}"
    project = created.json()["project"]
    pid = project["id"]
    assert project["metrics"]["churnRate"] == 0.25, project["metrics"]

    listed = s.get(f"{BASE}/api/projects")
    assert listed.status_code == 200, listed.text
    ids = [p["id"] for p in listed.json()["projects"]]
    assert pid in ids, f"created id {pid} not found in list {ids}"


def test_create_project_rejects_invalid_input():
    s = login()
    r = s.post(
        f"{BASE}/api/projects",
        json={"projectName": "Invalid", "totalUsers": 0, "activeUsers": 0,
              "churnedUsers": 0, "monthlyRevenue": 0},
        headers=CSRF,
    )
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


test_created_project_persists_and_is_listed()
test_create_project_rejects_invalid_input()
