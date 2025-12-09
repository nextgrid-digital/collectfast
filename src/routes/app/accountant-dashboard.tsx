import { createFileRoute } from '@tanstack/react-router'
import { AccountantDashboard } from '@/features/collectfast/accountant-dashboard'

export const Route = createFileRoute('/app/accountant-dashboard')({
  component: AccountantDashboard,
})
