from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class MessageRole(str, Enum):
    user = 'user'
    bot = 'bot'


class ChatCreate(BaseModel):
    title: str = Field(default='New chat')


class ChatRead(BaseModel):
    id: int
    title: str
    created_at: datetime
    last_message_at: Optional[datetime] = None


class ChatList(BaseModel):
    chats: List[ChatRead]


class MessageCreate(BaseModel):
    role: MessageRole
    content: str


class MessageRead(BaseModel):
    id: int
    role: MessageRole
    content: str
    created_at: datetime


class ChatDetailRead(BaseModel):
    id: int
    title: str
    created_at: datetime
    last_message_at: Optional[datetime] = None
    messages: List[MessageRead] = []
