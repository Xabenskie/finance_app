"""Интеграционные тесты ключевых эндпоинтов (auth, transactions, RBAC, S3, health)."""
import io

import pytest

from tests.conftest import auth_headers

pytestmark = pytest.mark.integration


# ---------- health & auth ----------

def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}


def test_register_login_me_flow(client):
    r = client.post(
        "/api/users/register", json={"username": "u", "password": "Pass123!"}
    )
    assert r.status_code == 200 and r.json()["role"] == "user"

    r = client.post(
        "/api/users/login", json={"username": "u", "password": "Pass123!"}
    )
    assert r.status_code == 200
    tokens = r.json()
    assert tokens["access_token"] and tokens["refresh_token"]

    r = client.get("/api/users/me", headers=auth_headers(tokens))
    assert r.status_code == 200 and r.json()["username"] == "u"


def test_login_with_wrong_password_returns_401(client):
    client.post(
        "/api/users/register", json={"username": "u", "password": "Pass123!"}
    )
    r = client.post(
        "/api/users/login", json={"username": "u", "password": "WRONG"}
    )
    assert r.status_code == 401


def test_me_without_token_is_401(client):
    assert client.get("/api/users/me").status_code == 401


# ---------- transactions: create, filter, pagination, validation, isolation ----------

def test_transaction_create_and_filter(client, user_token, manager_token):
    cid_inc = client.post(
        "/api/categories",
        json={"name": "Зп", "type": "доход"},
        headers=auth_headers(manager_token),
    ).json()["id"]
    cid_exp = client.post(
        "/api/categories",
        json={"name": "Еда", "type": "расход"},
        headers=auth_headers(manager_token),
    ).json()["id"]

    for _ in range(3):
        r = client.post(
            "/api/transactions",
            json={
                "type": "расход",
                "amount": 100,
                "category_id": cid_exp,
                "description": "x",
                "date": "2025-01-01",
            },
            headers=auth_headers(user_token),
        )
        assert r.status_code == 200

    client.post(
        "/api/transactions",
        json={
            "type": "доход",
            "amount": 1000,
            "category_id": cid_inc,
            "description": "salary",
            "date": "2025-01-02",
        },
        headers=auth_headers(user_token),
    )

    r = client.get(
        "/api/transactions/?type=доход", headers=auth_headers(user_token)
    )
    assert r.status_code == 200 and r.json()["total"] == 1

    stats = client.get(
        "/api/transactions/stats", headers=auth_headers(user_token)
    ).json()
    assert stats == {"income": 1000, "expense": 300, "balance": 700}


def test_transaction_validation_422(client, user_token):
    bad = {"type": "лишнее", "amount": 1, "category_id": "x", "date": "2025-01-01"}
    r = client.post(
        "/api/transactions", json=bad, headers=auth_headers(user_token)
    )
    assert r.status_code == 422


# ---------- RBAC ----------

def test_rbac_user_cannot_create_category(client, user_token):
    r = client.post(
        "/api/categories",
        json={"name": "X", "type": "доход"},
        headers=auth_headers(user_token),
    )
    assert r.status_code == 403


def test_rbac_user_cannot_list_admin_users(client, user_token):
    assert (
        client.get("/api/admin/users", headers=auth_headers(user_token)).status_code
        == 403
    )


def test_rbac_admin_changes_role(client, admin_token, user_token):  # noqa: ARG001
    users = client.get(
        "/api/admin/users", headers=auth_headers(admin_token)
    ).json()
    target = next(u for u in users if u["username"] == "user1")
    r = client.patch(
        f"/api/admin/users/{target['id']}/role",
        json={"role": "manager"},
        headers=auth_headers(admin_token),
    )
    assert r.status_code == 200 and r.json()["role"] == "manager"


# ---------- S3 / аватар ----------

def test_avatar_upload_returns_url(client, user_token):
    files = {"file": ("a.jpg", io.BytesIO(b"\xff\xd8\xff"), "image/jpeg")}
    r = client.post(
        "/api/users/avatar", files=files, headers=auth_headers(user_token)
    )
    assert r.status_code == 200 and r.json()["avatar_url"].startswith("http")


def test_avatar_s3_failure_returns_500(user_token, monkeypatch):
    """Сбой MinIO -> HTTP 500 для клиента."""
    from fastapi.testclient import TestClient

    from main import app

    monkeypatch.setattr(
        "app.routers.user.upload_avatar",
        lambda *a, **kw: (_ for _ in ()).throw(RuntimeError("MinIO down")),
    )
    with TestClient(app, raise_server_exceptions=False) as c:
        files = {"file": ("a.jpg", io.BytesIO(b"\xff\xd8\xff"), "image/jpeg")}
        r = c.post(
            "/api/users/avatar", files=files, headers=auth_headers(user_token)
        )
        assert r.status_code == 500
