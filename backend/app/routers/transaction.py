from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert
from app.schemas.transcation import TransactionCreate
from app.models.transaction import Transaction
from app.database import get_session

router = APIRouter(
    prefix="/transactions",
    tags=["Транзакции"]
)

@router.post("/", summary="Добавить доход/расход")
async def add_transaction(
    transaction: TransactionCreate,
    session: AsyncSession = Depends(get_session)
):
    stmt = insert(Transaction).values(**transaction.dict())
    await session.execute(stmt)
    await session.commit()
    return {"status": "ok"}