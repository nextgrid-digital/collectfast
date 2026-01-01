import { Plus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function CommunicationsPrimaryButtons() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus className='me-2 h-4 w-4' />
          New Communication
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Communication Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Send className='me-2 h-4 w-4' />
          Send Email
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Send className='me-2 h-4 w-4' />
          Send SMS
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Send className='me-2 h-4 w-4' />
          Schedule Reminder
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Send className='me-2 h-4 w-4' />
          Send Letter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

