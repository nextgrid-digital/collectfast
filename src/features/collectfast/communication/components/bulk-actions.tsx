import { Button } from '@/components/ui/button'
import { CheckCircle2, Send, Clock } from 'lucide-react'

type BulkActionsProps = {
  selectedCount: number
  onMarkAsRead?: () => void
  onResend?: () => void
  onScheduleFollowUp?: () => void
  onClearSelection?: () => void
}

export function BulkActions({
  selectedCount,
  onMarkAsRead,
  onResend,
  onScheduleFollowUp,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className='flex items-center justify-between p-4 border-b bg-muted/50 shadow-sm'>
      <div className='flex items-center gap-3'>
        <span className='text-base font-semibold text-foreground'>
          {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
        </span>
        {onClearSelection && (
          <Button
            size='sm'
            variant='ghost'
            onClick={onClearSelection}
            className='h-8 text-sm'
          >
            Clear
          </Button>
        )}
      </div>
      <div className='flex items-center gap-2'>
        {onMarkAsRead && (
          <Button
            size='sm'
            variant='outline'
            onClick={onMarkAsRead}
            className='gap-2'
          >
            <CheckCircle2 className='h-3 w-3' />
            Mark as Read
          </Button>
        )}
        {onResend && (
          <Button
            size='sm'
            variant='outline'
            onClick={onResend}
            className='gap-2'
          >
            <Send className='h-3 w-3' />
            Resend Selected
          </Button>
        )}
        {onScheduleFollowUp && (
          <Button
            size='sm'
            variant='outline'
            onClick={onScheduleFollowUp}
            className='gap-2'
          >
            <Clock className='h-3 w-3' />
            Schedule Follow-up
          </Button>
        )}
      </div>
    </div>
  )
}

