// Email module - Helder Woningpaspoort
// Uses Resend for transactional emails

export { sendEmail, type SendEmailOptions, type EmailTemplateType } from './send'

// Email Templates
export { welcomeEmail } from './templates/welcome'
export { passwordResetEmail } from './templates/password-reset'
export { documentUploadedEmail } from './templates/document-uploaded'
export { phaseCompletedEmail } from './templates/phase-completed'
export { issueAlertEmail } from './templates/issue-alert'
export { shareLinkEmail } from './templates/share-link'
export { weeklySummaryEmail } from './templates/weekly-summary'
export { builderDailyDigestEmail } from './templates/builder-daily-digest'

/**
 * Email Flow Documentation
 * ========================
 * 
 * 1. WELCOME EMAIL
 *    Trigger: After successful registration
 *    Recipient: New user
 *    Template: welcomeEmail
 * 
 * 2. PASSWORD RESET
 *    Trigger: User requests password reset
 *    Recipient: User requesting reset
 *    Template: passwordResetEmail
 * 
 * 3. DOCUMENT UPLOADED
 *    Trigger: New document uploaded to property/project
 *    Recipient: Property owner
 *    Template: documentUploadedEmail
 * 
 * 4. PHASE COMPLETED
 *    Trigger: Construction phase marked as complete
 *    Recipient: Property owner
 *    Template: phaseCompletedEmail
 * 
 * 5. ISSUE ALERT
 *    Trigger: AI detects issue in photo or builder reports issue
 *    Recipient: Builder/Project manager
 *    Template: issueAlertEmail
 * 
 * 6. SHARE LINK CREATED
 *    Trigger: User creates a share link
 *    Recipient: User who created the link
 *    Template: shareLinkEmail
 * 
 * 7. WEEKLY SUMMARY (Homeowner)
 *    Trigger: Scheduled weekly (Sunday evening)
 *    Recipient: Property owners with active projects
 *    Template: weeklySummaryEmail
 * 
 * 8. BUILDER DAILY DIGEST
 *    Trigger: Scheduled daily (weekdays at 7:00 AM)
 *    Recipient: Builders with active projects
 *    Template: builderDailyDigestEmail
 */
