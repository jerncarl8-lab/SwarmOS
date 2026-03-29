import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'SwarmOS API is running',
    integrations: {
      supabase: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'not configured',
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
      stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured',
      resend: process.env.RESEND_API_KEY ? 'configured' : 'not configured',
      twilio: process.env.TWILIO_SID ? 'configured' : 'not configured',
    },
    environment: {
      appUrl: process.env.APP_URL || 'not set',
      stripePriceId: process.env.STRIPE_PRICE_ID ? 'configured' : 'not configured',
    },
    timestamp: new Date().toISOString(),
  })
}
