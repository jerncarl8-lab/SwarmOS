# SwarmOS — Complete Deployment & Go-Live Guide
## For Your Developer: Step-by-Step

---

## PHASE 1: PREPARE CODE (15 minutes)

### Step 1: Save to GitHub
1. In the Emergent chat, click **"Save to Github"**
2. Create a new repository: `swarmos-app`
3. Push all code

### Step 2: Set Up MongoDB Atlas (Free)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free cluster (M0 — free forever)
3. Create database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (allow all)
5. Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/swarmos`

---

## PHASE 2: DEPLOY BACKEND — Railway (10 minutes)

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select your `swarmos-app` repo
4. Set **Root Directory**: `/backend`
5. Add these **Environment Variables**:

```
MONGO_URL=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/swarmos
DB_NAME=swarmos
CORS_ORIGINS=https://yourdomain.com,https://swarmos.vercel.app
STRIPE_API_KEY=sk_live_YOUR_STRIPE_LIVE_KEY
EMERGENT_LLM_KEY=sk-emergent-dD28b2dC763E5D7671
```

6. Set **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
7. Click **Deploy**
8. Copy your backend URL: `https://swarmos-backend.up.railway.app`

---

## PHASE 3: DEPLOY FRONTEND — Vercel (10 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"** → Import your GitHub repo
3. Set **Root Directory**: `/frontend`
4. Set **Framework Preset**: `Create React App`
5. Add **Environment Variable**:

```
REACT_APP_BACKEND_URL=https://swarmos-backend.up.railway.app
```

6. Click **Deploy**
7. Your app is live at: `https://swarmos.vercel.app`

---

## PHASE 4: CONNECT CUSTOM DOMAIN (10 minutes)

### Buy Domain
1. Go to [namecheap.com](https://namecheap.com)
2. Buy: `getswarmos.com` (or similar)

### Connect to Vercel
1. In Vercel dashboard → your project → **Settings** → **Domains**
2. Add: `getswarmos.com`
3. Vercel gives you DNS records
4. In Namecheap → **DNS Settings** → add the records Vercel provides
5. Wait 5-30 minutes for propagation

### Update Backend CORS
1. In Railway → Environment Variables
2. Update `CORS_ORIGINS` to include your domain:
```
CORS_ORIGINS=https://getswarmos.com,https://www.getswarmos.com
```

---

## PHASE 5: STRIPE LIVE PAYMENTS (10 minutes)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Complete account verification (business info, bank account)
3. Go to **Developers** → **API Keys**
4. Copy your **Secret Key** (starts with `sk_live_`)
5. In Railway → Update `STRIPE_API_KEY` with your live key
6. Set up webhook:
   - Stripe Dashboard → **Webhooks** → **Add Endpoint**
   - URL: `https://swarmos-backend.up.railway.app/api/webhook/stripe`
   - Events: `checkout.session.completed`

---

## PHASE 6: GO LIVE CHECKLIST

- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] Custom domain connected
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Stripe live key configured
- [ ] Stripe webhook configured
- [ ] MongoDB Atlas connected
- [ ] Test: complete onboarding flow end-to-end
- [ ] Test: Stripe checkout with test card 4242 4242 4242 4242
- [ ] CORS allows your domain

---

## PHASE 7: START MAKING MONEY

### Day 1: Launch
- Share link on LinkedIn, Twitter, email signature
- Send to 10 people you know in sales

### Day 2-7: Cold Outreach
- Send 100-200 cold messages/day via LinkedIn + email:
```
Hey — quick one:

We built an AI that books sales meetings automatically.
Replaces SDRs at 1/50th the cost.

Want me to show you? Takes 2 min.

[Your Link]
```

### Week 2+: Scale
- Set up ClickBank affiliate program (40% commission)
- Affiliates promote your product for you
- Reinvest revenue into paid ads (Google, LinkedIn)

### Revenue Targets
- Week 1: 1-3 clients → $99-$891
- Week 2: 5-10 clients → $495-$2,970
- Month 1: 20-50 clients → $1,980-$14,850
- Month 3: 100+ clients → $9,900+/month recurring

---

## QUICK REFERENCE

| Service | URL | Cost |
|---------|-----|------|
| Railway (backend) | railway.app | $5/mo |
| Vercel (frontend) | vercel.com | Free |
| MongoDB Atlas | mongodb.com/atlas | Free (M0) |
| Namecheap (domain) | namecheap.com | $10/year |
| Stripe | stripe.com | 2.9% + $0.30/txn |
| **Total monthly cost** | | **~$5/mo** |

---

## SUPPORT

If anything breaks during deployment:
1. Check Railway logs (backend)
2. Check Vercel deployment logs (frontend)
3. Verify environment variables are set correctly
4. Test API: `curl https://your-backend-url/api/health`
