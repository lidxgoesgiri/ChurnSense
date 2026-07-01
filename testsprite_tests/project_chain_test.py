"""Stateful, multi-step backend flow across the whole ChurnSense API.

Chains one business flow end to end:
  create a project  ->  confirm it is listed  ->  compute its metrics
  ->  generate an insight (with historical trend).

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
Test functions are invoked explicitly at the bottom — no auto-discovery.
"""
import requests

BASE = TARGET_URL.rstrip("/")

PAYLOAD = {
    "projectName": "Chain Flow Co",
    "totalUsers": 1000,
    "activeUsers": 800,
    "churnedUsers": 200,
    "monthlyRevenue": 8000,
}


def test_full_project_lifecycle_chain():
    # 1) Create the project and capture the generated id.
    created = requests.post(f"{BASE}/api/projects", json=PAYLOAD)
    assert created.status_code == 201, f"create failed: {created.status_code} {created.text}"
    project = created.json()["project"]
    pid = project["id"]
    assert isinstance(pid, int) and pid > 0, project

    # 2) The created id must appear in the listing (persistence).
    listed = requests.get(f"{BASE}/api/projects")
    assert listed.status_code == 200, listed.text
    assert pid in [p["id"] for p in listed.json()["projects"]], "created id not listed"

    # 3) Metrics for the same input compute the expected churn.
    metrics = requests.post(f"{BASE}/api/metrics", json=PAYLOAD)
    assert metrics.status_code == 200, metrics.text
    assert metrics.json()["metrics"]["churnRate"] == 0.2, metrics.json()["metrics"]

    # 4) Insight for the same input returns a usable insight and a trend field.
    insight = requests.post(f"{BASE}/api/insights", json=PAYLOAD)
    assert insight.status_code == 200, insight.text
    body = insight.json()
    assert body["success"] is True, body
    assert body["metrics"]["churnRate"] == 0.2, body["metrics"]
    assert isinstance(body["insight"]["summary"], str) and body["insight"]["summary"], body["insight"]
    assert body["insight"]["riskLevel"] in ("Low", "Medium", "High"), body["insight"]
    assert "trend" in body, "trend field missing from insight response"


# Required: actually invoke the test so its assertions run.
test_full_project_lifecycle_chain()
