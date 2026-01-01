import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CustomersPrimaryButtons() {
  return (
    <Button>
      <Plus className='me-2 h-4 w-4' />
      Add Customer
    </Button>
  )
}

