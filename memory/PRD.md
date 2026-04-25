# SwarmOS — AI SDR Automation Platform

## Problem Statement
Full AI SaaS for SDR automation. AI finds leads, writes personalized emails, handles replies, classifies sentiment, and books meetings — on autopilot. Stripe for payments, ClickBank for affiliates.

## Architecture
- **Backend**: FastAPI (Python) + MongoDB
- **Frontend**: React CRA + Tailwind CSS
- **AI**: OpenAI GPT-4o via Emergent LLM key
- **Payments**: Stripe (3 tiers: $99, $297, $497)
- **Affiliates**: ClickBank ref tracking via URL params
- **Design**: Swiss high-contrast, Outfit + IBM Plex Sans

## Implemented Features

### Landing Page — Professional Sales Page
- Sticky navbar + urgency bar (limited beta spots countdown)
- Hero: "Stop Hiring SDRs. Let AI Book Your Meetings."
- Social proof: 2,400+ meetings, $4.2M pipeline, 98% deliverability, 3.2x replies
- Video section (placeholder for VSL/demo)
- How it works (3 steps)
- Testimonials (3 cards, 5-star ratings)
- 3-tier pricing: Starter $99/mo, Growth $297/mo (Most Popular), Lifetime $497
- Price anchoring: $2,388 crossed out → $497
- Risk reversal: 30-day money-back guarantee
- FAQ accordion (6 items)
- Final CTA section (black bg)
- ClickBank affiliate ref tracking (?ref=xxx passes through all CTAs)

### Onboarding — 5-Step Wizard
- Progress bar + step labels with icons
- Email → Target → Offer → Volume → AI Preview
- AI Preview: GPT-4o generates live cold email based on target/offer
- Regenerate button
- Launch → login + save onboarding → redirect to dashboard

### Dashboard
- Sidebar: Dashboard, Outreach, Meetings, Analytics, Settings
- KPI cards, Activity feed, multiple views
- Upgrade to Pro (Stripe), Logout
- Settings: account info (email, orgId, plan)

### Backend
- All CRUD: leads, outreach, inbox, meetings, automation, optimizer
- Login (email → {email, orgId, plan})
- POST /api/subscribe (plan: starter/growth/lifetime, ref tracking)
- POST /api/generate-email (AI), POST /api/classify-reply (AI)
- Success page with Stripe status polling
- 27/27 tests passing

## MOCKED
- Resend email sending
- Gmail inbox reading

## Backlog
### P1
- Resend integration, Gmail API, Calendly API
- Upload demo video (VSL) to video section
- ClickBank vendor account setup + webhook

### P2
- JWT auth, campaign management, Recharts, multi-tenant
- Plan upgrade webhook (Stripe → update user.plan)
- Email scheduling & rate limiting
