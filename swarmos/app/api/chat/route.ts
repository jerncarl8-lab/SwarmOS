import { NextResponse } from 'next/server'
import { getChatCompletion } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const { message, model = 'gpt-4' } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const response = await getChatCompletion(
      [{ role: 'user', content: message }],
      model
    )

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
