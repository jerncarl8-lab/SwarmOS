import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./lib/storage.js";
import { getNewLeads, addLead, updateLeadStatus, getLeadStats } from "./lib/leads.js";
import { sendOutreach, getOutreachStats } from "./lib/outreach.js";
import { processInboxReply, getReplies } from "./lib/inbox.js";
import { createMeeting, getMeetings } from "./lib/booking.js";
import { analyzePerformance, getLatestInsights } from "./lib/optimizer.js";
import { startAutomationLoop, stopAutomationLoop, getLoopStatus } from "./lib/loop.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    loop: getLoopStatus()
  });
});

// Dashboard stats
app.get("/api/dashboard", async (req, res) => {
  try {
    const leadStats = await getLeadStats();
    const outreachStats = await getOutreachStats();
    const insights = await getLatestInsights();

    res.json({
      success: true,
      data: {
        leads: leadStats,
        outreach: outreachStats,
        insights,
        recentActivity: db.data.outreach.slice(-10).reverse()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leads endpoints
app.get("/api/leads", async (req, res) => {
  try {
    res.json({
      success: true,
      data: db.data.leads
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/leads", async (req, res) => {
  try {
    const lead = await addLead(req.body);
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/leads/:id", async (req, res) => {
  try {
    const lead = await updateLeadStatus(req.params.id, req.body.status, req.body);
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Outreach endpoints
app.get("/api/outreach", async (req, res) => {
  try {
    res.json({
      success: true,
      data: db.data.outreach
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/outreach/send", async (req, res) => {
  try {
    const { leadId } = req.body;
    const lead = db.data.leads.find(l => l.id === leadId);
    
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    const result = await sendOutreach(lead);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inbox endpoints
app.get("/api/inbox/replies", async (req, res) => {
  try {
    const replies = await getReplies();
    res.json({ success: true, data: replies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/inbox/process", async (req, res) => {
  try {
    const { emailId, fromEmail, content } = req.body;
    const result = await processInboxReply(emailId, fromEmail, content);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Meetings endpoints
app.get("/api/meetings", async (req, res) => {
  try {
    const meetings = await getMeetings();
    res.json({ success: true, data: meetings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/meetings", async (req, res) => {
  try {
    const { leadId, ...meetingData } = req.body;
    const meeting = await createMeeting(leadId, meetingData);
    res.json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Optimizer endpoints
app.post("/api/optimize", async (req, res) => {
  try {
    const result = await analyzePerformance();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/insights", async (req, res) => {
  try {
    const insights = await getLatestInsights();
    res.json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Automation loop control
app.post("/api/automation/start", (req, res) => {
  try {
    startAutomationLoop();
    res.json({ 
      success: true, 
      message: "Automation started",
      status: getLoopStatus()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/automation/stop", (req, res) => {
  try {
    stopAutomationLoop();
    res.json({ 
      success: true, 
      message: "Automation stopped",
      status: getLoopStatus()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/automation/status", (req, res) => {
  res.json({ 
    success: true, 
    data: getLoopStatus()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});
