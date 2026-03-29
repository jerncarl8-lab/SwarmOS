import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const { message, model = 'gpt-4o-mini' } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: message }],
    })

    const response = completion.choices[0]?.message?.content || ''

    return NextResponse.json({
      success: true,
      response,
      model,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process chat' },
      { status: 500 }
    )
  }
}
