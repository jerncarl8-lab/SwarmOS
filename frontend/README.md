# Frontend

React + CRACO frontend for SwarmOS.

## Installation

From `frontend`:

1. Install dependencies:
   - `npm install --legacy-peer-deps`
2. Create env file:
   - `cp .env.example .env`
3. Set API base URL in `.env`:
   - `REACT_APP_BACKEND_URL=http://localhost:8001`

## Local development

- Start dev server: `npm start`
- Default local URL: `http://localhost:3000`

## Build and checks

- Production build: `npm run build`
- CI-style tests: `npm run test:ci`

## Deployment (Vercel)

This app includes `vercel.json` for static SPA deployment.

1. Import the repository in Vercel.
2. Set project root directory to `frontend`.
3. Add environment variable:
   - `REACT_APP_BACKEND_URL=https://your-backend-domain.com`
4. Deploy.

Notes:

- Output directory: `build`
- SPA routes rewrite to `index.html` is already configured.
