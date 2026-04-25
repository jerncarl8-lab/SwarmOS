# SwarmOS — AI SDR Automation Platform

## Problem Statement
Full AI SaaS system for SDR automation. Manages leads, generates personalized cold emails using OpenAI, books meetings automatically, classifies reply sentiments, and optimizes campaigns. Stripe for payments.

## Architecture
- **Backend**: FastAPI (Python) on port 8001 + MongoDB
- **Frontend**: React CRA on port 3000 + Tailwind CSS
- **AI**: OpenAI GPT-4o via Emergent LLM key
- **Payments**: Stripe via emergentintegrations ($99/mo Pro plan)
- **Design**: Swiss high-contrast (black/white), Outfit + IBM Plex Sans

## Implemented Features

### Landing Page (/)
- Fixed navbar with SwarmOS logo, Login, Start Free Trial CTA
- Hero: headline, subtitle, dual CTAs (Start Free Trial + Book Demo)
- Social proof stats (2,400+ meetings, 98% deliverability, 3.2x replies)
- Feature bento grid (4 cards: ICP, AI emails, Automation, Meetings)
- Pricing section (Free $0 + Pro $99/mo)
- Footer

### Onboarding (/app) — 5-step wizard
- Progress bar + step labels with icons
- Step 1: Email → Step 2: Target → Step 3: Offer → Step 4: Volume
- Step 5: AI Preview — live GPT-4o generated cold email based on target/offer
- Regenerate button for new AI email
- Launch → POST /api/login + POST /api/onboarding → redirect to dashboard

### Dashboard (/dashboard)
- Sidebar: 5 nav items (Dashboard, Outreach, Meetings, Analytics, Settings)
- Active nav highlighting, Upgrade to Pro card ($99/mo → Stripe), Logout
- Dashboard view: 4 KPI cards + Activity feed
- Outreach view: outreach history list
- Meetings view: booked meetings list
- Analytics view: Reply Rate, Conversion, Contacted KPIs
- Settings view: account info (email, orgId, plan)

### Backend API
- POST /api/login, GET /api/stats, GET /api/dashboard
- CRUD: /api/leads, /api/outreach, /api/meetings
- POST /api/onboarding, GET /api/onboarding/{email}
- POST /api/generate-email (AI), POST /api/classify-reply (AI)
- POST /api/subscribe (Stripe $99/mo)
- Automation start/stop/status, Optimizer, Insights, Health

### Testing
- 22/22 backend tests passing
- All frontend flows verified (Landing, Onboarding, Dashboard)

## MOCKED
- Resend email sending (requires user API key + verified domain)
- Gmail inbox reading (simulated)

## Backlog
### P1
- Resend integration for real email sending
- Gmail API for inbox reading
- Calendly API for meeting booking

### P2
- JWT auth with passwords
- Campaign management
- Recharts analytics in dashboard
- Plan upgrade webhook (after Stripe payment → update user.plan)

### P3
- Multi-tenant data isolation (orgId)
- Email scheduling & rate limiting
- WebSocket real-time activity feed
