# AI Swarm System

## Overview

The SwarmOS swarm is an automated AI SDR system that runs continuously, generating and sending personalized outreach emails at regular intervals.

## How It Works

1. **Loop starts** when triggered via API
2. **Every 10 minutes**, the swarm:
   - Loads a list of leads
   - Generates personalized emails using AI
   - Sends emails via Resend
   - Logs all activity
3. **Continues indefinitely** until server restart

## Quick Start

### 1. Start the Swarm

```bash
curl -X POST http://localhost:3001/api/swarm \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Swarm started successfully",
  "status": "running"
}
```

### 2. Check Status

```bash
curl http://localhost:3001/api/swarm
```

or

```bash
curl -X POST http://localhost:3001/api/swarm \
  -H "Content-Type: application/json" \
  -d '{"action": "status"}'
```

## Configuration

### Change Interval

Edit `/app/swarmos/lib/swarm.ts`:

```typescript
// Current: Every 10 minutes
setInterval(async () => {
  await runOutreachCycle();
}, 1000 * 60 * 10);

// Every 30 minutes
setInterval(async () => {
  await runOutreachCycle();
}, 1000 * 60 * 30);

// Every hour
setInterval(async () => {
  await runOutreachCycle();
}, 1000 * 60 * 60);

// Every day at same time (use cron job instead)
```

### Add More Leads

**Option 1: Hardcode in swarm.ts**

```typescript
async function getLeads() {
  return [
    { email: "john@acme.com", company: "Acme Corp" },
    { email: "jane@techco.com", company: "TechCo" },
    { email: "bob@startup.io", company: "Startup Inc" }
  ];
}
```

**Option 2: Load from Supabase**

```typescript
import { supabase } from "./supabase";

async function getLeads() {
  const { data } = await supabase
    .from('leads')
    .select('*')
    .eq('contacted', false)
    .limit(20);
  
  return data || [];
}
```

**Option 3: Load from API**

```typescript
async function getLeads() {
  const response = await fetch('https://your-api.com/leads');
  const data = await response.json();
  return data.leads;
}
```

## Supabase Integration

### 1. Create Leads Table

```sql
create table leads (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  company text not null,
  contacted boolean default false,
  contacted_at timestamp,
  created_at timestamp default now()
);
```

### 2. Update swarm.ts

```typescript
import { supabase } from "./supabase";
import { sendOutreach } from "./outreach";

async function runOutreachCycle() {
  // Get uncontacted leads
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('contacted', false)
    .limit(10);

  if (!leads || leads.length === 0) {
    console.log("📭 No new leads to contact");
    return;
  }

  for (const lead of leads) {
    try {
      await sendOutreach(lead);
      
      // Mark as contacted
      await supabase
        .from('leads')
        .update({ 
          contacted: true,
          contacted_at: new Date().toISOString()
        })
        .eq('id', lead.id);
      
      console.log(`✅ Sent to ${lead.company}`);
      await delay(2000);
    } catch (error: any) {
      console.error(`❌ Failed:`, error.message);
    }
  }
}
```

### 3. Add Leads to Database

```typescript
await supabase.from('leads').insert([
  { email: 'john@acme.com', company: 'Acme Corp' },
  { email: 'jane@techco.com', company: 'TechCo' }
]);
```

## Monitoring

### View Logs

Server logs will show swarm activity:

```
🚀 Swarm started
⏰ Starting outreach cycle at 2024-03-29T00:00:00.000Z
📋 Processing 3 leads
Sent to: john@acme.com
✅ Sent to Acme Corp
Sent to: jane@techco.com
✅ Sent to TechCo
✨ Outreach cycle completed
```

### Track Sends in Database

Create an `outreach_log` table:

```sql
create table outreach_log (
  id uuid primary key default uuid_generate_v4(),
  lead_email text not null,
  company text not null,
  message_sent text,
  sent_at timestamp default now()
);
```

Update `sendOutreach` in `/app/swarmos/lib/outreach.ts`:

```typescript
import { supabase } from "./supabase";

export async function sendOutreach(lead: any) {
  const ai = await openai.chat.completions.create({...});
  const message = ai.choices[0].message.content;

  await resend.emails.send({...});

  // Log to database
  await supabase.from('outreach_log').insert({
    lead_email: lead.email,
    company: lead.company,
    message_sent: message
  });

  console.log("Sent to:", lead.email);
}
```

## Best Practices

### 1. Rate Limiting

Add delays between sends:

```typescript
for (const lead of leads) {
  await sendOutreach(lead);
  await delay(2000); // 2 second delay
}
```

### 2. Error Handling

Wrap in try-catch:

```typescript
try {
  await sendOutreach(lead);
} catch (error) {
  console.error(`Failed for ${lead.email}:`, error);
  // Continue with next lead
}
```

### 3. Limit Batch Size

Don't send to too many at once:

```typescript
const { data: leads } = await supabase
  .from('leads')
  .select('*')
  .eq('contacted', false)
  .limit(20); // Max 20 per cycle
```

### 4. Track Bounces

Monitor Resend webhook for bounces:

```typescript
// app/api/webhooks/resend/route.ts
export async function POST(request: Request) {
  const event = await request.json();
  
  if (event.type === 'email.bounced') {
    // Mark lead as invalid
    await supabase
      .from('leads')
      .update({ email_valid: false })
      .eq('email', event.data.email);
  }
}
```

### 5. Respect Unsubscribes

Track unsubscribe requests:

```sql
create table unsubscribed (
  email text primary key,
  unsubscribed_at timestamp default now()
);
```

```typescript
async function getLeads() {
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('contacted', false)
    .not('email', 'in', (
      supabase.from('unsubscribed').select('email')
    ));
  
  return leads || [];
}
```

## Production Deployment

### Environment Variables

Make sure these are set:

```bash
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Auto-Start on Deploy

Create `/app/swarmos/app/api/init/route.ts`:

```typescript
import { startLoop } from '@/lib/swarm'

let initialized = false

export async function GET() {
  if (!initialized) {
    startLoop()
    initialized = true
    return Response.json({ message: 'Swarm auto-started' })
  }
  return Response.json({ message: 'Already running' })
}
```

Then call it once after deployment.

### Use Cron Jobs Instead

For production, consider using cron jobs or scheduled functions:

**Vercel Cron:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/swarm/run",
    "schedule": "*/10 * * * *"
  }]
}
```

**Railway/Render:**
Use platform's scheduled jobs feature.

## Cost Estimation

**Per email:**
- OpenAI: $0.0001
- Resend: $0.001
- **Total: ~$0.0011**

**At scale:**
- 100 emails/day: ~$0.11/day ($3.30/month)
- 500 emails/day: ~$0.55/day ($16.50/month)
- 1000 emails/day: ~$1.10/day ($33/month)

## Troubleshooting

**Swarm not starting:**
- Check server logs for errors
- Verify API keys are set
- Ensure no syntax errors in swarm.ts

**Emails not sending:**
- Check Resend API key
- Verify sender email is configured in Resend
- Check for rate limiting

**High API costs:**
- Reduce batch size
- Increase interval time
- Use gpt-4o-mini instead of gpt-4

---

**Your AI swarm is ready to scale!** 🚀
