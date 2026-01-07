import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type Communication } from '../data/schema'
import { cn } from '@/lib/utils'
import {
  Mail,
  MessageSquare,
  Phone,
  Bell,
  FileText,
  CheckCircle2,
  Send,
  XCircle,
  Clock,
} from 'lucide-react'

type CommunicationTimelineProps = {
  communications: Communication[]
  currentCommunicationId: string
  onSelect: (id: string) => void
}

export function CommunicationTimeline({
  communications,
  currentCommunicationId,
  onSelect,
}: CommunicationTimelineProps) {
  // Sort by date (newest first)
  const sortedCommunications = [...communications].sort(
    (a, b) => b.sentDate.getTime() - a.sentDate.getTime()
  )

  const getTypeIcon = (type: Communication['type']) => {
    // Only email communications are used.
    return Mail
  }

  const getStatusIcon = (status: Communication['status']) => {
    switch (status) {
      case 'sent':
        return { icon: Send, color: 'text-blue-500' }
      case 'delivered':
        return { icon: CheckCircle2, color: 'text-teal-500' }
      case 'read':
        return { icon: CheckCircle2, color: 'text-green-500' }
      case 'failed':
        return { icon: XCircle, color: 'text-red-500' }
      case 'scheduled':
        return { icon: Clock, color: 'text-orange-500' }
      default:
        return { icon: Send, color: 'text-gray-500' }
    }
  }

  const getStatusColor = (status: Communication['status']) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
      case 'delivered':
        return 'bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400'
      case 'read':
        return 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
      case 'failed':
        return 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
      case 'scheduled':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400'
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className='space-y-5'>
      <h3 className='text-lg font-bold'>Communication Timeline</h3>
      <ScrollArea className='h-[300px]'>
        <div className='space-y-3'>
          {sortedCommunications.map((comm, index) => {
            const isCurrent = comm.id === currentCommunicationId
            const TypeIcon = getTypeIcon(comm.type)
            const statusConfig = getStatusIcon(comm.status)
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={comm.id}
                onClick={() => onSelect(comm.id)}
                className={cn(
                  'p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 hover:shadow-sm',
                  isCurrent && 'bg-muted border-foreground/20 shadow-sm'
                )}
              >
                <div className='flex items-start gap-3'>
                  <div className='flex items-center gap-2 shrink-0'>
                    <TypeIcon className='h-4 w-4 text-muted-foreground' />
                    <StatusIcon className={cn('h-3 w-3', statusConfig.color)} />
                  </div>
                  <div className='flex-1 min-w-0 space-y-2'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <span className='text-base font-semibold text-foreground'>{comm.subject}</span>
                      <Badge
                        variant='outline'
                        className={cn('text-sm font-medium px-2 py-0.5', getStatusColor(comm.status))}
                      >
                        {comm.status}
                      </Badge>
                      {comm.type && (
                        <Badge variant='outline' className='text-sm font-medium px-2 py-0.5'>
                          {comm.type}
                        </Badge>
                      )}
                    </div>
                    <div className='text-sm text-muted-foreground font-medium'>
                      {format(comm.sentDate, 'MMM dd, yyyy HH:mm')}
                    </div>
                    {comm.relatedInvoiceId && (
                      <Badge variant='outline' className='text-sm font-medium bg-muted px-2 py-0.5'>
                        {comm.relatedInvoiceId}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

