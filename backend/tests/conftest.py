"""Общие фикстуры для тестов backend.

Изолируем тесты от продовой БД и внешних сервисов:
* подменяем DATABASE_URL на in-memory SQLite,
* мокаем S3 (MinIO),
* пересоздаём схему перед каждым тестом для чистоты состояния.
"""
from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path
from typing import AsyncIterator
from unittest.mock import patch

import pytest
import pytest_asyncio

# --- настройка окружения ДО импорта приложения ---------------------------------

os.environ["ENVIRONMENT"] = "test"
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret"
os.environ["REFRESH_SECRET_KEY"] = "test-refresh-secret"
os.environ["S3_ENDPOINT_URL"] = "http://fake-s3:9000"
os.environ["S3_PUBLIC_URL"] = "http://fake-s3:9000"
os.environ["DEFAULT_ADMIN_PASSWORD"] = "admin"

# Чтобы импорты типа `from app.X` работали при запуске из /backend
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine  # noqa: E402

from app import database as db_module  # noqa: E402
from app.database import Base, get_session  # noqa: E402
from main import app  # noqa: E402

# Импорт всех моделей, чтобы они зарегистрировались в Base.metadata
from app.models import user as _u  # noqa: E402,F401
from app.models import transaction as _t  # noqa: E402,F401
from app.models import category as _c  # noqa: E402,F401
from app.models import refresh_token as _r  # noqa: E402,F401


@pytest.fixture(scope="session")
def event_loop():
    """Единый event-loop на сессию (нужен для async-фикстур)."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(autouse=True)
async def _isolated_db():
    """Каждый тест получает чистый in-memory SQLite: без shared state."""
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        future=True,
    )
    TestingSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

    # подменяем глобальные объекты модуля database
    db_module.engine = engine
    db_module.async_session = TestingSessionLocal

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async def override_get_session() -> AsyncIterator:
        async with TestingSessionLocal() as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session

    yield engine

    app.dependency_overrides.clear()
    await engine.dispose()


@pytest.fixture(autouse=True)
def _mock_s3():
    """S3/MinIO замокан, чтобы тесты не ходили во внешние сервисы."""
    with patch("app.s3.upload_avatar", return_value="http://fake-s3/avatars/test.jpg"), \
         patch("app.s3.get_avatar_url", return_value=None), \
         patch("app.routers.user.upload_avatar", return_value="http://fake-s3/avatars/test.jpg"):
        yield


@pytest.fixture
def client():
    """Синхронный TestClient для интеграционных тестов."""
    from fastapi.testclient import TestClient

    with TestClient(app) as c:
        yield c


@pytest_asyncio.fixture
async def session():
    """AsyncSession для unit-тестов CRUD-слоя."""
    async with db_module.async_session() as s:
        yield s


# ----- Хелперы для интеграционных тестов --------------------------------------


def _register_and_login(client, username: str, password: str = "Pass123!") -> dict:
    """Регистрирует пользователя и возвращает access/refresh токены и role."""
    client.post("/api/users/register", json={"username": username, "password": password})
    resp = client.post(
        "/api/users/login", json={"username": username, "password": password}
    )
    assert resp.status_code == 200, resp.text
    return resp.json()


@pytest.fixture
def user_token(client) -> dict:
    return _register_and_login(client, "user1")


@pytest.fixture
def admin_token(client):
    """Создаёт админа напрямую через CRUD и логинит."""
    import asyncio as _aio

    from app.auth.jwt import get_password_hash
    from app.crud.user import create_user

    async def _seed():
        async with db_module.async_session() as s:
            await create_user(s, "admin1", get_password_hash("Pass123!"), role="admin")

    _aio.get_event_loop().run_until_complete(_seed())
    resp = client.post(
        "/api/users/login", json={"username": "admin1", "password": "Pass123!"}
    )
    assert resp.status_code == 200, resp.text
    return resp.json()


@pytest.fixture
def manager_token(client):
    import asyncio as _aio

    from app.auth.jwt import get_password_hash
    from app.crud.user import create_user

    async def _seed():
        async with db_module.async_session() as s:
            await create_user(s, "mgr1", get_password_hash("Pass123!"), role="manager")

    _aio.get_event_loop().run_until_complete(_seed())
    resp = client.post(
        "/api/users/login", json={"username": "mgr1", "password": "Pass123!"}
    )
    assert resp.status_code == 200, resp.text
    return resp.json()


def auth_headers(token_data: dict) -> dict:
    return {"Authorization": f"Bearer {token_data['access_token']}"}
