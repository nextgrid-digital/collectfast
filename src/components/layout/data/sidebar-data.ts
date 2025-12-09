import React from 'react'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Receipt,
  FileText,
  Settings,
} from 'lucide-react'
import { type SidebarData } from '../types'

const CollectfastLogo: React.FC = () =>
  React.createElement('img', {
    src: '/images/Collectfast-Favicon.webp',
    alt: 'Collectfast logo',
    className: 'h-8 w-8 rounded-lg object-contain',
  })

export const sidebarData: SidebarData = {
  user: {
    name: 'User',
    email: 'user@collectfast.com',
    avatar: '/avatars/default.jpg',
  },
  teams: [
    {
      name: 'Collectfast',
      logo: CollectfastLogo,
      plan: 'Accounts Receivables',
    },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/app',
          icon: LayoutDashboard,
        },
        {
          title: 'Customers',
          url: '/app/customers',
          icon: Users,
        },
        {
          title: 'Invoices',
          url: '/app/invoices',
          icon: Receipt,
        },
        {
          title: 'Communication',
          url: '/app/communication',
          icon: MessageSquare,
        },
        {
          title: 'Aging Report',
          url: '/app/aging-report',
          icon: FileText,
        },
        {
          title: 'Settings',
          url: '/app/settings',
          icon: Settings,
        },
      ],
    },
  ],
}
