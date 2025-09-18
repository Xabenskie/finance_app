from app.database import Base
from sqlalchemy import Column, String, Float, Date, ForeignKey

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True, index=True)  # UUID!
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)  # "доход" или "расход"
    amount = Column(Float, nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    description = Column(String)
    date = Column(Date, nullable=False)
