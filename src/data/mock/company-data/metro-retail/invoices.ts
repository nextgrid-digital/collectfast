import { faker } from '@faker-js/faker'
import { type Invoice } from '@/features/collectfast/invoices/data/schema'

// Set a fixed seed for consistent data generation
faker.seed(101010)

const statuses = ['paid', 'overdue', 'due-soon', 'draft', 'sent'] as const

export const metroRetailInvoices: Invoice[] = Array.from({ length: 78 }, () => {
  const issueDate = faker.date.past({ years: 1 })
  const dueDate = faker.date.between({
    from: issueDate,
    to: new Date(issueDate.getTime() + 90 * 24 * 60 * 60 * 1000),
  })
  const isPaid = faker.datatype.boolean({ probability: 0.3 })
  const status = isPaid
    ? 'paid'
    : dueDate < new Date()
      ? 'overdue'
      : faker.helpers.arrayElement(statuses)

  return {
    id: faker.string.uuid(),
    invoiceNumber: `MR-${faker.string.alphanumeric(6).toUpperCase()}`,
    customerName: `${faker.person.firstName()} ${faker.person.lastName()}`,
    customerId: faker.string.uuid(),
    amount: parseFloat(faker.finance.amount({ min: 200, max: 20000, dec: 2 })),
    dueDate,
    issueDate,
    status,
    paidDate: isPaid ? faker.date.between({ from: issueDate, to: new Date() }) : null,
    createdAt: issueDate,
    updatedAt: faker.date.recent(),
  }
})

