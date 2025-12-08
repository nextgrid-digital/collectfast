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
import { type AgingReportItem } from '../data/schema'

export const agingReportColumns: ColumnDef<AgingReportItem>[] = [
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
    accessorKey: 'invoiceNumber',
    header: 'Invoice No.',
    cell: ({ row }) => (
      <div className='font-mono text-sm'>{row.getValue('invoiceNumber')}</div>
    ),
  },
  {
    accessorKey: 'invoiceDate',
    header: 'Invoice Date',
    cell: ({ row }) => {
      const date = row.getValue('invoiceDate') as Date
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
    accessorKey: 'daysOverdue',
    header: 'Days Overdue',
    cell: ({ row }) => {
      const days = row.getValue('daysOverdue') as number
      return (
        <div className={days > 90 ? 'text-red-500 font-medium' : days > 60 ? 'text-yellow-500' : ''}>
          {days} days
        </div>
      )
    },
  },
  {
    accessorKey: 'agingBucket',
    header: 'Aging Bucket',
    cell: ({ row }) => {
      const bucket = row.getValue('agingBucket') as string
      return (
        <Badge
          variant='outline'
          className={
            bucket === '0-30'
              ? 'bg-green-500/10 border-green-500/20 text-green-500'
              : bucket === '31-60'
                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                : bucket === '61-90'
                  ? 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
          }
        >
          {bucket} days
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original

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
              onClick={() => navigator.clipboard.writeText(item.id)}
            >
              Copy record ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View invoice</DropdownMenuItem>
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>Send reminder</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Export</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

