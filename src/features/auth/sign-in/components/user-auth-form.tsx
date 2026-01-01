import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
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
      email: 'accountant@demo.com',
      password: 'demo123',
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2 w-full' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in with email
        </Button>

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

        <Button
          variant='outline'
          className='w-full'
          type='button'
          disabled={isLoading}
          onClick={() => {
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
          }}
        >
          <IconGmail className='h-4 w-4 me-2' />
          Sign in with Google
        </Button>
      </form>
    </Form>
  )
}
