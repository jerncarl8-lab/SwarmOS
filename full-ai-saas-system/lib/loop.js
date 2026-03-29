import cron from "node-cron";
import { getNewLeads } from "./leads.js";
import { sendOutreach } from "./outreach.js";
import { analyzePerformance } from "./optimizer.js";

let isRunning = false;

export function startAutomationLoop() {
  if (isRunning) {
    console.log("⚠️  Loop already running");
    return;
  }

  isRunning = true;
  console.log("🚀 Automation loop started");

  // Run every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    console.log("\n⏰ Starting automation cycle...");

    try {
      // Get new leads
      const leads = await getNewLeads(5);
      console.log(`📋 Found ${leads.length} new leads`);

      // Send outreach to each
      for (const lead of leads) {
        try {
          await sendOutreach(lead);
          // Delay to avoid rate limits
          await delay(2000);
        } catch (error) {
          console.error(`Error with ${lead.email}:`, error.message);
        }
      }

      console.log("✨ Cycle completed");
    } catch (error) {
      console.error("❌ Cycle error:", error);
    }
  });

  // Analyze performance daily
  cron.schedule("0 0 * * *", async () => {
    console.log("\n📊 Running daily performance analysis...");
    try {
      await analyzePerformance();
    } catch (error) {
      console.error("❌ Analysis error:", error);
    }
  });
}

export function stopAutomationLoop() {
  isRunning = false;
  console.log("⏹️  Loop stopped");
}

export function getLoopStatus() {
  return {
    running: isRunning,
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
