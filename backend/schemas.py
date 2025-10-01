from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ------------------ USERS ------------------
class UserBase(BaseModel):
    name: str
    email: str
    role: str

class UserCreate(UserBase):
    password: str  # required

class User(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True  # Pydantic v2


# ------------------ JOBS ------------------
class JobBase(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    user_id: int  # <-- if your SQLAlchemy model uses user_id instead, rename this to user_id

class JobCreate(JobBase):
    pass

class JobOut(JobBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
