/**
 * Mention Notification Service
 *
 * Sends WhatsApp notifications when team members are mentioned in issues
 */

import { db } from '@/lib/db'
import { sendWhatsAppMessage } from './whatsapp/twilio'

export interface MentionNotificationResult {
  mentionId: string
  teamMemberId: string
  success: boolean
  error?: string
}

/**
 * Send WhatsApp notification for a mention
 */
export async function notifyMention(
  mentionId: string,
  issueTitle: string,
  projectName: string,
  issueUrl: string
): Promise<MentionNotificationResult> {
  // Get mention with team member details
  const mention = await db.mention.findUnique({
    where: { id: mentionId },
    include: {
      teamMember: true,
      issue: {
        include: {
          project: true,
        },
      },
    },
  })

  if (!mention) {
    return {
      mentionId,
      teamMemberId: '',
      success: false,
      error: 'Mention not found',
    }
  }

  // Check if already notified
  if (mention.notified) {
    return {
      mentionId,
      teamMemberId: mention.teamMemberId,
      success: true, // Already notified is considered success
    }
  }

  // Check if team member has a phone number
  if (!mention.teamMember.phone) {
    // Mark as notified anyway (can't notify without phone)
    await db.mention.update({
      where: { id: mentionId },
      data: {
        notified: true,
        notifiedAt: new Date(),
      },
    })

    return {
      mentionId,
      teamMemberId: mention.teamMemberId,
      success: false,
      error: 'Team member has no phone number',
    }
  }

  // Compose message in Dutch
  const message = `Je bent genoemd in een issue: "${issueTitle}"

Project: ${projectName}
Bekijk: ${issueUrl}

Helder Woningpaspoort`

  // Send WhatsApp message
  const result = await sendWhatsAppMessage(mention.teamMember.phone, message)

  // Update mention status
  if (result.success) {
    await db.mention.update({
      where: { id: mentionId },
      data: {
        notified: true,
        notifiedAt: new Date(),
      },
    })
  }

  return {
    mentionId,
    teamMemberId: mention.teamMemberId,
    success: result.success,
    error: result.error,
  }
}

/**
 * Send notifications for all pending mentions on an issue
 */
export async function notifyAllMentions(
  issueId: string,
  baseUrl: string
): Promise<MentionNotificationResult[]> {
  // Get the issue with project details
  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: {
      project: true,
      mentions: {
        where: { notified: false },
        include: { teamMember: true },
      },
    },
  })

  if (!issue) {
    return []
  }

  const issueUrl = `${baseUrl}/dashboard/issues?issue=${issue.id}`
  const results: MentionNotificationResult[] = []

  for (const mention of issue.mentions) {
    const result = await notifyMention(
      mention.id,
      issue.title,
      issue.project.name,
      issueUrl
    )
    results.push(result)
  }

  return results
}

/**
 * Process mentions from issue creation/update
 * Creates mention records and sends notifications
 */
export async function processMentions(
  issueId: string,
  teamMemberIds: string[],
  baseUrl: string
): Promise<{
  created: number
  notified: number
  errors: string[]
}> {
  if (teamMemberIds.length === 0) {
    return { created: 0, notified: 0, errors: [] }
  }

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  })

  if (!issue) {
    return { created: 0, notified: 0, errors: ['Issue not found'] }
  }

  const issueUrl = `${baseUrl}/dashboard/issues?issue=${issue.id}`
  const errors: string[] = []
  let created = 0
  let notified = 0

  for (const teamMemberId of teamMemberIds) {
    // Create or get existing mention
    const mention = await db.mention.upsert({
      where: {
        issueId_teamMemberId: {
          issueId,
          teamMemberId,
        },
      },
      create: {
        issueId,
        teamMemberId,
        notified: false,
      },
      update: {},
      include: { teamMember: true },
    })

    // Only count as created if it was newly created (check by comparing dates)
    const isNew = !mention.notified && !mention.notifiedAt
    if (isNew) created++

    // Send notification if not already notified
    if (!mention.notified) {
      const result = await notifyMention(
        mention.id,
        issue.title,
        issue.project.name,
        issueUrl
      )

      if (result.success) {
        notified++
      } else if (result.error) {
        errors.push(`${mention.teamMember.name}: ${result.error}`)
      }
    }
  }

  return { created, notified, errors }
}

/**
 * Retry failed notifications for an issue
 */
export async function retryFailedNotifications(
  issueId: string,
  baseUrl: string
): Promise<MentionNotificationResult[]> {
  return notifyAllMentions(issueId, baseUrl)
}

/**
 * Get notification status for mentions on an issue
 */
export async function getMentionNotificationStatus(issueId: string) {
  const mentions = await db.mention.findMany({
    where: { issueId },
    include: {
      teamMember: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
  })

  return mentions.map(m => ({
    id: m.id,
    teamMemberId: m.teamMemberId,
    teamMemberName: m.teamMember.name,
    hasPhone: !!m.teamMember.phone,
    notified: m.notified,
    notifiedAt: m.notifiedAt,
  }))
}
