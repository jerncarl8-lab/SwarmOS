import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmail(lead) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Write a personalized cold email to ${lead.firstName} at ${lead.company}. Keep it short and professional.`,
      },
    ],
  });

  return completion.choices[0].message.content;
}

export async function analyzeReply(emailContent) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Analyze this email reply and categorize it as: interested, not_interested, or needs_followup. Reply with just one word.\n\nEmail: ${emailContent}`,
      },
    ],
  });

  return completion.choices[0].message.content.toLowerCase().trim();
}

export async function optimizeMessage(pastMessages, metrics) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Based on these past messages and metrics, suggest improvements for better response rates.\n\nMetrics: ${JSON.stringify(metrics)}\n\nSuggest 3 improvements.`,
      },
    ],
  });

  return completion.choices[0].message.content;
}
