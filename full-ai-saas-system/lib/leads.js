import { db } from "./storage.js";

export async function getNewLeads(limit = 10) {
  const leads = await db.data.leads
    .filter((lead) => !lead.contacted)
    .slice(0, limit);
  return leads;
}

export async function addLead(leadData) {
  const newLead = {
    id: Date.now().toString(),
    ...leadData,
    status: "new",
    contacted: false,
    createdAt: new Date().toISOString(),
  };

  db.data.leads.push(newLead);
  await db.write();
  return newLead;
}

export async function updateLeadStatus(leadId, status, metadata = {}) {
  const lead = db.data.leads.find((l) => l.id === leadId);
  if (lead) {
    lead.status = status;
    Object.assign(lead, metadata);
    await db.write();
  }
  return lead;
}

export async function getLeadStats() {
  const total = db.data.leads.length;
  const contacted = db.data.leads.filter((l) => l.contacted).length;
  const replied = db.data.outreach.filter((o) => o.replied).length;
  const meetings = db.data.meetings.length;

  return {
    total,
    contacted,
    replied,
    meetings,
    conversionRate: contacted > 0 ? (meetings / contacted) * 100 : 0,
  };
}
