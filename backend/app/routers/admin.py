from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserOut, UserRoleUpdate
from app.crud import user as user_crud
from app.database import get_session
from app.auth.rbac import require_admin
from app.auth.jwt import VALID_ROLES
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict

router = APIRouter(
    prefix="/admin",
    tags=["Администрирование"]
)

@router.get("/users", response_model=List[UserOut], summary="Список всех пользователей (admin)")
async def list_users(
    session: AsyncSession = Depends(get_session),
    payload: dict = Depends(require_admin),
) -> List[UserOut]:
    users = await user_crud.get_all_users(session)
    return users

@router.patch("/users/{user_id}/role", response_model=UserOut, summary="Изменить роль пользователя (admin)")
async def change_user_role(
    user_id: str,
    body: UserRoleUpdate,
    session: AsyncSession = Depends(get_session),
    payload: dict = Depends(require_admin),
) -> UserOut:
    if body.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Недопустимая роль. Допустимые: {', '.join(sorted(VALID_ROLES))}")

    user = await user_crud.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    admin_username = payload["sub"]
    if user.username == admin_username and body.role != "admin":
        raise HTTPException(status_code=400, detail="Нельзя снять роль admin у самого себя")

    await user_crud.update_user_role(session, user_id, body.role)
    user = await user_crud.get_user_by_id(session, user_id)
    return user
