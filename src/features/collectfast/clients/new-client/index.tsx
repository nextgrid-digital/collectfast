import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCompany } from '@/context/company-context'

const formSchema = z
  .object({
    company_name: z.string().min(1, 'Company name is required'),
    erp_provider: z.enum(['quickbooks', 'xero', 'freshbooks']).optional(),
    industry: z.string().min(1, 'Industry is required'),
    company_size: z.string().min(1, 'Company size is required'),
    timezone: z.string().min(1, 'Timezone is required'),
    currency: z.string().min(1, 'Currency is required'),
    primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Please enter a valid hex color'),
    secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Please enter a valid hex color'),
    company_logo: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  })
  .refine((data) => data.erp_provider !== undefined, {
    message: 'Please select an ERP provider',
    path: ['erp_provider'],
  })

export function NewClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedERP, setSelectedERP] = useState<'quickbooks' | 'xero' | 'freshbooks' | null>(null)
  const navigate = useNavigate()
  const { isAccountant } = useCompany()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: 'Acme Corporation',
      erp_provider: 'quickbooks' as const,
      industry: 'Software',
      company_size: 'Small (10-50 employees)',
      timezone: 'America/New_York',
      currency: 'USD',
      primary_color: '#3b82f6',
      secondary_color: '#60a5fa',
      company_logo: 'https://example.com/logo.png',
    },
  })

  const handleERPSelect = (provider: 'quickbooks' | 'xero' | 'freshbooks') => {
    setSelectedERP(provider)
    form.setValue('erp_provider', provider)
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!selectedERP) {
      toast.error('Please select an ERP provider')
      return
    }

    setIsLoading(true)

    toast.promise(sleep(2000), {
      loading: 'Creating new client...',
      success: () => {
        setIsLoading(false)
        // In a real app, this would create the company via API
        // For prototype, just show success and redirect
        navigate({ to: '/app/accountant-dashboard', replace: true })
        return `Client "${data.company_name}" created successfully!`
      },
      error: () => {
        setIsLoading(false)
        return 'Error creating client'
      },
    })
  }

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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* ERP Provider Buttons */}
              <div className='grid grid-cols-2 gap-2'>
                <Button
                  type='button'
                  variant={selectedERP === 'quickbooks' ? 'default' : 'outline'}
                  className='w-full'
                  onClick={() => handleERPSelect('quickbooks')}
                >
                  <div className='h-4 w-4 rounded bg-blue-600 flex items-center justify-center shrink-0 mr-2'>
                    <span className='text-white font-bold text-xs'>QB</span>
                  </div>
                  Sign in with Quickbooks
                </Button>
                <Button
                  type='button'
                  variant={selectedERP === 'xero' ? 'default' : 'outline'}
                  className='w-full'
                  onClick={() => handleERPSelect('xero')}
                >
                  <div className='h-4 w-4 rounded bg-teal-600 flex items-center justify-center shrink-0 mr-2'>
                    <span className='text-white font-bold text-xs'>X</span>
                  </div>
                  Sign in with Xero
                </Button>
              </div>

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

              {/* Form Fields */}
              <FormField
                control={form.control}
                name='company_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Acme Corporation' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='industry'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder='Software' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='company_size'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Size</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select size' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Small (1-10 employees)'>
                            Small (1-10 employees)
                          </SelectItem>
                          <SelectItem value='Small (10-50 employees)'>
                            Small (10-50 employees)
                          </SelectItem>
                          <SelectItem value='Medium (50-200 employees)'>
                            Medium (50-200 employees)
                          </SelectItem>
                          <SelectItem value='Large (200+ employees)'>
                            Large (200+ employees)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='timezone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select timezone' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='America/New_York'>Eastern Time (ET)</SelectItem>
                          <SelectItem value='America/Chicago'>Central Time (CT)</SelectItem>
                          <SelectItem value='America/Denver'>Mountain Time (MT)</SelectItem>
                          <SelectItem value='America/Los_Angeles'>Pacific Time (PT)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='currency'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select currency' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='USD'>USD - US Dollar</SelectItem>
                          <SelectItem value='EUR'>EUR - Euro</SelectItem>
                          <SelectItem value='GBP'>GBP - British Pound</SelectItem>
                          <SelectItem value='CAD'>CAD - Canadian Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='primary_color'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <div className='flex gap-2'>
                          <Input
                            type='color'
                            className='w-16 h-10'
                            {...field}
                            value={field.value || '#3b82f6'}
                          />
                          <Input placeholder='#3b82f6' {...field} className='flex-1' />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='secondary_color'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color</FormLabel>
                      <FormControl>
                        <div className='flex gap-2'>
                          <Input
                            type='color'
                            className='w-16 h-10'
                            {...field}
                            value={field.value || '#60a5fa'}
                          />
                          <Input placeholder='#60a5fa' {...field} className='flex-1' />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='company_logo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Logo URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://example.com/logo.png'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  <>
                    <Building2 className='mr-2 h-4 w-4' />
                    Add Client
                  </>
                )}
              </Button>
            </form>
          </Form>

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
