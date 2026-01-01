import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconGmail } from '@/assets/brand-icons'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
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

const formSchema = z
  .object({
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'Please enter your email' : undefined,
    }),
    password: z
      .string()
      .min(1, 'Please enter your password')
      .min(7, 'Password must be at least 7 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    toast.promise(sleep(2000), {
      loading: 'Creating account...',
      success: () => {
        setIsLoading(false)

        // Mock successful sign-up with expiry computed at success time
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

        // Redirect to accountant dashboard
        navigate({ to: '/app/accountant-dashboard', replace: true })

        return `Account created successfully! Welcome, ${data.email}!`
      },
      error: () => {
        setIsLoading(false)
        return 'Error creating account'
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
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2 w-full' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : null}
          Sign up with email
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
              loading: 'Signing up with Google...',
              success: () => {
                setIsLoading(false)
                // Mock Google sign-up
                const mockUser = {
                  accountNo: 'ACC001',
                  email: form.getValues('email') || 'accountant@demo.com',
                  role: ['accountant'],
                  exp: Date.now() + 24 * 60 * 60 * 1000,
                }
                auth.setUser(mockUser)
                auth.setAccessToken('mock-access-token')
                localStorage.setItem('collectfast_is_accountant', 'true')
                localStorage.setItem(
                  'collectfast_user_email',
                  mockUser.email
                )
                navigate({ to: '/app/accountant-dashboard', replace: true })
                return 'Signed up with Google!'
              },
              error: () => {
                setIsLoading(false)
                return 'Error signing up with Google'
              },
            })
          }}
        >
          <IconGmail className='h-4 w-4 me-2' />
          Sign up with Google
        </Button>
      </form>
    </Form>
  )
}
