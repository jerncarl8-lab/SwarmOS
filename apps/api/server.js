import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { logEvent } from "../../packages/shared/memory.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());

app.get("/health", (req,res)=> res.send("ok"));

// LEAD INGEST
app.post("/lead", (req,res)=>{
  const lead = req.body;
  logEvent({ type:"lead_received", lead });

  io.emit("lead", lead);

  res.json({ status:"queued" });
});

// SWARM SIMULATION STREAM
setInterval(()=>{
  io.emit("swarm", {
    agents: 1000,
    revenue: Math.floor(Math.random()*50000),
    conversions: Math.floor(Math.random()*300)
  });
}, 1000);

server.listen(3001, ()=> console.log("API running"));