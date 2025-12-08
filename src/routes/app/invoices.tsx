import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Invoices } from '@/features/collectfast/invoices'

const invoicesSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(
      z.union([
        z.literal('paid'),
        z.literal('overdue'),
        z.literal('due-soon'),
        z.literal('draft'),
        z.literal('sent'),
      ])
    )
    .optional()
    .catch([]),
  // Per-column text filters
  invoiceNumber: z.string().optional().catch(''),
  customerName: z.string().optional().catch(''),
})

export const Route = createFileRoute('/app/invoices')({
  validateSearch: invoicesSearchSchema,
  component: Invoices,
})
