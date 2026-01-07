import { useMemo } from 'react'
import { type Communication } from '../data/schema'
import { getCommunicationMetadata } from '../utils/communication-metadata'
import { cn } from '@/lib/utils'

type CommunicationMetricsProps = {
  communications: Communication[]
  onFilterChange?: (filter: string) => void
  activeFilter?: string
}

export function CommunicationMetrics({
  communications,
  onFilterChange,
  activeFilter,
}: CommunicationMetricsProps) {
  // Calculate metrics
  const metrics = useMemo(() => {
    const total = communications.length

    const followUpsRequired = communications.filter((comm) => {
      const metadata = getCommunicationMetadata(comm, communications)
      return metadata.followUpRequired
    })

    const failed = communications.filter((comm) => comm.status === 'failed')

    const overdueInvoicesTouched = Array.from(
      new Set(
        followUpsRequired
          .map((comm) => comm.relatedInvoiceId)
          .filter((id): id is string => Boolean(id))
      )
    ).length

    return {
      total,
      followUpsRequired: followUpsRequired.length,
      failed: failed.length,
      overdueInvoicesTouched,
    }
  }, [communications])

  const handleMetricClick = (filter: string) => {
    if (onFilterChange) {
      onFilterChange(filter)
    }
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3'>
      <button
        onClick={() => handleMetricClick('all')}
        className={cn(
          'flex flex-col items-start gap-1 px-4 py-3 rounded-lg border transition-all hover:shadow-sm',
          activeFilter === 'all'
            ? 'bg-muted border-foreground/20 shadow-sm'
            : 'bg-background border-border hover:border-foreground/20'
        )}
      >
        <span className='text-2xl font-bold text-foreground'>{metrics.total}</span>
        <span className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>Total</span>
      </button>

      <button
        onClick={() => handleMetricClick('follow-up')}
        className={cn(
          'flex flex-col items-start gap-1 px-4 py-3 rounded-lg border transition-all hover:shadow-sm',
          activeFilter === 'follow-up'
            ? 'bg-orange-500/10 border-orange-500/20 shadow-sm'
            : 'bg-background border-border hover:border-orange-500/20'
        )}
      >
        <span className='text-2xl font-bold text-orange-600 dark:text-orange-400'>{metrics.followUpsRequired}</span>
        <span className='text-xs font-medium text-orange-600/70 dark:text-orange-400/70 uppercase tracking-wide'>
          Follow-ups
        </span>
      </button>

      <button
        onClick={() => handleMetricClick('failed')}
        className={cn(
          'flex flex-col items-start gap-1 px-4 py-3 rounded-lg border transition-all hover:shadow-sm',
          activeFilter === 'failed'
            ? 'bg-red-500/10 border-red-500/20 shadow-sm'
            : 'bg-background border-border hover:border-red-500/20'
        )}
      >
        <span className='text-2xl font-bold text-red-600 dark:text-red-400'>{metrics.failed}</span>
        <span className='text-xs font-medium text-red-600/70 dark:text-red-400/70 uppercase tracking-wide'>Failed</span>
      </button>

      <button
        onClick={() => handleMetricClick('overdue-invoices')}
        className={cn(
          'flex flex-col items-start gap-1 px-4 py-3 rounded-lg border transition-all hover:shadow-sm',
          activeFilter === 'overdue-invoices'
            ? 'bg-amber-500/10 border-amber-500/20 shadow-sm'
            : 'bg-background border-border hover:border-amber-500/20'
        )}
      >
        <span className='text-2xl font-bold text-amber-600 dark:text-amber-400'>
          {metrics.overdueInvoicesTouched}
        </span>
        <span className='text-xs font-medium text-amber-600/70 dark:text-amber-400/70 uppercase tracking-wide'>
          Overdue Invoices
        </span>
      </button>
    </div>
  )
}

