export type AgingBucket = '0-30' | '31-60' | '61-90' | '90+'

export type AgingReportItem = {
  id: string
  customerName: string
  customerId: string
  invoiceNumber: string
  invoiceDate: Date
  dueDate: Date
  amount: number
  daysOverdue: number
  agingBucket: AgingBucket
  totalOutstanding: number
}

