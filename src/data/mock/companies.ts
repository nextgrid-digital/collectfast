export type Company = {
  id: string
  company_name: string
  company_logo: string
  primary_color: string
  secondary_color: string
  erp_provider: 'quickbooks' | 'xero' | 'freshbooks'
  industry: string
  company_size: string
  avg_invoices: number
  status: 'active' | 'suspended' | 'inactive'
  timezone: string
  currency: string
}

export const companies: Company[] = [
  {
    id: 'techstart-001',
    company_name: 'TechStart Inc.',
    company_logo: '/images/companies/techstart-logo.png',
    primary_color: '#3b82f6',
    secondary_color: '#60a5fa',
    erp_provider: 'quickbooks',
    industry: 'Software',
    company_size: 'Small (10-50 employees)',
    avg_invoices: 45,
    status: 'active',
    timezone: 'America/New_York',
    currency: 'USD',
  },
  {
    id: 'greenleaf-002',
    company_name: 'GreenLeaf Consulting',
    company_logo: '/images/companies/greenleaf-logo.png',
    primary_color: '#10b981',
    secondary_color: '#34d399',
    erp_provider: 'xero',
    industry: 'Consulting',
    company_size: 'Small (5-20 employees)',
    avg_invoices: 22,
    status: 'active',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
  },
  {
    id: 'metro-retail-003',
    company_name: 'Metro Retail Group',
    company_logo: '/images/companies/metro-retail-logo.png',
    primary_color: '#8b5cf6',
    secondary_color: '#a78bfa',
    erp_provider: 'quickbooks',
    industry: 'Retail',
    company_size: 'Medium (50-200 employees)',
    avg_invoices: 78,
    status: 'active',
    timezone: 'America/Chicago',
    currency: 'USD',
  },
]

export const getCompanyById = (id: string): Company | undefined => {
  return companies.find((c) => c.id === id)
}

export const getCompanyByName = (name: string): Company | undefined => {
  return companies.find((c) => c.company_name === name)
}

