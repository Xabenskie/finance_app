from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

Base = declarative_base()

engine = create_async_engine('sqlite+aiosqlite:///./finance.db')

async_session = async_sessionmaker(engine, expire_on_commit=False)

async def get_session():
		async with async_session() as session:
				yield session

async def setup_db():
		async with engine.begin() as conn:
				await conn.run_sync(Base.metadata.drop_all)
				await conn.run_sync(Base.metadata.create_all)
		return { "status": "ok" }
