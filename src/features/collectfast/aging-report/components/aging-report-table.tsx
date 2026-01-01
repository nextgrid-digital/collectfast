import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { type AgingReportRow } from '../data/schema'

type AgingReportTableProps = {
  data: AgingReportRow[]
}

const formatAmount = (value: number) => {
  return `$ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const bucketClass = (bucket: '1-30' | '31-60' | '61-90' | '90+', value: number) => {
  if (value === 0) return 'bg-muted text-foreground'
  switch (bucket) {
    case '1-30':
      return 'bg-muted text-foreground'
    case '31-60':
      return 'bg-blue-500/30 text-blue-100'
    case '61-90':
      return 'bg-amber-200/50 text-amber-900'
    case '90+':
      return 'bg-rose-500/30 text-rose-100'
    default:
      return 'bg-muted text-foreground'
  }
}

export function AgingReportTable({ data }: AgingReportTableProps) {
  return (
    <div className='flex flex-col gap-4 overflow-hidden rounded-md border bg-card'>
      <div className='overflow-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>1 - 30</TableHead>
              <TableHead>31 - 60</TableHead>
              <TableHead>61 - 90</TableHead>
              <TableHead>&gt;90</TableHead>
              <TableHead className='text-right'>Outstanding Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className='font-medium'>{row.customer}</TableCell>
                <TableCell>
                  <Badge variant='outline' className={bucketClass('1-30', row.bucket_1_30)}>
                    {formatAmount(row.bucket_1_30)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant='outline' className={bucketClass('31-60', row.bucket_31_60)}>
                    {formatAmount(row.bucket_31_60)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant='outline' className={bucketClass('61-90', row.bucket_61_90)}>
                    {formatAmount(row.bucket_61_90)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant='outline' className={bucketClass('90+', row.bucket_90_plus)}>
                    {formatAmount(row.bucket_90_plus)}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
                  <Badge variant='outline' className='bg-muted text-foreground'>
                    {formatAmount(row.outstanding)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer placeholder to match screenshot */}
      <div className='flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground'>
        <span>Page 1 of 10</span>
        <div className='flex gap-2'>
          <button className='rounded-md border px-3 py-1 disabled:opacity-50' disabled>
            Previous
          </button>
          <button className='rounded-md border px-3 py-1'>Next</button>
        </div>
      </div>
    </div>
  )
}

