import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
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
import { type Invoice } from '../data/schema'

export const invoicesColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'invoiceNumber',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Invoice No.
          <ArrowUpDown className='ms-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('invoiceNumber')}</div>
    ),
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
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='text-end'
        >
          Amount
          <ArrowUpDown className='ms-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return <div className='text-end font-medium'>{formatted}</div>
    },
  },
  {
    accessorKey: 'issueDate',
    header: 'Issue Date',
    cell: ({ row }) => {
      const date = row.getValue('issueDate') as Date
      return <div className='text-muted-foreground'>{format(date, 'MMM dd, yyyy')}</div>
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Due Date
          <ArrowUpDown className='ms-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('dueDate') as Date
      const isOverdue = date < new Date()
      return (
        <div className={isOverdue ? 'text-red-500 font-medium' : ''}>
          {format(date, 'MMM dd, yyyy')}
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
            status === 'paid'
              ? 'bg-green-500/10 border-green-500/20 text-green-500'
              : status === 'overdue'
                ? 'bg-red-500/10 border-red-500/20 text-red-500'
                : status === 'due-soon'
                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                  : status === 'sent'
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                    : 'bg-gray-500/10 border-gray-500/20 text-gray-500'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'paidDate',
    header: 'Paid Date',
    cell: ({ row }) => {
      const date = row.getValue('paidDate') as Date | null
      return (
        <div className='text-muted-foreground'>
          {date ? format(date, 'MMM dd, yyyy') : '-'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const invoice = row.original

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
              onClick={() => navigator.clipboard.writeText(invoice.id)}
            >
              Copy invoice ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View invoice</DropdownMenuItem>
            <DropdownMenuItem>Edit invoice</DropdownMenuItem>
            <DropdownMenuItem>Send reminder</DropdownMenuItem>
            <DropdownMenuItem>Mark as paid</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuItem className='text-red-600'>
              Delete invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

