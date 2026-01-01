import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, ExternalLink } from 'lucide-react'
import { sleep } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface QuickBooksConnectionProps {
  onSuccess: (data: { accessToken: string; companyId: string; companyName: string }) => void
  onError: (error: string) => void
  onConnect: () => void
  isConnecting: boolean
}

export function QuickBooksConnection({
  onSuccess,
  onError,
  onConnect,
  isConnecting,
}: QuickBooksConnectionProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isAuthorizing, setIsAuthorizing] = useState(false)

  const handleConnect = () => {
    onConnect()
    setShowAuthDialog(true)
  }

  const handleAuthorize = async () => {
    setIsAuthorizing(true)

    // Simulate OAuth flow
    await sleep(2000)

    try {
      // Mock successful connection
      const mockData = {
        accessToken: 'qb_mock_access_token_' + Date.now(),
        companyId: 'qb_company_' + Math.random().toString(36).substr(2, 9),
        companyName: 'QuickBooks Company',
      }

      setIsAuthorizing(false)
      setShowAuthDialog(false)
      onSuccess(mockData)
    } catch (error) {
      setIsAuthorizing(false)
      onError('Failed to connect to QuickBooks. Please try again.')
    }
  }

  return (
    <>
      <div className='space-y-4'>
        <div className='p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900'>
          <div className='flex items-start gap-3'>
            <div className='h-10 w-10 rounded bg-blue-600 flex items-center justify-center shrink-0'>
              <span className='text-white font-bold text-sm'>QB</span>
            </div>
            <div className='flex-1'>
              <h3 className='font-semibold text-sm mb-1'>QuickBooks Integration</h3>
              <p className='text-xs text-muted-foreground'>
                Connect your QuickBooks account to sync invoices, customers, and payment data
                automatically.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className='w-full'
          size='lg'
        >
          {isConnecting ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Connecting...
            </>
          ) : (
            <>
              <ExternalLink className='mr-2 h-4 w-4' />
              Connect with QuickBooks
            </>
          )}
        </Button>

        <p className='text-xs text-muted-foreground text-center'>
          You'll be redirected to QuickBooks to authorize the connection
        </p>
      </div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authorize QuickBooks Access</DialogTitle>
            <DialogDescription>
              Please authorize Collectfast to access your QuickBooks account
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='p-4 bg-muted rounded-lg space-y-2'>
              <h4 className='font-semibold text-sm'>Permissions Requested:</h4>
              <ul className='text-sm text-muted-foreground space-y-1 list-disc list-inside'>
                <li>Read company information</li>
                <li>Read and write invoices</li>
                <li>Read customer data</li>
                <li>Read payment information</li>
              </ul>
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={() => setShowAuthDialog(false)}
                className='flex-1'
                disabled={isAuthorizing}
              >
                Cancel
              </Button>
              <Button onClick={handleAuthorize} className='flex-1' disabled={isAuthorizing}>
                {isAuthorizing ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Authorizing...
                  </>
                ) : (
                  'Authorize'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

