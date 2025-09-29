# Chat (Monorepo)

A full-stack chat application built with **FastAPI** (async) on the backend and **React + Vite + TypeScript** on the frontend.  
Authentication uses **JWT (Bearer)**; data-fetching in the frontend uses **Redux Toolkit Query**.  
The UI is built with **Tailwind CSS** (with Shadcn/Radix components as needed).

> Monorepo layout
>
> ```
> chat/
> ├─ chat-backend/     # FastAPI app, async SQLAlchemy, Alembic, JWT
> └─ chat-frontend/    # React + Vite + TS, RTK Query, Tailwind, Shadcn UI
> ```

---

## ✨ Features

- 🔐 **Authentication**: JWT bearer token flow (token stored client-side)
- 💬 **Chats & Messages (REST)**: create/list chats, add/list messages
- ⚡ **Async Backend**: FastAPI + async SQLAlchemy + Alembic migrations
- 🔄 **Data Layer**: RTK Query with tag invalidation and `prepareHeaders` for auth
- 🎨 **Modern UI**: Tailwind CSS + (optional) Shadcn/Radix UI components
- 🧪 **Linting/Types**: TypeScript + ESLint (frontend)

---

## 🧰 Tech Stack

**Backend**
- Python 3.11+, FastAPI, Pydantic
- SQLAlchemy (async), Alembic
- JWT (OAuth2 Password Bearer)
- Uvicorn

**Frontend**
- React, TypeScript, Vite
- Redux Toolkit + RTK Query
- React Router
- Tailwind CSS (+ Shadcn/Radix UI)

**Database**
- Dev default: SQLite
- Production-ready: PostgreSQL (via `DATABASE_URL`)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18 (recommend 20+)
- **Python** ≥ 3.11
---

### 1) Backend (FastAPI)

```bash
cd chat-backend

poetry install
poetry shell

# Database schema
alembic upgrade head

# Run server
task run

Swagger UI → http://localhost:8000/docs

### 2) Frontend (Vite + React)

cd chat-frontend

npm install

# Environment
cp .env.example .env
# Set VITE_CHAT_API_URL (see below)

# Start dev server
npm run dev
# The terminal will show a URL (usually http://localhost:5173)



### Improvements

- Deploy of front and backend services
- Create tests for backend to cover 100% of the code
