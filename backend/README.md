# Backend

FastAPI backend for SwarmOS, configured for Supabase Postgres.

## Installation

From `backend`:

1. Create virtual environment:
   - `python3 -m venv .venv`
   - `source .venv/bin/activate`
2. Install dependencies:
   - `python3 -m pip install -r requirements.txt`

## Database setup (Supabase)

The backend reads database configuration from one URL:

- `SUPABASE_DB_URL` (or `DATABASE_URL` fallback)

Example:

- `postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require`

How to get it from Supabase:

1. Open your Supabase project.
2. Go to `Project Settings -> Database`.
3. Copy the Postgres connection string.
4. Put it in `backend/.env` as `SUPABASE_DB_URL`.

`CORS_ORIGINS` is also required for browser access.

## Run locally

- Start API: `python3 -m uvicorn server:app --host 0.0.0.0 --port 8001`
- Health endpoint: `http://localhost:8001/api/health`

On startup, backend auto-creates required tables and indexes in Supabase.

## Auth endpoints

- `POST /api/signup` with `{ "email": "...", "password": "min-8-chars", "plan": "free" }`
- `POST /api/signin` with `{ "email": "...", "password": "min-8-chars" }`
- `POST /api/login` with `{ "email": "..." }` (legacy fallback for existing frontend)

## Deployment

Deploy on any Python ASGI host (Railway, Render, Fly.io, VPS).

Run command:

- `uvicorn server:app --host 0.0.0.0 --port $PORT`

Set env vars:

- `SUPABASE_DB_URL`
- `CORS_ORIGINS`
- optional integration keys: `EMERGENT_LLM_KEY`, `STRIPE_API_KEY`, `RESEND_API_KEY`, `SENDER_EMAIL`
