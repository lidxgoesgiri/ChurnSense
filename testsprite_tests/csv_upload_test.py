"""Backend verification for POST /api/upload-csv (auth + CSRF aware).

Covers the happy path (parse + validate + aggregate) and the rejection paths
(empty file, wrong header, all-invalid rows, oversized file). Runs in the
TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
"""
import requests

BASE = TARGET_URL.rstrip("/")
URL = f"{BASE}/api/upload-csv"
CSRF = {"X-Requested-With": "ChurnSense"}
HEADER = "project_name,total_users,active_users,churned_users,monthly_revenue"


def login():
    s = requests.Session()
    r = s.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


def test_csv_valid_upload():
    s = login()
    csv = f"{HEADER}\nBeta Client A,1000,850,150,5000\nBeta Client B,500,400,100,2000"
    r = s.post(URL, files={"file": ("data.csv", csv, "text/csv")}, headers=CSRF)
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    data = r.json()
    assert data["totalRows"] == 2, data
    assert data["validRows"] == 2, data
    assert data["failedRows"] == 0, data
    assert data["results"][0]["metrics"]["churnRate"] == 0.15, data["results"][0]
    assert data["results"][0]["metrics"]["retentionRate"] == 0.85, data["results"][0]
    assert data["aggregate"]["totalMonthlyRevenue"] == 7000, data["aggregate"]


def test_csv_empty_rejected():
    s = login()
    r = s.post(URL, files={"file": ("empty.csv", "", "text/csv")}, headers=CSRF)
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


def test_csv_wrong_header_rejected():
    s = login()
    csv = "name,users,active,churned,revenue\nA,1000,850,150,5000"
    r = s.post(URL, files={"file": ("bad.csv", csv, "text/csv")}, headers=CSRF)
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


def test_csv_invalid_data_rejected():
    s = login()
    csv = f"{HEADER}\nBad,0,0,0,0"
    r = s.post(URL, files={"file": ("bad.csv", csv, "text/csv")}, headers=CSRF)
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


def test_csv_too_large_rejected():
    # >5MB body must be rejected with 413.
    s = login()
    large = HEADER + "\n" + ("A,1000,850,150,5000\n" * 300000)
    r = s.post(URL, files={"file": ("large.csv", large, "text/csv")}, headers=CSRF)
    assert r.status_code == 413, f"expected 413, got {r.status_code}: {r.text[:200]}"


test_csv_valid_upload()
test_csv_empty_rejected()
test_csv_wrong_header_rejected()
test_csv_invalid_data_rejected()
test_csv_too_large_rejected()
