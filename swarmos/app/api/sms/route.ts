import { NextResponse } from 'next/server'
import { twilioClient, TWILIO_NUMBER } from '@/lib/twilio'

export async function POST(request: Request) {
  try {
    const { to, body } = await request.json()

    if (!to || !body) {
      return NextResponse.json(
        { error: 'to and body are required' },
        { status: 400 }
      )
    }

    const message = await twilioClient.messages.create({
      body,
      from: TWILIO_NUMBER,
      to,
    })

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
      status: message.status,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send SMS' },
      { status: 500 }
    )
  }
}
