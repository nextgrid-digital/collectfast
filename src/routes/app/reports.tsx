import { createFileRoute } from '@tanstack/react-router'
import { Reports } from '@/features/collectfast/reports'

export const Route = createFileRoute('/app/reports')({
  component: Reports,
})

