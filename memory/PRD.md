# SwarmOS — AI SDR Automation Platform

## What You Built
A complete AI SaaS product that automates sales outreach. AI finds leads, writes personalized emails (GPT-4o), tracks outreach, classifies sentiments, processes payments (Stripe), and includes a full sales playbook.

## Architecture
- **Backend**: FastAPI (Python) + MongoDB — 27+ API endpoints
- **Frontend**: React CRA + Tailwind CSS — 5 pages, 15+ components
- **AI**: OpenAI GPT-4o via Emergent LLM key
- **Payments**: Stripe (Starter $99, Growth $297, Lifetime $497)
- **Email**: Resend (integrated, needs API key to go live)
- **Affiliate**: ClickBank ref tracking

## All Pages
- `/` — Sales landing page (psychological triggers)
- `/app` — 5-step onboarding wizard with AI preview
- `/dashboard` — Full dashboard (6 nav views)
- `/success` — Post-payment confirmation

## Dashboard Views
- **Dashboard**: KPIs + Add Lead form + Activity
- **Outreach**: Send AI Email buttons + history with content
- **Meetings**: Booked meetings list
- **Playbook**: Daily schedule, KPI targets, Call script, Objection handling, Scale plan
- **Analytics**: Reply Rate, Conversion, Contacted
- **Settings**: Account info (email, orgId, plan)

## Documents
- `DEPLOYMENT_GUIDE.md` — Step-by-step deploy guide
- `AUTOMATION_ROADMAP.md` — Global AI automation vision
- `SALES_SCRIPT.md` — Call script word-for-word
- `SALES_MACHINE.md` — Full sales machine playbook

## Status
- Resend: Integrated, sends real emails when API key is configured
- Gmail inbox: Simulated (needs Gmail API for real reading)
- 27+ tests passing across 5 iterations
