# SwarmOS — AI SDR Automation Platform

## Problem Statement
Full AI SaaS system for Sales Development Representative (SDR) automation. Manages leads, generates personalized cold emails, sends them, reads replies, classifies sentiments, auto-books meetings, and optimizes campaign metrics.

## Architecture
- **Backend**: FastAPI (Python) on port 8001 with MongoDB
- **Frontend**: React CRA on port 3000
- **Database**: MongoDB (collections: users, leads, outreach, meetings, campaigns, insights)
- **Preview URL**: https://lead-automation-27.preview.emergentagent.com

## What's Been Implemented (2026-04-15)
- [x] Backend ported from Node.js/Express to FastAPI/Python with MongoDB
- [x] Login flow (POST /api/login — email-only, no password)
- [x] Dashboard with stats (GET /api/stats)
- [x] Leads CRUD (GET/POST/PATCH /api/leads)
- [x] Outreach endpoints (GET/POST /api/outreach, /api/outreach/send)
- [x] Inbox/replies endpoints (GET /api/inbox/replies, POST /api/inbox/process)
- [x] Meetings endpoints (GET/POST /api/meetings)
- [x] Automation start/stop/status endpoints
- [x] Optimizer + insights endpoints
- [x] Health endpoint
- [x] Seed data on startup (demo user, 5 leads, 1 campaign)
- [x] Frontend: Login.jsx, Dashboard.jsx, Stats.jsx
- [x] Full test suite passing (15/15 backend, frontend flows verified)

## MOCKED (Not Real)
- OpenAI email generation — uses template string
- Resend email sending — not integrated
- Inbox reading — simulated
- Calendly booking — simulated
- Sentiment classification — hardcoded "interested"

## Backlog
### P0 (Next)
- User may provide more component code snippets to apply

### P1
- OpenAI integration for real email generation & sentiment classification
- Resend integration for actual email sending (requires user's API key + verified domain)
- Gmail API for inbox processing
- Calendly API for meeting booking

### P2
- JWT auth with password hashing
- Logout functionality
- Error handling on frontend (login failures, loading states)
- Better UI/styling for Login and Dashboard
- Navigation sidebar, outreach history view, leads table view

### P3
- Performance optimizer with real AI suggestions
- Campaign management
- Analytics charts (Recharts)
