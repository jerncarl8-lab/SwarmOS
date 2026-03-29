import { optimizeMessage } from "./openai.js";
import { getLeadStats } from "./leads.js";
import { getOutreachStats } from "./outreach.js";
import { db } from "./storage.js";

export async function analyzePerformance() {
  const leadStats = await getLeadStats();
  const outreachStats = await getOutreachStats();

  const metrics = {
    ...leadStats,
    ...outreachStats,
  };

  console.log("📊 Performance Metrics:", metrics);

  // Get AI suggestions
  const suggestions = await optimizeMessage([], metrics);

  // Store insights
  if (!db.data.insights) {
    db.data.insights = [];
  }

  db.data.insights.push({
    id: Date.now().toString(),
    metrics,
    suggestions,
    createdAt: new Date().toISOString(),
  });

  await db.write();

  return {
    metrics,
    suggestions,
  };
}

export async function getLatestInsights() {
  if (!db.data.insights || db.data.insights.length === 0) {
    return null;
  }
  return db.data.insights[db.data.insights.length - 1];
}
