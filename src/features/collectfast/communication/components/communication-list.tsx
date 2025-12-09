import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type Communication } from '../data/schema'
import { cn } from '@/lib/utils'

type CommunicationListProps = {
  communications: Communication[]
  selectedId: string | null
  onSelect: (id: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function CommunicationList({
  communications,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
}: CommunicationListProps) {
  const filteredCommunications = communications.filter((comm) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      comm.customerName.toLowerCase().includes(query) ||
      comm.relatedInvoiceId?.toLowerCase().includes(query) ||
      comm.subject.toLowerCase().includes(query)
    )
  })

  const getMessagePreview = (comm: Communication) => {
    // Use a template-based preview for payment reminders
    if (comm.relatedInvoiceId && comm.message.includes('invoice')) {
      return `We are writing to remind you that your invoice [${comm.relatedInvoiceId}], dated [Invoice Date], is now 30 days overdue. The total amount due is [Invoice Amount].`
    }
    // Extract a preview from the message
    const preview = comm.message.substring(0, 120)
    return preview.length < comm.message.length ? `${preview}...` : preview
  }

  const getDueAmount = (comm: Communication) => {
    // Mock due amount - in real app this would come from invoice data
    const amounts = [450, 750, 500, 1200, 850]
    return amounts[comm.id.charCodeAt(0) % amounts.length]
  }

  const getDueAmountColor = (amount: number) => {
    if (amount >= 750) return 'bg-red-500/10 border-red-500/20 text-red-500'
    return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
  }

  return (
    <div className='flex h-full flex-col border-r bg-background'>
      {/* Search Bar */}
      <div className='border-b p-4 flex-shrink-0'>
        <Input
          placeholder='Search by Customer or invoice number...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className='w-full'
        />
      </div>

      {/* Communication List */}
      <ScrollArea className='flex-1 min-h-0'>
        <div className='divide-y'>
          {filteredCommunications.map((comm) => {
            const isSelected = selectedId === comm.id
            const dueAmount = getDueAmount(comm)

            return (
              <div
                key={comm.id}
                onClick={() => onSelect(comm.id)}
                className={cn(
                  'cursor-pointer p-4 transition-colors hover:bg-muted/50',
                  isSelected && 'bg-muted'
                )}
              >
                <div className='space-y-2'>
                  {/* Customer Name */}
                  <div className='font-medium'>{comm.customerName}</div>

                  {/* Message Preview */}
                  <p className='text-sm text-muted-foreground line-clamp-2'>
                    {getMessagePreview(comm)}
                  </p>

                  {/* Date */}
                  <div className='text-xs text-muted-foreground'>
                    Reminder Sent, {format(comm.sentDate, 'dd MMMM, yyyy')}
                  </div>

                  {/* Badges */}
                  <div className='flex flex-wrap gap-2'>
                    {comm.relatedInvoiceId && (
                      <Badge variant='outline' className='bg-muted'>
                        {comm.relatedInvoiceId}
                      </Badge>
                    )}
                    <Badge
                      variant='outline'
                      className={getDueAmountColor(dueAmount)}
                    >
                      Due: ${dueAmount.toFixed(2)}
                    </Badge>
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

