# SwarmOS — AI SDR Automation Platform

## Problem Statement
Full AI SaaS system for Sales Development Representative (SDR) automation. Manages leads, generates personalized cold emails using OpenAI, sends them via Resend, reads replies from inbox, classifies sentiments using AI, auto-books meetings, and optimizes campaign metrics.

## Architecture
- **Backend**: FastAPI (Python) on port 8001 with MongoDB
- **Frontend**: React CRA on port 3000 with Tailwind CSS
- **Database**: MongoDB (collections: users, leads, outreach, meetings, campaigns, insights, onboarding, payment_transactions)
- **AI**: OpenAI GPT-4o via Emergent LLM key
- **Payments**: Stripe via emergentintegrations
- **Preview URL**: https://lead-automation-27.preview.emergentagent.com

## What's Been Implemented

### Phase 1 — Core Backend (2026-04-15)
- [x] FastAPI backend with MongoDB
- [x] All CRUD endpoints: leads, outreach, inbox, meetings, automation, optimizer
- [x] Login endpoint (email-only, returns {email, orgId, plan})
- [x] Stats endpoint
- [x] Seed data on startup (demo user, 5 leads, 1 campaign)

### Phase 2 — Stripe Integration (2026-04-15)
- [x] POST /api/subscribe — Stripe checkout ($99/mo, "AI SDR SaaS")
- [x] GET /api/checkout/status/{session_id} — payment status polling
- [x] POST /api/webhook/stripe — webhook handler
- [x] payment_transactions collection

### Phase 3 — OpenAI Integration (2026-04-15)
- [x] POST /api/generate-email — AI-generated cold emails (GPT-4o)
- [x] POST /api/classify-reply — AI sentiment classification
- [x] Emergent LLM key configured

### Phase 4 — Full Design Overhaul (2026-04-15)
- [x] Landing page: navbar, hero, social proof, feature cards, pricing (Free/$0 + Pro/$99), footer
- [x] Onboarding: 4-step wizard with progress bar (Email → Target → Offer → Volume)
- [x] Dashboard: sidebar nav (Dashboard, Outreach, Meetings, Analytics, Settings), KPI cards, activity feed
- [x] Upgrade to Pro ($99/mo) → Stripe checkout
- [x] Logout functionality
- [x] Onboarding data saved to backend
- [x] Outfit + IBM Plex Sans typography
- [x] Swiss high-contrast design (black/white)

## MOCKED
- Resend email sending — not integrated (requires user API key + verified domain)
- Gmail inbox reading — simulated
- Calendly booking — simulated

## Backlog
### P1
- Resend integration for actual email sending
- Gmail API for inbox processing
- Calendly API for meeting booking

### P2
- JWT auth with password hashing
- Campaign management CRUD
- Real-time activity feed with WebSockets
- Analytics charts (Recharts)

### P3
- Multi-tenant (orgId-based data isolation)
- Webhook for plan upgrades after Stripe payment
- Email scheduling & rate limiting
