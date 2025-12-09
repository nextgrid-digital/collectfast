import { ChevronsUpDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCompany } from '@/context/company-context'

export function CompanySwitcherSidebar() {
  const { isMobile } = useSidebar()
  const { currentCompany, companies, switchCompany, isAccountant } = useCompany()

  if (!currentCompany || companies.length === 0) {
    return null
  }

  const handleSwitchCompany = (companyId: string) => {
    switchCompany(companyId)
  }

  // Group companies by role (for accountants)
  const founderCompanies = companies.filter(() => !isAccountant)
  const clientCompanies = companies.filter(() => isAccountant)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 shrink-0'>
                <AvatarImage
                  src={currentCompany.company_logo}
                  alt={currentCompany.company_name}
                />
                <AvatarFallback
                  style={{
                    backgroundColor: `${currentCompany.primary_color}30`,
                    color: currentCompany.primary_color,
                  }}
                  className='text-xs'
                >
                  {currentCompany.company_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {currentCompany.company_name}
                </span>
                <span className='truncate text-xs text-muted-foreground'>
                  {currentCompany.erp_provider}
                </span>
              </div>
              <ChevronsUpDown className='ms-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              {isAccountant ? 'Client Companies' : 'My Company'}
            </DropdownMenuLabel>

            {/* My Companies (for founders) */}
            {founderCompanies.length > 0 &&
              founderCompanies.map((company) => (
                <DropdownMenuItem
                  key={company.id}
                  onClick={() => handleSwitchCompany(company.id)}
                  className='gap-2 p-2'
                >
                  <Avatar className='h-6 w-6 shrink-0'>
                    <AvatarImage src={company.company_logo} alt={company.company_name} />
                    <AvatarFallback
                      style={{
                        backgroundColor: `${company.primary_color}30`,
                        color: company.primary_color,
                      }}
                      className='text-xs'
                    >
                      {company.company_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col min-w-0 flex-1'>
                    <span className='truncate text-sm font-medium'>
                      {company.company_name}
                    </span>
                    <span className='truncate text-xs text-muted-foreground'>
                      {company.erp_provider}
                    </span>
                  </div>
                  {currentCompany.id === company.id && (
                    <span className='text-xs text-muted-foreground'>✓</span>
                  )}
                </DropdownMenuItem>
              ))}

            {/* Client Companies (for accountants) */}
            {clientCompanies.length > 0 && (
              <>
                {founderCompanies.length > 0 && <DropdownMenuSeparator />}
                {clientCompanies.map((company) => (
                  <DropdownMenuItem
                    key={company.id}
                    onClick={() => handleSwitchCompany(company.id)}
                    className='gap-2 p-2'
                  >
                    <Avatar className='h-6 w-6 shrink-0'>
                      <AvatarImage src={company.company_logo} alt={company.company_name} />
                      <AvatarFallback
                        style={{
                          backgroundColor: `${company.primary_color}30`,
                          color: company.primary_color,
                        }}
                        className='text-xs'
                      >
                        {company.company_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col min-w-0 flex-1'>
                      <span className='truncate text-sm font-medium'>
                        {company.company_name}
                      </span>
                      <span className='truncate text-xs text-muted-foreground'>
                        {company.erp_provider}
                      </span>
                    </div>
                    {currentCompany.id === company.id && (
                      <span className='text-xs text-muted-foreground'>✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='bg-background flex size-6 items-center justify-center rounded-md border'>
                <Plus className='size-4' />
              </div>
              <div className='text-muted-foreground font-medium'>Add company</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

