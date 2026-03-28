# SwarmOS - Next.js Application

A powerful Next.js application with integrated services for AI, payments, email, and communications.

## 🚀 Tech Stack

- **Next.js 16.2** (App Router, TypeScript)
- **React 19**
- **Tailwind CSS 4**
- **Supabase** - Database & Authentication
- **OpenAI** - AI & Language Models
- **Stripe** - Payment Processing
- **Resend** - Email Service
- **Twilio** - SMS & Voice

## 📦 Installation

Already completed! Dependencies installed:
```bash
✅ @supabase/supabase-js
✅ openai
✅ stripe
✅ resend
✅ twilio
```

## ⚙️ Environment Setup

1. Copy `.env.local` and fill in your API keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Resend
RESEND_API_KEY=your-resend-api-key

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### Where to Get API Keys:

- **Supabase**: https://supabase.com/dashboard
- **OpenAI**: https://platform.openai.com/api-keys
- **Stripe**: https://dashboard.stripe.com/apikeys
- **Resend**: https://resend.com/api-keys
- **Twilio**: https://console.twilio.com

## 🏃 Running the Application

```bash
# Development mode
cd /app/swarmos
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

The app will run on **http://localhost:3000**

## 📁 Project Structure

```
/app/swarmos/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── example/
│   │   │       └── route.ts          # Example API route
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   └── lib/
│       ├── supabase.ts               # Supabase client
│       ├── openai.ts                 # OpenAI client
│       ├── stripe.ts                 # Stripe client
│       ├── resend.ts                 # Resend client
│       └── twilio.ts                 # Twilio client
├── public/                           # Static assets
├── .env.local                        # Environment variables
└── package.json
```

## 🔧 Integration Usage Examples

### Supabase
```typescript
import { supabase } from '@/lib/supabase';

// Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*');
```

### OpenAI
```typescript
import { getChatCompletion } from '@/lib/openai';

const response = await getChatCompletion([
  { role: 'user', content: 'Hello!' }
]);
```

### Stripe
```typescript
import { createCheckoutSession } from '@/lib/stripe';

const session = await createCheckoutSession({
  priceId: 'price_xxx',
  successUrl: 'https://yourapp.com/success',
  cancelUrl: 'https://yourapp.com/cancel',
});
```

### Resend
```typescript
import { sendEmail } from '@/lib/resend';

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<p>Welcome to SwarmOS</p>',
});
```

### Twilio
```typescript
import { sendSMS, makeCall } from '@/lib/twilio';

// Send SMS
await sendSMS('+1234567890', 'Hello from SwarmOS!');

// Make call
await makeCall('+1234567890', 'https://demo.twilio.com/docs/voice.xml');
```

## 🎯 Next Steps

1. **Configure Environment Variables**: Add your API keys to `.env.local`
2. **Set up Supabase**: Create tables and configure authentication
3. **Test API Route**: Visit http://localhost:3000/api/example
4. **Build Your Features**: Start developing with all integrations ready!

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Twilio Documentation](https://www.twilio.com/docs)

---

Built with ❤️ using Next.js
