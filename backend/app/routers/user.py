from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas import user as user_schema
from app.crud import user as user_crud
from app.auth import jwt as auth_jwt
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session, setup_db
from app.auth.jwt import get_current_username

router = APIRouter(
    prefix="/users",
    tags=["Пользователи"]
)

@router.post("/register", response_model=user_schema.UserCreate, tags=["Пользователи"], summary="Регистрация пользователя")
async def register(user_in: user_schema.UserCreate, session: AsyncSession = Depends(get_session)):
    existing_user = await user_crud.get_user_by_username(session, user_in.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth_jwt.get_password_hash(user_in.password)
    user_id = await user_crud.create_user(session, user_in.username, hashed_password)
    return {"username": user_in.username, "password": "***"}

@router.post("/login", response_model=user_schema.Token, tags=["Пользователи"], summary="Вход пользователя (JWT)")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: AsyncSession = Depends(get_session)):
    db_user = await user_crud.get_user_by_username(session, form_data.username)
    if not db_user or not auth_jwt.verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    access_token = auth_jwt.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", tags=["Пользователи"], summary="Текущий пользователь")
async def read_users_me(username: str = Depends(get_current_username)):
    return {"username": username}