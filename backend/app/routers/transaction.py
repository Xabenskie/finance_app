from fastapi.responses import FileResponse
import openpyxl
import os
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.transaction import TransactionCreate, TransactionOut, TransactionPage
from app.crud.transaction import create_transaction, get_transactions_by_user, get_stats_by_user, get_transactions_paginated
from app.auth.jwt import get_current_username
from app.crud.user import get_user_by_username
from app.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any, Optional
from fastapi import Query

router = APIRouter(
    prefix="/transactions",
    tags=["Транзакции"]
)

@router.post("/", summary="Добавить доход/расход", response_model=Dict[str, str])
async def add_transaction(
    transaction: TransactionCreate,
    session: AsyncSession = Depends(get_session),
    username: str = Depends(get_current_username)
) -> Dict[str, str]:
    user = await get_user_by_username(session, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await create_transaction(
        session,
        user_id=user.id,
        type_=transaction.type,
        amount=transaction.amount,
        category_id=transaction.category_id,
        description=transaction.description,
        date=transaction.date
    )
    return {"status": "ok"}

@router.get("/", summary="Получить транзакции (с пагинацией и фильтрацией)", response_model=TransactionPage)
async def get_transactions(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    type: Optional[str] = Query(None),
    category_id: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_session),
    username: str = Depends(get_current_username),
) -> TransactionPage:
    user = await get_user_by_username(session, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    items, total = await get_transactions_paginated(
        session, user.id, page, per_page, type, category_id
    )
    return TransactionPage(items=items, total=total, page=page, per_page=per_page)

@router.get("/stats", summary="Статистика пользователя", response_model=Dict[str, float])
async def get_stats(
    session: AsyncSession = Depends(get_session),
    username: str = Depends(get_current_username)
) -> Dict[str, float]:
    user = await get_user_by_username(session, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    stats = await get_stats_by_user(session, user.id)
    return stats

# Отчет по категориям и датам
@router.get("/report", summary="Отчет по категориям и датам", response_model=Dict[str, List[Dict[str, Any]]])
async def get_report(
    session: AsyncSession = Depends(get_session),
    username: str = Depends(get_current_username)
) -> Dict[str, List[Dict[str, Any]]]:
    from app.models.transaction import Transaction
    from sqlalchemy import func, select
    user = await get_user_by_username(session, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Суммы по категориям
    category_stmt = select(
        Transaction.category,
        Transaction.type,
        func.sum(Transaction.amount).label("total")
    ).where(Transaction.user_id == user.id).group_by(Transaction.category, Transaction.type)
    category_result = await session.execute(category_stmt)
    by_category = [
        {"category": row.category, "type": row.type, "total": row.total}
        for row in category_result
    ]
    # Суммы по датам
    date_stmt = select(
        Transaction.date,
        Transaction.type,
        func.sum(Transaction.amount).label("total")
    ).where(Transaction.user_id == user.id).group_by(Transaction.date, Transaction.type)
    date_result = await session.execute(date_stmt)
    by_date = [
        {"date": row.date, "type": row.type, "total": row.total}
        for row in date_result
    ]
    return {
        "by_category": by_category,
        "by_date": by_date
    }

# Выгрузка всех транзакций пользователя в Excel
@router.get("/export", summary="Выгрузить транзакции в Excel", response_class=FileResponse)
async def export_transactions(
    session: AsyncSession = Depends(get_session),
    username: str = Depends(get_current_username)
) -> FileResponse:
    user = await get_user_by_username(session, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    from app.models.transaction import Transaction
    from app.models.category import Category
    from sqlalchemy import select
    # Получаем все транзакции пользователя
    result = await session.execute(select(Transaction).where(Transaction.user_id == user.id))
    transactions = result.scalars().all()
    # Получаем категории для отображения имени
    cat_result = await session.execute(select(Category))
    categories = {cat.id: cat.name for cat in cat_result.scalars().all()}
    # Создаем Excel-файл
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Транзакции"
    ws.append(["ID", "Тип", "Сумма", "Категория", "Описание", "Дата"])
    for t in transactions:
        ws.append([
            t.id,
            t.type,
            t.amount,
            categories.get(t.category_id, t.category_id),
            t.description or "",
            str(t.date)
        ])
    # Сохраняем файл во временную папку
    filename = f"transactions_{user.id}.xlsx"
    filepath = os.path.join("/tmp", filename)
    wb.save(filepath)
    return FileResponse(filepath, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename=filename)
