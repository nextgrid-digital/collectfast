import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useCompany } from '@/context/company-context'

export function NewClient() {
  const navigate = useNavigate()
  const { isAccountant } = useCompany()

  if (!isAccountant) {
    navigate({ to: '/app' })
    return null
  }

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* Left Column - New Client Form */}
      <div className='lg:p-8 w-full'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-2xl font-semibold tracking-tight'>Add New Client</h2>
            <p className='text-muted-foreground text-sm'>
              Enter the details below to add a new client company
            </p>
          </div>

          <div className='space-y-4'>
            {/* QuickBooks Button */}
            <Button
              type='button'
              variant='default'
              className='w-full'
              disabled
            >
              <div className='h-4 w-4 rounded bg-blue-600 flex items-center justify-center shrink-0 mr-2'>
                <span className='text-white font-bold text-xs'>QB</span>
              </div>
              Sign in with Quickbooks
            </Button>
          </div>

          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking continue, you agree to our{' '}
            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Right Column - Testimonial with Dark Background */}
      <div
        className='bg-black relative hidden h-full flex-col p-10 text-white lg:flex'
        style={{ backgroundColor: '#000' }}
      >
        <div className='relative z-20 flex h-full flex-col justify-between'>
          <div className='flex items-center gap-2 text-lg font-medium'>
            <div className='h-8 w-8 rounded bg-white/20 flex items-center justify-center'>
              <span className='text-white font-bold'>C</span>
            </div>
            <span>Collectfast</span>
          </div>

          <blockquote className='space-y-4'>
            <p className='text-lg leading-relaxed'>
              "Collectfast has revolutionized how we manage our receivables. The
              automated reminders have drastically reduced our overdue invoices and
              improved cash flow. Its seamless integration with QuickBooks has saved us
              significant time. Highly recommended for any business looking to streamline
              their financial operations."
            </p>
            <footer className='text-sm'>
              <div className='font-semibold'>Sofia Davis</div>
              <div className='text-white/70'>CFO, Tech Innovations Inc.</div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
