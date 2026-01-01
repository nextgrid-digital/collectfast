import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/features/collectfast/dashboard'

export const Route = createFileRoute('/app/')({
  component: Dashboard,
})
