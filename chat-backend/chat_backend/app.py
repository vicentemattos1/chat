from fastapi import FastAPI

from chat_backend.routers import chats, users, auth

app = FastAPI()

app.include_router(users.router)
app.include_router(chats.router)
app.include_router(auth.router)
