from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, delete
from app.models.refresh_token import RefreshToken
from datetime import datetime, timezone

async def save_refresh_token(session: AsyncSession, token_id: str, user_id: str, token: str, expires_at: datetime):
    stmt = insert(RefreshToken).values(
        id=token_id,
        user_id=user_id,
        token=token,
        expires_at=expires_at
    )
    await session.execute(stmt)
    await session.commit()

async def get_refresh_token(session: AsyncSession, token: str):
    result = await session.execute(
        select(RefreshToken).where(RefreshToken.token == token)
    )
    return result.scalars().first()

async def delete_refresh_token(session: AsyncSession, token: str):
    stmt = delete(RefreshToken).where(RefreshToken.token == token)
    await session.execute(stmt)
    await session.commit()

async def delete_expired_tokens(session: AsyncSession):
    stmt = delete(RefreshToken).where(RefreshToken.expires_at < datetime.now(timezone.utc))
    await session.execute(stmt)
    await session.commit()
