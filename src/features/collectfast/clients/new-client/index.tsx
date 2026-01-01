import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Building2, ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Stepper } from '@/components/ui/stepper'
import { useCompany } from '@/context/company-context'
import { ERPConnectionStep } from './components/erp-connection-step'

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
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [erpConnectionData, setErpConnectionData] = useState<{
    provider: 'quickbooks' | 'xero' | 'freshbooks'
    accessToken: string
    companyId: string
    companyName: string
  } | null>(null)
  const navigate = useNavigate()
  const { isAccountant } = useCompany()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: '',
      erp_provider: undefined,
      industry: '',
      company_size: '',
      timezone: 'America/New_York',
      currency: 'USD',
      primary_color: '#3b82f6',
      secondary_color: '#60a5fa',
      company_logo: '',
    },
  })

  const erpProvider = form.watch('erp_provider')

  const handleNext = async () => {
    // Validate step 1 before proceeding
    const isValid = await form.trigger([
      'company_name',
      'erp_provider',
      'industry',
      'company_size',
      'timezone',
      'currency',
      'primary_color',
      'secondary_color',
    ])

    if (isValid && currentStep === 1) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const handleERPConnectionSuccess = (data: {
    provider: 'quickbooks' | 'xero' | 'freshbooks'
    accessToken: string
    companyId: string
    companyName: string
  }) => {
    setErpConnectionData(data)
    toast.success(`Successfully connected to ${data.provider}!`)
  }

  const handleERPConnectionError = (error: string) => {
    toast.error(error)
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!erpConnectionData) {
      toast.error('Please connect to your ERP provider before completing setup')
      return
    }

    setIsLoading(true)

    toast.promise(sleep(2000), {
      loading: 'Creating new client...',
      success: () => {
        setIsLoading(false)
        // In a real app, this would create the company via API with ERP connection data
        // For prototype, just show success and redirect
        navigate({ to: '/app/accountant-dashboard', replace: true })
        return `Client "${data.company_name}" created successfully with ${erpConnectionData.provider} connection!`
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
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='mb-4'>
          <h1 className='text-3xl font-bold text-foreground'>Add New Client</h1>
          <p className='text-muted-foreground mt-2'>
            {currentStep === 1
              ? 'Enter the details below to add a new client company'
              : 'Connect to your ERP provider to complete the setup'}
          </p>
        </div>

        {/* Progress Stepper */}
        <Card>
          <CardContent className='pt-6'>
            <Stepper currentStep={currentStep} totalSteps={2} />
          </CardContent>
        </Card>

        {/* Step 1: Client Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Client Information</CardTitle>
              <CardDescription>
                Fill in the details for the new client company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='company_name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder='Acme Corporation' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='erp_provider'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ERP Provider *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select ERP provider' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='quickbooks'>QuickBooks</SelectItem>
                            <SelectItem value='xero'>Xero</SelectItem>
                            <SelectItem value='freshbooks'>FreshBooks</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='industry'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry *</FormLabel>
                        <FormControl>
                          <Input placeholder='Software, Retail, Consulting, etc.' {...field} />
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
                        <FormLabel>Company Size *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select company size' />
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

                  <FormField
                    control={form.control}
                    name='timezone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone *</FormLabel>
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
                        <FormLabel>Currency *</FormLabel>
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

                  <FormField
                    control={form.control}
                    name='primary_color'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color *</FormLabel>
                        <FormControl>
                          <div className='flex gap-2'>
                            <Input
                              type='color'
                              className='w-20 h-10'
                              {...field}
                              value={field.value || '#3b82f6'}
                            />
                            <Input placeholder='#3b82f6' {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>Hex color code for primary branding</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='secondary_color'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Color *</FormLabel>
                        <FormControl>
                          <div className='flex gap-2'>
                            <Input
                              type='color'
                              className='w-20 h-10'
                              {...field}
                              value={field.value || '#60a5fa'}
                            />
                            <Input placeholder='#60a5fa' {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>Hex color code for secondary branding</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='company_logo'
                    render={({ field }) => (
                      <FormItem className='md:col-span-2'>
                        <FormLabel>Company Logo URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='https://example.com/logo.png'
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>Optional: URL to the company logo image</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                  <div className='flex justify-end gap-4 pt-4'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => navigate({ to: '/app/accountant-dashboard' })}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button type='button' onClick={handleNext} disabled={isLoading}>
                      Next
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: ERP Connection */}
        {currentStep === 2 && erpProvider && (
          <>
            <ERPConnectionStep
              provider={erpProvider}
              onConnectionSuccess={handleERPConnectionSuccess}
              onConnectionError={handleERPConnectionError}
            />

            <Card>
              <CardContent className='pt-6'>
                <div className='flex justify-between gap-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Back
                  </Button>
                  <Button
                    type='button'
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isLoading || !erpConnectionData}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Building2 className='mr-2 h-4 w-4' />
                        Complete Setup
                      </>
                    )}
                  </Button>
                </div>
                {!erpConnectionData && (
                  <p className='text-sm text-muted-foreground text-center mt-4'>
                    Please connect to your ERP provider to continue
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Main>
    </>
  )
}

