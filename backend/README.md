# Backend

FastAPI backend for SwarmOS.

## Installation

From `backend`:

1. Create virtual environment (recommended):
   - `python3 -m venv .venv`
   - `source .venv/bin/activate`
2. Install dependencies:
   - `python3 -m pip install -r requirements.txt`

If `requirements.txt` fails on private packages, install core runtime deps:

- `python3 -m pip install fastapi uvicorn motor pymongo python-dotenv resend`

## Database setup (MongoDB)

Backend expects MongoDB and reads values from `backend/.env`.

Current required keys:

- `MONGO_URL` (example: `mongodb://localhost:27017`)
- `DB_NAME` (example: `test_database`)
- `CORS_ORIGINS` (example: `*`)

### Run local MongoDB

Install and start MongoDB service on your machine so `MONGO_URL` is reachable.

Quick connectivity check:

- `python3 -c "from pymongo import MongoClient; print(MongoClient('mongodb://localhost:27017').admin.command('ping'))"`

## Run locally

- Start API: `python3 -m uvicorn server:app --host 0.0.0.0 --port 8001`
- Health endpoint: `http://localhost:8001/api/health`

## Auth endpoints

The backend now supports both schema-based auth and legacy login:

- `POST /api/signup` with `{ "email": "...", "password": "min-8-chars", "plan": "free" }`
- `POST /api/signin` with `{ "email": "...", "password": "min-8-chars" }`
- `POST /api/login` with `{ "email": "..." }` (legacy fallback used by current frontend)

## Tests

Run from `backend`:

- `python3 -m pytest -q`

Test suite expects `BASE_URL` to be set, for example:

- `BASE_URL=http://localhost:8001 python3 -m pytest -q`

## Deployment

Use any Python host that supports ASGI (Railway, Render, Fly.io, VPS, etc).

Recommended production command:

- `uvicorn server:app --host 0.0.0.0 --port $PORT`

Set environment variables in your platform:

- `MONGO_URL`
- `DB_NAME`
- `CORS_ORIGINS`
- optional integration keys (`EMERGENT_LLM_KEY`, `STRIPE_API_KEY`, `RESEND_API_KEY`, `SENDER_EMAIL`)
