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
import { TeamSwitcher } from './team-switcher'
import { CompanySwitcher } from '@/components/company-switcher'
import { useCompany } from '@/context/company-context'
import { Badge } from '@/components/ui/badge'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { currentCompany, isAccountant } = useCompany()
  
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
        
        {/* Company Switcher */}
        <div className='px-2 py-2'>
          <CompanySwitcher />
        </div>
        
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

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
