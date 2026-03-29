import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Helper function for chat completions
export async function getChatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  model: string = 'gpt-4'
) {
  const completion = await openai.chat.completions.create({
    model,
    messages,
  })
  return completion.choices[0]?.message?.content || ''
}

// Helper for streaming responses
export async function streamChatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  model: string = 'gpt-4'
) {
  return await openai.chat.completions.create({
    model,
    messages,
    stream: true,
  })
}
