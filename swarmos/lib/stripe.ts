import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Helper to create a checkout session
export async function createCheckoutSession({
  priceId,
  successUrl,
  cancelUrl,
  customerEmail,
}: {
  priceId: string
  successUrl: string
  cancelUrl: string
  customerEmail?: string
}) {
  return await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
  })
}

// Helper to create a subscription
export async function createSubscription({
  customerId,
  priceId,
}: {
  customerId: string
  priceId: string
}) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  })
}
