# SwarmOS Quick Start Guide

## ✅ Setup Complete!

Your Next.js application has been successfully created with all integrations installed.

## 🎯 Current Status

**Application Location:** `/app/swarmos/`

**Running:** Yes ✓
- **URL:** http://localhost:3001
- **API Test:** http://localhost:3001/api/example

**Installed Integrations:**
- ✅ Supabase (Database & Auth)
- ✅ OpenAI (AI & LLMs)
- ✅ Stripe (Payments)
- ✅ Resend (Email)
- ✅ Twilio (SMS & Voice)

## 🔑 Next Steps

### 1. Configure API Keys

Edit `/app/swarmos/.env.local` and add your credentials:

```bash
# Supabase - Get from: https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI - Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...

# Stripe - Get from: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend - Get from: https://resend.com/api-keys
RESEND_API_KEY=re_...

# Twilio - Get from: https://console.twilio.com
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### 2. Start Development

```bash
cd /app/swarmos
yarn dev
```

Access at: **http://localhost:3001**

### 3. Test the API

```bash
curl http://localhost:3001/api/example
```

Expected response:
```json
{
  "message": "SwarmOS API is running!",
  "integrations": {
    "supabase": "Ready",
    "openai": "Ready",
    "stripe": "Ready",
    "resend": "Ready",
    "twilio": "Ready"
  }
}
```

## 📁 Key Files

### Integration Libraries
- `/app/swarmos/src/lib/supabase.ts` - Database client
- `/app/swarmos/src/lib/openai.ts` - AI client with helper functions
- `/app/swarmos/src/lib/stripe.ts` - Payment processing
- `/app/swarmos/src/lib/resend.ts` - Email service
- `/app/swarmos/src/lib/twilio.ts` - SMS & Voice

### API Routes
- `/app/swarmos/src/app/api/example/route.ts` - Example API endpoint

### Frontend
- `/app/swarmos/src/app/page.tsx` - Home page
- `/app/swarmos/src/app/layout.tsx` - Root layout

## 🚀 Usage Examples

### Create an API Route with OpenAI

```typescript
// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/openai';

export async function POST(request: Request) {
  const { message } = await request.json();
  
  const response = await getChatCompletion([
    { role: 'user', content: message }
  ]);
  
  return NextResponse.json({ response });
}
```

### Send Email with Resend

```typescript
import { sendEmail } from '@/lib/resend';

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to SwarmOS',
  html: '<h1>Welcome!</h1><p>Thanks for joining.</p>',
});
```

### Query Supabase

```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('active', true);
```

### Process Payment with Stripe

```typescript
import { createCheckoutSession } from '@/lib/stripe';

const session = await createCheckoutSession({
  priceId: 'price_1234',
  successUrl: `${process.env.NEXT_PUBLIC_URL}/success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_URL}/cancel`,
});

// Redirect to session.url
```

### Send SMS with Twilio

```typescript
import { sendSMS } from '@/lib/twilio';

await sendSMS('+1234567890', 'Your verification code is: 123456');
```

## 📊 Project Structure

```
swarmos/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   └── example/
│   │   │       └── route.ts
│   │   ├── page.tsx          # Home page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css
│   └── lib/                  # Integration clients
│       ├── supabase.ts
│       ├── openai.ts
│       ├── stripe.ts
│       ├── resend.ts
│       └── twilio.ts
├── public/                   # Static files
├── .env.local               # Environment variables
├── package.json
└── tsconfig.json
```

## 🛠️ Common Commands

```bash
# Install new dependency
yarn add package-name

# Development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linter
yarn lint
```

## 📚 Documentation Links

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Twilio Docs](https://www.twilio.com/docs)

## 🎉 You're Ready to Build!

All integrations are set up and ready to use. Just add your API keys and start building your SwarmOS application!
