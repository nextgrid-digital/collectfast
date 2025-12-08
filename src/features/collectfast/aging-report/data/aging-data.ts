import { faker } from '@faker-js/faker'
import { type AgingReportItem, type AgingBucket } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(11111)

function getAgingBucket(daysOverdue: number): AgingBucket {
  if (daysOverdue <= 30) return '0-30'
  if (daysOverdue <= 60) return '31-60'
  if (daysOverdue <= 90) return '61-90'
  return '90+'
}

export const agingReportData: AgingReportItem[] = Array.from({ length: 150 }, () => {
  const invoiceDate = faker.date.past({ years: 1 })
  const dueDate = faker.date.between({
    from: invoiceDate,
    to: new Date(invoiceDate.getTime() + 90 * 24 * 60 * 60 * 1000), // Up to 90 days from invoice date
  })
  const now = new Date()
  const daysOverdue = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)))
  const amount = parseFloat(faker.finance.amount({ min: 500, max: 15000, dec: 2 }))
  const agingBucket = getAgingBucket(daysOverdue)

  return {
    id: faker.string.uuid(),
    customerName: `${faker.person.firstName()} ${faker.person.lastName()}`,
    customerId: faker.string.uuid(),
    invoiceNumber: `INV-${faker.string.alphanumeric(6).toUpperCase()}`,
    invoiceDate,
    dueDate,
    amount,
    daysOverdue,
    agingBucket,
    totalOutstanding: amount,
  }
})

// Calculate summary totals
export const agingSummary = {
  '0-30': agingReportData
    .filter((item) => item.agingBucket === '0-30')
    .reduce((sum, item) => sum + item.amount, 0),
  '31-60': agingReportData
    .filter((item) => item.agingBucket === '31-60')
    .reduce((sum, item) => sum + item.amount, 0),
  '61-90': agingReportData
    .filter((item) => item.agingBucket === '61-90')
    .reduce((sum, item) => sum + item.amount, 0),
  '90+': agingReportData
    .filter((item) => item.agingBucket === '90+')
    .reduce((sum, item) => sum + item.amount, 0),
}

