from fastapi import FastAPI
from app.routers import user
from app.database import setup_db
from app.routers import transaction

app = FastAPI()

@app.post("/setup_db")
async def initialize_database():
    result = await setup_db()
    return result

app.include_router(user.router)

app.include_router(transaction.router)