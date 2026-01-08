import { useState, useMemo } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { Mail, Send, CheckCircle2, Clock, XCircle, Plus, ArrowLeft, Calendar, DollarSign, FileText, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { type Communication } from '../data/schema'
import { getCommunicationMetadata } from '../utils/communication-metadata'
import { generateTaskSuggestions } from '../utils/task-suggestions'
import { CommunicationTimeline } from './communication-timeline'
import { NotesSection, type Note } from './notes-section'
import { cn } from '@/lib/utils'
import { getInvoicesByCompany } from '@/data/mock/data-service'
import { toast } from 'sonner'

type CommunicationDetailProps = {
  communication: Communication | null
  allCommunications?: Communication[]
  onResend?: (id: string) => void
  onMarkAsRead?: (id: string) => void
  onScheduleFollowUp?: (id: string) => void
  onAddTask?: (suggestion: { title: string; description: string; dueDate: Date | null }) => void
  onAddNote?: (content: string) => void
  onSelectCommunication?: (id: string) => void
  onBackToList?: () => void
  onViewEntityContext?: () => void
  companyId?: string
}

// Mock related invoices data
const getRelatedInvoices = (invoiceId: string | null) => {
  if (!invoiceId) return []
  
  // Generate consistent invoices based on the invoice ID
  const age1 = 56
  const age2 = 78
  const age3 = 119
  
  return [
    {
      invoice: invoiceId,
      invDate: '2024-07-15',
      dueDate: '2024-08-15',
      originalAmount: 1000.0,
      balanceDue: 450.0,
      age: age1,
    },
    {
      invoice: `CF${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.random().toString(36).substring(2, 3).toUpperCase()}`,
      invDate: '2024-06-20',
      dueDate: '2024-07-20',
      originalAmount: 750.0,
      balanceDue: 750.0,
      age: age2,
    },
    {
      invoice: `CF${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.random().toString(36).substring(2, 3).toUpperCase()}`,
      invDate: '2024-05-10',
      dueDate: '2024-06-10',
      originalAmount: 500.0,
      balanceDue: 500.0,
      age: age3,
    },
  ]
}

export function CommunicationDetail({
  communication,
  allCommunications = [],
  onAddTask,
  onAddNote,
  onSelectCommunication,
  onBackToList,
  companyId,
}: CommunicationDetailProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [activeTab, setActiveTab] = useState('communication')
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false)
  const [showEscalateDialog, setShowEscalateDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [escalationReason, setEscalationReason] = useState('')

  if (!communication) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <Mail className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
          <p className='text-muted-foreground'>Select a communication to view details</p>
        </div>
      </div>
    )
  }

  const metadata = getCommunicationMetadata(communication, allCommunications)
  const taskSuggestions = generateTaskSuggestions(communication, metadata)
  const relatedInvoices = getRelatedInvoices(communication.relatedInvoiceId)

  // Get invoice data for overview
  const invoice = useMemo(() => {
    if (!communication.relatedInvoiceId || !companyId) return null
    const invoices = getInvoicesByCompany(companyId)
    return invoices.find((inv) => inv.invoiceNumber === communication.relatedInvoiceId) || null
  }, [communication.relatedInvoiceId, companyId])

  // Calculate invoice status details
  const invoiceStatus = useMemo(() => {
    if (!invoice) return null
    
    const now = new Date()
    const daysSinceDue = Math.floor((now.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysSinceIssue = Math.floor((now.getTime() - invoice.issueDate.getTime()) / (1000 * 60 * 60 * 24))
    
    let statusLabel: string = invoice.status
    let statusColor = 'bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400'
    
    if (invoice.status === 'paid') {
      statusLabel = 'Paid'
      statusColor = 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
    } else if (invoice.status === 'overdue') {
      statusLabel = `${daysSinceDue} days overdue`
      statusColor = 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
    } else if (invoice.status === 'due-soon') {
      statusLabel = `Due in ${Math.abs(daysSinceDue)} days`
      statusColor = 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400'
    } else if (invoice.status === 'sent') {
      statusLabel = 'Sent'
      statusColor = 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
    }
    
    return {
      label: statusLabel,
      color: statusColor,
      daysOverdue: daysSinceDue > 0 ? daysSinceDue : 0,
      daysSinceIssue,
    }
  }, [invoice])

  // Get status icon and color
  const getStatusConfig = (status: Communication['status']) => {
    switch (status) {
      case 'sent':
        return { icon: Send, color: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400', label: 'Sent' }
      case 'delivered':
        return { icon: CheckCircle2, color: 'bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400', label: 'Delivered' }
      case 'read':
        return { icon: CheckCircle2, color: 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400', label: 'Read' }
      case 'failed':
        return { icon: XCircle, color: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400', label: 'Failed' }
      case 'scheduled':
        return { icon: Clock, color: 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400', label: 'Scheduled' }
      default:
        return { icon: Send, color: 'bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400', label: 'Sent' }
    }
  }

  // Get related communications for timeline
  const relatedCommunications = allCommunications.filter(
    (comm) =>
      comm.customerId === communication.customerId &&
      (comm.relatedInvoiceId === communication.relatedInvoiceId || !communication.relatedInvoiceId)
  )

  const handleAddNote = (content: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content,
      author: 'Current User', // In real app, get from auth context
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setNotes([...notes, newNote])
    if (onAddNote) {
      onAddNote(content)
    }
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
  }

  const handleUpdateNote = (noteId: string, content: string) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? { ...note, content, updatedAt: new Date() }
          : note
      )
    )
  }

  // Email templates
  const emailTemplates = [
    {
      id: 'payment-reminder',
      name: 'Payment Reminder',
      subject: `Invoice ${invoice?.invoiceNumber || 'N/A'} – Payment Reminder`,
      message: invoice
        ? `Dear ${communication.customerName},

This is a friendly reminder that invoice ${invoice.invoiceNumber} for $${invoice.amount.toFixed(2)} is now ${invoiceStatus?.daysOverdue || 0} days overdue.

We kindly request that you arrange payment at your earliest convenience. If you have already made the payment, please disregard this message and provide us with your remittance advice.

Thank you for your attention to this matter.

Best regards,
Collections Team`
        : '',
    },
    {
      id: 'overdue-notice',
      name: 'Overdue Notice',
      subject: `Invoice ${invoice?.invoiceNumber || 'N/A'} – Overdue Notice`,
      message: invoice
        ? `Dear ${communication.customerName},

This is an overdue notice for invoice ${invoice.invoiceNumber} for $${invoice.amount.toFixed(2)}. This invoice is now ${invoiceStatus?.daysOverdue || 0} days overdue.

We require immediate payment to avoid further action. Please contact us immediately if you have any questions or concerns.

Thank you for your prompt attention to this matter.

Best regards,
Collections Team`
        : '',
    },
    {
      id: 'final-notice',
      name: 'Final Notice',
      subject: `Invoice ${invoice?.invoiceNumber || 'N/A'} – Final Notice`,
      message: invoice
        ? `Dear ${communication.customerName},

This is a final notice regarding invoice ${invoice.invoiceNumber} for $${invoice.amount.toFixed(2)}, which is now ${invoiceStatus?.daysOverdue || 0} days overdue.

We have made multiple attempts to collect this outstanding balance. If payment is not received within 7 days, we will be forced to take further action, which may include referring this matter to a collections agency.

Please contact us immediately to arrange payment.

Best regards,
Collections Team`
        : '',
    },
    {
      id: 'custom',
      name: 'Custom',
      subject: '',
      message: '',
    },
  ]

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = emailTemplates.find((t) => t.id === templateId)
    if (template) {
      setEmailSubject(template.subject)
      setEmailMessage(template.message)
    }
  }

  const handleSendFollowUp = () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Please fill in both subject and message')
      return
    }
    // In a real app, this would send the email
    toast.success('Follow-up email sent successfully')
    setShowFollowUpDialog(false)
    setSelectedTemplate('')
    setEmailSubject('')
    setEmailMessage('')
  }

  const handleEscalate = () => {
    if (!escalationReason.trim()) {
      toast.error('Please provide a reason for escalation')
      return
    }
    // In a real app, this would escalate the case
    toast.success('Case escalated successfully')
    setShowEscalateDialog(false)
    setEscalationReason('')
  }

  return (
    <div className='flex h-full flex-col bg-background'>
      {/* Sticky Header */}
      <div className='sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 flex-shrink-0'>
        <div className='p-5'>
          {/* Back Button */}
          {onBackToList && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onBackToList}
              className='gap-2'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to List
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Overview */}
      {invoice && invoiceStatus && (
        <div className='border-b bg-muted/30'>
          <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <Card>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <FileText className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm text-muted-foreground'>Invoice Number</span>
                  </div>
                  <div className='text-lg font-semibold text-foreground'>{invoice.invoiceNumber}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <DollarSign className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm text-muted-foreground'>Amount</span>
                  </div>
                  <div className='text-lg font-semibold text-foreground'>${invoice.amount.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm text-muted-foreground'>Due Date</span>
                  </div>
                  <div className='text-lg font-semibold text-foreground'>
                    {format(invoice.dueDate, 'MMM d, yyyy')}
                  </div>
                  {invoiceStatus.daysOverdue > 0 && (
                    <div className='text-xs text-red-600 dark:text-red-400 mt-1'>
                      {invoiceStatus.daysOverdue} days overdue
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <CheckCircle2 className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm text-muted-foreground'>Status</span>
                  </div>
                  <Badge variant='outline' className={cn('text-sm font-medium px-2.5 py-1', invoiceStatus.color)}>
                    {invoiceStatus.label}
                  </Badge>
                  {invoice.paidDate && (
                    <div className='text-xs text-muted-foreground mt-1'>
                      Paid on {format(invoice.paidDate, 'MMM d, yyyy')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            {invoice.issueDate && (
              <div className='mt-4 text-sm text-muted-foreground'>
                <span className='font-medium'>Issued:</span> {format(invoice.issueDate, 'MMMM d, yyyy')} 
                {' • '}
                <span className='font-medium'>Age:</span> {invoiceStatus.daysSinceIssue} days
              </div>
            )}
          </div>
        </div>
      )}

      {/* Follow-up Email Sheet */}
      <Sheet open={showFollowUpDialog} onOpenChange={setShowFollowUpDialog}>
        <SheetContent side='right' className='w-full sm:max-w-2xl overflow-hidden flex flex-col p-0'>
          <SheetHeader className='flex-shrink-0 border-b bg-muted/30 px-6 py-5'>
            <div className='flex items-start justify-between gap-4 mb-3'>
              <SheetTitle className='text-xl font-bold leading-tight pr-8'>Send Follow-up Email</SheetTitle>
            </div>
            <div className='text-sm text-muted-foreground'>
              Select a template and customize the email before sending
            </div>
          </SheetHeader>

          <ScrollArea className='flex-1'>
            <div className='px-6 py-6 space-y-6'>
              {/* Template Selection */}
              <div className='space-y-2'>
                <Label htmlFor='template-select' className='text-sm font-semibold'>Email Template</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger id='template-select' className='w-full'>
                    <SelectValue placeholder='Select a template' />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Email Metadata */}
              <div className='space-y-3 pb-6 border-b'>
                <div className='flex items-start gap-4'>
                  <div className='w-20 shrink-0 text-sm font-semibold text-muted-foreground'>From:</div>
                  <div className='flex-1 text-sm text-foreground'>admin@ses.collectfast.ai</div>
                </div>
                {invoice && (
                  <div className='flex items-start gap-4'>
                    <div className='w-20 shrink-0 text-sm font-semibold text-muted-foreground'>Invoice:</div>
                    <div className='flex-1'>
                      <Badge variant='outline' className='font-mono text-sm px-2 py-0.5'>
                        {invoice.invoiceNumber}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Subject */}
              <div className='space-y-2'>
                <Label htmlFor='email-subject' className='text-sm font-semibold'>Subject</Label>
                <Input
                  id='email-subject'
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder='Email subject'
                  className='w-full'
                />
              </div>

              {/* Message */}
              <div className='space-y-2'>
                <Label htmlFor='email-message' className='text-sm font-semibold'>Message</Label>
                <Textarea
                  id='email-message'
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder='Email message'
                  rows={15}
                  className='font-normal text-[15px] leading-relaxed'
                />
              </div>
            </div>
          </ScrollArea>

          {/* Footer with Actions */}
          <div className='flex-shrink-0 border-t bg-muted/30 px-6 py-4'>
            <div className='flex items-center justify-end gap-3'>
              <Button variant='outline' onClick={() => setShowFollowUpDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendFollowUp} className='gap-2'>
                <Send className='h-4 w-4' />
                Send Email
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Escalate Dialog */}
      <Dialog open={showEscalateDialog} onOpenChange={setShowEscalateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escalate Case</DialogTitle>
            <DialogDescription>
              Escalate this invoice to a higher level for review and action
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='escalation-reason'>Reason for Escalation</Label>
              <Textarea
                id='escalation-reason'
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder='Please provide details about why this case needs to be escalated...'
                rows={6}
              />
            </div>
            {invoice && (
              <div className='rounded-lg border bg-muted/30 p-4 space-y-2 text-sm'>
                <div className='font-semibold'>Invoice Details</div>
                <div>Invoice: {invoice.invoiceNumber}</div>
                <div>Amount: ${invoice.amount.toFixed(2)}</div>
                <div>Customer: {communication.customerName}</div>
                {invoiceStatus && (
                  <div>Days Overdue: {invoiceStatus.daysOverdue}</div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowEscalateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEscalate} variant='destructive' className='gap-2'>
              <AlertTriangle className='h-4 w-4' />
              Escalate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content */}
      <div className='flex-1 overflow-auto min-h-0'>
        <div className='p-6'>
          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <div className='flex items-center justify-between mb-6'>
              <TabsList>
                <TabsTrigger value='communication'>Communication</TabsTrigger>
                <TabsTrigger value='timeline'>Timeline</TabsTrigger>
                <TabsTrigger value='notes'>Notes</TabsTrigger>
              </TabsList>
              {invoice && (
                <div className='flex items-center gap-3'>
                  <Button
                    onClick={() => setShowFollowUpDialog(true)}
                    className='gap-2'
                  >
                    <Send className='h-4 w-4' />
                    Send Follow-up Email
                  </Button>
                  <Button
                    onClick={() => setShowEscalateDialog(true)}
                    variant='outline'
                    className='gap-2'
                  >
                    <AlertTriangle className='h-4 w-4' />
                    Escalate
                  </Button>
                </div>
              )}
            </div>

          <TabsContent value='communication' className='space-y-6'>
            {/* Thread list: compact view of all emails */}
            <div className='space-y-2'>
              {[communication, ...relatedCommunications.filter((c) => c.id !== communication.id)]
                .sort((a, b) => b.sentDate.getTime() - a.sentDate.getTime())
                .map((comm) => {
                  const commStatusConfig = getStatusConfig(comm.status)
                  const CommStatusIcon = commStatusConfig.icon
                  return (
                    <div
                      key={comm.id}
                      onClick={() => setSelectedThreadId(comm.id)}
                      className={cn(
                        'border rounded-lg p-4 bg-background cursor-pointer transition-colors hover:bg-muted/50',
                        comm.id === communication.id && 'ring-1 ring-primary/40',
                        selectedThreadId === comm.id && 'bg-muted'
                      )}
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex-1 min-w-0 space-y-1'>
                          <div className='flex items-center gap-2'>
                            <Mail className='h-4 w-4 text-muted-foreground shrink-0' />
                            <span className='font-semibold text-sm text-foreground truncate'>
                              {comm.subject}
                            </span>
                          </div>
                          <div className='text-xs text-muted-foreground line-clamp-2'>
                            {comm.message.substring(0, 150)}
                            {comm.message.length > 150 && '...'}
                          </div>
                          <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                            <span>{format(comm.sentDate, 'MMM d, yyyy h:mm a')}</span>
                            {comm.relatedInvoiceId && (
                              <>
                                <span>•</span>
                                <span className='font-mono'>{comm.relatedInvoiceId}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className='flex items-center gap-2 shrink-0'>
                          <Badge
                            variant='outline'
                            className={cn('text-xs px-2 py-0.5', commStatusConfig.color)}
                          >
                            <CommStatusIcon className='h-3 w-3 mr-1' />
                            {commStatusConfig.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>

            {/* Task Suggestions */}
            {taskSuggestions.length > 0 && (
              <div className='space-y-3 p-5 border rounded-lg bg-muted/50'>
                <div className='font-semibold text-base'>Suggested Tasks</div>
                {taskSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className='flex items-center justify-between p-3 border rounded-lg bg-background'
                  >
                    <div className='flex-1'>
                      <div className='text-base font-medium'>{suggestion.title}</div>
                      <div className='text-sm text-muted-foreground mt-1'>
                        {suggestion.description}
                      </div>
                    </div>
                    {onAddTask && (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => onAddTask({
                          title: suggestion.title,
                          description: suggestion.description,
                          dueDate: suggestion.dueDate,
                        })}
                        className='ml-3'
                      >
                        <Plus className='h-4 w-4 mr-1.5' />
                        Add
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Related Invoices Table */}
            {relatedInvoices.length > 0 && (
              <div className='space-y-4'>
                <div className='font-semibold text-base'>Related Invoices</div>
                <div className='rounded-lg border overflow-hidden'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='font-semibold'>Invoice</TableHead>
                        <TableHead className='font-semibold'>Inv Date</TableHead>
                        <TableHead className='font-semibold'>Due Date</TableHead>
                        <TableHead className='text-right font-semibold'>Original Amount</TableHead>
                        <TableHead className='text-right font-semibold'>Balance Due</TableHead>
                        <TableHead className='font-semibold'>Age</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatedInvoices.map((invoice, idx) => (
                        <TableRow
                          key={idx}
                          className='cursor-pointer hover:bg-muted/50 transition-colors'
                          onClick={() => {
                            // Navigate to invoice - in real app, use router
                            console.log('Navigate to invoice:', invoice.invoice)
                          }}
                        >
                          <TableCell className='font-mono text-sm font-medium'>
                            {invoice.invoice}
                          </TableCell>
                          <TableCell className='text-sm'>{invoice.invDate}</TableCell>
                          <TableCell className='text-sm'>{invoice.dueDate}</TableCell>
                          <TableCell className='text-right text-sm'>
                            ${invoice.originalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className='text-right font-semibold text-base'>
                            ${invoice.balanceDue.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                'text-sm font-medium',
                                invoice.age > 30
                                  ? 'text-red-600 dark:text-red-400'
                                  : invoice.age > 15
                                    ? 'text-orange-600 dark:text-orange-400'
                                    : 'text-muted-foreground'
                              )}
                            >
                              {invoice.age} days
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value='timeline' className='space-y-6'>
            {relatedCommunications.length > 0 ? (
              <CommunicationTimeline
                communications={relatedCommunications}
                currentCommunicationId={communication.id}
                onSelect={(id) => {
                  if (onSelectCommunication) {
                    onSelectCommunication(id)
                  }
                }}
              />
            ) : (
              <div className='text-center py-12 text-base text-muted-foreground'>
                No related communications found.
              </div>
            )}
          </TabsContent>

          <TabsContent value='notes' className='space-y-6'>
            <NotesSection
              communicationId={communication.id}
              notes={notes}
              initialIsAdding={isAddingNote}
              onAddingStateChange={setIsAddingNote}
              onAddNote={(content) => {
                handleAddNote(content)
                setIsAddingNote(false)
              }}
              onDeleteNote={handleDeleteNote}
              onUpdateNote={handleUpdateNote}
            />
          </TabsContent>
        </Tabs>
        </div>
      </div>

      {/* Email Thread Sidebar */}
      <Sheet open={selectedThreadId !== null} onOpenChange={(open) => !open && setSelectedThreadId(null)}>
        <SheetContent side='right' className='w-full sm:max-w-2xl overflow-hidden flex flex-col p-0'>
          {selectedThreadId && (() => {
            const selectedComm = [communication, ...relatedCommunications].find((c) => c.id === selectedThreadId)
            if (!selectedComm) return null

            const selectedStatusConfig = getStatusConfig(selectedComm.status)
            const SelectedStatusIcon = selectedStatusConfig.icon

            return (
              <>
                <SheetHeader className='flex-shrink-0 border-b bg-muted/30 px-6 py-5'>
                  <div className='flex items-start justify-between gap-4 mb-3'>
                    <SheetTitle className='text-xl font-bold leading-tight pr-8'>{selectedComm.subject}</SheetTitle>
                  </div>
                  <div className='flex items-center gap-3 flex-wrap'>
                    <Badge
                      variant='outline'
                      className={cn('text-xs px-2.5 py-1', selectedStatusConfig.color)}
                    >
                      <SelectedStatusIcon className='h-3 w-3 mr-1.5' />
                      {selectedStatusConfig.label}
                    </Badge>
                    <span className='text-xs text-muted-foreground font-medium'>
                      {formatDistanceToNow(selectedComm.sentDate, { addSuffix: true })}
                    </span>
                  </div>
                </SheetHeader>

                <ScrollArea className='flex-1'>
                  <div className='px-6 py-6'>
                    {/* Email Metadata */}
                    <div className='space-y-3 pb-6 border-b mb-6'>
                      <div className='flex items-start gap-4'>
                        <div className='w-20 shrink-0 text-sm font-semibold text-muted-foreground'>From:</div>
                        <div className='flex-1 text-sm text-foreground'>admin@ses.collectfast.ai</div>
                      </div>
                      <div className='flex items-start gap-4'>
                        <div className='w-20 shrink-0 text-sm font-semibold text-muted-foreground'>Sent:</div>
                        <div className='flex-1 text-sm text-foreground'>
                          {format(selectedComm.sentDate, 'EEEE, MMMM d, yyyy')} at {format(selectedComm.sentDate, 'h:mm a')}
                        </div>
                      </div>
                      {selectedComm.relatedInvoiceId && (
                        <div className='flex items-start gap-4'>
                          <div className='w-20 shrink-0 text-sm font-semibold text-muted-foreground'>Invoice:</div>
                          <div className='flex-1'>
                            <Badge variant='outline' className='font-mono text-sm px-2 py-0.5'>
                              {selectedComm.relatedInvoiceId}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Email Body */}
                    <div className='space-y-4'>
                      <div className='text-foreground whitespace-pre-wrap leading-relaxed text-[15px] font-normal'>
                        {selectedComm.message}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </>
            )
          })()}
        </SheetContent>
      </Sheet>
    </div>
  )
}

