import { format } from 'date-fns'
import { Mail, Plus } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type Communication } from '../data/schema'

type CommunicationDetailProps = {
  communication: Communication | null
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

export function CommunicationDetail({ communication }: CommunicationDetailProps) {
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

  const relatedInvoices = getRelatedInvoices(communication.relatedInvoiceId)
  const customerInitials = communication.customerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Extract customer email from name
  const customerEmail = `${communication.customerName.toLowerCase().replace(/\s+/g, '.')}@email.com`

  return (
    <div className='flex h-full flex-col bg-background'>
      {/* Header */}
      <div className='border-b p-6 flex-shrink-0'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-10 w-10'>
              <AvatarFallback>{customerInitials}</AvatarFallback>
            </Avatar>
            <div>
              <div className='font-semibold text-lg'>{communication.customerName}</div>
              <div className='text-sm text-muted-foreground'>
                {customerEmail}
              </div>
            </div>
          </div>
          <div className='text-sm text-muted-foreground'>
            {format(communication.sentDate, 'MMM dd, yyyy')}
          </div>
        </div>

        {/* Tabs and Action Button */}
        <div className='flex items-center justify-between'>
          <Tabs defaultValue='communication' className='w-auto'>
            <TabsList>
              <TabsTrigger value='communication'>Communication</TabsTrigger>
              <TabsTrigger value='notes'>Notes</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Draft an Email
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-auto p-6 min-h-0'>
        <Tabs defaultValue='communication' className='w-full'>
          <TabsContent value='communication' className='space-y-6 mt-0'>
            {/* Email Content */}
            <div className='space-y-4'>
              <div className='space-y-1 text-sm'>
                <div className='text-muted-foreground'>
                  From: admin@ses.collectfast.ai
                </div>
                <div className='text-muted-foreground'>
                  Sent: {format(communication.sentDate, 'M/d/yyyy, h:mm:ss a')}
                </div>
              </div>

              <div className='space-y-3'>
                <div className='font-semibold text-base'>{communication.subject}</div>
                <div className='text-foreground whitespace-pre-wrap leading-relaxed text-sm'>
                  {communication.message}
                </div>
              </div>
            </div>

            {/* Related Invoices Table */}
            {relatedInvoices.length > 0 && (
              <div className='space-y-4'>
                <div className='font-semibold'>Related Invoices</div>
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Inv Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className='text-right'>Original Invoice Amount</TableHead>
                        <TableHead className='text-right'>Balance Due</TableHead>
                        <TableHead>Age</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatedInvoices.map((invoice, idx) => (
                        <TableRow key={idx}>
                          <TableCell className='font-mono text-sm font-medium'>
                            {invoice.invoice}
                          </TableCell>
                          <TableCell>{invoice.invDate}</TableCell>
                          <TableCell>{invoice.dueDate}</TableCell>
                          <TableCell className='text-right'>
                            ${invoice.originalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className='text-right font-medium'>
                            ${invoice.balanceDue.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {invoice.age} days
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value='notes' className='mt-0'>
            <div className='text-muted-foreground'>
              Notes feature coming soon. Add notes about this communication here.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

