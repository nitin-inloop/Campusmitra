# schemas/user_schema.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class User(BaseModel):
    id: Optional[str] = None
    username: str
    email: EmailStr
    password_hash: str  # Never store plain passwords
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    created_at: datetime
    is_active: bool
