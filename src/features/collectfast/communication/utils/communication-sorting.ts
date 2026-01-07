import { type Communication } from '../data/schema'
import { getCommunicationMetadata } from './communication-metadata'

export type SortOption =
  | 'urgency'
  | 'newest'
  | 'oldest'
  | 'customer'
  | 'amount'
  | 'status'
  | 'type'

/**
 * Get mock due amount for sorting (in real app, this would come from invoice data)
 */
function getDueAmount(comm: Communication): number {
  const amounts = [450, 750, 500, 1200, 850]
  return amounts[comm.id.charCodeAt(0) % amounts.length]
}

/**
 * Sort communications by urgency (Follow-up Required → Amount Due → Days Old)
 */
export function sortByUrgency(
  communications: Communication[],
  allCommunications: Communication[]
): Communication[] {
  return [...communications].sort((a, b) => {
    const metadataA = getCommunicationMetadata(a, allCommunications)
    const metadataB = getCommunicationMetadata(b, allCommunications)

    // First: Follow-up required (true comes first)
    if (metadataA.followUpRequired !== metadataB.followUpRequired) {
      return metadataA.followUpRequired ? -1 : 1
    }

    // Second: Amount due (higher comes first)
    const amountA = getDueAmount(a)
    const amountB = getDueAmount(b)
    if (amountA !== amountB) {
      return amountB - amountA
    }

    // Third: Days old (older comes first)
    const daysA = Math.floor(
      (new Date().getTime() - a.sentDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const daysB = Math.floor(
      (new Date().getTime() - b.sentDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysB - daysA
  })
}

/**
 * Sort communications by various options
 */
export function sortCommunications(
  communications: Communication[],
  sortOption: SortOption,
  allCommunications: Communication[]
): Communication[] {
  switch (sortOption) {
    case 'urgency':
      return sortByUrgency(communications, allCommunications)

    case 'newest':
      return [...communications].sort(
        (a, b) => b.sentDate.getTime() - a.sentDate.getTime()
      )

    case 'oldest':
      return [...communications].sort(
        (a, b) => a.sentDate.getTime() - b.sentDate.getTime()
      )

    case 'customer':
      return [...communications].sort((a, b) =>
        a.customerName.localeCompare(b.customerName)
      )

    case 'amount':
      return [...communications].sort((a, b) => {
        const amountA = getDueAmount(a)
        const amountB = getDueAmount(b)
        return amountB - amountA
      })

    case 'status':
      return [...communications].sort((a, b) => {
        // Failed first, then Scheduled, then others
        const statusOrder: Record<string, number> = {
          failed: 0,
          scheduled: 1,
          sent: 2,
          delivered: 3,
          read: 4,
        }
        return (
          (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99)
        )
      })

    case 'type':
      return [...communications].sort((a, b) => {
        const typeOrder: Record<string, number> = {
          reminder: 0,
          email: 1,
          sms: 2,
          call: 3,
          letter: 4,
        }
        return (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99)
      })

    default:
      return communications
  }
}

/**
 * Filter communications based on filter type
 */
export function filterCommunications(
  communications: Communication[],
  filter: string,
  allCommunications: Communication[]
): Communication[] {
  switch (filter) {
    case 'all':
      return communications

    case 'follow-up': {
      return communications.filter((comm) => {
        const metadata = getCommunicationMetadata(comm, allCommunications)
        return metadata.followUpRequired
      })
    }

    case 'failed':
      return communications.filter((comm) => comm.status === 'failed')

    case 'scheduled':
      return communications.filter((comm) => comm.status === 'scheduled')

    case 'unread':
      return communications.filter(
        (comm) => comm.status === 'sent' || comm.status === 'delivered'
      )

    default:
      return communications
  }
}



