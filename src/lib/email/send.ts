import { Resend } from 'resend'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Default sender
const FROM_EMAIL = process.env.EMAIL_FROM || 'Helder <noreply@helder.nl>'

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, html, text, replyTo } = options

  // In development, log instead of sending
  if (process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY) {
    console.log('📧 Email would be sent:')
    console.log(`  To: ${Array.isArray(to) ? to.join(', ') : to}`)
    console.log(`  Subject: ${subject}`)
    console.log(`  Content preview: ${html.substring(0, 200)}...`)
    return { id: 'dev-mock-id', success: true }
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      replyTo,
    })

    return { id: data.data?.id, success: true }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

/**
 * Email template types
 */
export type EmailTemplateType = 
  | 'welcome'
  | 'password-reset'
  | 'document-uploaded'
  | 'phase-completed'
  | 'issue-alert'
  | 'share-link'
  | 'weekly-summary'
  | 'builder-daily-digest'
