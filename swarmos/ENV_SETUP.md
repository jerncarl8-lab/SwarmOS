# SwarmOS - Environment Setup Guide

## 📋 Environment Variables

Your `.env.local` file uses these exact variable names:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
RESEND_API_KEY=
TWILIO_SID=
TWILIO_AUTH=
TWILIO_NUMBER=
APP_URL=http://localhost:3000
```

## 🔑 How to Get Each API Key

### 1. Supabase (Database & Auth)

**Get from:** https://supabase.com/dashboard

1. Create a new project or select existing one
2. Go to **Settings** → **API**
3. Copy the values:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. OpenAI (AI & Chat)

**Get from:** https://platform.openai.com/api-keys

1. Sign in to OpenAI Platform
2. Click **API keys** in sidebar
3. Click **+ Create new secret key**
4. Copy the key (starts with `sk-`)

```bash
OPENAI_API_KEY=sk-proj-xxxxx
```

💡 **Note:** Make sure you have credits in your OpenAI account

### 3. Stripe (Payments)

**Get from:** https://dashboard.stripe.com/

#### Secret Key:
1. Go to **Developers** → **API keys**
2. Copy **Secret key** (use test key for development)

```bash
STRIPE_SECRET_KEY=sk_test_xxxxx
```

#### Price ID:
1. Go to **Products** → Select or create a product
2. Click on a price
3. Copy the **Price ID** (starts with `price_`)

```bash
STRIPE_PRICE_ID=price_xxxxx
```

💡 **Alternative:** You can pass `priceId` in the API request instead of using the env var

### 4. Resend (Email)

**Get from:** https://resend.com/api-keys

1. Sign up or log in to Resend
2. Go to **API Keys**
3. Click **+ Create API Key**
4. Copy the key (starts with `re_`)

```bash
RESEND_API_KEY=re_xxxxx
```

💡 **Note:** For production, verify your domain in Resend settings

### 5. Twilio (SMS & Voice)

**Get from:** https://console.twilio.com/

1. Log in to Twilio Console
2. Find your **Account SID** and **Auth Token** on the dashboard

```bash
TWILIO_SID=ACxxxxx
TWILIO_AUTH=your_auth_token
```

#### Phone Number:
1. Go to **Phone Numbers** → **Manage** → **Active numbers**
2. Purchase a number if you don't have one
3. Copy the number (format: +1234567890)

```bash
TWILIO_NUMBER=+1234567890
```

### 6. App URL

Set this to your application URL:

```bash
# Development
APP_URL=http://localhost:3000

# Production
APP_URL=https://yourdomain.com
```

## ✅ Complete Example

Here's a filled example (with fake keys):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTcwNDM2MDAsImV4cCI6MjAxMjYxOTYwMH0.abcdefghijklmnop
OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz1234567890
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz
STRIPE_PRICE_ID=price_1AbCdEfGhIjKlMnOpQrStUv
RESEND_API_KEY=re_abcdefgh_1234567890ABCDEFGHIJKLMNOP
TWILIO_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH=1234567890abcdef1234567890abcdef
TWILIO_NUMBER=+15551234567
APP_URL=http://localhost:3000
```

## 🧪 Testing Your Setup

After adding your keys, restart the server and test:

```bash
# Restart server
pkill -f "next dev"
cd /app/swarmos && yarn dev

# Test health endpoint
curl http://localhost:3001/api/health
```

You should see all integrations show as "configured":

```json
{
  "integrations": {
    "supabase": "configured",
    "openai": "configured",
    "stripe": "configured",
    "resend": "configured",
    "twilio": "configured"
  }
}
```

## 🚀 Quick Tests

### Test OpenAI Chat
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Say hello!"}'
```

### Test Email
```bash
curl -X POST http://localhost:3001/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello from SwarmOS!</h1>"
  }'
```

### Test SMS
```bash
curl -X POST http://localhost:3001/api/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "body": "Hello from SwarmOS!"
  }'
```

### Test Payment (uses STRIPE_PRICE_ID from env)
```bash
curl -X POST http://localhost:3001/api/payment \
  -H "Content-Type: application/json" \
  -d '{
    "successUrl": "http://localhost:3000/success",
    "cancelUrl": "http://localhost:3000/cancel"
  }'
```

## 💰 Cost Information

| Service | Free Tier | Pricing |
|---------|-----------|---------|
| Supabase | ✅ 500MB database, 2GB bandwidth | Free tier available |
| OpenAI | ❌ Pay per token | ~$0.03 per 1K tokens (GPT-4) |
| Stripe | ✅ No monthly fees | 2.9% + $0.30 per transaction |
| Resend | ✅ 100 emails/day | Free tier available |
| Twilio | ❌ Pay per message | ~$0.0075 per SMS |

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use different keys** for development and production
3. **Rotate keys** regularly
4. **Use test keys** for Stripe in development
5. **Monitor usage** to avoid unexpected charges

## 🆘 Troubleshooting

**Variables not loading:**
- Restart dev server after changing `.env.local`
- Check for typos in variable names (they're case-sensitive)
- Make sure there are no spaces around `=`

**API key errors:**
- Verify the key is correct and active
- Check if you have credits/quota available
- Ensure the key has proper permissions

**Stripe errors:**
- Use test keys (`sk_test_`) in development
- Make sure the price ID exists and is active
- Check that the price is in the correct mode (test/live)

---

**Ready to build!** 🎉
