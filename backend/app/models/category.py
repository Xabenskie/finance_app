from sqlalchemy import Column, String
from app.database import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    type = Column(String, nullable=False)  # "доход" или "расход"
