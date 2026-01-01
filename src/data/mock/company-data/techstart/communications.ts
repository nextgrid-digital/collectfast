import { faker } from '@faker-js/faker'
import { format } from 'date-fns'
import { type Communication } from '@/features/collectfast/communication/data/schema'

// Set a fixed seed for consistent data generation
faker.seed(33333)

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

const generatePaymentReminderMessage = (
  customerName: string,
  invoiceNumber: string,
  invoiceDate: string,
  amount: number,
  dueDate: string,
  daysOverdue: number
) => {
  if (daysOverdue > 0) {
    return `Dear ${customerName}, I hope this message finds you well.

This is a reminder that the remaining balance of $${amount.toFixed(2)} for invoice ${invoiceNumber}, dated ${invoiceDate}, is now overdue. We had agreed on a payment date of ${dueDate}, which has unfortunately passed without receipt of the payment.

We kindly request that you arrange for the immediate payment of the outstanding balance to avoid any further action.

For your reference, the payment details are as follows:
- Invoice Number: ${invoiceNumber}
- Invoice Date: ${invoiceDate}
- Outstanding Amount: $${amount.toFixed(2)}

If you have already made the payment, please disregard this message and let us know the details of the transaction. Otherwise, we would appreciate your prompt attention to this matter.

Thank you for your cooperation.

Best regards,
TechStart Inc. Team`
  }

  return `Dear ${customerName}, I hope this message finds you well.

We are writing to remind you that your invoice ${invoiceNumber}, dated ${invoiceDate}, is now ${daysOverdue} days overdue. The total amount due is $${amount.toFixed(2)}.

Please arrange for payment at your earliest convenience to avoid any further action.

Thank you for your attention to this matter.

Best regards,
TechStart Inc. Team`
}

export const techstartCommunications: Communication[] = Array.from(
  { length: 120 },
  () => {
    const type = faker.helpers.arrayElement(types)
    const status = faker.helpers.arrayElement(statuses)
    const sentDate = faker.date.recent({ days: 60 })
    const isScheduled = status === 'scheduled'
    const scheduledDate = isScheduled ? faker.date.soon({ days: 30 }) : null

    const customerName = `${faker.person.firstName()} ${faker.person.lastName()}`
    const invoiceNumber = faker.datatype.boolean({ probability: 0.7 })
      ? `TS${faker.string.alphanumeric(5).toUpperCase()}`
      : null
    const invoiceDate = faker.date.past({ years: 1 })
    const dueDate = faker.date.between({
      from: invoiceDate,
      to: new Date(invoiceDate.getTime() + 90 * 24 * 60 * 60 * 1000),
    })
    const amount = parseFloat(faker.finance.amount({ min: 200, max: 5000, dec: 2 }))
    const daysOverdue = Math.max(
      0,
      Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
    )

    const subject = invoiceNumber
      ? `Dear ${customerName}, I hope this message finds you well.`
      : faker.helpers.arrayElement([
          'Payment Reminder',
          'Overdue Payment Notice',
          'Thank you for your payment',
          'Payment Confirmation',
        ])

    const message = invoiceNumber
      ? generatePaymentReminderMessage(
          customerName,
          invoiceNumber,
          format(invoiceDate, 'MMMM d, yyyy'),
          amount,
          format(dueDate, 'MMMM d, yyyy'),
          daysOverdue
        )
      : faker.lorem.paragraph({ min: 2, max: 4 })

    return {
      id: faker.string.uuid(),
      customerName,
      customerId: faker.string.uuid(),
      type,
      subject,
      message,
      status,
      sentDate: isScheduled ? new Date() : sentDate,
      scheduledDate,
      template: faker.helpers.arrayElement(templates),
      relatedInvoiceId: invoiceNumber,
      createdAt: sentDate,
      updatedAt: faker.date.recent(),
    }
  }
)

