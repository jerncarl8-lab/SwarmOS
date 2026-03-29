import { Resend } from "resend";
import { generateEmail } from "./openai.js";
import { db } from "./storage.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOutreach(lead) {
  try {
    // Generate AI email
    const emailContent = await generateEmail(lead);

    // Send via Resend
    const result = await resend.emails.send({
      from: "AI SDR <ai@yourapp.com>",
      to: lead.email,
      subject: "Quick question",
      html: `<p>${emailContent}</p>`,
    });

    // Log outreach
    const outreach = {
      id: Date.now().toString(),
      leadId: lead.id,
      email: lead.email,
      company: lead.company,
      content: emailContent,
      sent: true,
      replied: false,
      sentAt: new Date().toISOString(),
    };

    db.data.outreach.push(outreach);

    // Update lead
    const leadToUpdate = db.data.leads.find((l) => l.id === lead.id);
    if (leadToUpdate) {
      leadToUpdate.contacted = true;
      leadToUpdate.contactedAt = new Date().toISOString();
    }

    await db.write();

    console.log(`✅ Sent to ${lead.company}`);
    return outreach;
  } catch (error) {
    console.error(`❌ Failed to send to ${lead.company}:`, error.message);
    throw error;
  }
}

export async function getOutreachStats() {
  const total = db.data.outreach.length;
  const replied = db.data.outreach.filter((o) => o.replied).length;
  const replyRate = total > 0 ? (replied / total) * 100 : 0;

  return {
    total,
    replied,
    replyRate: replyRate.toFixed(2),
  };
}
