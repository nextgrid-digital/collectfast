import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CustomersTable } from './components/customers-table'
import { CustomersPrimaryButtons } from './components/customers-primary-buttons'
import { useCompany } from '@/context/company-context'
import { getCustomersByCompany } from '@/data/mock/data-service'

const route = getRouteApi('/app/customers')

export function Customers() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { currentCompany, isLoading } = useCompany()

  const customers = useMemo(() => {
    if (!currentCompany) return []
    return getCustomersByCompany(currentCompany.id)
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
            <h2 className='text-2xl font-bold tracking-tight'>Customers</h2>
            <p className='text-muted-foreground'>
              Manage your customer accounts and track receivables.
            </p>
          </div>
          <CustomersPrimaryButtons />
        </div>
        <CustomersTable data={customers} search={search} navigate={navigate} />
      </Main>
    </>
  )
}
