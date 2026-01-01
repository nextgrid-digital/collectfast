import { type User } from './users'
import { type Customer } from '@/features/collectfast/customers/data/schema'
import { type Invoice } from '@/features/collectfast/invoices/data/schema'
import { type Communication } from '@/features/collectfast/communication/data/schema'
import { type AgingReportRow } from '@/features/collectfast/aging-report/data/schema'

// Import company-specific data
import { techstartCustomers } from './company-data/techstart/customers'
import { techstartInvoices } from './company-data/techstart/invoices'
import { techstartCommunications } from './company-data/techstart/communications'
import { techstartAgingReport } from './company-data/techstart/aging-report'

import { greenleafCustomers } from './company-data/greenleaf/customers'
import { greenleafInvoices } from './company-data/greenleaf/invoices'
import { greenleafCommunications } from './company-data/greenleaf/communications'
import { greenleafAgingReport } from './company-data/greenleaf/aging-report'

import { metroRetailCustomers } from './company-data/metro-retail/customers'
import { metroRetailInvoices } from './company-data/metro-retail/invoices'
import { metroRetailCommunications } from './company-data/metro-retail/communications'
import { metroRetailAgingReport } from './company-data/metro-retail/aging-report'

// Company data map
const companyDataMap: Record<
  string,
  {
    customers: Customer[]
    invoices: Invoice[]
    communications: Communication[]
    agingReport: AgingReportRow[]
  }
> = {
  'techstart-001': {
    customers: techstartCustomers,
    invoices: techstartInvoices,
    communications: techstartCommunications,
    agingReport: techstartAgingReport,
  },
  'greenleaf-002': {
    customers: greenleafCustomers,
    invoices: greenleafInvoices,
    communications: greenleafCommunications,
    agingReport: greenleafAgingReport,
  },
  'metro-retail-003': {
    customers: metroRetailCustomers,
    invoices: metroRetailInvoices,
    communications: metroRetailCommunications,
    agingReport: metroRetailAgingReport,
  },
}

// Data access functions
export function getCustomersByCompany(companyId: string): Customer[] {
  return companyDataMap[companyId]?.customers || []
}

export function getInvoicesByCompany(companyId: string): Invoice[] {
  return companyDataMap[companyId]?.invoices || []
}

export function getCommunicationsByCompany(companyId: string): Communication[] {
  return companyDataMap[companyId]?.communications || []
}

export function getAgingReportByCompany(companyId: string): AgingReportRow[] {
  return companyDataMap[companyId]?.agingReport || []
}

// Aggregate functions for accountant view
export function getAllCustomersForUser(user: User): Customer[] {
  return user.companyIds.flatMap((companyId) => getCustomersByCompany(companyId))
}

export function getAllInvoicesForUser(user: User): Invoice[] {
  return user.companyIds.flatMap((companyId) => getInvoicesByCompany(companyId))
}

export function getAllCommunicationsForUser(user: User): Communication[] {
  return user.companyIds.flatMap((companyId) =>
    getCommunicationsByCompany(companyId)
  )
}

export function getAllAgingReportsForUser(user: User): AgingReportRow[] {
  return user.companyIds.flatMap((companyId) =>
    getAgingReportByCompany(companyId)
  )
}

// Summary functions
export function getCompanySummary(companyId: string) {
  const customers = getCustomersByCompany(companyId)
  const invoices = getInvoicesByCompany(companyId)
  const agingReport = getAgingReportByCompany(companyId)

  const totalOutstanding = invoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const overdueInvoices = invoices.filter(
    (inv) => inv.status === 'overdue'
  ).length

  const totalInvoices = invoices.length

  const totalOutstandingAging = agingReport.reduce(
    (sum, item) => sum + item.outstanding,
    0
  )

  return {
    companyId,
    totalCustomers: customers.length,
    totalInvoices,
    totalOutstanding,
    overdueInvoices,
    totalOutstandingAging,
    lastActivity: new Date(), // Would come from actual data
  }
}

