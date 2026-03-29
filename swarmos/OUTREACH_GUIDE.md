# AI Outreach Example

## Overview

The `sendOutreach()` function combines OpenAI and Resend to automatically generate and send personalized cold emails.

## How It Works

1. **AI Generation**: Uses GPT-4o-mini to write a personalized email based on company name
2. **Email Sending**: Sends the AI-generated content via Resend
3. **Logging**: Tracks which emails were sent

## Usage

### API Endpoint

```bash
POST /api/outreach
```

**Request:**
```json
{
  "email": "john@acmecorp.com",
  "company": "Acme Corp"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Outreach sent to john@acmecorp.com"
}
```

### Example cURL

```bash
curl -X POST http://localhost:3001/api/outreach \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@acmecorp.com",
    "company": "Acme Corp"
  }'
```

### Using in Code

```typescript
import { sendOutreach } from '@/lib/outreach'

const lead = {
  email: 'john@acmecorp.com',
  company: 'Acme Corp'
}

await sendOutreach(lead)
```

## Batch Processing

Send to multiple leads:

```typescript
const leads = [
  { email: 'john@acme.com', company: 'Acme Corp' },
  { email: 'jane@techco.com', company: 'TechCo' },
  { email: 'bob@startup.io', company: 'Startup Inc' }
]

for (const lead of leads) {
  await sendOutreach(lead)
  // Add delay to avoid rate limits
  await new Promise(resolve => setTimeout(resolve, 2000))
}
```

## Required Environment Variables

```bash
OPENAI_API_KEY=sk-...        # For AI email generation
RESEND_API_KEY=re_...        # For sending emails
```

## Customization

### Change Email Prompt

Edit `/app/swarmos/lib/outreach.ts`:

```typescript
content: `Write a personalized email to ${lead.company} about our new product`
```

### Change AI Model

```typescript
model: "gpt-4o",  // Use GPT-4 for better quality
```

### Customize Email Sender

```typescript
from: "Sales Team <sales@yourcompany.com>",
```

### Add More Lead Data

```typescript
export async function sendOutreach(lead: {
  email: string;
  company: string;
  firstName?: string;
  industry?: string;
}) {
  const ai = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Write a personalized email to ${lead.firstName} at ${lead.company} (${lead.industry} industry)`
      }
    ]
  });
  // ... rest of code
}
```

## Advanced: Add Lead Tracking

```typescript
import { supabase } from "./supabase";

export async function sendOutreach(lead: any) {
  // Generate email
  const ai = await openai.chat.completions.create({...});
  const message = ai.choices[0].message.content;

  // Send email
  const result = await resend.emails.send({...});

  // Track in database
  await supabase.from('outreach_sent').insert({
    lead_email: lead.email,
    company: lead.company,
    message_sent: message,
    sent_at: new Date().toISOString(),
    resend_id: result.data?.id
  });

  console.log("Sent and tracked:", lead.email);
}
```

## Best Practices

1. **Rate Limiting**: Add delays between sends to avoid hitting API limits
2. **Error Handling**: Wrap in try-catch to handle failures gracefully
3. **Logging**: Track successful sends and failures
4. **Personalization**: Include more lead data for better AI generation
5. **Testing**: Test with your own email first
6. **Compliance**: Ensure you have permission to email recipients

## Cost Estimation

- **OpenAI**: ~$0.0001 per email (GPT-4o-mini)
- **Resend**: Free for first 100/day, then ~$0.001 per email
- **Total**: ~$0.0011 per outreach email

For 1000 emails/day: ~$1.10/day

---

**Ready to start sending AI-powered outreach!** 🚀
