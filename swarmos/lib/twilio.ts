import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!

export const twilioClient = twilio(accountSid, authToken)

// Helper to send SMS
export async function sendSMS(to: string, body: string) {
  return await twilioClient.messages.create({
    body,
    from: twilioPhoneNumber,
    to,
  })
}

// Helper to make a voice call
export async function makeCall(to: string, twimlUrl: string) {
  return await twilioClient.calls.create({
    url: twimlUrl,
    from: twilioPhoneNumber,
    to,
  })
}

// Helper to send WhatsApp message
export async function sendWhatsApp(to: string, body: string) {
  return await twilioClient.messages.create({
    body,
    from: `whatsapp:${twilioPhoneNumber}`,
    to: `whatsapp:${to}`,
  })
}
