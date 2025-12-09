import { useMemo } from 'react'
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
import { useCompany } from '@/context/company-context'
import {
  getCustomersByCompany,
  getInvoicesByCompany,
} from '@/data/mock/data-service'

export function Dashboard() {
  const { currentCompany, user, isLoading } = useCompany()
  const lastSynced = format(new Date(), 'EEE, MMM do')

  // Get company-specific data
  const customers = useMemo(() => {
    if (!currentCompany) return []
    return getCustomersByCompany(currentCompany.id)
  }, [currentCompany])

  const invoices = useMemo(() => {
    if (!currentCompany) return []
    return getInvoicesByCompany(currentCompany.id)
  }, [currentCompany])

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!currentCompany) {
      return [
        { title: 'Total Outstanding', value: '$0.00', icon: DollarSign },
        { title: 'Invoices Outstanding', value: '0', icon: FileText },
        { title: 'Active Customers', value: '0', icon: Users },
        { title: 'Current DSO', value: '0', icon: TrendingUp },
      ]
    }

    const outstandingInvoices = invoices.filter(
      (inv) => inv.status !== 'paid'
    )
    const totalOutstanding = outstandingInvoices.reduce(
      (sum, inv) => sum + inv.amount,
      0
    )
    const activeCustomers = customers.filter(
      (c) => c.status === 'active'
    ).length

    // Simple DSO calculation (days since oldest unpaid invoice)
    const oldestUnpaid = outstandingInvoices
      .map((inv) => inv.issueDate.getTime())
      .sort((a, b) => a - b)[0]
    const dso = oldestUnpaid
      ? Math.floor((Date.now() - oldestUnpaid) / (1000 * 60 * 60 * 24))
      : 0

    return [
      {
        title: 'Total Outstanding',
        value: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(totalOutstanding),
        icon: DollarSign,
      },
      {
        title: 'Invoices Outstanding',
        value: outstandingInvoices.length.toString(),
        icon: FileText,
      },
      {
        title: 'Active Customers',
        value: activeCustomers.toString(),
        icon: Users,
      },
      {
        title: 'Current DSO',
        value: dso.toString(),
        icon: TrendingUp,
      },
    ]
  }, [customers, invoices, currentCompany])

  // Get outstanding invoices for table
  const outstandingInvoices = useMemo(() => {
    return invoices
      .filter((inv) => inv.status !== 'paid')
      .slice(0, 5)
      .map((inv) => ({
        customer: inv.customerName,
        invoiceNo: inv.invoiceNumber,
        amount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(inv.amount),
        status: inv.status === 'overdue' ? 'Overdue' : inv.status === 'due-soon' ? 'Due Soon' : 'Paid',
      }))
  }, [invoices])

  // Get high value outstanding
  const highValueOutstanding = useMemo(() => {
    return invoices
      .filter((inv) => inv.status !== 'paid' && inv.amount > 2000)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((inv) => ({
        customer: inv.customerName,
        dueDate: format(inv.dueDate, 'MMM dd, yyyy'),
        amount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(inv.amount),
        status: inv.status === 'overdue' ? 'Overdue' : inv.status === 'due-soon' ? 'Due Soon' : 'Paid',
      }))
  }, [invoices])

  // Get unresponsive customers (overdue > 90 days)
  const unresponsiveCustomers = useMemo(() => {
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    return invoices
      .filter(
        (inv) =>
          inv.status === 'overdue' && inv.dueDate < ninetyDaysAgo
      )
      .slice(0, 3)
      .map((inv) => {
        const daysOverdue = Math.floor(
          (Date.now() - inv.dueDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        return {
          customer: inv.customerName,
          invoiceNo: inv.invoiceNumber,
          amount: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(inv.amount),
          status: `${daysOverdue} Days`,
          statusColor:
            daysOverdue > 120
              ? ('text-red-500' as const)
              : ('text-yellow-500' as const),
        }
      })
  }, [invoices])

  if (isLoading || !currentCompany) {
    return (
      <>
        <Header>
          <div className='flex items-center gap-4'>
            <div>
              <h1 className='text-xl font-semibold'>Loading...</h1>
            </div>
          </div>
        </Header>
        <Main>
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading company data...</p>
          </div>
        </Main>
      </>
    )
  }

  const userName = user?.name || 'User'

  return (
    <>
      <Header>
        <div className='flex items-center gap-4'>
          <div>
            <h1 className='text-xl font-semibold'>Welcome back, {userName}</h1>
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
                  {outstandingInvoices.length > 0 ? (
                    outstandingInvoices.map((invoice, index) => (
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className='text-center text-muted-foreground'>
                        No outstanding invoices
                      </TableCell>
                    </TableRow>
                  )}
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
                  {highValueOutstanding.length > 0 ? (
                    highValueOutstanding.map((item, index) => (
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className='text-center text-muted-foreground'>
                        No high value outstanding
                      </TableCell>
                    </TableRow>
                  )}
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
                  {unresponsiveCustomers.length > 0 ? (
                    unresponsiveCustomers.map((customer, index) => (
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className='text-center text-muted-foreground'>
                        No unresponsive customers
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
