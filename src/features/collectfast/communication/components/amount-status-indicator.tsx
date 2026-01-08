import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Clock, Circle } from 'lucide-react'

export type PaymentStatus = 'overdue' | 'due-soon' | 'paid' | 'pending'

type AmountStatusIndicatorProps = {
  amount: number
  status?: PaymentStatus
  className?: string
}


export function AmountStatusIndicator({
  amount,
  status,
  className,
}: AmountStatusIndicatorProps) {
  // If status not provided, determine from amount (mock)
  const paymentStatus = status || 'pending'

  const statusConfig = {
    overdue: {
      icon: AlertCircle,
      label: 'Overdue',
      className: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
      iconClassName: 'text-red-500',
    },
    'due-soon': {
      icon: Clock,
      label: 'Due Soon',
      className: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400',
      iconClassName: 'text-yellow-500',
    },
    paid: {
      icon: CheckCircle2,
      label: 'Paid',
      className: 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400',
      iconClassName: 'text-green-500',
    },
    pending: {
      icon: Circle,
      label: 'Pending',
      className: 'bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400',
      iconClassName: 'text-gray-500',
    },
  }

  const config = statusConfig[paymentStatus]
  const Icon = config.icon

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className='font-bold text-base text-foreground'>${amount.toFixed(2)}</span>
      <Badge variant='outline' className={cn('text-sm font-medium flex items-center gap-1.5 px-2.5 py-1', config.className)}>
        <Icon className={cn('h-4 w-4', config.iconClassName)} />
        <span>{config.label}</span>
      </Badge>
    </div>
  )
}

