from fastapi import APIRouter, Depends, HTTPException
from app.schemas.category import CategoryCreate, CategoryOut
from app.crud.category import create_category, get_categories, delete_category
from app.database import get_session
from app.auth.rbac import require_manager, require_user
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict

router = APIRouter(
    prefix="/categories",
    tags=["Категории"]
)

@router.post("/", response_model=CategoryOut, summary="Добавить категорию (manager/admin)")
async def add_category(
    category: CategoryCreate,
    session: AsyncSession = Depends(get_session),
    _payload: dict = Depends(require_manager),
) -> CategoryOut:
    category_id = await create_category(session, category.name, category.type)
    return CategoryOut(id=category_id, name=category.name, type=category.type)

@router.get("/", response_model=List[CategoryOut], summary="Получить все категории")
async def get_all_categories(
    session: AsyncSession = Depends(get_session),
    _payload: dict = Depends(require_user),
) -> List[CategoryOut]:
    categories = await get_categories(session)
    return categories

@router.delete("/{category_id}", summary="Удалить категорию (manager/admin)", response_model=Dict[str, str])
async def remove_category(
    category_id: str,
    session: AsyncSession = Depends(get_session),
    _payload: dict = Depends(require_manager),
) -> Dict[str, str]:
    await delete_category(session, category_id)
    return {"status": "deleted"}
