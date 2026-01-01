import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function Settings() {
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
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
            <p className='text-muted-foreground'>
              Configure your Collectfast preferences and account settings.
            </p>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic application settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='company-name'>Company Name</Label>
                <Input id='company-name' placeholder='Enter company name' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='currency'>Default Currency</Label>
                <Select defaultValue='usd'>
                  <SelectTrigger id='currency'>
                    <SelectValue placeholder='Select currency' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='usd'>USD - US Dollar</SelectItem>
                    <SelectItem value='eur'>EUR - Euro</SelectItem>
                    <SelectItem value='gbp'>GBP - British Pound</SelectItem>
                    <SelectItem value='cad'>CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='timezone'>Timezone</Label>
                <Select defaultValue='utc'>
                  <SelectTrigger id='timezone'>
                    <SelectValue placeholder='Select timezone' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='utc'>UTC</SelectItem>
                    <SelectItem value='est'>EST - Eastern Time</SelectItem>
                    <SelectItem value='pst'>PST - Pacific Time</SelectItem>
                    <SelectItem value='gmt'>GMT - Greenwich Mean Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='email-notifications'>Email Notifications</Label>
                  <p className='text-sm text-muted-foreground'>
                    Receive email alerts for overdue invoices
                  </p>
                </div>
                <Switch id='email-notifications' defaultChecked />
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='sms-notifications'>SMS Notifications</Label>
                  <p className='text-sm text-muted-foreground'>
                    Receive SMS alerts for critical updates
                  </p>
                </div>
                <Switch id='sms-notifications' />
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='payment-reminders'>Payment Reminders</Label>
                  <p className='text-sm text-muted-foreground'>
                    Automatically send payment reminders
                  </p>
                </div>
                <Switch id='payment-reminders' defaultChecked />
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='weekly-reports'>Weekly Reports</Label>
                  <p className='text-sm text-muted-foreground'>
                    Receive weekly summary reports
                  </p>
                </div>
                <Switch id='weekly-reports' defaultChecked />
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
              <CardDescription>
                Configure default payment terms and conditions
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='default-terms'>Default Payment Terms</Label>
                <Select defaultValue='net30'>
                  <SelectTrigger id='default-terms'>
                    <SelectValue placeholder='Select payment terms' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='net15'>Net 15</SelectItem>
                    <SelectItem value='net30'>Net 30</SelectItem>
                    <SelectItem value='net45'>Net 45</SelectItem>
                    <SelectItem value='net60'>Net 60</SelectItem>
                    <SelectItem value='due-on-receipt'>Due on Receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='late-fee'>Late Fee Percentage</Label>
                <Input
                  id='late-fee'
                  type='number'
                  placeholder='1.5'
                  defaultValue='1.5'
                />
                <p className='text-sm text-muted-foreground'>
                  Percentage charged for late payments
                </p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='grace-period'>Grace Period (Days)</Label>
                <Input
                  id='grace-period'
                  type='number'
                  placeholder='5'
                  defaultValue='5'
                />
                <p className='text-sm text-muted-foreground'>
                  Days before late fee is applied
                </p>
              </div>
              <Button>Save Terms</Button>
            </CardContent>
          </Card>

          {/* Email Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Customize email templates for customer communications
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='reminder-template'>Payment Reminder Template</Label>
                <Textarea
                  id='reminder-template'
                  placeholder='Dear {customer}, Your invoice {invoice_number} for {amount} is due on {due_date}.'
                  rows={4}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='overdue-template'>Overdue Notice Template</Label>
                <Textarea
                  id='overdue-template'
                  placeholder='Dear {customer}, Your invoice {invoice_number} for {amount} is now {days_overdue} days overdue.'
                  rows={4}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='sender-email'>Sender Email Address</Label>
                <Input
                  id='sender-email'
                  type='email'
                  placeholder='billing@yourcompany.com'
                />
              </div>
              <Button>Save Templates</Button>
            </CardContent>
          </Card>

          {/* Integration Settings */}
          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Connect with external services and APIs
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='accounting-api'>Accounting Software API</Label>
                <Select defaultValue='none'>
                  <SelectTrigger id='accounting-api'>
                    <SelectValue placeholder='Select accounting software' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>None</SelectItem>
                    <SelectItem value='quickbooks'>QuickBooks</SelectItem>
                    <SelectItem value='xero'>Xero</SelectItem>
                    <SelectItem value='sage'>Sage</SelectItem>
                    <SelectItem value='freshbooks'>FreshBooks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='payment-gateway'>Payment Gateway</Label>
                <Select defaultValue='none'>
                  <SelectTrigger id='payment-gateway'>
                    <SelectValue placeholder='Select payment gateway' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>None</SelectItem>
                    <SelectItem value='stripe'>Stripe</SelectItem>
                    <SelectItem value='paypal'>PayPal</SelectItem>
                    <SelectItem value='square'>Square</SelectItem>
                    <SelectItem value='authorize'>Authorize.net</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='api-key'>API Key</Label>
                <Input
                  id='api-key'
                  type='password'
                  placeholder='Enter API key'
                />
                <p className='text-sm text-muted-foreground'>
                  Keep your API keys secure and never share them
                </p>
              </div>
              <Button>Save Integration</Button>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
