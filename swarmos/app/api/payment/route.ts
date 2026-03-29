import { NextResponse } from 'next/server'
import { createCheckoutSession, STRIPE_PRICE_ID } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail } = await request.json()

    // Use provided priceId or fall back to environment variable
    const finalPriceId = priceId || STRIPE_PRICE_ID

    if (!finalPriceId) {
      return NextResponse.json(
        { error: 'priceId is required (either in request or STRIPE_PRICE_ID env var)' },
        { status: 400 }
      )
    }

    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'successUrl and cancelUrl are required' },
        { status: 400 }
      )
    }

    const session = await createCheckoutSession({
      priceId: finalPriceId,
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
