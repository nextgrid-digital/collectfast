import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCompany } from '@/context/company-context'
import { cn } from '@/lib/utils'

export function CompanySwitcher({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const { currentCompany, companies, switchCompany, isAccountant } = useCompany()

  if (!currentCompany || companies.length === 0) {
    return null
  }

  const handleSwitchCompany = (companyId: string) => {
    switchCompany(companyId)
    setOpen(false)
  }

  // Group companies by role (for accountants)
  const founderCompanies = companies.filter(() => {
    // In prototype, we'll show all companies for accountant
    // In real app, this would check user role per company
    return !isAccountant
  })

  const clientCompanies = companies.filter(() => {
    return isAccountant
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          aria-label='Select a company'
          className={cn('w-full justify-between', className)}
        >
          <div className='flex items-center gap-2 overflow-hidden'>
            <Avatar className='h-5 w-5 shrink-0'>
              <AvatarImage
                src={currentCompany.company_logo}
                alt={currentCompany.company_name}
              />
              <AvatarFallback
                style={{
                  backgroundColor: `${currentCompany.primary_color}20`,
                  color: currentCompany.primary_color,
                }}
                className='text-xs'
              >
                {currentCompany.company_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className='truncate text-sm font-medium'>
              {currentCompany.company_name}
            </span>
          </div>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[280px] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search company...' />
          <CommandList>
            <CommandEmpty>No company found.</CommandEmpty>

            {/* My Companies (for founders) */}
            {founderCompanies.length > 0 && (
              <CommandGroup heading='My Company'>
                {founderCompanies.map((company) => (
                  <CompanyItem
                    key={company.id}
                    company={company}
                    isSelected={currentCompany.id === company.id}
                    onSelect={handleSwitchCompany}
                  />
                ))}
              </CommandGroup>
            )}

            {/* Client Companies (for accountants) */}
            {clientCompanies.length > 0 && (
              <CommandGroup heading={isAccountant ? 'Client Companies' : 'Companies'}>
                {clientCompanies.map((company) => (
                  <CompanyItem
                    key={company.id}
                    company={company}
                    isSelected={currentCompany.id === company.id}
                    onSelect={handleSwitchCompany}
                  />
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface CompanyItemProps {
  company: {
    id: string
    company_name: string
    company_logo: string
    primary_color: string
    erp_provider: string
  }
  isSelected: boolean
  onSelect: (id: string) => void
}

function CompanyItem({ company, isSelected, onSelect }: CompanyItemProps) {
  return (
    <CommandItem
      key={company.id}
      onSelect={() => onSelect(company.id)}
      className='flex items-center justify-between cursor-pointer'
    >
      <div className='flex items-center gap-2 overflow-hidden flex-1'>
        <Avatar className='h-6 w-6 shrink-0'>
          <AvatarImage src={company.company_logo} alt={company.company_name} />
          <AvatarFallback
            style={{
              backgroundColor: `${company.primary_color}20`,
              color: company.primary_color,
            }}
            className='text-xs'
          >
            {company.company_name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col overflow-hidden flex-1 min-w-0'>
          <span className='text-sm font-medium truncate'>
            {company.company_name}
          </span>
          <span className='text-xs text-muted-foreground truncate'>
            {company.erp_provider}
          </span>
        </div>
      </div>
      {isSelected && <Check className='ml-2 h-4 w-4 shrink-0' />}
    </CommandItem>
  )
}

