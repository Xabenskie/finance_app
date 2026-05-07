from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: str
    username: str
    role: str = "user"
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}

class UserRoleUpdate(BaseModel):
    role: str
