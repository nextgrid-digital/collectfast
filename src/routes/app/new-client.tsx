import { createFileRoute } from '@tanstack/react-router'
import { NewClient } from '@/features/collectfast/clients/new-client'

export const Route = createFileRoute('/app/new-client')({
  component: NewClient,
})

