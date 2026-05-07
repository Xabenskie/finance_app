# Finance App

MVP личного финансового учёта: FastAPI + React/TS + PostgreSQL + MinIO + nginx.
Репозиторий покрывает требования **Лабораторных №5 (тестирование)** и **№6 (контейнеризация и CI/CD)**.

---

## Содержание

- [Стек и архитектура](#стек-и-архитектура)
- [Быстрый запуск (docker compose)](#быстрый-запуск-docker-compose)
- [Локальная разработка](#локальная-разработка)
- [Тестирование (Лаба 5)](#тестирование-лаба-5)
- [Контейнеризация (Лаба 6)](#контейнеризация-лаба-6)
- [CI/CD](#cicd)
- [Конфигурация (env-переменные)](#конфигурация-env-переменные)
- [Структура репозитория](#структура-репозитория)

---

## Стек и архитектура

```
┌───────────┐   /        ┌──────────────┐   /api    ┌──────────┐
│  Browser  │ ─────────▶ │   nginx      │ ────────▶ │ FastAPI  │
└───────────┘            │ (frontend)   │           │ backend  │
                         └──────┬───────┘           └────┬─────┘
                                │ /s3 (avatars)          │
                                ▼                        ▼
                        ┌──────────────┐         ┌─────────────┐
                        │   MinIO      │         │ PostgreSQL  │
                        └──────────────┘         └─────────────┘
```

- **frontend** (React 19 + Vite + Zustand) собирается в статические файлы и раздаётся nginx-ом.
  Тот же nginx проксирует `/api/*` на backend и `/s3/*` на MinIO.
- **backend** (FastAPI + SQLAlchemy async) выполняет бизнес-логику, JWT-аутентификацию (access+refresh), RBAC.
- **PostgreSQL** — основное хранилище.
- **MinIO** — объектное хранилище для аватаров (S3-совместимое).
- Все сервисы общаются через bridge-сеть `app-net`, порты наружу пробрасывает только nginx (frontend) и MinIO (для отладки).

---

## Быстрый запуск (docker compose)

```bash
cp .env.example .env
docker compose up -d --build
# Инициализация БД и админ-аккаунта (admin/admin):
curl -X POST http://localhost:8000/api/setup_db
```

Открыть: <http://localhost:8080>.
MinIO console: <http://localhost:9001> (`minioadmin` / `minioadmin`).

Healthcheck-и встроены:
```bash
docker compose ps        # колонка STATUS должна быть "healthy"
curl http://localhost:8080/healthz       # фронт
curl http://localhost:8000/api/health    # бэкенд
```

---

## Локальная разработка

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Vite dev-server проксирует `/api/*` на backend (см. `vite.config.ts`).

---

## Тестирование (Лаба 5)

Тестовая модель приложения и матрица «сценарий → тест»: см. [`docs/test-model.md`](docs/test-model.md).

### Backend (pytest, async)

| Файл | Тип | Что покрывает |
|------|-----|---------------|
| `backend/tests/unit/test_unit.py` | unit | JWT (хеш, expire, refresh-roundtrip), RBAC, ключевая бизнес-логика CRUD (статистика, пагинация, изоляция пользователей) |
| `backend/tests/integration/test_api.py` | integration | health, register/login/me, валидация, фильтры транзакций + статистика, RBAC на категориях и админке, загрузка аватара + сценарий «MinIO лёг» |

```bash
cd backend
source venv/bin/activate
python -m pytest tests/ --cov=app --cov-report=term-missing

# Только быстрые
python -m pytest -m unit
# Только интеграционные
python -m pytest -m integration
```

Изоляция (`tests/conftest.py`): in-memory SQLite, переопределение `get_session`,
мок `app.s3.upload_avatar`/`get_avatar_url`, фикстуры `user_token` / `manager_token` / `admin_token`.

Последний прогон: **18 тестов**, покрытие **68%** (порог 50% в `.coveragerc`).

### Frontend (Vitest + React Testing Library)

| Файл | Что покрывает |
|------|---------------|
| `src/lib/utils.test.ts` | утилита `cn` (merge классов) |
| `src/pages/auth/store/auth-store.test.ts` | бизнес-логика стора авторизации |
| `src/pages/auth/login/login.test.tsx` | форма логина + обработка серверной ошибки |
| `src/pages/categories/categories-page.test.tsx` | RBAC в UI: user vs manager |
| `src/pages/transactions/transactions-page.test.tsx` | список транзакций + фильтр |

```bash
cd frontend
pnpm test                # один прогон
pnpm test:watch          # watch
pnpm test:coverage       # с покрытием
```

Последний прогон: **10 тестов**, покрытие **87%** в core-модулях (порог 30/30/50/30).

### E2E (Playwright)

Каталог `frontend/e2e/`. HTTP-запросы к backend и Open-Meteo замокированы
через `page.route()` — E2E-сьют не требует поднятого backend.

```bash
cd frontend
pnpm test:e2e:install    # один раз — поставить браузер
pnpm test:e2e
```

`e2e/critical.spec.ts` (3 теста) покрывает (Лаба 5, п.4):
- 4.1 вход → `/dashboard`;
- 4.1 восстановление сессии из localStorage → защищённый маршрут открыт;
- 4.2 RBAC: `user` на `/admin` видит «Доступ запрещён».

### Метрики качества (Лаба 5, п.6)

| Метрика | Backend | Frontend |
|---------|---------|----------|
| Минимальный порог покрытия | 50% (`backend/.coveragerc → fail_under`) | 30% lines / 30% functions / 50% branches / 30% statements (`frontend/vite.config.ts`) |
| Разделение быстрых/долгих | маркеры `unit` / `integration` / `slow` в `pytest.ini` | unit (`pnpm test`) vs e2e (`pnpm test:e2e`) |
| Единое именование | `test_*.py`, классы `Test*`, функции `test_*` / `*.test.ts(x)` |

---

## Контейнеризация (Лаба 6)

### Состав сервисов (`docker-compose.yml`)

| Сервис | Образ | Порт хоста | Зависит от |
|--------|-------|------------|------------|
| `db` | `postgres:16-alpine` | — | — |
| `minio` | `minio/minio:latest` | `9000` (S3), `9001` (UI) | — |
| `backend` | build `./backend` | `8000` | `db` (healthy), `minio` (healthy) |
| `frontend` | build `./frontend` (multi-stage Vite + nginx) | `8080` | `backend` (healthy) |

Сетевая схема — отдельный bridge `app-net`. Postgres намеренно **не** пробрасывает порт наружу.

### Healthchecks

- `db` — `pg_isready`;
- `minio` — `/minio/health/ready`;
- `backend` — `GET /api/health` (новый эндпоинт в `main.py`);
- `frontend` — `GET /healthz` (отдельный location в `nginx.conf`).

`depends_on.condition: service_healthy` гарантирует правильный порядок старта (Лаба 6, п.3.4).

### Безопасная конфигурация (Лаба 6, п.4)

- Все секреты вынесены в env (`.env.example` — шаблон, `.env` в `.gitignore`).
- Контейнер backend работает под `app:1000`, не от root.
- nginx добавляет `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`.
- В `.dockerignore` исключены `.env`, тесты, `node_modules`, `__pycache__`, локальная sqlite.

### Управление

```bash
# Сборка и запуск
docker compose up -d --build

# Просмотр статуса/healthchecks
docker compose ps

# Логи
docker compose logs -f backend

# Прогон backend-тестов в контейнере
docker compose -f docker-compose.test.yml up --abort-on-container-exit --exit-code-from backend-tests --build

# Остановка
docker compose down            # с сохранением томов
docker compose down -v         # вместе с томами
```

### Устойчивость (Лаба 6, п.6.4)

- Падение `backend` → `restart: unless-stopped` поднимает контейнер.
- Падение `db` → backend помечается `unhealthy`, но при возврате БД healthcheck зелёный.
- Сбой `minio` → ручка `/api/users/avatar` отвечает 500, фронт показывает ошибку, остальное работает.
- Неуспешная миграция/инициализация (`/api/setup_db`) → возвращает HTTP-ошибку, БД остаётся в исходном состоянии.

---

## CI/CD

`.github/workflows/ci.yml` запускается на каждый push/PR в `main`:

1. **backend-tests** — `pytest` с порогом покрытия 70%.
2. **frontend-tests** — `pnpm lint` + `pnpm test:coverage` (порог 60%).
3. **e2e-tests** — Playwright (с моками HTTP) после успешных юнит-прогонов.
4. **docker-build** — сборка обоих образов через buildx, валидация compose.

`.github/workflows/deploy.yml` — на push в `main` или тег `vX.Y.Z`:
- логин в GHCR;
- сборка и пуш `ghcr.io/<owner>/<repo>-{backend,frontend}:{sha,latest,ref}`;
- шаг `deploy` — заглушка под реальную инфраструктуру (ssh / k8s / Helm).

---

## Конфигурация (env-переменные)

Полный список и значения по умолчанию: [`backend/.env.example`](backend/.env.example), [`.env.example`](.env.example).

Ключевые:

| Имя | Где используется | По умолчанию |
|-----|------------------|--------------|
| `DATABASE_URL` | backend SQLAlchemy | `sqlite+aiosqlite:///./finance.db` (`postgresql+asyncpg://...` в compose) |
| `SECRET_KEY`, `REFRESH_SECRET_KEY` | подпись JWT | dev-значения, **в проде заменить!** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | срок access-токена | 30 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | срок refresh-токена | 7 |
| `CORS_ORIGINS` | CORS allowlist (через запятую) | `*` |
| `S3_ENDPOINT_URL` | внутренний адрес MinIO | `http://minio:9000` |
| `S3_PUBLIC_URL` | URL, по которому браузер видит аватары | `http://localhost:9000` |
| `DEFAULT_ADMIN_USERNAME/PASSWORD` | создаются `/api/setup_db` | `admin` / `admin` |
| `VITE_API_URL` (frontend) | base URL axios | `/api/` (через nginx) |

---

## Структура репозитория

```
finance_app/
├─ backend/                      FastAPI приложение
│  ├─ app/                       код (routers, crud, models, schemas, auth)
│  ├─ tests/                     pytest unit + integration
│  ├─ Dockerfile                 multi-stage prod-образ (Лаба 6)
│  ├─ .dockerignore
│  ├─ .env.example
│  ├─ pytest.ini                 маркеры unit/integration/slow
│  └─ .coveragerc                порог покрытия 70%
├─ frontend/                     React 19 + Vite + TS
│  ├─ src/                       код + *.test.ts(x)
│  ├─ e2e/                       Playwright-сьют (с моками HTTP)
│  ├─ Dockerfile                 builder (pnpm) + nginx
│  ├─ nginx.conf                 SPA + /api proxy + /s3 proxy + healthz
│  ├─ playwright.config.ts
│  ├─ vite.config.ts             dev proxy + vitest config + покрытие
│  └─ .env.example
├─ docs/test-model.md            тестовая модель (Лаба 5, п.1)
├─ docker-compose.yml            прод-композ (db + minio + backend + frontend)
├─ docker-compose.test.yml       composer для backend-тестов
├─ .env.example
└─ .github/workflows/
   ├─ ci.yml                     backend + frontend + e2e + docker build
   └─ deploy.yml                 публикация образов в GHCR
```
