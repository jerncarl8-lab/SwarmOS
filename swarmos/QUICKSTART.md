# SwarmOS - Quick Reference

## ✅ Installation Complete

✓ Next.js 14.0.0  
✓ React 18.2.0  
✓ Supabase ^2.39.0  
✓ OpenAI ^4.0.0  
✓ Stripe ^14.0.0  
✓ Resend ^2.0.0  
✓ Twilio ^4.0.0  

## 🚀 Server Status

**Running:** http://localhost:3001  
**Health Check:** http://localhost:3001/api/health

## 📂 File Locations

```
/app/swarmos/
├── app/
│   ├── api/
│   │   ├── health/route.ts    ← Health check
│   │   ├── chat/route.ts      ← OpenAI endpoint
│   │   ├── email/route.ts     ← Resend endpoint
│   │   ├── sms/route.ts       ← Twilio endpoint
│   │   └── payment/route.ts   ← Stripe endpoint
│   ├── page.tsx               ← Home page
│   └── layout.tsx
├── lib/
│   ├── supabase.ts            ← DB client
│   ├── openai.ts              ← AI client
│   ├── stripe.ts              ← Payments
│   ├── resend.ts              ← Email
│   └── twilio.ts              ← SMS/Voice
└── .env.local                 ← Add your API keys here!
```

## 🔑 Environment Variables Needed

Edit `/app/swarmos/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## 🧪 Quick Tests

```bash
# Health check
curl http://localhost:3001/api/health

# Chat with AI (requires OPENAI_API_KEY)
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'

# Send email (requires RESEND_API_KEY)
curl -X POST http://localhost:3001/api/email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'
```

## 💡 Common Commands

```bash
cd /app/swarmos

# Start dev server
yarn dev

# Build production
yarn build

# Run linter
yarn lint

# Install new package
yarn add package-name
```

## 📖 Integration Guides

### Supabase Setup
1. Go to https://supabase.com/dashboard
2. Create a project
3. Copy URL and keys from Settings > API
4. Create tables in Table Editor

### OpenAI Setup
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add credits to your account

### Stripe Setup
1. Go to https://dashboard.stripe.com/apikeys
2. Get test keys (pk_test_... and sk_test_...)
3. Create products and prices
4. Set up webhooks if needed

### Resend Setup
1. Go to https://resend.com/api-keys
2. Create an API key
3. Verify your domain for production use

### Twilio Setup
1. Go to https://console.twilio.com
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Set up messaging service if needed

## 🎯 Next Steps

1. ✅ Add API keys to `.env.local`
2. ✅ Restart dev server: `yarn dev`
3. ✅ Test `/api/health` endpoint
4. ✅ Build your features!

## 🆘 Troubleshooting

**Port already in use:**
```bash
# Kill existing process
pkill -f "next dev"
yarn dev
```

**TypeScript errors:**
```bash
# Rebuild types
rm -rf .next
yarn dev
```

**Environment variables not loading:**
- Restart dev server after changing `.env.local`
- Check variable names match exactly
- Use `NEXT_PUBLIC_` prefix for client-side vars

## 📚 Documentation

- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- OpenAI: https://platform.openai.com/docs
- Stripe: https://stripe.com/docs
- Resend: https://resend.com/docs
- Twilio: https://twilio.com/docs

---

**Ready to build!** 🚀
