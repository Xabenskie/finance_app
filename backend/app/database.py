from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.config import settings

Base = declarative_base()

engine = create_async_engine(settings.database_url)

async_session = async_sessionmaker(engine, expire_on_commit=False)


async def get_session():
	async with async_session() as session:
		yield session


async def setup_db():
	async with engine.begin() as conn:
		await conn.run_sync(Base.metadata.drop_all)
		await conn.run_sync(Base.metadata.create_all)

	from app.crud.user import get_user_by_username, create_user
	from app.auth.jwt import get_password_hash

	async with async_session() as session:
		existing = await get_user_by_username(session, settings.default_admin_username)
		if not existing:
			hashed = get_password_hash(settings.default_admin_password)
			await create_user(
				session,
				settings.default_admin_username,
				hashed,
				role="admin",
			)

	return {"status": "ok"}
