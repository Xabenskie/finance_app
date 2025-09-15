from pydantic import BaseModel
from datetime import date
from typing import Literal

class TransactionCreate(BaseModel):
    type: Literal["доход", "расход"]
    amount: float
    category: str
    description: str | None = None
    date: date