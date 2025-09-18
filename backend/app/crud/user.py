from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert
from app.models.user import User
import uuid

async def get_user_by_username(session: AsyncSession, username: str):
    result = await session.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()

async def create_user(session: AsyncSession, username: str, hashed_password: str):
    user_id = str(uuid.uuid4())
    stmt = insert(User).values(id=user_id, username=username, hashed_password=hashed_password)
    await session.execute(stmt)
    await session.commit()
    return user_id
