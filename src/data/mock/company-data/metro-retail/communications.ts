import { type Communication } from '@/features/collectfast/communication/data/schema'
import { metroRetailInvoices } from './invoices'

const daysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

const addDays = (date: Date, days: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

const generateInvoiceSentMessage = (customer: string, invoice: string, amount: number, dueDate: Date) => {
  return `Dear ${customer},

Your invoice ${invoice} for $${amount.toFixed(2)} has been sent. Payment is due on ${dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.

Please arrange payment by the due date to avoid any late fees.

Thank you for your business.

Best regards,
Metro Retail Group Collections Team`
}

const generateReminderMessage = (customer: string, invoice: string, amount: number, daysOverdue: number, reminderNumber: number) => {
  const ordinal = reminderNumber === 1 ? '1st' : reminderNumber === 2 ? '2nd' : '3rd'
  return `Dear ${customer},

This is your ${ordinal} reminder that invoice ${invoice} for $${amount.toFixed(2)} is now ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue.

We kindly request that you arrange payment at your earliest convenience. If you have already made the payment, please disregard this message and provide us with your remittance advice.

If you have any questions or concerns, please contact us immediately.

Thank you for your attention to this matter.

Best regards,
Metro Retail Group Collections Team`
}

function generateCommunicationsForInvoice(
  invoice: typeof metroRetailInvoices[0],
  prefix: string
): Communication[] {
  const comms: Communication[] = []
  const now = new Date()
  const daysSinceDue = Math.floor((now.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))

  // 1. Invoice sent email (on due date)
  comms.push({
    id: `${prefix}-inv-sent-${invoice.invoiceNumber}`,
    customerName: invoice.customerName,
    customerId: invoice.customerId,
    type: 'email',
    subject: `Invoice ${invoice.invoiceNumber} – Payment Due`,
    message: generateInvoiceSentMessage(invoice.customerName, invoice.invoiceNumber, invoice.amount, invoice.dueDate),
    status: 'read',
    sentDate: invoice.dueDate,
    scheduledDate: null,
    template: 'Invoice Sent',
    relatedInvoiceId: invoice.invoiceNumber,
    createdAt: invoice.dueDate,
    updatedAt: invoice.dueDate,
  })

  // Only generate reminders if invoice is overdue
  if (daysSinceDue > 0 && invoice.status !== 'paid') {
    // 1st reminder (7 days after due date)
    if (daysSinceDue >= 7) {
      const firstReminderDate = addDays(invoice.dueDate, 7)
      const daysOverdueAtFirstReminder = 7 // Days overdue at the time this reminder was sent
      comms.push({
        id: `${prefix}-reminder-1-${invoice.invoiceNumber}`,
        customerName: invoice.customerName,
        customerId: invoice.customerId,
        type: 'email',
        subject: `Invoice ${invoice.invoiceNumber} – 1st Reminder (${daysOverdueAtFirstReminder} days overdue)`,
        message: generateReminderMessage(invoice.customerName, invoice.invoiceNumber, invoice.amount, daysOverdueAtFirstReminder, 1),
        status: daysSinceDue <= 14 ? 'delivered' : 'read',
        sentDate: firstReminderDate,
        scheduledDate: null,
        template: 'Payment Reminder',
        relatedInvoiceId: invoice.invoiceNumber,
        createdAt: firstReminderDate,
        updatedAt: firstReminderDate,
      })
    }

    // 2nd reminder (15 days after due date)
    if (daysSinceDue >= 15) {
      const secondReminderDate = addDays(invoice.dueDate, 15)
      const daysOverdueAtSecondReminder = 15 // Days overdue at the time this reminder was sent
      comms.push({
        id: `${prefix}-reminder-2-${invoice.invoiceNumber}`,
        customerName: invoice.customerName,
        customerId: invoice.customerId,
        type: 'email',
        subject: `Invoice ${invoice.invoiceNumber} – 2nd Reminder (${daysOverdueAtSecondReminder} days overdue)`,
        message: generateReminderMessage(invoice.customerName, invoice.invoiceNumber, invoice.amount, daysOverdueAtSecondReminder, 2),
        status: daysSinceDue <= 25 ? 'delivered' : daysSinceDue <= 30 ? 'read' : 'failed',
        sentDate: secondReminderDate,
        scheduledDate: null,
        template: 'Overdue Notice',
        relatedInvoiceId: invoice.invoiceNumber,
        createdAt: secondReminderDate,
        updatedAt: secondReminderDate,
      })
    }

    // 3rd reminder (30 days after due date)
    if (daysSinceDue >= 30) {
      const thirdReminderDate = addDays(invoice.dueDate, 30)
      const daysOverdueAtThirdReminder = 30 // Days overdue at the time this reminder was sent
      comms.push({
        id: `${prefix}-reminder-3-${invoice.invoiceNumber}`,
        customerName: invoice.customerName,
        customerId: invoice.customerId,
        type: 'email',
        subject: `Invoice ${invoice.invoiceNumber} – 3rd Reminder (${daysOverdueAtThirdReminder} days overdue)`,
        message: generateReminderMessage(invoice.customerName, invoice.invoiceNumber, invoice.amount, daysOverdueAtThirdReminder, 3),
        status: daysSinceDue <= 45 ? 'sent' : 'failed',
        sentDate: thirdReminderDate,
        scheduledDate: null,
        template: 'Overdue Notice',
        relatedInvoiceId: invoice.invoiceNumber,
        createdAt: thirdReminderDate,
        updatedAt: thirdReminderDate,
      })
    }
  }

  return comms
}

export const metroRetailCommunications: Communication[] = metroRetailInvoices.flatMap((invoice) =>
  generateCommunicationsForInvoice(invoice, 'mr')
)
