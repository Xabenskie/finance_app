from pydantic import BaseModel
from datetime import date
from typing import Literal, Optional, List

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
    model_config = {"from_attributes": True}

class TransactionPage(BaseModel):
    items: List[TransactionOut]
    total: int
    page: int
    per_page: int