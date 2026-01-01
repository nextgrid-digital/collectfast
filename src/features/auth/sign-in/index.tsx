import { Link, useSearch } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* Left Column - Sign In Form */}
      <div className='lg:p-8 w-full'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          {/* Top Right Sign Up Link */}
          <div className='flex justify-end mb-4'>
            <Link
              to='/sign-up'
              className='text-sm text-muted-foreground hover:text-primary underline underline-offset-4'
            >
              Sign up
            </Link>
          </div>

          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-2xl font-semibold tracking-tight'>Sign in</h2>
            <p className='text-muted-foreground text-sm'>
              Enter your email and password below to log into your account
            </p>
          </div>

          <UserAuthForm redirectTo={redirect} />

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
