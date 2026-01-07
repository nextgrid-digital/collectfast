import * as React from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { type Communication } from '../data/schema'
import { type CommunicationMetadata } from '../utils/communication-metadata'
import { generateTaskSuggestions } from '../utils/task-suggestions'
import { CheckCircle2, Send, Clock, FileText, Plus } from 'lucide-react'

type CommunicationContextMenuProps = {
  communication: Communication
  metadata: CommunicationMetadata
  children: React.ReactNode
  onAddTask?: (suggestion: { title: string; description: string; dueDate: Date | null }) => void
  onMarkAsRead?: () => void
  onResend?: () => void
  onScheduleFollowUp?: () => void
  onAddNote?: () => void
}

export function CommunicationContextMenu({
  communication,
  metadata,
  children,
  onAddTask,
  onMarkAsRead,
  onResend,
  onScheduleFollowUp,
  onAddNote,
}: CommunicationContextMenuProps) {
  const taskSuggestions = generateTaskSuggestions(communication, metadata)

  const handleTaskSuggestion = (suggestion: ReturnType<typeof generateTaskSuggestions>[0]) => {
    if (onAddTask) {
      onAddTask({
        title: suggestion.title,
        description: suggestion.description,
        dueDate: suggestion.dueDate,
      })
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {/* Task Suggestions */}
        {taskSuggestions.length > 0 && (
          <>
            <div className='px-2 py-1.5 text-xs font-semibold text-muted-foreground'>
              Add Task
            </div>
            {taskSuggestions.map((suggestion) => (
              <ContextMenuItem
                key={suggestion.id}
                onClick={() => handleTaskSuggestion(suggestion)}
                className='flex items-center gap-2'
              >
                <Plus className='h-4 w-4' />
                <span className='text-xs'>{suggestion.title}</span>
              </ContextMenuItem>
            ))}
            <ContextMenuSeparator />
          </>
        )}

        {/* Custom Task */}
        <ContextMenuItem
          onClick={() => {
            if (onAddTask) {
              onAddTask({
                title: `Follow up with ${communication.customerName}`,
                description: `Custom task for ${communication.customerName}`,
                dueDate: null,
              })
            }
          }}
          className='flex items-center gap-2'
        >
          <Plus className='h-4 w-4' />
          <span>Add Custom Task</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        {/* Quick Actions */}
        {communication.status !== 'read' && onMarkAsRead && (
          <ContextMenuItem onClick={onMarkAsRead} className='flex items-center gap-2'>
            <CheckCircle2 className='h-4 w-4' />
            <span>Mark as Read</span>
          </ContextMenuItem>
        )}

        {communication.status === 'failed' && onResend && (
          <ContextMenuItem onClick={onResend} className='flex items-center gap-2'>
            <Send className='h-4 w-4' />
            <span>Resend</span>
          </ContextMenuItem>
        )}

        {onScheduleFollowUp && (
          <ContextMenuItem onClick={onScheduleFollowUp} className='flex items-center gap-2'>
            <Clock className='h-4 w-4' />
            <span>Schedule Follow-up</span>
          </ContextMenuItem>
        )}

        {onAddNote && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onAddNote} className='flex items-center gap-2'>
              <FileText className='h-4 w-4' />
              <span>Add Note</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}

