import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { type CommunicationTask } from '../utils/communication-tasks'
import { type Task } from '@/features/tasks/data/schema'
import { statuses, priorities } from '@/features/tasks/data/data'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

type TasksPanelProps = {
  communicationTasks: CommunicationTask[]
  generalTasks: Task[]
  onTaskClick?: (taskId: string, communicationId?: string) => void
  onTaskComplete?: (taskId: string) => void
}

export function TasksPanel({
  communicationTasks,
  generalTasks,
  onTaskClick,
  onTaskComplete,
}: TasksPanelProps) {
  // Filter general tasks to only pending ones (todo, in progress, backlog)
  const pendingGeneralTasks = generalTasks.filter(
    (task) =>
      task.status === 'todo' ||
      task.status === 'in progress' ||
      task.status === 'backlog'
  )

  // Combine and sort all tasks by priority and due date
  const allTasks = [
    ...communicationTasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      description: task.description,
      dueDate: task.dueDate,
      type: 'communication' as const,
      communicationId: task.communicationId,
      customerName: task.customerName,
    })),
    ...pendingGeneralTasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority as 'low' | 'medium' | 'high' | 'critical',
      description: (task as any).description || '',
      dueDate: (task as any).dueDate || null,
      type: 'general' as const,
      communicationId: null,
      customerName: null,
    })),
  ].sort((a, b) => {
    // Sort by priority first (critical > high > medium > low)
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff

    // Then by due date (earlier first)
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime()
    }
    if (a.dueDate) return -1
    if (b.dueDate) return 1

    return 0
  })

  const totalTasks = allTasks.length

  const getStatusConfig = (status: string) => {
    return statuses.find((s) => s.value === status) || statuses[0]
  }

  const getPriorityConfig = (priority: string) => {
    return priorities.find((p) => p.value === priority) || priorities[0]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
      case 'high':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400'
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400'
      case 'low':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
      default:
        return 'bg-muted border-muted-foreground/20 text-muted-foreground'
    }
  }

  return (
    <div className='flex h-full flex-col bg-background'>
      <div className='border-b p-5 flex-shrink-0 bg-muted/30'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg font-bold'>Pending Tasks</CardTitle>
          <Badge variant='outline' className='ml-2 text-sm font-semibold px-2.5 py-1'>
            {totalTasks}
          </Badge>
        </div>
      </div>

      <ScrollArea className='flex-1 min-h-0'>
        {allTasks.length === 0 ? (
          <div className='flex h-full items-center justify-center p-8'>
            <div className='text-center'>
              <CheckCircle2 className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
              <p className='text-sm text-muted-foreground'>
                No pending tasks
              </p>
            </div>
          </div>
        ) : (
          <div className='py-2'>
            {allTasks.map((task) => {
              const statusConfig = getStatusConfig(task.status)
              const priorityConfig = getPriorityConfig(task.priority)
              const StatusIcon = statusConfig.icon
              const PriorityIcon = priorityConfig.icon

              return (
                <Card
                  key={task.id}
                  className={cn(
                    'rounded-lg border shadow-sm mx-2 my-2',
                    onTaskClick && 'cursor-pointer hover:shadow-md hover:border-foreground/20 transition-all'
                  )}
                  onClick={() => {
                    if (onTaskClick) {
                      onTaskClick(task.id, task.type === 'communication' ? task.communicationId : undefined)
                    }
                  }}
                >
                  <CardContent className='p-4'>
                    <div className='space-y-3'>
                      {/* Task Title */}
                      <div className='flex items-start justify-between gap-2'>
                        <h4 className='text-base font-semibold leading-tight flex-1 text-foreground'>
                          {task.title}
                        </h4>
                        <div className='flex items-center gap-2 shrink-0'>
                          {task.type === 'communication' && (
                            <Badge
                              variant='outline'
                              className='text-xs font-medium bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5'
                            >
                              Comm
                            </Badge>
                          )}
                          {onTaskComplete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onTaskComplete(task.id)
                              }}
                              className='text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted'
                              title='Mark as complete'
                            >
                              <CheckCircle2 className='h-4 w-4' />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Task Description */}
                      {task.description && (
                        <p className='text-sm text-foreground/70 line-clamp-2 leading-relaxed'>
                          {task.description}
                        </p>
                      )}

                      {/* Status and Priority */}
                      <div className='flex items-center gap-2 flex-wrap'>
                        {StatusIcon && (
                          <div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                            <StatusIcon className='h-4 w-4' />
                            <span>{statusConfig.label}</span>
                          </div>
                        )}

                        {PriorityIcon && (
                          <Badge
                            variant='outline'
                            className={cn(
                              'text-sm font-medium flex items-center gap-1.5 px-2 py-1',
                              getPriorityColor(task.priority)
                            )}
                          >
                            <PriorityIcon className='h-4 w-4' />
                            <span>{priorityConfig.label}</span>
                          </Badge>
                        )}
                      </div>

                      {/* Due Date */}
                      {task.dueDate && (
                        <div className='text-sm text-foreground/60 font-medium'>
                          Due: {format(task.dueDate, 'MMM dd, yyyy')}
                        </div>
                      )}

                      {/* Customer Name for communication tasks */}
                      {task.type === 'communication' && task.customerName && (
                        <div className='text-sm text-foreground/60'>
                          Customer: <span className='font-medium'>{task.customerName}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

