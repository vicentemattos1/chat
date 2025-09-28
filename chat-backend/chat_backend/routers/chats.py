from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from chat_backend.database import get_session
from chat_backend.models import Chat, Message, User
from chat_backend.schemas.chats import (
    ChatCreate,
    ChatDetailRead,
    ChatList,
    ChatRead,
    MessageCreate,
    MessageRead,
)
from chat_backend.schemas.user import FilterPage
from chat_backend.security import get_current_user

router = APIRouter(prefix='/chats', tags=['chats'])

Session = Annotated[AsyncSession, Depends(get_session)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post('/', status_code=HTTPStatus.CREATED, response_model=ChatRead)
async def create_chat(
    payload: ChatCreate,
    session: Session,
    current_user: CurrentUser,
):
    chat = Chat(user_id=current_user.id, title=payload.title or 'New chat')
    session.add(chat)
    await session.commit()
    await session.refresh(chat)
    return ChatRead(
        id=chat.id,
        title=chat.title,
        created_at=chat.created_at,
        last_message_at=chat.last_message_at,
    )


@router.get('/', response_model=ChatList)
async def list_chats(
    session: Session,
    current_user: CurrentUser,
    filter_page: Annotated[FilterPage, Query()],
):
    stmt = (
        select(Chat)
        .where(Chat.user_id == current_user.id)
        .order_by(
            Chat.last_message_at.desc().nullslast(), Chat.created_at.desc()
        )
        .offset(filter_page.offset)
        .limit(filter_page.limit)
    )
    chats = (await session.scalars(stmt)).all()
    return {
        'chats': [
            ChatRead(
                id=c.id,
                title=c.title,
                created_at=c.created_at,
                last_message_at=c.last_message_at,
            )
            for c in chats
        ]
    }


@router.get('/{chat_id}', response_model=ChatDetailRead)
async def get_chat(
    chat_id: int,
    session: Session,
    current_user: CurrentUser,
):
    chat = await session.get(Chat, chat_id)
    if not chat or chat.user_id != current_user.id:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Chat not found'
        )

    return ChatDetailRead(
        id=chat.id,
        title=chat.title,
        created_at=chat.created_at,
        last_message_at=chat.last_message_at,
        messages=[
            MessageRead(
                id=m.id,
                role=m.role,
                content=m.content,
                created_at=m.created_at,
            )
            for m in chat.messages
        ],
    )


@router.post(
    '/{chat_id}/messages',
    status_code=HTTPStatus.CREATED,
    response_model=MessageRead,
)
async def add_message(
    chat_id: int,
    payload: MessageCreate,
    session: Session,
    current_user: CurrentUser,
):
    chat = await session.get(Chat, chat_id)
    if not chat or chat.user_id != current_user.id:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Chat not found'
        )

    msg = Message(chat_id=chat_id, role=payload.role, content=payload.content)
    session.add(msg)

    # Atualiza last_message_at para ordenar por recente
    chat.last_message_at = func.now()

    await session.commit()
    await session.refresh(msg)
    return MessageRead(
        id=msg.id,
        role=msg.role,
        content=msg.content,
        created_at=msg.created_at,
    )


@router.delete('/{chat_id}', response_model=dict)
async def delete_chat(
    chat_id: int,
    session: Session,
    current_user: CurrentUser,
):
    chat = await session.get(Chat, chat_id)
    if not chat or chat.user_id != current_user.id:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Chat not found'
        )

    await session.delete(chat)
    await session.commit()
    return {'message': 'Chat deleted'}
