from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, delete
from app.models.category import Category
import uuid

async def create_category(session: AsyncSession, name: str, type_: str):
    category_id = str(uuid.uuid4())
    stmt = insert(Category).values(id=category_id, name=name, type=type_)
    await session.execute(stmt)
    await session.commit()
    return category_id

async def get_categories(session: AsyncSession):
    result = await session.execute(select(Category))
    return result.scalars().all()

async def delete_category(session: AsyncSession, category_id: str):
    stmt = delete(Category).where(Category.id == category_id)
    await session.execute(stmt)
    await session.commit()
