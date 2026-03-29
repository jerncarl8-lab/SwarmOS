import { analyzeReply } from "./openai.js";
import { db } from "./storage.js";

export async function processInboxReply(emailId, fromEmail, content) {
  // Find the original outreach
  const outreach = db.data.outreach.find((o) => o.email === fromEmail);

  if (!outreach) {
    console.log("No matching outreach found");
    return null;
  }

  // Analyze reply with AI
  const sentiment = await analyzeReply(content);

  // Update outreach
  outreach.replied = true;
  outreach.repliedAt = new Date().toISOString();
  outreach.replyContent = content;
  outreach.sentiment = sentiment;

  // Update lead status
  const lead = db.data.leads.find((l) => l.id === outreach.leadId);
  if (lead) {
    lead.status = sentiment;
  }

  await db.write();

  console.log(`📬 Reply from ${fromEmail}: ${sentiment}`);

  return {
    outreach,
    sentiment,
  };
}

export async function getReplies() {
  return db.data.outreach.filter((o) => o.replied);
}
