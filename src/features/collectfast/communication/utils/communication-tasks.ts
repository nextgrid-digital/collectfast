import { type Communication } from '../data/schema'
import { getCommunicationMetadata } from './communication-metadata'

export type CommunicationTask = {
  id: string
  title: string
  status: 'todo' | 'in progress' | 'backlog'
  priority: 'low' | 'medium' | 'high' | 'critical'
  description: string
  dueDate: Date | null
  communicationId: string
  customerName: string
  relatedInvoiceId: string | null
}

/**
 * Generate task items from communications that require follow-up or have scheduled reminders
 */
export function generateCommunicationTasks(
  communications: Communication[]
): CommunicationTask[] {
  const tasks: CommunicationTask[] = []

  communications.forEach((comm) => {
    const metadata = getCommunicationMetadata(comm, communications)

    // Create task for follow-up required
    if (metadata.followUpRequired) {
      const priority = determinePriority(comm, metadata)
      tasks.push({
        id: `comm-task-${comm.id}`,
        title: `Follow up with ${comm.customerName}`,
        status: 'todo',
        priority,
        description: metadata.followUpReason || `Follow-up required for ${comm.customerName}`,
        dueDate: metadata.nextReminderDate,
        communicationId: comm.id,
        customerName: comm.customerName,
        relatedInvoiceId: comm.relatedInvoiceId,
      })
    }

    // Create task for scheduled reminders
    if (comm.status === 'scheduled' && comm.scheduledDate) {
      const daysUntil = metadata.daysUntilNextReminder || 0
      const priority = daysUntil <= 2 ? 'high' : daysUntil <= 5 ? 'medium' : 'low'

      const reminderText =
        metadata.reminderSequence > 0
          ? getOrdinal(metadata.reminderSequence)
          : 'Next'

      tasks.push({
        id: `comm-reminder-${comm.id}`,
        title: `Send ${reminderText} reminder to ${comm.customerName}`,
        status: 'todo',
        priority,
        description: `Scheduled reminder for ${comm.customerName}${
          comm.relatedInvoiceId ? ` (Invoice: ${comm.relatedInvoiceId})` : ''
        }`,
        dueDate: comm.scheduledDate,
        communicationId: comm.id,
        customerName: comm.customerName,
        relatedInvoiceId: comm.relatedInvoiceId,
      })
    }
  })

  // Remove duplicates (same customer and invoice)
  const uniqueTasks = tasks.filter(
    (task, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.customerName === task.customerName &&
          t.relatedInvoiceId === task.relatedInvoiceId &&
          t.title === task.title
      )
  )

  return uniqueTasks
}

/**
 * Determine task priority based on communication status and metadata
 */
function determinePriority(
  communication: Communication,
  metadata: ReturnType<typeof getCommunicationMetadata>
): 'low' | 'medium' | 'high' | 'critical' {
  const now = new Date()
  const daysSinceSent = Math.floor(
    (now.getTime() - communication.sentDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Critical: Overdue scheduled reminder or very old communication
  if (
    (communication.status === 'scheduled' &&
      metadata.daysUntilNextReminder !== null &&
      metadata.daysUntilNextReminder < 0) ||
    daysSinceSent >= 21
  ) {
    return 'critical'
  }

  // High: Recent read but no response, or reminder due soon
  if (
    (communication.status === 'read' && daysSinceSent >= 3) ||
    (metadata.daysUntilNextReminder !== null && metadata.daysUntilNextReminder <= 2)
  ) {
    return 'high'
  }

  // Medium: Delivered but not read, or reminder due in 3-5 days
  if (
    (communication.status === 'delivered' && daysSinceSent >= 5) ||
    (metadata.daysUntilNextReminder !== null &&
      metadata.daysUntilNextReminder > 2 &&
      metadata.daysUntilNextReminder <= 5)
  ) {
    return 'medium'
  }

  // Low: Everything else
  return 'low'
}

/**
 * Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
 */
function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}




