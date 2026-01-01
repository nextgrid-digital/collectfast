type Option = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export const agingBuckets: Option[] = [
  {
    value: '0-30',
    label: '0-30 Days',
    icon: undefined,
  },
  {
    value: '31-60',
    label: '31-60 Days',
    icon: undefined,
  },
  {
    value: '61-90',
    label: '61-90 Days',
    icon: undefined,
  },
  {
    value: '90+',
    label: '90+ Days',
    icon: undefined,
  },
]

