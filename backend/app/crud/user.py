from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, update
from app.models.user import User
import uuid

async def get_user_by_username(session: AsyncSession, username: str):
    result = await session.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()

async def get_user_by_id(session: AsyncSession, user_id: str):
    result = await session.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

async def create_user(session: AsyncSession, username: str, hashed_password: str, role: str = "user"):
    user_id = str(uuid.uuid4())
    stmt = insert(User).values(id=user_id, username=username, hashed_password=hashed_password, role=role)
    await session.execute(stmt)
    await session.commit()
    return user_id

async def get_all_users(session: AsyncSession):
    result = await session.execute(select(User))
    return result.scalars().all()

async def update_user_role(session: AsyncSession, user_id: str, role: str):
    stmt = update(User).where(User.id == user_id).values(role=role)
    await session.execute(stmt)
    await session.commit()

async def update_user_avatar(session: AsyncSession, user_id: str, avatar_url: str):
    stmt = update(User).where(User.id == user_id).values(avatar_url=avatar_url)
    await session.execute(stmt)
    await session.commit()
