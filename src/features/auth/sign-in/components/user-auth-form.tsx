import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { IconGmail } from '@/assets/brand-icons'
import { useAuthStore } from '@/stores/auth-store'
import { sleep, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'jonnathan.doe@acme.com',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    toast.promise(sleep(2000), {
      loading: 'Signing in...',
      success: () => {
        setIsLoading(false)

        // Mock successful authentication with expiry computed at success time
        // For prototype: always set as accountant user
        const mockUser = {
          accountNo: 'ACC001',
          email: data.email,
          role: ['accountant'],
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        }

        // Set user and access token
        auth.setUser(mockUser)
        auth.setAccessToken('mock-access-token')

        // Store accountant flag in localStorage for company context
        localStorage.setItem('collectfast_is_accountant', 'true')
        localStorage.setItem('collectfast_user_email', data.email)

        // Redirect accountants to accountant dashboard, others to default path
        const targetPath = redirectTo || '/app/accountant-dashboard'
        navigate({ to: targetPath, replace: true })

        return `Welcome back, ${data.email}!`
      },
      error: 'Error',
    })
  }

  const handleGoogleSignIn = () => {
    setIsLoading(true)
    toast.promise(sleep(2000), {
      loading: 'Signing in with Google...',
      success: () => {
        setIsLoading(false)
        // Mock Google sign-in
        const mockUser = {
          accountNo: 'ACC001',
          email: 'accountant@demo.com',
          role: ['accountant'],
          exp: Date.now() + 24 * 60 * 60 * 1000,
        }
        auth.setUser(mockUser)
        auth.setAccessToken('mock-access-token')
        localStorage.setItem('collectfast_is_accountant', 'true')
        localStorage.setItem('collectfast_user_email', 'accountant@demo.com')
        navigate({ to: redirectTo || '/app/accountant-dashboard', replace: true })
        return 'Signed in with Google!'
      },
      error: () => {
        setIsLoading(false)
        return 'Error signing in with Google'
      },
    })
  }

  const handleQuickBooksSignIn = () => {
    setIsLoading(true)
    toast.promise(sleep(2000), {
      loading: 'Signing in with QuickBooks...',
      success: () => {
        setIsLoading(false)
        // Mock QuickBooks sign-in
        const mockUser = {
          accountNo: 'ACC001',
          email: 'accountant@demo.com',
          role: ['accountant'],
          exp: Date.now() + 24 * 60 * 60 * 1000,
        }
        auth.setUser(mockUser)
        auth.setAccessToken('mock-access-token')
        localStorage.setItem('collectfast_is_accountant', 'true')
        localStorage.setItem('collectfast_user_email', 'accountant@demo.com')
        navigate({ to: redirectTo || '/app/accountant-dashboard', replace: true })
        return 'Signed in with QuickBooks!'
      },
      error: () => {
        setIsLoading(false)
        return 'Error signing in with QuickBooks'
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        {/* Google Sign-in Button */}
        <Button
          type='button'
          className='w-full bg-blue-600 hover:bg-blue-700 text-white'
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          <IconGmail className='h-4 w-4 me-2' />
          Sign in with Google
        </Button>

        {/* QuickBooks Sign-in Button */}
        <Button
          type='button'
          variant='outline'
          className='w-full'
          disabled={isLoading}
          onClick={handleQuickBooksSignIn}
        >
          <div className='h-4 w-4 rounded bg-blue-600 flex items-center justify-center shrink-0 mr-2'>
            <span className='text-white font-bold text-xs'>QB</span>
          </div>
          Sign in with Quickbooks
        </Button>

        {/* Divider */}
        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        {/* Email Input */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder='jonnathan.doe@acme.com'
                  {...field}
                  className='border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sign in with email Button */}
        <Button className='w-full' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in with email
        </Button>
      </form>
    </Form>
  )
}
