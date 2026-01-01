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
import { type Customer } from '../data/schema'

export const customersColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Customer Name
          <ArrowUpDown className='ms-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className='text-muted-foreground'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => (
      <div className='text-muted-foreground'>{row.getValue('phone')}</div>
    ),
  },
  {
    accessorKey: 'totalOutstanding',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='text-end'
        >
          Total Outstanding
          <ArrowUpDown className='ms-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalOutstanding'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return <div className='text-end font-medium'>{formatted}</div>
    },
  },
  {
    accessorKey: 'invoiceCount',
    header: 'Invoices',
    cell: ({ row }) => {
      const count = row.getValue('invoiceCount') as number
      return <div className='text-center'>{count}</div>
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
            status === 'active'
              ? 'bg-green-500/10 border-green-500/20 text-green-500'
              : status === 'overdue'
                ? 'bg-red-500/10 border-red-500/20 text-red-500'
                : status === 'on-hold'
                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
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
    accessorKey: 'lastPaymentDate',
    header: 'Last Payment',
    cell: ({ row }) => {
      const date = row.getValue('lastPaymentDate') as Date | null
      return (
        <div className='text-muted-foreground'>
          {date ? format(date, 'MMM dd, yyyy') : 'Never'}
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original

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
              onClick={() => navigator.clipboard.writeText(customer.id)}
            >
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>Edit customer</DropdownMenuItem>
            <DropdownMenuItem>View invoices</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-red-600'>
              Delete customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

