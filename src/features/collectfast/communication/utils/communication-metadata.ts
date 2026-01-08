import { type Communication } from '../data/schema'

export type CommunicationMetadata = {
  reminderCount: number
  reminderSequence: number // 1st, 2nd, 3rd, etc.
  followUpRequired: boolean
  nextReminderDate: Date | null
  daysUntilNextReminder: number | null
  followUpReason: string | null
}

/**
 * Calculate metadata for a communication based on all communications
 */
export function getCommunicationMetadata(
  communication: Communication,
  allCommunications: Communication[]
): CommunicationMetadata {
  // Filter communications for the same customer and invoice
  const relatedCommunications = allCommunications.filter(
    (comm) =>
      comm.customerId === communication.customerId &&
      comm.relatedInvoiceId === communication.relatedInvoiceId &&
      comm.relatedInvoiceId !== null
  )

  // Count reminders (type === 'reminder' and status !== 'failed')
  const reminders = relatedCommunications.filter(
    (comm) => comm.type === 'reminder' && comm.status !== 'failed'
  )

  // Sort reminders by sentDate to determine sequence
  const sortedReminders = [...reminders].sort(
    (a, b) => a.sentDate.getTime() - b.sentDate.getTime()
  )

  // Find the current communication's position in the sequence
  const currentIndex = sortedReminders.findIndex((comm) => comm.id === communication.id)
  const reminderSequence = currentIndex >= 0 ? currentIndex + 1 : 0
  const reminderCount = reminders.length

  // Determine if follow-up is required
  const followUpRequired = calculateFollowUpRequired(communication, relatedCommunications)
  const followUpReason = followUpRequired
    ? getFollowUpReason(communication, relatedCommunications)
    : null

  // Calculate next reminder date
  const nextReminderDate = calculateNextReminderDate(
    communication,
    relatedCommunications,
    sortedReminders
  )

  // Calculate days until next reminder
  const daysUntilNextReminder = nextReminderDate
    ? Math.ceil(
        (nextReminderDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    : null

  return {
    reminderCount,
    reminderSequence,
    followUpRequired,
    nextReminderDate,
    daysUntilNextReminder,
    followUpReason,
  }
}

/**
 * Determine if a follow-up is required based on communication status and timing
 */
function calculateFollowUpRequired(
  communication: Communication,
  relatedCommunications: Communication[]
): boolean {
  const now = new Date()
  const daysSinceSent = Math.floor(
    (now.getTime() - communication.sentDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Follow-up required if:
  // 1. Status is 'read' but no response after 3 days
  if (communication.status === 'read' && daysSinceSent >= 3) {
    return true
  }

  // 2. Status is 'delivered' but not 'read' after 5 days
  if (communication.status === 'delivered' && daysSinceSent >= 5) {
    return true
  }

  // 3. Status is 'sent' and more than 7 days have passed
  if (communication.status === 'sent' && daysSinceSent >= 7) {
    return true
  }

  // 4. Last communication was sent more than 14 days ago and invoice is still unpaid
  const lastCommunication = relatedCommunications
    .sort((a, b) => b.sentDate.getTime() - a.sentDate.getTime())[0]
  if (
    lastCommunication &&
    lastCommunication.id === communication.id &&
    daysSinceSent >= 14
  ) {
    return true
  }

  // 5. If there's a scheduled reminder that hasn't been sent yet
  if (communication.status === 'scheduled' && communication.scheduledDate) {
    return true
  }

  return false
}

/**
 * Get the reason why follow-up is required
 */
function getFollowUpReason(
  communication: Communication,
  relatedCommunications: Communication[]
): string {
  const now = new Date()
  const daysSinceSent = Math.floor(
    (now.getTime() - communication.sentDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (communication.status === 'read' && daysSinceSent >= 3) {
    return 'No response after read'
  }

  if (communication.status === 'delivered' && daysSinceSent >= 5) {
    return 'Not opened after delivery'
  }

  if (communication.status === 'sent' && daysSinceSent >= 7) {
    return 'No delivery confirmation'
  }

  if (communication.status === 'scheduled' && communication.scheduledDate) {
    return 'Scheduled reminder pending'
  }

  if (daysSinceSent >= 14) {
    return 'Long time since last contact'
  }

  return 'Follow-up required'
}

/**
 * Calculate the next reminder date
 */
function calculateNextReminderDate(
  communication: Communication,
  relatedCommunications: Communication[],
  sortedReminders: Communication[]
): Date | null {
  // If current communication has a scheduled date, use it
  if (communication.scheduledDate) {
    return communication.scheduledDate
  }

  // Find the next scheduled communication for this customer/invoice
  const nextScheduled = relatedCommunications
    .filter((comm) => comm.status === 'scheduled' && comm.scheduledDate)
    .sort((a, b) => {
      const dateA = a.scheduledDate?.getTime() || 0
      const dateB = b.scheduledDate?.getTime() || 0
      return dateA - dateB
    })[0]

  if (nextScheduled?.scheduledDate) {
    return nextScheduled.scheduledDate
  }

  // Calculate based on business rules: 7 days after last reminder
  if (sortedReminders.length > 0) {
    const lastReminder = sortedReminders[sortedReminders.length - 1]
    const lastReminderDate = lastReminder.sentDate
    const nextDate = new Date(lastReminderDate)
    nextDate.setDate(nextDate.getDate() + 7)

    // Only return if it's in the future
    if (nextDate.getTime() > new Date().getTime()) {
      return nextDate
    }
  }

  return null
}




