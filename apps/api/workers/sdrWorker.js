import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ host: process.env.REDIS_HOST || "localhost" });

export const worker = new Worker("sdr", async job => {
  const lead = job.data;

  console.log("Processing lead:", lead.email);

  return { ok: true };
}, { connection });