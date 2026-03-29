import { openai } from "./openai";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendOutreach(lead: any) {
  const ai = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Write a short cold email for ${lead.company}`
      }
    ]
  });

  const message = ai.choices[0].message.content;

  await resend.emails.send({
    from: "AI <ai@yourapp.com>",
    to: lead.email,
    subject: "Quick idea",
    html: `<p>${message}</p>`
  });

  console.log("Sent to:", lead.email);
}
