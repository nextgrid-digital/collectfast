import { useMemo } from 'react'
import { Building2 } from 'lucide-react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { CompanySwitcherSidebar } from '@/components/company-switcher-sidebar'
import { useCompany } from '@/context/company-context'
import { Badge } from '@/components/ui/badge'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { currentCompany, isAccountant } = useCompany()
  
  // Filter navigation items based on role
  const navGroups = useMemo(() => {
    const baseGroups = [...sidebarData.navGroups]
    
    // For accountants, add Accountant Dashboard as first item
    if (isAccountant) {
      const mainGroup = baseGroups[0]
      if (mainGroup) {
        return [
          {
            ...mainGroup,
            items: [
              {
                title: 'Accountant Dashboard',
                url: '/app/accountant-dashboard',
                icon: Building2,
              },
              ...mainGroup.items,
            ],
          },
          ...baseGroups.slice(1),
        ]
      }
    }
    
    return baseGroups
  }, [isAccountant])
  
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <CompanySwitcherSidebar />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* Role Badge */}
        {currentCompany && (
          <div className='px-2 pb-2'>
            <Badge
              variant='outline'
              className='w-full justify-center text-xs'
              style={{
                borderColor: currentCompany.primary_color,
                color: currentCompany.primary_color,
                backgroundColor: `${currentCompany.primary_color}10`,
              }}
            >
              {isAccountant ? '👔 Accountant View' : '👤 Owner View'}
            </Badge>
          </div>
        )}
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
