from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from chat_backend.routers import auth, chats, users

app = FastAPI()

ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://seu-dominio.com',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allow_headers=[
        'Authorization',
        'Content-Type',
        'Accept',
        'X-Requested-With',
    ],
    expose_headers=[
        'Content-Disposition',
    ],
)

app.include_router(users.router)
app.include_router(chats.router)
app.include_router(auth.router)
