import { db } from "./storage.js";

export async function createMeeting(leadId, meetingData) {
  const meeting = {
    id: Date.now().toString(),
    leadId,
    ...meetingData,
    status: "scheduled",
    createdAt: new Date().toISOString(),
  };

  db.data.meetings.push(meeting);
  await db.write();

  console.log(`📅 Meeting scheduled for lead ${leadId}`);
  return meeting;
}

export async function getMeetings() {
  return db.data.meetings;
}

export async function updateMeetingStatus(meetingId, status) {
  const meeting = db.data.meetings.find((m) => m.id === meetingId);
  if (meeting) {
    meeting.status = status;
    await db.write();
  }
  return meeting;
}
