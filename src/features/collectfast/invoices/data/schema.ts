export type Invoice = {
  id: string
  invoiceNumber: string
  customerName: string
  customerId: string
  amount: number
  dueDate: Date
  issueDate: Date
  status: 'paid' | 'overdue' | 'due-soon' | 'draft' | 'sent'
  paidDate: Date | null
  createdAt: Date
  updatedAt: Date
}

