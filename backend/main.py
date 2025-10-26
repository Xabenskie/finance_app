from fastapi import FastAPI
from app.database import setup_db
from app.routers import user, transaction, category
from fastapi.middleware.cors import CORSMiddleware
# Импортируем модели для создания таблиц
from app.models import user as user_model, transaction as transaction_model, category as category_model, refresh_token as refresh_token_model

app = FastAPI()

# CORS: Разрешить все (по сути "отключить" ограничения CORS для фронта в разработке)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # В проде лучше указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix="/api")
app.include_router(transaction.router, prefix="/api")
app.include_router(category.router, prefix="/api")

@app.post("/api/setup_db")
async def initialize_database():
    result = await setup_db()
    return result

