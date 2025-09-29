from datetime import datetime
from typing import List

from pydantic import BaseModel, EmailStr, Field


class Message(BaseModel):
    message: str


class FilterPage(BaseModel):
    limit: int = Field(default=10, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class UserSchema(BaseModel):
    username: str = Field(min_length=3, max_length=80)
    password: str = Field(min_length=6)
    email: EmailStr


class UserPublic(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime


class UserList(BaseModel):
    users: List[UserPublic]
