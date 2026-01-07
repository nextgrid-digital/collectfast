import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type Communication } from '../data/schema'
import { getCommunicationMetadata } from '../utils/communication-metadata'
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
  AlertCircle,
} from 'lucide-react'

type CommunicationInboxProps = {
  communications: Communication[]
  allCommunications?: Communication[]
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption?: string
  onSortChange?: (sort: string) => void
  companyId?: string
  selectedId?: string | null
  onSelect?: (id: string) => void
  mode?: 'communications' | 'invoices'
  invoiceLookup?: Record<string, { amount: number; dueDate: Date; status: string; customerId: string }>
}

export function CommunicationInbox({
  communications,
  allCommunications,
  searchQuery,
  onSearchChange,
  sortOption = 'newest',
  onSortChange,
  companyId,
  selectedId,
  onSelect,
  mode = 'communications',
  invoiceLookup = {},
}: CommunicationInboxProps) {
  const allCommsForMetadata = allCommunications || communications

  const getCustomerInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getMessagePreview = (comm: Communication) => {
    const preview = comm.message.substring(0, 150)
    return preview.length < comm.message.length ? `${preview}...` : preview
  }

  const getStatusConfig = (status: Communication['status']) => {
    switch (status) {
      case 'sent':
        return { icon: Send, color: 'text-blue-500', label: 'Sent', badgeColor: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400' }
      case 'delivered':
        return { icon: CheckCircle2, color: 'text-teal-500', label: 'Delivered', badgeColor: 'bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400' }
      case 'read':
        return { icon: CheckCircle2, color: 'text-green-500', label: 'Read', badgeColor: 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' }
      case 'failed':
        return { icon: XCircle, color: 'text-red-500', label: 'Failed', badgeColor: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' }
      case 'scheduled':
        return { icon: Clock, color: 'text-orange-500', label: 'Scheduled', badgeColor: 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400' }
      default:
        return { icon: Send, color: 'text-gray-500', label: 'Sent', badgeColor: 'bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400' }
    }
  }

  const getTypeIcon = (type: Communication['type']) => {
    // Collectfast only deals with emails; always use the mail icon.
    return Mail
  }

  const getUnreadIndicator = (comm: Communication, metadata: ReturnType<typeof getCommunicationMetadata>) => {
    if (comm.status === 'read') return null
    if (metadata.followUpRequired) return 'bg-orange-500'
    if (comm.status === 'failed') return 'bg-red-500'
    if (comm.status === 'scheduled') return 'bg-blue-500'
    return 'bg-blue-500'
  }

  return (
    <div className='flex h-full flex-col bg-background'>
      {/* Search and Sort Bar */}
      <div className='border-b p-4 flex-shrink-0 space-y-3'>
        <Input
          placeholder='Search by customer, invoice, or subject...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className='w-full'
        />
        {onSortChange && (
          <Select value={sortOption} onValueChange={onSortChange}>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Sort by...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='newest'>Newest First</SelectItem>
              <SelectItem value='oldest'>Oldest First</SelectItem>
              <SelectItem value='urgency'>By Urgency</SelectItem>
              <SelectItem value='customer'>By Customer</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Inbox List */}
      <ScrollArea className='flex-1 min-h-0'>
        <div className='divide-y'>
          {communications.length === 0 ? (
            <div className='flex h-full items-center justify-center p-12'>
              <div className='text-center'>
                <Mail className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
                <p className='text-muted-foreground'>No communications found</p>
              </div>
            </div>
          ) : (
            communications.map((comm) => {
              const metadata = getCommunicationMetadata(comm, allCommsForMetadata)
              const statusConfig = getStatusConfig(comm.status)
              const StatusIcon = statusConfig.icon
              const TypeIcon = getTypeIcon(comm.type)
              const unreadColor = getUnreadIndicator(comm, metadata)
              const customerInitials = getCustomerInitials(comm.customerName)

              const isSelected = selectedId === comm.id

               const invoiceMeta =
                 comm.relatedInvoiceId && invoiceLookup[comm.relatedInvoiceId]
                   ? invoiceLookup[comm.relatedInvoiceId]
                   : null

              const handleClick = (e: React.MouseEvent) => {
                e.preventDefault()
                if (onSelect) {
                  onSelect(comm.id)
                }
              }

              return (
                <div
                  key={comm.id}
                  onClick={handleClick}
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-muted/50 p-4 select-none',
                    'flex items-start gap-4',
                    isSelected && 'bg-muted'
                  )}
                >
                  {/* Avatar with Unread Indicator */}
                  <div className='relative flex-shrink-0'>
                    <Avatar className='h-10 w-10'>
                      <AvatarFallback>{customerInitials}</AvatarFallback>
                    </Avatar>
                    {unreadColor && (
                      <div className={cn('absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-background', unreadColor)} />
                    )}
                  </div>

                  {/* Main Content */}
                  <div className='flex-1 min-w-0 space-y-1'>
                    {/* Top Row: Invoice First + Client Name + Status Badges + Date */}
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex items-center gap-2 flex-1 min-w-0'>
                        {/* Primary label: Invoice number (or customer if missing) */}
                        <span className='font-semibold text-base text-foreground truncate'>
                          {comm.relatedInvoiceId ?? comm.customerName}
                        </span>
                        {/* Secondary label: Client name when we have an invoice */}
                        {comm.relatedInvoiceId && (
                          <Badge variant='outline' className='text-xs px-2 py-0.5 shrink-0'>
                            {comm.customerName}
                          </Badge>
                        )}
                        {invoiceMeta && (
                          <Badge variant='outline' className='text-xs px-2 py-0.5 shrink-0'>
                            ${invoiceMeta.amount.toFixed(2)} • due{' '}
                            {formatDistanceToNow(invoiceMeta.dueDate, { addSuffix: true })}
                          </Badge>
                        )}
                      </div>
                      <div className='flex items-center gap-2 shrink-0'>
                        <Badge variant='outline' className={cn('text-xs px-2 py-0.5', statusConfig.badgeColor)}>
                          <StatusIcon className='h-3 w-3 mr-1' />
                          {statusConfig.label}
                        </Badge>
                        <span className='text-xs text-muted-foreground whitespace-nowrap'>
                          {formatDistanceToNow(comm.sentDate, { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div className='flex items-center gap-2'>
                      <TypeIcon className='h-4 w-4 text-muted-foreground shrink-0' />
                      <span className='font-medium text-sm text-foreground truncate'>
                        {comm.subject}
                      </span>
                    </div>

                    {/* Message Preview */}
                    <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
                      {getMessagePreview(comm)}
                    </p>

                    {/* Follow-up Indicator */}
                    {metadata.followUpRequired && (
                      <div className='flex items-center gap-1.5 text-xs'>
                        <AlertCircle className='h-3 w-3 text-orange-500' />
                        <span className='text-orange-600 dark:text-orange-400 font-medium'>
                          Follow-up required
                        </span>
                        {metadata.followUpReason && (
                          <span className='text-muted-foreground'>• {metadata.followUpReason}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

