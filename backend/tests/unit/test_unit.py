"""Модульные тесты: JWT, RBAC, ключевая бизнес-логика CRUD."""
from datetime import date, timedelta

import pytest
from fastapi import HTTPException

from app.auth import jwt as auth_jwt
from app.auth.rbac import require_admin, require_manager
from app.crud import category as cat_crud
from app.crud import transaction as tx_crud
from app.crud import user as user_crud

pytestmark = pytest.mark.unit


# ---------- JWT ----------

def test_password_hash_and_verify():
    h = auth_jwt.get_password_hash("Pass123!")
    assert h != "Pass123!"
    assert auth_jwt.verify_password("Pass123!", h)
    assert not auth_jwt.verify_password("wrong", h)


def test_expired_access_token_rejected():
    token = auth_jwt.create_access_token(
        {"sub": "alice", "role": "user"}, expires_delta=timedelta(seconds=-1)
    )
    with pytest.raises(HTTPException) as exc:
        auth_jwt._decode_access_token(token)
    assert exc.value.status_code == 401


def test_refresh_token_roundtrip():
    token, jti, _ = auth_jwt.create_refresh_token({"sub": "alice"})
    username, parsed_jti = auth_jwt.verify_refresh_token(token)
    assert username == "alice" and parsed_jti == jti


# ---------- RBAC ----------

def test_rbac_admin_only():
    assert require_admin({"sub": "x", "role": "admin"})
    with pytest.raises(HTTPException):
        require_admin({"sub": "x", "role": "user"})


def test_rbac_manager_allows_admin():
    assert require_manager({"sub": "x", "role": "admin"})
    with pytest.raises(HTTPException):
        require_manager({"sub": "x", "role": "user"})


# ---------- CRUD ----------

async def test_transaction_stats(session):
    user_id = await user_crud.create_user(session, "alice", "h")
    cid_i = await cat_crud.create_category(session, "Зп", "доход")
    cid_e = await cat_crud.create_category(session, "Еда", "расход")
    await tx_crud.create_transaction(
        session, user_id, "доход", 1000.0, cid_i, "salary", date(2025, 1, 1)
    )
    await tx_crud.create_transaction(
        session, user_id, "расход", 350.0, cid_e, "food", date(2025, 1, 2)
    )
    stats = await tx_crud.get_stats_by_user(session, user_id)
    assert stats == {"income": 1000.0, "expense": 350.0, "balance": 650.0}


async def test_transactions_pagination_and_isolation(session):
    u1 = await user_crud.create_user(session, "u1", "h")
    u2 = await user_crud.create_user(session, "u2", "h")
    cid = await cat_crud.create_category(session, "Еда", "расход")
    for i in range(12):
        await tx_crud.create_transaction(
            session, u1, "расход", 10 + i, cid, f"e{i}", date(2025, 1, 1)
        )

    items, total = await tx_crud.get_transactions_paginated(
        session, u1, page=2, per_page=10
    )
    assert total == 12 and len(items) == 2

    _, total_u2 = await tx_crud.get_transactions_paginated(session, u2)
    assert total_u2 == 0
