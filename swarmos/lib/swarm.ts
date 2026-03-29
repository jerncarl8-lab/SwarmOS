import { sendOutreach } from "./outreach";

// Enhanced swarm with dynamic lead loading
export async function startLoop() {
  console.log("🚀 Swarm started");

  // Run immediately on start
  await runOutreachCycle();

  // Then run every 10 minutes
  setInterval(async () => {
    await runOutreachCycle();
  }, 1000 * 60 * 10);
}

async function runOutreachCycle() {
  console.log("⏰ Starting outreach cycle at", new Date().toISOString());

  const leads = await getLeads();
  
  console.log(`📋 Processing ${leads.length} leads`);

  for (const lead of leads) {
    try {
      await sendOutreach(lead);
      console.log(`✅ Sent to ${lead.company}`);
      
      // Add delay between emails to avoid rate limits
      await delay(2000);
    } catch (error: any) {
      console.error(`❌ Failed to send to ${lead.company}:`, error.message);
    }
  }

  console.log("✨ Outreach cycle completed");
}

// Get leads - can be replaced with database query
async function getLeads() {
  // Default leads (replace with database query)
  return [
    {
      email: "test@example.com",
      company: "StartupX"
    }
  ];

  // Example: Load from Supabase
  // import { supabase } from "./supabase";
  // const { data } = await supabase
  //   .from('leads')
  //   .select('*')
  //   .eq('contacted', false)
  //   .limit(10);
  // return data || [];
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
