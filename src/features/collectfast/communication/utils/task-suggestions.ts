import { type Communication } from '../data/schema'
import { type CommunicationMetadata } from './communication-metadata'
import { format } from 'date-fns'

export type TaskSuggestion = {
  id: string
  title: string
  description: string
  dueDate: Date | null
  communicationId: string
}

/**
 * Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
 */
function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/**
 * Generate task suggestions from communication metadata
 */
export function generateTaskSuggestions(
  communication: Communication,
  metadata: CommunicationMetadata
): TaskSuggestion[] {
  const suggestions: TaskSuggestion[] = []

  // Suggestion 1: Follow up on specific date
  if (metadata.nextReminderDate) {
    const dateStr = format(metadata.nextReminderDate, 'MMM dd, yyyy')
    suggestions.push({
      id: `follow-up-${communication.id}`,
      title: `Follow up on ${dateStr}`,
      description: `Follow up with ${communication.customerName}${
        communication.relatedInvoiceId ? ` regarding invoice ${communication.relatedInvoiceId}` : ''
      }`,
      dueDate: metadata.nextReminderDate,
      communicationId: communication.id,
    })
  }

  // Suggestion 2: Nth reminder in X days
  if (
    metadata.reminderSequence > 0 &&
    metadata.daysUntilNextReminder !== null &&
    metadata.daysUntilNextReminder > 0
  ) {
    const nextSequence = metadata.reminderSequence + 1
    const ordinal = getOrdinal(nextSequence)
    const dueDate = metadata.nextReminderDate || new Date()
    
    suggestions.push({
      id: `reminder-${communication.id}`,
      title: `${ordinal} reminder in ${metadata.daysUntilNextReminder} ${
        metadata.daysUntilNextReminder === 1 ? 'day' : 'days'
      }`,
      description: `Send ${ordinal} reminder to ${communication.customerName}${
        communication.relatedInvoiceId ? ` for invoice ${communication.relatedInvoiceId}` : ''
      }`,
      dueDate,
      communicationId: communication.id,
    })
  }

  // Suggestion 3: General follow-up if follow-up required
  if (metadata.followUpRequired && suggestions.length === 0) {
    suggestions.push({
      id: `general-follow-up-${communication.id}`,
      title: `Follow up with ${communication.customerName}`,
      description: metadata.followUpReason || `Follow-up required for ${communication.customerName}`,
      dueDate: null,
      communicationId: communication.id,
    })
  }

  return suggestions
}



