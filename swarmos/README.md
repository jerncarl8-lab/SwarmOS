# SwarmOS

Enterprise AI SDR + Voice + Ads + Swarm + Dashboard system built with Next.js 14.

## 🚀 Stack

- **Next.js 14.0.0** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database & Authentication
- **OpenAI** - AI & Language Models
- **Stripe** - Payment processing
- **Resend** - Email service
- **Twilio** - SMS & Voice

## 📦 Installation

Dependencies are already installed. To reinstall:

```bash
cd /app/swarmos
yarn install
```

## ⚙️ Environment Setup

1. Copy the environment template and add your API keys:

```bash
# Edit .env.local with your credentials
```

### Required API Keys:

| Service | Environment Variable | Get From |
|---------|---------------------|----------|
| Supabase | `NEXT_PUBLIC_SUPABASE_URL` | https://supabase.com/dashboard |
| Supabase | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | https://supabase.com/dashboard |
| OpenAI | `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| Stripe | `STRIPE_SECRET_KEY` | https://dashboard.stripe.com/apikeys |
| Stripe | `STRIPE_PRICE_ID` | https://dashboard.stripe.com/products |
| Resend | `RESEND_API_KEY` | https://resend.com/api-keys |
| Twilio | `TWILIO_SID` | https://console.twilio.com |
| Twilio | `TWILIO_AUTH` | https://console.twilio.com |
| Twilio | `TWILIO_NUMBER` | https://console.twilio.com |
| App | `APP_URL` | Your app URL (e.g., http://localhost:3000) |

## 🏃 Running the App

```bash
# Development
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

The app runs on **http://localhost:3000**

## 📁 Project Structure

```
swarmos/
├── app/
│   ├── api/
│   │   ├── health/          # Health check endpoint
│   │   ├── chat/            # OpenAI chat endpoint
│   │   ├── email/           # Email sending endpoint
│   │   ├── sms/             # SMS sending endpoint
│   │   └── payment/         # Stripe checkout endpoint
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── openai.ts            # OpenAI client
│   ├── stripe.ts            # Stripe client
│   ├── resend.ts            # Resend client
│   └── twilio.ts            # Twilio client
├── public/                  # Static assets
├── .env.local              # Environment variables
└── package.json
```

## 🔌 API Endpoints

### Health Check
```bash
GET /api/health
```
Returns system health and integration status.

### Chat (OpenAI)
```bash
POST /api/chat
Content-Type: application/json

{
  \"message\": \"Hello, AI!\",
  \"model\": \"gpt-4\"
}
```

### Send Email (Resend)
```bash
POST /api/email
Content-Type: application/json

{
  \"to\": \"user@example.com\",
  \"subject\": \"Welcome!\",
  \"html\": \"<h1>Welcome to SwarmOS</h1>\"
}
```

### Send SMS (Twilio)
```bash
POST /api/sms
Content-Type: application/json

{
  \"to\": \"+1234567890\",
  \"body\": \"Hello from SwarmOS!\"
}
```

### Create Payment (Stripe)
```bash
POST /api/payment
Content-Type: application/json

{
  \"priceId\": \"price_xxx\",
  \"successUrl\": \"https://yourapp.com/success\",
  \"cancelUrl\": \"https://yourapp.com/cancel\"
}
```

## 💻 Usage Examples

### Using Supabase

```typescript
import { supabase } from '@/lib/supabase'

// Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert({ name: 'John Doe' })
```

### Using OpenAI

```typescript
import { getChatCompletion } from '@/lib/openai'

const response = await getChatCompletion([
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Tell me a joke!' }
])
```

### Using Stripe

```typescript
import { createCheckoutSession } from '@/lib/stripe'

const session = await createCheckoutSession({
  priceId: 'price_1234',
  successUrl: 'https://yourapp.com/success',
  cancelUrl: 'https://yourapp.com/cancel',
  customerEmail: 'user@example.com'
})

// Redirect user to session.url
```

### Using Resend

```typescript
import { sendEmail } from '@/lib/resend'

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome to SwarmOS</h1><p>Get started now!</p>',
  from: 'noreply@yourdomain.com'
})
```

### Using Twilio

```typescript
import { sendSMS, makeCall } from '@/lib/twilio'

// Send SMS
await sendSMS('+1234567890', 'Your code is: 123456')

// Make a call
await makeCall('+1234567890', 'https://demo.twilio.com/docs/voice.xml')
```

## 🧪 Testing

Test the health endpoint:

```bash
curl http://localhost:3000/api/health
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Twilio Documentation](https://www.twilio.com/docs)

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- The `SUPABASE_SERVICE_ROLE_KEY` should only be used in API routes (server-side)
- Always validate and sanitize user input
- Use Stripe webhooks to verify payment events

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Don't forget to add all environment variables in your Vercel project settings.

### Other Platforms

This app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 📝 License

MIT

---

Built with ❤️ for SwarmOS
