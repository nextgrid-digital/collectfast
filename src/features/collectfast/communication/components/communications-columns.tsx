import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Mail, MessageSquare, Phone, Bell, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { type Communication } from '../data/schema'

const typeIcons = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
  reminder: Bell,
  letter: FileText,
}

export const communicationsColumns: ColumnDef<Communication>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      const Icon = typeIcons[type as keyof typeof typeIcons]
      return (
        <div className='flex items-center gap-2'>
          {Icon && <Icon className='h-4 w-4 text-muted-foreground' />}
          <span className='capitalize'>{type}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Customer
          <ArrowUpDown className='ms-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('customerName')}</div>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => (
      <div className='max-w-[300px] truncate'>{row.getValue('subject')}</div>
    ),
  },
  {
    accessorKey: 'template',
    header: 'Template',
    cell: ({ row }) => {
      const template = row.getValue('template') as string | null
      return (
        <div className='text-muted-foreground'>
          {template || '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'relatedInvoiceId',
    header: 'Invoice',
    cell: ({ row }) => {
      const invoiceId = row.getValue('relatedInvoiceId') as string | null
      return (
        <div className='text-muted-foreground font-mono text-sm'>
          {invoiceId || '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge
          variant='outline'
          className={
            status === 'read'
              ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
              : status === 'delivered'
                ? 'bg-green-500/10 border-green-500/20 text-green-500'
                : status === 'sent'
                  ? 'bg-gray-500/10 border-gray-500/20 text-gray-500'
                  : status === 'failed'
                    ? 'bg-red-500/10 border-red-500/20 text-red-500'
                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'sentDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className='ms-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('sentDate') as Date
      const scheduledDate = row.original.scheduledDate
      return (
        <div className='text-muted-foreground'>
          {scheduledDate
            ? `Scheduled: ${format(scheduledDate, 'MMM dd, yyyy')}`
            : format(date, 'MMM dd, yyyy')}
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const communication = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(communication.id)}
            >
              Copy communication ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Resend</DropdownMenuItem>
            <DropdownMenuItem>View customer</DropdownMenuItem>
            {communication.relatedInvoiceId && (
              <DropdownMenuItem>View invoice</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-red-600'>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

