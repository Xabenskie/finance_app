from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import user as user_schema
from app.crud import user as user_crud
from app.auth import jwt as auth_jwt
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.schemas.user import UserCreate

router = APIRouter(
    prefix="/users",
    tags=["Пользователи"]
)

@router.post("/register", response_model=user_schema.UserOut, summary="Регистрация пользователя")
async def register(user_in: user_schema.UserCreate, session: AsyncSession = Depends(get_session)) -> user_schema.UserOut:
    existing_user = await user_crud.get_user_by_username(session, user_in.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth_jwt.get_password_hash(user_in.password)
    user_id = await user_crud.create_user(session, user_in.username, hashed_password)
    return user_schema.UserOut(id=user_id, username=user_in.username)



from typing import Dict
@router.post("/login", summary="Вход пользователя (JWT)", response_model=Dict[str, str])
async def login(login: UserCreate, session: AsyncSession = Depends(get_session)) -> Dict[str, str]:
    db_user = await user_crud.get_user_by_username(session, login.username)
    if not db_user or not auth_jwt.verify_password(login.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    access_token = auth_jwt.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "username": db_user.username}

@router.get("/me", summary="Текущий пользователь", response_model=Dict[str, str])
async def read_users_me(username: str = Depends(auth_jwt.get_current_username)) -> Dict[str, str]:
    return {"username": username}
