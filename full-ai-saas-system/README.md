# Full AI SaaS System

Complete AI-powered SDR platform with automated outreach, lead management, and self-optimizing AI.

## 🎯 Features

### Backend (Node.js + Express)
- ✅ **Lead Management** - Store and track leads
- ✅ **AI Outreach** - Generate personalized emails with OpenAI
- ✅ **Email Automation** - Send emails via Resend
- ✅ **Inbox Processing** - Analyze replies with AI
- ✅ **Meeting Booking** - Schedule and track meetings
- ✅ **Self-Optimization** - AI analyzes performance and suggests improvements
- ✅ **Automation Loop** - Cron jobs for automatic outreach every 10 minutes
- ✅ **Lowdb Storage** - Simple JSON database

### Frontend (React + Vite + Tailwind)
- ✅ **Dashboard** - Real-time KPIs and analytics
- ✅ **Lead Management** - View and manage leads
- ✅ **Outreach History** - Track all sent emails
- ✅ **Analytics Charts** - Visualize performance with Recharts
- ✅ **Automation Control** - Start/stop automation with one click

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- OpenAI API key
- Resend API key

### Setup

1. **Install Backend Dependencies:**
```bash
cd /app/full-ai-saas-system
yarn install
```

2. **Install Frontend Dependencies:**
```bash
cd frontend
yarn install
```

3. **Configure Environment:**
```bash
cp .env.example .env
# Edit .env and add your API keys
```

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd /app/full-ai-saas-system
node index.js
```

Server runs on: **http://localhost:3001**

### Start Frontend (Terminal 2)
```bash
cd /app/full-ai-saas-system/frontend
yarn dev
```

Dashboard runs on: **http://localhost:5173**

## 📡 API Endpoints

### Dashboard
- `GET /api/dashboard` - Get all stats and recent activity

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Add new lead
- `PATCH /api/leads/:id` - Update lead status

### Outreach
- `GET /api/outreach` - Get outreach history
- `POST /api/outreach/send` - Send outreach to specific lead

### Inbox
- `GET /api/inbox/replies` - Get all replies
- `POST /api/inbox/process` - Process incoming reply

### Meetings
- `GET /api/meetings` - Get all meetings
- `POST /api/meetings` - Create new meeting

### Automation
- `POST /api/automation/start` - Start automation loop
- `POST /api/automation/stop` - Stop automation loop
- `GET /api/automation/status` - Check if running

### Optimization
- `POST /api/optimize` - Run AI performance analysis
- `GET /api/insights` - Get latest AI insights

## 🎨 Frontend Structure

```
frontend/
├── src/
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # React entry point
│   ├── components/
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── Header.jsx          # Top header with automation control
│   │   ├── KPIWidget.jsx       # Metric cards
│   │   └── AnalyticsChart.jsx  # Performance charts
│   └── mockData/
│       ├── users.js            # Demo users
│       ├── leads.js            # Demo leads
│       └── campaigns.js        # Demo campaigns
```

## 🔧 Backend Structure

```
lib/
├── openai.js       # AI email generation & analysis
├── leads.js        # Lead CRUD operations
├── outreach.js     # Email sending logic
├── inbox.js        # Reply processing
├── booking.js      # Meeting management
├── optimizer.js    # Performance optimization AI
├── storage.js      # Lowdb database setup
└── loop.js         # Cron job automation
```

## 🤖 Automation Loop

The automation loop runs every 10 minutes and:
1. Fetches up to 5 new leads
2. Generates personalized AI email for each
3. Sends email via Resend
4. Updates lead status
5. Logs all activity

**Daily at midnight:**
- Analyzes overall performance
- Gets AI suggestions for improvements
- Stores insights in database

## 📊 Database Schema (db.json)

```json
{
  "users": [...],
  "leads": [
    {
      "id": "1",
      "email": "john@acme.com",
      "company": "Acme Corp",
      "firstName": "John",
      "status": "new|contacted|interested|not_interested",
      "contacted": false,
      "createdAt": "ISO date"
    }
  ],
  "campaigns": [...],
  "outreach": [
    {
      "id": "1",
      "leadId": "1",
      "email": "john@acme.com",
      "company": "Acme Corp",
      "content": "AI generated email",
      "sent": true,
      "replied": false,
      "sentAt": "ISO date"
    }
  ],
  "meetings": [...],
  "insights": [...]
}
```

## 💡 Usage Examples

### Add a New Lead (API)
```bash
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "company": "Example Corp",
    "firstName": "John"
  }'
```

### Start Automation
```bash
curl -X POST http://localhost:3001/api/automation/start
```

### Get Dashboard Stats
```bash
curl http://localhost:3001/api/dashboard
```

## 🔑 Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Resend
RESEND_API_KEY=re_...

# Server
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## 📈 Performance Metrics Tracked

- Total leads
- Contacted leads
- Reply rate
- Meetings booked
- Conversion rate
- Daily activity trends

## 🎯 AI Capabilities

1. **Email Generation** - Personalized cold emails using GPT-4o-mini
2. **Reply Analysis** - Categorizes replies as interested/not_interested/needs_followup
3. **Performance Optimization** - Suggests improvements based on metrics
4. **Self-Learning** - Analyzes patterns to improve over time

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- OpenAI GPT-4o-mini
- Resend (email)
- Lowdb (database)
- node-cron (scheduling)

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios
- Recharts

## 📝 Next Steps

1. Add your API keys to `.env`
2. Start both backend and frontend
3. Visit http://localhost:5173
4. Click "Start Automation" in the dashboard
5. Watch the AI work! 🚀

## 🔒 Production Considerations

- Replace Lowdb with PostgreSQL/MongoDB
- Add authentication
- Set up proper email verification
- Implement rate limiting
- Add error monitoring (Sentry)
- Use environment-specific configs
- Set up CI/CD pipeline

---

**Built with ❤️ for AI-powered sales automation**
