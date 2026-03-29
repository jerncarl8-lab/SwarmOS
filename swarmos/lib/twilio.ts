import twilio from 'twilio';

const accountSid = process.env.TWILIO_SID || '';
const authToken = process.env.TWILIO_AUTH || '';

export const twilioClient = twilio(accountSid, authToken);
export const TWILIO_NUMBER = process.env.TWILIO_NUMBER || '';
