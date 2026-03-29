import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY || '')

// Helper to send email
export async function sendEmail({
  to,
  subject,
  html,
  from = 'onboarding@resend.dev',
}: {
  to: string | string[]
  subject: string
  html: string
  from?: string
}) {
  return await resend.emails.send({
    from,
    to,
    subject,
    html,
  })
}

// Helper to send email with React component
export async function sendEmailWithReact({
  to,
  subject,
  react,
  from = 'onboarding@resend.dev',
}: {
  to: string | string[]
  subject: string
  react: React.ReactElement
  from?: string
}) {
  return await resend.emails.send({
    from,
    to,
    subject,
    react,
  })
}
