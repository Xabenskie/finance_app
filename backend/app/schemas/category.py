from pydantic import BaseModel

class CategoryCreate(BaseModel):
    name: str
    type: str  # "доход" или "расход"

class CategoryOut(BaseModel):
    id: str
    name: str
    type: str
    class Config:
        orm_mode = True
