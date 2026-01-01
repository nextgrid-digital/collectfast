type Option = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export const invoiceStatuses: Option[] = [
  {
    value: 'paid',
    label: 'Paid',
    icon: undefined,
  },
  {
    value: 'overdue',
    label: 'Overdue',
    icon: undefined,
  },
  {
    value: 'due-soon',
    label: 'Due Soon',
    icon: undefined,
  },
  {
    value: 'draft',
    label: 'Draft',
    icon: undefined,
  },
  {
    value: 'sent',
    label: 'Sent',
    icon: undefined,
  },
]

