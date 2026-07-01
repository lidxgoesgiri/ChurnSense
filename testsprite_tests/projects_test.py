"""Backend verification for /api/projects (Neon-backed persistence).

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
Test functions are invoked explicitly at the bottom — no auto-discovery.
"""
import requests

BASE = TARGET_URL.rstrip("/")


def test_created_project_persists_and_is_listed():
    payload = {
        "projectName": "Persistence Check Co",
        "totalUsers": 1200,
        "activeUsers": 900,
        "churnedUsers": 300,
        "monthlyRevenue": 7200,
    }
    created = requests.post(f"{BASE}/api/projects", json=payload)
    assert created.status_code == 201, f"expected 201, got {created.status_code}: {created.text}"
    project = created.json()["project"]
    pid = project["id"]
    # Server-side computed metrics should be attached.
    assert project["metrics"]["churnRate"] == 0.25, project["metrics"]

    listed = requests.get(f"{BASE}/api/projects")
    assert listed.status_code == 200, listed.text
    ids = [p["id"] for p in listed.json()["projects"]]
    assert pid in ids, f"created id {pid} not found in list {ids}"


def test_create_project_rejects_invalid_input():
    r = requests.post(
        f"{BASE}/api/projects",
        json={
            "projectName": "Invalid",
            "totalUsers": 0,
            "activeUsers": 0,
            "churnedUsers": 0,
            "monthlyRevenue": 0,
        },
    )
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


# Required: actually invoke the tests so their assertions run.
test_created_project_persists_and_is_listed()
test_create_project_rejects_invalid_input()
