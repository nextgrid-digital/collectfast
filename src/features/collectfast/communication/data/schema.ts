export type Communication = {
  id: string
  customerName: string
  customerId: string
  type: 'email' | 'sms' | 'call' | 'reminder' | 'letter'
  subject: string
  message: string
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'scheduled'
  sentDate: Date
  scheduledDate: Date | null
  template: string | null
  relatedInvoiceId: string | null
  createdAt: Date
  updatedAt: Date
}

