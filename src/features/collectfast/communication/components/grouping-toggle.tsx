import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Layers, Users, FileText, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type GroupingOption = 'urgency' | 'customer' | 'invoice'

type GroupingToggleProps = {
  value: GroupingOption
  onChange: (value: GroupingOption) => void
  className?: string
}

export function GroupingToggle({
  value,
  onChange,
  className,
}: GroupingToggleProps) {
  const options: Array<{ value: GroupingOption; label: string; icon: typeof Layers }> = [
    { value: 'urgency', label: 'By Urgency', icon: AlertTriangle },
    { value: 'customer', label: 'By Customer', icon: Users },
    { value: 'invoice', label: 'By Invoice', icon: FileText },
  ]

  const currentOption = options.find((opt) => opt.value === value) || options[0]
  const Icon = currentOption.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn('gap-2', className)}
        >
          <Icon className='h-4 w-4' />
          <span className='text-sm'>{currentOption.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {options.map((option) => {
          const OptionIcon = option.icon
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                'gap-2',
                value === option.value && 'bg-muted'
              )}
            >
              <OptionIcon className='h-4 w-4' />
              <span>{option.label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}




