type Option = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export const communicationTypes: Option[] = [
  {
    value: 'email',
    label: 'Email',
    icon: undefined,
  },
  {
    value: 'sms',
    label: 'SMS',
    icon: undefined,
  },
  {
    value: 'call',
    label: 'Call',
    icon: undefined,
  },
  {
    value: 'reminder',
    label: 'Reminder',
    icon: undefined,
  },
  {
    value: 'letter',
    label: 'Letter',
    icon: undefined,
  },
]

export const communicationStatuses: Option[] = [
  {
    value: 'sent',
    label: 'Sent',
    icon: undefined,
  },
  {
    value: 'delivered',
    label: 'Delivered',
    icon: undefined,
  },
  {
    value: 'read',
    label: 'Read',
    icon: undefined,
  },
  {
    value: 'failed',
    label: 'Failed',
    icon: undefined,
  },
  {
    value: 'scheduled',
    label: 'Scheduled',
    icon: undefined,
  },
]

