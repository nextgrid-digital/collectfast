import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  DollarSign,
  FileText,
  AlertCircle,
  Building2,
  Plus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { useCompany } from '@/context/company-context'
import { getCompanySummary } from '@/data/mock/data-service'
import { toast } from 'sonner'

export function AccountantDashboard() {
  const { companies: userCompanies, isAccountant, switchCompany } = useCompany()
  const navigate = useNavigate()

  // Calculate aggregate metrics
  const aggregateMetrics = useMemo(() => {
    let totalOutstanding = 0
    let totalInvoices = 0
    let totalOverdue = 0

    userCompanies.forEach((company) => {
      const summary = getCompanySummary(company.id)
      totalOutstanding += summary.totalOutstanding
      totalInvoices += summary.totalInvoices
      totalOverdue += summary.overdueInvoices
    })

    return {
      totalCompanies: userCompanies.length,
      totalOutstanding,
      totalInvoices,
      totalOverdue,
    }
  }, [userCompanies])

  // Get company summaries for cards
  const companySummaries = useMemo(() => {
    return userCompanies.map((company) => {
      const summary = getCompanySummary(company.id)
      return {
        ...company,
        ...summary,
        lastActivity: new Date(), // Would come from actual data
      }
    })
  }, [userCompanies])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleCompanyClick = (companyId: string) => {
    switchCompany(companyId)
    navigate({ to: '/app' })
  }

  const handleAddNewClient = () => {
    navigate({ to: '/app/new-client' })
  }

  // Redirect non-accountants to regular dashboard
  if (!isAccountant) {
    navigate({ to: '/app' })
    return null
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='mb-4'>
          <h1 className='text-3xl font-bold text-foreground'>Accountant Dashboard</h1>
          <p className='text-muted-foreground mt-2'>
            Overview of all {aggregateMetrics.totalCompanies} client companies
          </p>
        </div>

        {/* Aggregate Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Companies</CardTitle>
              <Building2 className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{aggregateMetrics.totalCompanies}</div>
              <p className='text-xs text-muted-foreground'>Active clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Outstanding</CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(aggregateMetrics.totalOutstanding)}
              </div>
              <p className='text-xs text-muted-foreground'>Across all clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Invoices</CardTitle>
              <FileText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{aggregateMetrics.totalInvoices}</div>
              <p className='text-xs text-muted-foreground'>Outstanding</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Overdue</CardTitle>
              <AlertCircle className='h-4 w-4 text-red-500' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-500'>
                {aggregateMetrics.totalOverdue}
              </div>
              <p className='text-xs text-muted-foreground'>Need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Company Cards */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>Your Clients</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {companySummaries.map((company) => (
              <Card
                key={company.id}
                className='cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]'
                onClick={() => handleCompanyClick(company.id)}
                style={{
                  borderTop: `4px solid ${company.primary_color}`,
                }}
              >
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-3 flex-1 min-w-0'>
                      <Avatar className='h-12 w-12 shrink-0'>
                        <AvatarImage src={company.company_logo} />
                        <AvatarFallback
                          style={{
                            backgroundColor: `${company.primary_color}30`,
                            color: company.primary_color,
                          }}
                        >
                          {company.company_name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className='min-w-0 flex-1'>
                        <CardTitle className='text-lg truncate'>
                          {company.company_name}
                        </CardTitle>
                        <p className='text-sm text-muted-foreground'>
                          {company.erp_provider}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-muted-foreground'>Outstanding</span>
                    <span className='text-lg font-bold'>
                      {formatCurrency(company.totalOutstanding)}
                    </span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-muted-foreground'>Invoices</span>
                    <Badge variant='secondary'>{company.totalInvoices}</Badge>
                  </div>

                  {company.overdueInvoices > 0 && (
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-muted-foreground'>Overdue</span>
                      <Badge variant='destructive'>{company.overdueInvoices}</Badge>
                    </div>
                  )}

                  <div className='pt-2 border-t'>
                    <p className='text-xs text-muted-foreground'>
                      {company.totalCustomers} customers
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Client Card */}
            <Card
              className='cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-dashed border-2'
              onClick={handleAddNewClient}
            >
              <CardHeader>
                <div className='flex flex-col items-center justify-center min-h-[120px] gap-3'>
                  <div className='h-12 w-12 rounded-full bg-muted flex items-center justify-center'>
                    <Plus className='h-6 w-6 text-muted-foreground' />
                  </div>
                  <CardTitle className='text-lg text-center'>
                    Add New Client
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground text-center'>
                  Click to add a new client company
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}

