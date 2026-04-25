# SwarmOS — AI SDR Automation Platform

## Problem Statement
Full AI SaaS for SDR automation that sells TIME and MONEY. AI finds leads, writes emails, books meetings — replaces entire outbound teams.

## Architecture
- **Backend**: FastAPI (Python) + MongoDB
- **Frontend**: React CRA + Tailwind CSS
- **AI**: OpenAI GPT-4o via Emergent LLM key
- **Payments**: Stripe (3 tiers: $99, $297, $497)
- **Affiliates**: ClickBank ref tracking

## Implemented Features

### Sales Landing Page (Psychological Selling)
- Countdown timer (urgency)
- "Limited beta spots" scarcity
- Live notification toasts ("Marcus just booked 3 meetings")
- Exit-intent modal ("Don't leave money on the table")
- Before/After comparison (manual vs SwarmOS)
- ROI section (160 hrs saved, $50K+ pipeline, 50x ROI)
- Video section (placeholder for VSL)
- 3 testimonials with specific results
- 3-tier pricing with anchoring ($2,388 → $497)
- 30-day money-back guarantee
- FAQ accordion (6 items)
- Final CTA with urgency
- Affiliate tracking (?ref=xxx)

### Onboarding (5-step wizard)
- Email → Target → Offer → Volume → AI Preview (GPT-4o)

### Dashboard
- Sidebar, KPIs, Outreach/Meetings/Analytics/Settings views
- Upgrade button, Logout

### Backend (27 tests passing)
- All CRUD, Auth, Stripe, OpenAI, Onboarding

## Documents Created
- `/app/DEPLOYMENT_GUIDE.md` — Complete step-by-step deploy guide
- `/app/AUTOMATION_ROADMAP.md` — Global AI automation vision (57 countries)

## MOCKED
- Resend email sending
- Gmail inbox reading

## Immediate Next Steps
1. Deploy (follow DEPLOYMENT_GUIDE.md)
2. Get Resend API key → real emails
3. Record demo video → embed in landing page
4. Send first 100 cold messages
5. Set up ClickBank affiliate program
