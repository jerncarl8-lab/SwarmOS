# 🚀 Quick Start Guide - Super Easy!

## ONE-COMMAND START ⚡

Just run this:

```bash
cd /app/full-ai-saas-system
./quick-start.sh
```

That's it! The script will:
1. ✅ Ask for your API keys (first time only)
2. ✅ Install all dependencies automatically
3. ✅ Start backend and frontend
4. ✅ Open at http://localhost:5173

---

## What You Need

**API Keys (get them free):**
- **OpenAI:** https://platform.openai.com/api-keys
- **Resend:** https://resend.com/api-keys

Don't have keys? The script will still run in demo mode!

---

## After Starting

**Your Dashboard:** http://localhost:5173

**What to do:**
1. Open the dashboard
2. Click "Start Automation" button
3. Watch the AI work! 🤖

---

## Stop the System

Press **Ctrl+C** in the terminal where it's running.

---

## Alternative: Manual Start

If you prefer manual control:

```bash
# Terminal 1 - Backend
cd /app/full-ai-saas-system
node index.js

# Terminal 2 - Frontend  
cd /app/full-ai-saas-system/frontend
yarn dev
```

---

## Troubleshooting

**Port already in use?**
```bash
# Kill existing processes
killall node
./quick-start.sh
```

**API keys not working?**
```bash
# Edit .env file directly
nano .env
# Add your keys and save
```

**Need to reinstall?**
```bash
rm -rf node_modules frontend/node_modules
./quick-start.sh
```

---

## What Each Part Does

- **Backend (Port 3001):** AI engine, database, automation
- **Frontend (Port 5173):** Dashboard, controls, analytics

---

## 🎯 That's It!

You're ready to automate your outreach with AI! 🚀
