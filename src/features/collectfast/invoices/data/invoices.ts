import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(54321)

const statuses = ['paid', 'overdue', 'due-soon', 'draft', 'sent'] as const

export const invoices = Array.from({ length: 300 }, () => {
  const issueDate = faker.date.past({ years: 1 })
  const dueDate = faker.date.between({
    from: issueDate,
    to: new Date(issueDate.getTime() + 90 * 24 * 60 * 60 * 1000), // Up to 90 days from issue date
  })
  const isPaid = faker.datatype.boolean({ probability: 0.4 })
  const status = isPaid
    ? 'paid'
    : dueDate < new Date()
      ? 'overdue'
      : faker.helpers.arrayElement(statuses)

  return {
    id: faker.string.uuid(),
    invoiceNumber: `INV-${faker.string.alphanumeric(6).toUpperCase()}`,
    customerName: `${faker.person.firstName()} ${faker.person.lastName()}`,
    customerId: faker.string.uuid(),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 10000, dec: 2 })),
    dueDate,
    issueDate,
    status,
    paidDate: isPaid ? faker.date.between({ from: issueDate, to: new Date() }) : null,
    createdAt: issueDate,
    updatedAt: faker.date.recent(),
  }
})

