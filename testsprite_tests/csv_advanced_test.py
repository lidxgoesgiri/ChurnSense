"""Backend: advanced CSV upload — quoted fields, partial success, row limit (#19, #20).

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
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


def test_quoted_field_with_comma():
    s = login()
    csv = f'{HEADER}\n"Acme, Inc.",1000,850,150,5000'
    r = s.post(URL, files={"file": ("q.csv", csv, "text/csv")}, headers=CSRF)
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    data = r.json()
    assert data["validRows"] == 1, data
    assert data["results"][0]["projectName"] == "Acme, Inc.", data["results"][0]


def test_partial_success_reports_failed_rows():
    # One valid + one invalid (zero users) -> 200 with validRows=1, failedRows=1.
    s = login()
    csv = f"{HEADER}\nGood Co,1000,850,150,5000\nBad Co,0,0,0,0"
    r = s.post(URL, files={"file": ("p.csv", csv, "text/csv")}, headers=CSRF)
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    data = r.json()
    assert data["totalRows"] == 2, data
    assert data["validRows"] == 1, data
    assert data["failedRows"] == 1, data
    assert len(data["errors"]) == 1, data


def test_row_limit_enforced():
    # More than MAX_ROWS (500) data rows must be rejected with 400.
    s = login()
    rows = "\n".join("Proj,1000,850,150,5000" for _ in range(501))
    csv = f"{HEADER}\n{rows}"
    r = s.post(URL, files={"file": ("big.csv", csv, "text/csv")}, headers=CSRF)
    assert r.status_code == 400, f"expected 400 for >500 rows, got {r.status_code}: {r.text[:200]}"


test_quoted_field_with_comma()
test_partial_success_reports_failed_rows()
test_row_limit_enforced()
