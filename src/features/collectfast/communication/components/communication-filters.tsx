import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { type Communication } from '../data/schema'
import { getCommunicationMetadata } from '../utils/communication-metadata'
import { cn } from '@/lib/utils'

type CommunicationFiltersProps = {
  communications: Communication[]
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function CommunicationFilters({
  communications,
  activeFilter,
  onFilterChange,
}: CommunicationFiltersProps) {
  // Calculate filter counts
  const filterCounts = useMemo(() => {
    const all = communications.length

    const followUpRequired = communications.filter((comm) => {
      const metadata = getCommunicationMetadata(comm, communications)
      return metadata.followUpRequired
    }).length

    const failed = communications.filter((comm) => comm.status === 'failed').length

    const scheduled = communications.filter((comm) => comm.status === 'scheduled').length

    const unread = communications.filter(
      (comm) => comm.status === 'sent' || comm.status === 'delivered'
    ).length

    return {
      all,
      followUpRequired,
      failed,
      scheduled,
      unread,
    }
  }, [communications])

  const filters = [
    { id: 'all', label: 'All', count: filterCounts.all },
    {
      id: 'follow-up',
      label: 'Follow-up Required',
      count: filterCounts.followUpRequired,
      className: 'text-orange-600 dark:text-orange-400',
    },
    {
      id: 'failed',
      label: 'Failed',
      count: filterCounts.failed,
      className: 'text-red-600 dark:text-red-400',
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      count: filterCounts.scheduled,
      className: 'text-orange-600 dark:text-orange-400',
    },
    {
      id: 'unread',
      label: 'Unread',
      count: filterCounts.unread,
      className: 'text-blue-600 dark:text-blue-400',
    },
  ]

  return (
    <div className='flex items-center gap-2 flex-wrap'>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm font-medium',
            'hover:bg-muted border',
            activeFilter === filter.id
              ? 'bg-muted border-foreground/20'
              : 'bg-background border-border',
            filter.className
          )}
        >
          <span>{filter.label}</span>
          <Badge variant='outline' className='text-xs'>
            {filter.count}
          </Badge>
        </button>
      ))}
    </div>
  )
}

