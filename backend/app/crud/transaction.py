from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, func
from app.models.transaction import Transaction
import uuid

async def create_transaction(session: AsyncSession, user_id: str, type_: str, amount: float, category_id: str, description: str, date):
    transaction_id = str(uuid.uuid4())
    stmt = insert(Transaction).values(id=transaction_id, user_id=user_id, type=type_, amount=amount, category_id=category_id, description=description, date=date)
    await session.execute(stmt)
    await session.commit()

async def get_transactions_by_user(session: AsyncSession, user_id: str):
    result = await session.execute(select(Transaction).where(Transaction.user_id == user_id))
    return result.scalars().all()

async def get_stats_by_user(session: AsyncSession, user_id: str):
    income_result = await session.execute(
        select(func.sum(Transaction.amount)).where(Transaction.user_id == user_id, Transaction.type == "доход")
    )
    expense_result = await session.execute(
        select(func.sum(Transaction.amount)).where(Transaction.user_id == user_id, Transaction.type == "расход")
    )
    income = income_result.scalar() or 0
    expense = expense_result.scalar() or 0
    return {
        "income": income,
        "expense": expense,
        "balance": income - expense
    }
