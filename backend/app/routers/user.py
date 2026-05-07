from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from app.schemas import user as user_schema
from app.crud import user as user_crud
from app.auth import jwt as auth_jwt
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.schemas.user import UserCreate
from app.crud import refresh_token as refresh_token_crud
from app.s3 import upload_avatar, get_avatar_url
from typing import Dict
from pydantic import BaseModel

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
    return user_schema.UserOut(id=user_id, username=user_in.username, role="user")


@router.post("/login", summary="Вход пользователя (JWT)", response_model=Dict[str, str])
async def login(login: UserCreate, session: AsyncSession = Depends(get_session)) -> Dict[str, str]:
    db_user = await user_crud.get_user_by_username(session, login.username)
    if not db_user or not auth_jwt.verify_password(login.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    access_token = auth_jwt.create_access_token(data={"sub": db_user.username, "role": db_user.role})
    refresh_token, jti, expires_at = auth_jwt.create_refresh_token(data={"sub": db_user.username})
    await refresh_token_crud.save_refresh_token(session, jti, db_user.id, refresh_token, expires_at)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "username": db_user.username,
        "role": db_user.role,
        "avatar_url": db_user.avatar_url or "",
    }

@router.get("/me", summary="Текущий пользователь", response_model=Dict[str, str])
async def read_users_me(
    payload: dict = Depends(auth_jwt.get_current_user_payload),
    session: AsyncSession = Depends(get_session),
) -> Dict[str, str]:
    username = payload["sub"]
    db_user = await user_crud.get_user_by_username(session, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"username": db_user.username, "role": db_user.role}

class RefreshTokenRequest(BaseModel):
    refresh_token: str

@router.post("/refresh", summary="Обновить access token", response_model=Dict[str, str])
async def refresh_access_token(
    request: RefreshTokenRequest,
    session: AsyncSession = Depends(get_session)
) -> Dict[str, str]:
    username, jti = auth_jwt.verify_refresh_token(request.refresh_token)
    if not username or not jti:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    db_token = await refresh_token_crud.get_refresh_token(session, request.refresh_token)
    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found or expired"
        )
    
    db_user = await user_crud.get_user_by_username(session, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    new_access_token = auth_jwt.create_access_token(data={"sub": username, "role": db_user.role})
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }

@router.post("/logout", summary="Выход из системы")
async def logout(
    request: RefreshTokenRequest,
    session: AsyncSession = Depends(get_session)
) -> Dict[str, str]:
    await refresh_token_crud.delete_refresh_token(session, request.refresh_token)
    return {"status": "success", "message": "Logged out successfully"}

@router.post("/avatar", summary="Загрузить аватарку")
async def upload_user_avatar(
    file: UploadFile = File(...),
    payload: dict = Depends(auth_jwt.get_current_user_payload),
    session: AsyncSession = Depends(get_session),
) -> Dict[str, str]:
    username = payload["sub"]
    db_user = await user_crud.get_user_by_username(session, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    contents = await file.read()
    content_type = file.content_type or "image/jpeg"
    url = upload_avatar(contents, db_user.id, content_type)
    await user_crud.update_user_avatar(session, db_user.id, url)
    return {"avatar_url": url}

@router.get("/avatar", summary="Получить URL аватарки")
async def get_user_avatar(
    payload: dict = Depends(auth_jwt.get_current_user_payload),
    session: AsyncSession = Depends(get_session),
) -> Dict[str, str | None]:
    username = payload["sub"]
    db_user = await user_crud.get_user_by_username(session, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"avatar_url": db_user.avatar_url}
