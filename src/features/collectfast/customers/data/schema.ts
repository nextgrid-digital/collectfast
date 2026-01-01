export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  totalOutstanding: number
  invoiceCount: number
  status: 'active' | 'inactive' | 'overdue' | 'on-hold'
  lastPaymentDate: Date | null
  createdAt: Date
  updatedAt: Date
}

