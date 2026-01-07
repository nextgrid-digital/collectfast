import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { type Communication } from '../data/schema'
import { type Invoice } from '@/features/collectfast/invoices/data/schema'
import { type CommunicationTask } from '../utils/communication-tasks'
import { type Task } from '@/features/tasks/data/schema'
import { CommunicationInbox } from './communication-inbox'
import { format } from 'date-fns'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type EntityDetailPageProps = {
  entityType: 'invoice' | 'customer'
  entityId: string
  entityName: string
  communications: Communication[]
  invoices: Invoice[]
  tasks: Array<CommunicationTask | Task>
  allCommunications: Communication[]
  companyId: string
}

export function EntityDetailPage({
  entityType,
  entityId: _entityId,
  entityName,
  communications,
  invoices,
  tasks,
  allCommunications,
  companyId: _companyId,
}: EntityDetailPageProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('communications')
  const [searchQuery, setSearchQuery] = useState('')

  const handleBack = () => {
    navigate({ to: '/app/communication' })
  }

  // Calculate stats
  const stats = useMemo(() => {
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
    const outstandingAmount = invoices
      .filter((inv) => inv.status !== 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0)
    const pendingTasks = tasks.filter(
      (task) =>
        task.status === 'todo' ||
        task.status === 'in progress' ||
        task.status === 'backlog'
    ).length

    return {
      totalCommunications: communications.length,
      totalInvoices: invoices.length,
      totalAmount,
      outstandingAmount,
      pendingTasks,
    }
  }, [communications, invoices, tasks])

  const getTaskPriorityColor = (priority: string) => {
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
        return 'bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
      case 'overdue':
        return 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
      case 'due-soon':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400'
      case 'sent':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className='flex h-full flex-col bg-background'>
      {/* Sticky Header */}
      <div className='sticky top-0 z-10 border-b bg-background p-4'>
        <div className='flex items-center gap-4 mb-4'>
          <Button variant='ghost' size='sm' onClick={handleBack}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Inbox
          </Button>
          <div className='flex-1'>
            <h1 className='text-2xl font-bold'>{entityName}</h1>
            <p className='text-sm text-muted-foreground capitalize'>{entityType}</p>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
          <div className='text-sm'>
            <div className='text-muted-foreground'>Communications</div>
            <div className='text-lg font-semibold'>{stats.totalCommunications}</div>
          </div>
          <div className='text-sm'>
            <div className='text-muted-foreground'>Invoices</div>
            <div className='text-lg font-semibold'>{stats.totalInvoices}</div>
          </div>
          <div className='text-sm'>
            <div className='text-muted-foreground'>Outstanding</div>
            <div className='text-lg font-semibold'>${stats.outstandingAmount.toFixed(2)}</div>
          </div>
          <div className='text-sm'>
            <div className='text-muted-foreground'>Pending Tasks</div>
            <div className='text-lg font-semibold'>{stats.pendingTasks}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='flex-1 flex flex-col min-h-0'>
        <div className='border-b px-4'>
          <TabsList>
            <TabsTrigger value='communications'>Communications</TabsTrigger>
            <TabsTrigger value='invoices'>Invoices</TabsTrigger>
            <TabsTrigger value='tasks'>Tasks</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className='flex-1 min-h-0'>
          <div className='p-4'>
            <TabsContent value='communications' className='mt-0'>
              <CommunicationInbox
                communications={communications}
                allCommunications={allCommunications}
                companyId={companyId}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </TabsContent>

            <TabsContent value='invoices' className='mt-0'>
              {invoices.length === 0 ? (
                <div className='flex h-full items-center justify-center p-12'>
                  <div className='text-center'>
                    <p className='text-muted-foreground'>No invoices found</p>
                  </div>
                </div>
              ) : (
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice Number</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className='text-right'>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className='font-mono font-medium'>
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell>{invoice.customerName}</TableCell>
                          <TableCell>{format(invoice.issueDate, 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{format(invoice.dueDate, 'MMM dd, yyyy')}</TableCell>
                          <TableCell className='text-right font-medium'>
                            ${invoice.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant='outline'
                              className={cn('text-sm', getStatusColor(invoice.status))}
                            >
                              {invoice.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value='tasks' className='mt-0'>
              {tasks.length === 0 ? (
                <div className='flex h-full items-center justify-center p-12'>
                  <div className='text-center'>
                    <CheckCircle2 className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
                    <p className='text-muted-foreground'>No tasks found</p>
                  </div>
                </div>
              ) : (
                <div className='space-y-3'>
                  {tasks.map((task) => {
                    const isCommTask = 'communicationId' in task
                    const priority = ('priority' in task ? task.priority : 'low') || 'low'
                    const status = task.status
                    const description = 'description' in task ? task.description : undefined
                    const dueDate = 'dueDate' in task ? task.dueDate : null

                    return (
                      <Card key={task.id} className='shadow-sm'>
                        <CardContent className='p-4'>
                          <div className='flex items-start justify-between gap-4'>
                            <div className='flex-1 space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h4 className='font-semibold text-base'>{task.title}</h4>
                                {isCommTask && (
                                  <Badge variant='outline' className='text-xs bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'>
                                    Comm
                                  </Badge>
                                )}
                              </div>
                              {description && (
                                <p className='text-sm text-muted-foreground line-clamp-2'>
                                  {description}
                                </p>
                              )}
                              <div className='flex items-center gap-3 flex-wrap'>
                                <Badge
                                  variant='outline'
                                  className={cn('text-xs', getTaskPriorityColor(priority))}
                                >
                                  {priority}
                                </Badge>
                                <Badge variant='outline' className='text-xs'>
                                  {status}
                                </Badge>
                                {dueDate && (
                                  <span className='text-xs text-muted-foreground'>
                                    Due: {format(dueDate, 'MMM dd, yyyy')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

