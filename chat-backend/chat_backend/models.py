from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, registry, relationship

table_registry = registry()


class MessageRole(str, Enum):
    user = 'user'
    bot = 'bot'


@table_registry.mapped_as_dataclass
class User:
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True)
    password: Mapped[str]
    email: Mapped[str] = mapped_column(String(255), unique=True)
    created_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now()
    )

    chats: Mapped[list['Chat']] = relationship(
        init=False,
        cascade='all, delete-orphan',
        lazy='selectin',
        back_populates='user',
        order_by='Chat.created_at.desc()',
    )


@table_registry.mapped_as_dataclass
class Chat:
    __tablename__ = 'chats'

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), index=True)

    title: Mapped[str] = mapped_column(String(160), default='New chat')
    created_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now()
    )
    last_message_at: Mapped[Optional[datetime]] = mapped_column(
        default=None, index=True
    )

    user: Mapped['User'] = relationship(init=False, back_populates='chats')
    messages: Mapped[list['Message']] = relationship(
        init=False,
        cascade='all, delete-orphan',
        lazy='selectin',
        back_populates='chat',
        order_by='Message.created_at.asc()',
    )


@table_registry.mapped_as_dataclass
class Message:
    __tablename__ = 'messages'

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    chat_id: Mapped[int] = mapped_column(ForeignKey('chats.id'), index=True)

    role: Mapped[MessageRole]
    content: Mapped[str] = mapped_column(Text())
    created_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now()
    )

    chat: Mapped['Chat'] = relationship(init=False, back_populates='messages')
