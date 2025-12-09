import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { InvoicesTable } from './components/invoices-table'
import { InvoicesPrimaryButtons } from './components/invoices-primary-buttons'
import { useCompany } from '@/context/company-context'
import { getInvoicesByCompany } from '@/data/mock/data-service'

const route = getRouteApi('/app/invoices')

export function Invoices() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { currentCompany, isLoading } = useCompany()

  const invoices = useMemo(() => {
    if (!currentCompany) return []
    return getInvoicesByCompany(currentCompany.id)
  }, [currentCompany])

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
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Invoices</h2>
            <p className='text-muted-foreground'>
              View and manage all your accounts receivables invoices.
            </p>
          </div>
          <InvoicesPrimaryButtons />
        </div>
        <InvoicesTable data={invoices} search={search} navigate={navigate} />
      </Main>
    </>
  )
}
