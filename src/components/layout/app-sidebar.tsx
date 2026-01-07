import { useMemo } from 'react'
import { Building2, LogIn, UserPlus } from 'lucide-react'
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

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { isAccountant } = useCompany()
  
  // Filter navigation items based on role
  const navGroups = useMemo(() => {
    const baseGroups = [...sidebarData.navGroups]
    
    // Create Sandbox section with Sign In, Accountant Dashboard, and New Client
    const sandboxItems = [
      {
        title: 'Sign In',
        url: '/sign-in',
        icon: LogIn,
      },
    ]
    
    // For accountants, add Accountant Dashboard
    if (isAccountant) {
      sandboxItems.push({
        title: 'Accountant Dashboard',
        url: '/app/accountant-dashboard',
        icon: Building2,
      })
    }
    
    // Add New Client
    sandboxItems.push({
      title: 'New Client',
      url: '/app/new-client',
      icon: UserPlus,
    })
    
    const sandboxGroup = {
      title: 'Sandbox',
      items: sandboxItems,
    }
    
    // Return Main group followed by Sandbox group
    return [...baseGroups, sandboxGroup]
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
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
