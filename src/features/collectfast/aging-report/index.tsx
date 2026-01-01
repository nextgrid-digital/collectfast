import { useMemo, useState } from 'react'
import { RefreshCcw, SlidersHorizontal } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AgingReportTable } from './components/aging-report-table'
import { useCompany } from '@/context/company-context'
import { getAgingReportByCompany } from '@/data/mock/data-service'

export function AgingReport() {
  const { currentCompany, isLoading } = useCompany()
  const [query, setQuery] = useState('')

  const agingReportData = useMemo(() => {
    if (!currentCompany) return []
    return getAgingReportByCompany(currentCompany.id)
  }, [currentCompany])

  const filteredData = useMemo(() => {
    if (!query) return agingReportData
    const q = query.toLowerCase()
    return agingReportData.filter((row) =>
      row.customer.toLowerCase().includes(q)
    )
  }, [query, agingReportData])

  if (isLoading || !currentCompany) {
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
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading company data...</p>
          </div>
        </Main>
      </>
    )
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
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='space-y-2'>
            <h2 className='text-2xl font-bold tracking-tight'>Aging Report</h2>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm'>
              <SlidersHorizontal className='mr-2 h-4 w-4' />
              Filters
            </Button>
            <Button variant='outline' size='sm'>
              <RefreshCcw className='mr-2 h-4 w-4' />
              Sync Invoices
            </Button>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Input
            placeholder='Search by Customer or invoice number...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='max-w-sm'
          />
        </div>

        {/* Aging Report Table */}
        <AgingReportTable data={filteredData} />
      </Main>
    </>
  )
}
