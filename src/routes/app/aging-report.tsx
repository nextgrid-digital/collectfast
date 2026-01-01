import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AgingReport } from '@/features/collectfast/aging-report'

const agingReportSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  agingBucket: z
    .array(
      z.union([
        z.literal('0-30'),
        z.literal('31-60'),
        z.literal('61-90'),
        z.literal('90+'),
      ])
    )
    .optional()
    .catch([]),
  // Per-column text filter
  customerName: z.string().optional().catch(''),
})

export const Route = createFileRoute('/app/aging-report')({
  validateSearch: agingReportSearchSchema,
  component: AgingReport,
})
