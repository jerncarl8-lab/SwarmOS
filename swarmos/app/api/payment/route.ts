import { NextResponse } from 'next/server'
import { stripe, STRIPE_PRICE_ID } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail } = await request.json()

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

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
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
