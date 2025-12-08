import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(98765)

const types = ['email', 'sms', 'call', 'reminder', 'letter'] as const
const statuses = ['sent', 'delivered', 'read', 'failed', 'scheduled'] as const
const templates = [
  'Payment Reminder',
  'Overdue Notice',
  'Thank You',
  'Invoice Sent',
  'Payment Received',
  null,
] as const

export const communications = Array.from({ length: 250 }, () => {
  const type = faker.helpers.arrayElement(types)
  const status = faker.helpers.arrayElement(statuses)
  const sentDate = faker.date.recent({ days: 60 })
  const isScheduled = status === 'scheduled'
  const scheduledDate = isScheduled
    ? faker.date.soon({ days: 30 }) // Within 30 days from now
    : null

  return {
    id: faker.string.uuid(),
    customerName: `${faker.person.firstName()} ${faker.person.lastName()}`,
    customerId: faker.string.uuid(),
    type,
    subject: faker.helpers.arrayElement([
      'Payment Reminder - Invoice #INV-001',
      'Overdue Payment Notice',
      'Thank you for your payment',
      'Invoice #INV-002 has been sent',
      'Payment Confirmation',
      'Payment Request',
      'Account Statement',
    ]),
    message: faker.lorem.paragraph({ min: 2, max: 4 }),
    status,
    sentDate: isScheduled ? new Date() : sentDate,
    scheduledDate,
    template: faker.helpers.arrayElement(templates),
    relatedInvoiceId: faker.datatype.boolean({ probability: 0.7 })
      ? `INV-${faker.string.alphanumeric(6).toUpperCase()}`
      : null,
    createdAt: sentDate,
    updatedAt: faker.date.recent(),
  }
})

