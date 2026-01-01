import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/features/collectfast/settings'

export const Route = createFileRoute('/app/settings')({
  component: Settings,
})

