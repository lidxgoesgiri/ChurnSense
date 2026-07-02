"""Backend verification for /api/chat: auth, message validation (#1, #6, #12).

Runs in the TestSprite sandbox (stdlib + requests). TARGET_URL is injected.
"""
import requests

BASE = TARGET_URL.rstrip("/")


def login():
    s = requests.Session()
    r = s.post(f"{BASE}/api/auth/login", json={"email": "demo@churnsense.app"})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return s


def test_chat_requires_auth():
    r = requests.post(f"{BASE}/api/chat", json={"message": "hello"})
    assert r.status_code == 401, f"expected 401, got {r.status_code}: {r.text}"


def test_chat_missing_message_rejected():
    s = login()
    r = s.post(f"{BASE}/api/chat", json={"context": {}})
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"


def test_chat_too_long_message_rejected():
    # >2000 chars must be rejected with 400 (#12).
    s = login()
    r = s.post(f"{BASE}/api/chat", json={"message": "a" * 2500})
    assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text[:200]}"


test_chat_requires_auth()
test_chat_missing_message_rejected()
test_chat_too_long_message_rejected()
