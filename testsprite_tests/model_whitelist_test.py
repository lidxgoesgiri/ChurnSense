"""Backend: AI model whitelist gateway on /api/insights and /api/chat (Step6).

An unauthorized (non-whitelisted) model must be REJECTED with 400 and a clear
message — never silently accepted, and never a 500 crash. A whitelisted model
(or no model) is accepted. Runs in the TestSprite sandbox; TARGET_URL injected.
"""
import requests

BASE = TARGET_URL.rstrip("/")
DEFAULT_MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free"
ROSTER_MODEL = "openai/gpt-oss-120b:free"

VALID = {
    "projectName": "Whitelist Check",
    "totalUsers": 1000,
    "activeUsers": 850,
    "churnedUsers": 150,
    "monthlyRevenue": 5000,
}


def login():
    s = requests.Session()
    r = s.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


def test_no_model_uses_default():
    s = login()
    r = s.post(f"{BASE}/api/insights", json=VALID)
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    assert r.json().get("model") == DEFAULT_MODEL, r.json().get("model")


def test_whitelisted_roster_model_accepted():
    s = login()
    r = s.post(f"{BASE}/api/insights", json={**VALID, "model": ROSTER_MODEL})
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    assert r.json().get("model") == ROSTER_MODEL, f"model not honored: {r.json().get('model')}"


def test_unauthorized_model_rejected_insights():
    s = login()
    r = s.post(f"{BASE}/api/insights", json={**VALID, "model": "evil/unauthorized-model-999"})
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"
    assert "Invalid or unauthorized AI model requested" in r.text, r.text


def test_unauthorized_model_rejected_chat():
    s = login()
    r = s.post(f"{BASE}/api/chat", json={"message": "hi", "model": "evil/unauthorized-model-999"})
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"
    assert "Invalid or unauthorized AI model requested" in r.text, r.text


test_no_model_uses_default()
test_whitelisted_roster_model_accepted()
test_unauthorized_model_rejected_insights()
test_unauthorized_model_rejected_chat()
