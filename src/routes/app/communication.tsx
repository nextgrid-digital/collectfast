import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Communication } from '@/features/collectfast/communication'

const communicationSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  type: z
    .array(
      z.union([
        z.literal('email'),
        z.literal('sms'),
        z.literal('call'),
        z.literal('reminder'),
        z.literal('letter'),
      ])
    )
    .optional()
    .catch([]),
  status: z
    .array(
      z.union([
        z.literal('sent'),
        z.literal('delivered'),
        z.literal('read'),
        z.literal('failed'),
        z.literal('scheduled'),
      ])
    )
    .optional()
    .catch([]),
  // Per-column text filters
  customerName: z.string().optional().catch(''),
  subject: z.string().optional().catch(''),
})

export const Route = createFileRoute('/app/communication')({
  validateSearch: communicationSearchSchema,
  component: Communication,
})

