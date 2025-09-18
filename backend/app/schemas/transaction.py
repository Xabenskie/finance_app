from pydantic import BaseModel
from datetime import date
from typing import Literal, Optional

class TransactionCreate(BaseModel):
    type: Literal["доход", "расход"]
    amount: float
    category_id: str
    description: Optional[str] = None
    date: date

class TransactionOut(BaseModel):
    id: str
    type: str
    amount: float
    category_id: str
    description: Optional[str]
    date: date
    class Config:
        orm_mode = True