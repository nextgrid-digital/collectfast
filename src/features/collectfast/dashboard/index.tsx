import { format } from 'date-fns'
import {
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Circle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Search } from '@/components/search'

// Mock data
const metrics = [
  {
    title: 'Total Outstanding',
    value: '$15,432.67',
    icon: DollarSign,
  },
  {
    title: 'Invoices Outstanding',
    value: '38',
    icon: FileText,
  },
  {
    title: 'Active Customers',
    value: '145',
    icon: Users,
  },
  {
    title: 'Current DSO',
    value: '27',
    icon: TrendingUp,
  },
]

const outstandingInvoices = [
  {
    customer: 'Liam Johnson',
    invoiceNo: 'INV-001',
    amount: '$1,250',
    status: 'Paid',
  },
  {
    customer: 'Olivia Smith',
    invoiceNo: 'INV-002',
    amount: '$3,500',
    status: 'Overdue',
  },
  {
    customer: 'Noah Williams',
    invoiceNo: 'INV-003',
    amount: '$2,750',
    status: 'Due Soon',
  },
]

const highValueOutstanding = [
  {
    customer: 'Olivia Martin',
    dueDate: '2024-07-15',
    amount: '$5,000',
    status: 'Paid',
  },
  {
    customer: 'Ethan Brown',
    dueDate: '2024-07-15',
    amount: '$4,200',
    status: 'Overdue',
  },
  {
    customer: 'Sophia Lee',
    dueDate: '2024-07-15',
    amount: '$3,800',
    status: 'Due Soon',
  },
  {
    customer: 'William Chen',
    dueDate: '2024-07-15',
    amount: '$2,900',
    status: 'Paid',
  },
  {
    customer: 'Sophia Lee',
    dueDate: '2024-07-15',
    amount: '$1,500',
    status: 'Paid',
  },
  {
    customer: 'Sophia Lee',
    dueDate: '2024-07-15',
    amount: '$1,200',
    status: 'Paid',
  },
  {
    customer: 'Sophia Lee',
    dueDate: '2024-07-15',
    amount: '$1,800',
    status: 'Overdue',
  },
  {
    customer: 'Sophia Lee',
    dueDate: '2024-07-15',
    amount: '$2,400',
    status: 'Due Soon',
  },
]

const unresponsiveCustomers = [
  {
    customer: 'Liam Johnson',
    invoiceNo: 'INV-001',
    amount: '$1,250',
    status: '90 Days',
    statusColor: 'text-red-500' as const,
  },
  {
    customer: 'Olivia Smith',
    invoiceNo: 'INV-002',
    amount: '$3,500',
    status: '123 Days',
    statusColor: 'text-yellow-500' as const,
  },
  {
    customer: 'Noah Williams',
    invoiceNo: 'INV-003',
    amount: '$2,750',
    status: '90 Days',
    statusColor: 'text-red-500' as const,
  },
]

export function Dashboard() {
  const lastSynced = format(new Date(2024, 9, 30), 'EEE, MMM do')

  return (
    <>
      <Header>
        <div className='flex items-center gap-4'>
          <div>
            <h1 className='text-xl font-semibold'>Welcome back, Olivia</h1>
          </div>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <span className='text-sm text-muted-foreground'>
            Last Synced {lastSynced}
          </span>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {/* Key Metrics Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6'>
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.title}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {metric.title}
                  </CardTitle>
                  <Icon className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{metric.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tables Section */}
        <div className='grid gap-4 md:grid-cols-2'>
          {/* Outstanding Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Invoice No.</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outstandingInvoices.map((invoice, index) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium'>
                        {invoice.customer}
                      </TableCell>
                      <TableCell>{invoice.invoiceNo}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={
                            invoice.status === 'Paid'
                              ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'
                              : invoice.status === 'Overdue'
                                ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'
                                : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20'
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* High Value Outstanding */}
          <Card>
            <CardHeader>
              <CardTitle>High Value Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {highValueOutstanding.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium'>
                        {item.customer}
                      </TableCell>
                      <TableCell>{item.dueDate}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={
                            item.status === 'Paid'
                              ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'
                              : item.status === 'Overdue'
                                ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'
                                : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Unresponsive Customers */}
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle>Unresponsive Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Invoice No.</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unresponsiveCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium'>
                        {customer.customer}
                      </TableCell>
                      <TableCell>{customer.invoiceNo}</TableCell>
                      <TableCell>{customer.amount}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Circle
                            className={`h-2 w-2 fill-current ${customer.statusColor}`}
                          />
                          <span>{customer.status}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
