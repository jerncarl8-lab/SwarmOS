import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const { to, subject, html, from = 'onboarding@resend.dev' } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'to, subject, and html are required' },
        { status: 400 }
      )
    }

    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    return NextResponse.json({
      success: true,
      messageId: result.data?.id,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
