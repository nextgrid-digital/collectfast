type Option = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export const customerStatuses: Option[] = [
  {
    value: 'active',
    label: 'Active',
    icon: undefined,
  },
  {
    value: 'inactive',
    label: 'Inactive',
    icon: undefined,
  },
  {
    value: 'overdue',
    label: 'Overdue',
    icon: undefined,
  },
  {
    value: 'on-hold',
    label: 'On Hold',
    icon: undefined,
  },
]

