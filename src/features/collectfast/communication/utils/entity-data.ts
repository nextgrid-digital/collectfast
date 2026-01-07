import { type Communication } from '../data/schema'
import { type Invoice } from '@/features/collectfast/invoices/data/schema'
import { type Task } from '@/features/tasks/data/schema'
import { type CommunicationTask } from './communication-tasks'
import { getInvoicesByCompany, getCustomersByCompany } from '@/data/mock/data-service'
import { tasks } from '@/features/tasks/data/tasks'
import { generateCommunicationTasks } from './communication-tasks'

/**
 * Get all communications for a specific entity (invoice or customer)
 */
export function getCommunicationsByEntity(
  allCommunications: Communication[],
  entityType: 'invoice' | 'customer',
  entityId: string
): Communication[] {
  if (entityType === 'invoice') {
    // Filter by relatedInvoiceId matching the invoice number
    const filtered = allCommunications.filter((comm) => comm.relatedInvoiceId === entityId)
    console.log(`Found ${filtered.length} communications for invoice ${entityId}`)
    return filtered
  } else {
    // entityType === 'customer'
    // Filter by customerId
    const filtered = allCommunications.filter((comm) => comm.customerId === entityId)
    console.log(`Found ${filtered.length} communications for customer ${entityId}`)
    return filtered
  }
}

/**
 * Get all invoices for a specific entity (invoice or customer)
 */
export function getInvoicesByEntity(
  companyId: string,
  entityType: 'invoice' | 'customer',
  entityId: string
): Invoice[] {
  const allInvoices = getInvoicesByCompany(companyId)

  if (entityType === 'invoice') {
    // Return the specific invoice
    return allInvoices.filter((inv) => inv.invoiceNumber === entityId)
  } else {
    // entityType === 'customer'
    // Return all invoices for this customer
    return allInvoices.filter((inv) => inv.customerId === entityId)
  }
}

/**
 * Get all tasks for a specific entity (invoice or customer)
 * This includes both communication-related tasks and general tasks
 */
export function getTasksByEntity(
  allCommunications: Communication[],
  entityType: 'invoice' | 'customer',
  entityId: string
): Array<CommunicationTask | Task> {
  // Get communications for this entity
  const entityCommunications = getCommunicationsByEntity(
    allCommunications,
    entityType,
    entityId
  )

  // Generate communication tasks from entity communications
  const communicationTasks = generateCommunicationTasks(entityCommunications)

  // Filter communication tasks to only those related to this entity
  const filteredCommTasks = communicationTasks.filter((task) => {
    if (entityType === 'invoice') {
      // For invoice, match by relatedInvoiceId
      return task.relatedInvoiceId === entityId
    } else {
      // For customer, match by customer name from communications
      const customerName = entityCommunications[0]?.customerName
      return customerName && task.customerName === customerName
    }
  })

  // For general tasks, filter by checking if they mention the entity
  // In a real app, tasks would have explicit entity relationships
  const generalTasks = tasks.filter((task) => {
    // Simple text matching - in real app, tasks would have entityId fields
    const taskText = `${task.title} ${task.description || ''}`.toLowerCase()
    if (entityType === 'invoice') {
      // Check if task mentions the invoice number
      return taskText.includes(entityId.toLowerCase())
    } else {
      // For customer, try to match by customer name if available in task
      // This is a simplified approach - in real app, tasks would have customerId
      return false
    }
  })

  const allTasks = [...filteredCommTasks, ...generalTasks]
  console.log(`Found ${allTasks.length} tasks for ${entityType} ${entityId} (${filteredCommTasks.length} communication tasks, ${generalTasks.length} general tasks)`)
  
  return allTasks
}

/**
 * Get entity information (name, type) for display
 */
export function getEntityInfo(
  companyId: string,
  entityType: 'invoice' | 'customer',
  entityId: string
): { name: string; type: string } {
  if (entityType === 'invoice') {
    const invoices = getInvoicesByEntity(companyId, 'invoice', entityId)
    if (invoices.length > 0) {
      return {
        name: `Invoice ${invoices[0].invoiceNumber}`,
        type: 'Invoice',
      }
    }
    return { name: `Invoice ${entityId}`, type: 'Invoice' }
  } else {
    // For customer, get customer data
    const customers = getCustomersByCompany(companyId)
    const customer = customers.find((c) => c.id === entityId)
    if (customer) {
      return {
        name: customer.name,
        type: 'Customer',
      }
    }
    return { name: `Customer ${entityId}`, type: 'Customer' }
  }
}

