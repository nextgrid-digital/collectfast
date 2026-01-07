import { type Communication } from '../data/schema'
import { getInvoicesByCompany } from '@/data/mock/data-service'

/**
 * Determine the entity type and ID from a communication
 * Always navigate to the most detailed page:
 * - If communication has relatedInvoiceId, find matching invoice (or first invoice for customer)
 * - Otherwise, navigate to customer page
 */
export function getEntityFromCommunication(
  comm: Communication,
  companyId: string
): {
  type: 'invoice' | 'customer'
  id: string
} {
  try {
    const invoices = getInvoicesByCompany(companyId)
    
    // If communication has a relatedInvoiceId, try to find matching invoice
    if (comm.relatedInvoiceId) {
      // Try exact match first
      let matchingInvoice = invoices.find(
        (inv) => inv.invoiceNumber === comm.relatedInvoiceId
      )
      
      if (matchingInvoice) {
        console.log(`Found exact invoice match: ${matchingInvoice.invoiceNumber} for communication ${comm.id}`)
        return { type: 'invoice', id: matchingInvoice.invoiceNumber }
      }
      
      // If no exact match, find invoices for the same customer
      // This ensures we always navigate to an actual invoice page
      const customerInvoices = invoices.filter(
        (inv) => inv.customerName === comm.customerName
      )
      
      if (customerInvoices.length > 0) {
        // Use the first invoice for this customer
        matchingInvoice = customerInvoices[0]
        console.log(`Found customer invoice match: ${matchingInvoice.invoiceNumber} for communication ${comm.id}`)
        return { type: 'invoice', id: matchingInvoice.invoiceNumber }
      }
      
      console.warn(`No invoice found for relatedInvoiceId: ${comm.relatedInvoiceId}, falling back to customer`)
    }
    
    // If no invoice found, try to find any invoice for this customer
    // This ensures we navigate to the most detailed page (invoice > customer)
    const customerInvoices = invoices.filter(
      (inv) => inv.customerName === comm.customerName
    )
    
    if (customerInvoices.length > 0) {
      // Navigate to the first invoice for this customer
      console.log(`Found ${customerInvoices.length} invoices for customer ${comm.customerName}, using first one`)
      return { type: 'invoice', id: customerInvoices[0].invoiceNumber }
    }
    
    // No invoice found, navigate to customer page
    console.log(`No invoice found, navigating to customer: ${comm.customerId}`)
    return { type: 'customer', id: comm.customerId }
  } catch (error) {
    console.error('Error in getEntityFromCommunication:', error)
    // Fallback to customer if anything goes wrong
    return { type: 'customer', id: comm.customerId }
  }
}

/**
 * Generate the route path for an entity
 */
export function getEntityRoute(entityType: 'invoice' | 'customer', entityId: string): string {
  return `/app/communication/${entityType}/${entityId}`
}

