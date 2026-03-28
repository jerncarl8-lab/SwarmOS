import { NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail } = await request.json()

    if (!priceId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'priceId, successUrl, and cancelUrl are required' },
        { status: 400 }
      )
    }

    const session = await createCheckoutSession({
      priceId,
      successUrl,
      cancelUrl,
      customerEmail,
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
