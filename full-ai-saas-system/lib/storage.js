import { JSONFilePreset } from "lowdb/node";

const defaultData = {
  users: [],
  leads: [],
  campaigns: [],
  outreach: [],
  meetings: [],
};

export const db = await JSONFilePreset("db.json", defaultData);

console.log("🗄️ Database loaded");
