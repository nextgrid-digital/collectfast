import { useState, useMemo } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { type Communication } from '../data/schema'
import { cn } from '@/lib/utils'
import { getCommunicationMetadata } from '../utils/communication-metadata'
import { AmountStatusIndicator } from './amount-status-indicator'
import { CommunicationContextMenu } from './communication-context-menu'
import { BulkActions } from './bulk-actions'
import { GroupingToggle, type GroupingOption } from './grouping-toggle'
import {
  AlertCircle,
  Mail,
  CheckCircle2,
  Send,
  XCircle,
  Clock,
  MoreVertical,
} from 'lucide-react'

type CommunicationListProps = {
  communications: Communication[]
  allCommunications?: Communication[] // All communications for metadata calculation
  selectedId: string | null
  onSelect: (id: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption?: string
  onSortChange?: (sort: string) => void
  grouping?: GroupingOption
  onGroupingChange?: (grouping: GroupingOption) => void
  onAddTask?: (suggestion: { title: string; description: string; dueDate: Date | null }) => void
  onMarkAsRead?: (id: string) => void
  onResend?: (id: string) => void
  onScheduleFollowUp?: (id: string) => void
  onAddNote?: (id: string) => void
  onBulkMarkAsRead?: (ids: string[]) => void
  onBulkResend?: (ids: string[]) => void
  onBulkScheduleFollowUp?: (ids: string[]) => void
}

export function CommunicationList({
  communications,
  allCommunications,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  grouping = 'urgency',
  onGroupingChange,
  onAddTask,
  onMarkAsRead,
  onResend,
  onScheduleFollowUp,
  onAddNote,
  onBulkMarkAsRead,
  onBulkResend,
  onBulkScheduleFollowUp,
}: CommunicationListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Helper functions
  const getDueAmount = (comm: Communication) => {
    // Mock due amount - in real app this would come from invoice data
    const amounts = [450, 750, 500, 1200, 850]
    return amounts[comm.id.charCodeAt(0) % amounts.length]
  }

  // Search is now handled in parent component, but keep for backward compatibility
  const filteredCommunications = communications
  // Use allCommunications for metadata calculation, fallback to communications if not provided
  const allCommsForMetadata = allCommunications || communications

  // Group communications based on grouping option
  const groupedCommunications = useMemo(() => {
    if (grouping === 'urgency') {
      // Group by urgency: Critical, High, Medium, Low
      const groups: Record<string, Communication[]> = {
        critical: [],
        high: [],
        medium: [],
        low: [],
      }

      filteredCommunications.forEach((comm) => {
        const metadata = getCommunicationMetadata(comm, allCommsForMetadata)
        const dueAmount = getDueAmount(comm)
        const daysSinceSent = Math.floor(
          (new Date().getTime() - comm.sentDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (comm.status === 'failed' || (dueAmount >= 1000 && daysSinceSent > 30)) {
          groups.critical.push(comm)
        } else if (metadata.followUpRequired || (dueAmount >= 500 && daysSinceSent > 15)) {
          groups.high.push(comm)
        } else if (comm.status === 'scheduled' || daysSinceSent > 7) {
          groups.medium.push(comm)
        } else {
          groups.low.push(comm)
        }
      })

      return [
        { label: 'Critical', communications: groups.critical },
        { label: 'High Priority', communications: groups.high },
        { label: 'Medium Priority', communications: groups.medium },
        { label: 'Low Priority', communications: groups.low },
      ].filter((group) => group.communications.length > 0)
    } else if (grouping === 'customer') {
      // Group by customer
      const customerMap = new Map<string, Communication[]>()
      filteredCommunications.forEach((comm) => {
        const existing = customerMap.get(comm.customerName) || []
        customerMap.set(comm.customerName, [...existing, comm])
      })

      return Array.from(customerMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([customerName, comms]) => ({
          label: customerName,
          communications: comms,
        }))
    } else if (grouping === 'invoice') {
      // Group by invoice
      const invoiceMap = new Map<string, Communication[]>()
      filteredCommunications.forEach((comm) => {
        const invoiceId = comm.relatedInvoiceId || 'No Invoice'
        const existing = invoiceMap.get(invoiceId) || []
        invoiceMap.set(invoiceId, [...existing, comm])
      })

      return Array.from(invoiceMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([invoiceId, comms]) => ({
          label: invoiceId,
          communications: comms,
        }))
    }

    return [{ label: 'All', communications: filteredCommunications }]
  }, [filteredCommunications, grouping, allCommsForMetadata])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredCommunications.map((comm) => comm.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkAction = (action: () => void) => {
    action()
    setSelectedIds(new Set())
  }

  const getMessagePreview = (comm: Communication) => {
    // Use a template-based preview for payment reminders
    if (comm.relatedInvoiceId && comm.message.includes('invoice')) {
      return `We are writing to remind you that your invoice [${comm.relatedInvoiceId}], dated [Invoice Date], is now 30 days overdue. The total amount due is [Invoice Amount].`
    }
    // Extract a preview from the message
    const preview = comm.message.substring(0, 120)
    return preview.length < comm.message.length ? `${preview}...` : preview
  }

  const getOrdinal = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }

  // Get urgency border color
  const getUrgencyBorderColor = (comm: Communication, metadata: ReturnType<typeof getCommunicationMetadata>) => {
    if (comm.status === 'failed') return 'border-l-red-500'
    if (metadata.followUpRequired) return 'border-l-orange-500'
    if (comm.status === 'scheduled') return 'border-l-blue-500'
    if (comm.status === 'read') return 'border-l-green-500'
    if (comm.status === 'delivered') return 'border-l-teal-500'
    return 'border-l-gray-300'
  }

  // Get status icon
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

  // Get type icon
  const getTypeIcon = (_type: Communication['type']) => {
    // Collectfast currently only sends emails; keep a single email icon.
    return { icon: Mail, color: 'text-blue-500' }
  }

  // Get task suggestion text
  const getTaskSuggestion = (metadata: ReturnType<typeof getCommunicationMetadata>) => {
    if (metadata.nextReminderDate) {
      const dateStr = format(metadata.nextReminderDate, 'MMM dd, yyyy')
      return `Follow up on ${dateStr}`
    }
    if (metadata.reminderSequence > 0 && metadata.daysUntilNextReminder !== null && metadata.daysUntilNextReminder > 0) {
      const ordinal = getOrdinal(metadata.reminderSequence + 1)
      return `${ordinal} reminder in ${metadata.daysUntilNextReminder} ${metadata.daysUntilNextReminder === 1 ? 'day' : 'days'}`
    }
    return null
  }

  return (
    <div className='flex h-full flex-col border-r bg-background'>
      {/* Search Bar, Sort, and Grouping */}
      <div className='border-b p-5 flex-shrink-0 space-y-3 bg-muted/20'>
        <Input
          placeholder='Search by Customer or invoice number...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className='w-full'
        />
        <div className='flex items-center gap-2'>
          {onSortChange && (
            <div className='flex-1'>
              <Select value={sortOption} onValueChange={onSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Sort by...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='urgency'>By Urgency</SelectItem>
                  <SelectItem value='newest'>Newest First</SelectItem>
                  <SelectItem value='oldest'>Oldest First</SelectItem>
                  <SelectItem value='customer'>By Customer</SelectItem>
                  <SelectItem value='amount'>By Amount Due</SelectItem>
                  <SelectItem value='status'>By Status</SelectItem>
                  <SelectItem value='type'>By Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {onGroupingChange && (
            <GroupingToggle value={grouping} onChange={onGroupingChange} />
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {(onBulkMarkAsRead || onBulkResend || onBulkScheduleFollowUp) && (
        <BulkActions
          selectedCount={selectedIds.size}
          onMarkAsRead={
            onBulkMarkAsRead
              ? () => handleBulkAction(() => onBulkMarkAsRead!(Array.from(selectedIds)))
              : undefined
          }
          onResend={
            onBulkResend
              ? () => handleBulkAction(() => onBulkResend!(Array.from(selectedIds)))
              : undefined
          }
          onScheduleFollowUp={
            onBulkScheduleFollowUp
              ? () => handleBulkAction(() => onBulkScheduleFollowUp!(Array.from(selectedIds)))
              : undefined
          }
          onClearSelection={() => setSelectedIds(new Set())}
        />
      )}

      {/* Communication List */}
      <ScrollArea className='flex-1 min-h-0'>
        <div>
          {/* Select All Checkbox */}
          {(onBulkMarkAsRead || onBulkResend || onBulkScheduleFollowUp) && (
            <div className='p-4 border-b flex items-center gap-3 bg-muted/30'>
              <Checkbox
                checked={
                  filteredCommunications.length > 0 &&
                  selectedIds.size === filteredCommunications.length
                }
                onCheckedChange={handleSelectAll}
                className='shrink-0'
              />
              <span className='text-sm font-medium text-foreground'>
                Select all ({filteredCommunications.length})
              </span>
            </div>
          )}

          {/* Grouped Communications */}
          {groupedCommunications.map((group, groupIndex) => (
            <div key={group.label} className={cn(groupIndex > 0 && 'border-t')}>
              {grouping !== 'urgency' && (
                <div className='px-5 py-3 bg-muted/40 border-b sticky top-0 z-10'>
                  <h3 className='text-sm font-bold text-foreground uppercase tracking-wide'>{group.label}</h3>
                </div>
              )}
              <div className='divide-y'>
                {group.communications.map((comm) => {
            const isSelected = selectedId === comm.id
            const dueAmount = getDueAmount(comm)
            const metadata = getCommunicationMetadata(comm, allCommsForMetadata)
            const statusIcon = getStatusIcon(comm.status)
            const typeIcon = getTypeIcon(comm.type)
            const StatusIcon = statusIcon.icon
            const TypeIcon = typeIcon.icon
            const taskSuggestion = getTaskSuggestion(metadata)
            const daysSinceSent = Math.floor(
              (new Date().getTime() - comm.sentDate.getTime()) / (1000 * 60 * 60 * 24)
            )

            return (
              <CommunicationContextMenu
                key={comm.id}
                communication={comm}
                metadata={metadata}
                onAddTask={onAddTask}
                onMarkAsRead={onMarkAsRead ? () => onMarkAsRead(comm.id) : undefined}
                onResend={onResend ? () => onResend(comm.id) : undefined}
                onScheduleFollowUp={onScheduleFollowUp ? () => onScheduleFollowUp(comm.id) : undefined}
                onAddNote={onAddNote ? () => onAddNote(comm.id) : undefined}
              >
                <div
                  onClick={(e) => {
                    // Don't select if clicking checkbox or dropdown
                    if (
                      (e.target as HTMLElement).closest('[role="checkbox"]') ||
                      (e.target as HTMLElement).closest('[role="menu"]')
                    ) {
                      return
                    }
                    onSelect(comm.id)
                  }}
                  className={cn(
                    'cursor-pointer border-l-4 transition-all hover:bg-muted/50 hover:shadow-sm relative rounded-r-lg',
                    getUrgencyBorderColor(comm, metadata),
                    isSelected && 'bg-muted shadow-sm'
                  )}
                >
                  <div className='p-5 space-y-4'>
                  {/* Top Row: Checkbox + Customer Name + Status Icon + Type Icon + 3-dot Menu */}
                  <div className='flex items-start justify-between gap-3'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      {(onBulkMarkAsRead || onBulkResend || onBulkScheduleFollowUp) && (
                        <Checkbox
                          checked={selectedIds.has(comm.id)}
                          onCheckedChange={(checked) => handleSelectOne(comm.id, checked as boolean)}
                          onClick={(e) => e.stopPropagation()}
                          className='shrink-0'
                        />
                      )}
                      <div className='font-bold text-lg text-foreground flex-1 truncate'>{comm.customerName}</div>
                    </div>
                    <div className='flex items-center gap-2 shrink-0'>
                      <StatusIcon className={cn('h-5 w-5', statusIcon.color)} />
                      <TypeIcon className={cn('h-5 w-5', typeIcon.color)} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant='ghost' size='icon' className='h-7 w-7'>
                            <MoreVertical className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          {onMarkAsRead && comm.status !== 'read' && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onMarkAsRead(comm.id)
                              }}
                            >
                              <CheckCircle2 className='h-4 w-4 mr-2' />
                              Mark as Read
                            </DropdownMenuItem>
                          )}
                          {onResend && comm.status === 'failed' && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onResend(comm.id)
                              }}
                            >
                              <Send className='h-4 w-4 mr-2' />
                              Resend
                            </DropdownMenuItem>
                          )}
                          {onScheduleFollowUp && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onScheduleFollowUp(comm.id)
                              }}
                            >
                              <Clock className='h-4 w-4 mr-2' />
                              Schedule Follow-up
                            </DropdownMenuItem>
                          )}
                          {onAddNote && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                onAddNote(comm.id)
                              }}
                            >
                              <FileText className='h-4 w-4 mr-2' />
                              Add Note
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Second Row: Invoice Badge + Amount with Status Indicator */}
                  <div className='flex items-center justify-between gap-3 flex-wrap'>
                    {comm.relatedInvoiceId && (
                      <Badge variant='outline' className='bg-muted text-sm font-medium px-2.5 py-1'>
                        {comm.relatedInvoiceId}
                      </Badge>
                    )}
                    <AmountStatusIndicator
                      amount={dueAmount}
                      status={daysSinceSent > 30 ? 'overdue' : daysSinceSent > 15 ? 'due-soon' : 'pending'}
                    />
                  </div>

                  {/* Third Row: Follow-up indicator + Reminder count + Task suggestion */}
                  <div className='space-y-2'>
                    {metadata.followUpRequired && (
                      <div className='flex items-center gap-2 text-sm'>
                        <AlertCircle className='h-4 w-4 text-orange-500 shrink-0' />
                        <span className='text-orange-600 dark:text-orange-400 font-semibold'>
                          Follow-up required
                        </span>
                      </div>
                    )}

                    {metadata.reminderSequence > 0 && (
                      <div className='text-sm text-foreground/80'>
                        {getOrdinal(metadata.reminderSequence)} reminder
                        {metadata.daysUntilNextReminder !== null &&
                          metadata.daysUntilNextReminder > 0 && (
                            <span className='ml-2 text-foreground/60'>
                              • Next in {metadata.daysUntilNextReminder}{' '}
                              {metadata.daysUntilNextReminder === 1 ? 'day' : 'days'}
                            </span>
                          )}
                      </div>
                    )}

                    {taskSuggestion && (
                      <div className='text-sm text-blue-600 dark:text-blue-400 font-medium'>
                        Suggested: {taskSuggestion}
                      </div>
                    )}
                  </div>

                  {/* Fourth Row: Expanded Message Preview (2-3 lines) */}
                  <p className='text-base text-foreground/70 line-clamp-3 leading-relaxed'>
                    {getMessagePreview(comm)}
                  </p>

                  {/* Bottom Row: Relative Date + Follow-up Badge */}
                  <div className='flex items-center justify-between gap-2'>
                    <div className='text-sm text-foreground/60 font-medium'>
                      {formatDistanceToNow(comm.sentDate, { addSuffix: true })}
                    </div>
                    {metadata.followUpRequired && (
                      <Badge
                        variant='outline'
                        className='bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium px-2.5 py-1'
                      >
                        Follow-up
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              </CommunicationContextMenu>
                )
              })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

