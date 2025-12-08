import { useSearch, useNavigate } from '@tanstack/react-router'
import { DollarSign, AlertTriangle, Clock, Calendar, Download } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AgingReportTable } from './components/aging-report-table'
import { agingReportData, agingSummary } from './data/aging-data'

export function AgingReport() {
  const search = (useSearch({ from: '/app/aging-report', strict: false }) as Record<string, unknown>) || {}
  const navigate = useNavigate()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const totalOutstanding = agingSummary['0-30'] + agingSummary['31-60'] + agingSummary['61-90'] + agingSummary['90+']

  const summaryCards = [
    {
      title: 'Total Outstanding',
      value: formatCurrency(totalOutstanding),
      description: 'All aging buckets',
      icon: DollarSign,
      className: 'bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-500',
    },
    {
      title: '0-30 Days',
      value: formatCurrency(agingSummary['0-30']),
      description: 'Current',
      icon: DollarSign,
      className: 'bg-green-500/10 border-green-500/20',
      iconColor: 'text-green-500',
    },
    {
      title: '31-60 Days',
      value: formatCurrency(agingSummary['31-60']),
      description: 'Attention needed',
      icon: Clock,
      className: 'bg-yellow-500/10 border-yellow-500/20',
      iconColor: 'text-yellow-500',
    },
    {
      title: '61-90 Days',
      value: formatCurrency(agingSummary['61-90']),
      description: 'Overdue',
      icon: AlertTriangle,
      className: 'bg-orange-500/10 border-orange-500/20',
      iconColor: 'text-orange-500',
    },
    {
      title: '90+ Days',
      value: formatCurrency(agingSummary['90+']),
      description: 'Critical',
      icon: Calendar,
      className: 'bg-red-500/10 border-red-500/20',
      iconColor: 'text-red-500',
    },
  ]

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting aging report...')
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
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Aging Report</h2>
            <p className='text-muted-foreground'>
              View accounts receivables aging analysis by time buckets.
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={handleExport}>
              <Download className='mr-2 h-4 w-4' />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title} className={card.className}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div className='space-y-1'>
                    <CardTitle className='text-sm font-medium'>
                      {card.title}
                    </CardTitle>
                    {card.description && (
                      <CardDescription className='text-xs'>
                        {card.description}
                      </CardDescription>
                    )}
                  </div>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{card.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Aging Report Table */}
        <AgingReportTable data={agingReportData} search={search} navigate={navigate} />
      </Main>
    </>
  )
}
