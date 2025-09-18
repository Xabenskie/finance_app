from fastapi import FastAPI
from app.database import setup_db
from app.routers import user, transaction, category

app = FastAPI()

app.include_router(user.router)
app.include_router(transaction.router)
app.include_router(category.router)

@app.post("/setup_db")
async def initialize_database():
    result = await setup_db()
    return result

