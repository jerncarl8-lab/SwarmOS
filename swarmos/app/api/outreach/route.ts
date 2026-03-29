import { NextResponse } from 'next/server'
import { sendOutreach } from '@/lib/outreach'

export async function POST(request: Request) {
  try {
    const lead = await request.json()

    if (!lead.email || !lead.company) {
      return NextResponse.json(
        { error: 'email and company are required' },
        { status: 400 }
      )
    }

    await sendOutreach(lead)

    return NextResponse.json({
      success: true,
      message: `Outreach sent to ${lead.email}`,
    })
  } catch (error: any) {
    console.error('Outreach error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send outreach' },
      { status: 500 }
    )
  }
}
