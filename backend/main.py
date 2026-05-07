from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import setup_db
from app.routers import user, transaction, category, admin
from app.models import (
    user as user_model,
    transaction as transaction_model,
    category as category_model,
    refresh_token as refresh_token_model,
)


def create_app() -> FastAPI:
    app = FastAPI(title="Finance App API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(user.router, prefix="/api")
    app.include_router(transaction.router, prefix="/api")
    app.include_router(category.router, prefix="/api")
    app.include_router(admin.router, prefix="/api")

    @app.get("/api/health", tags=["Service"])
    async def health() -> dict:
        return {"status": "ok"}

    @app.post("/api/setup_db")
    async def initialize_database():
        return await setup_db()

    return app


app = create_app()
