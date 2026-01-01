import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QuickBooksConnection } from './quickbooks-connection'
import { XeroConnection } from './xero-connection'
import { FreshBooksConnection } from './freshbooks-connection'

type ERPProvider = 'quickbooks' | 'xero' | 'freshbooks'

interface ERPConnectionStepProps {
  provider: ERPProvider
  onConnectionSuccess: (connectionData: {
    provider: ERPProvider
    accessToken: string
    companyId: string
    companyName: string
  }) => void
  onConnectionError: (error: string) => void
}

export function ERPConnectionStep({
  provider,
  onConnectionSuccess,
  onConnectionError,
}: ERPConnectionStepProps) {
  const [connectionStatus, setConnectionStatus] = useState<
    'not_connected' | 'connecting' | 'connected' | 'error'
  >('not_connected')
  const [connectionData, setConnectionData] = useState<{
    accessToken: string
    companyId: string
    companyName: string
  } | null>(null)

  const handleConnectionSuccess = (data: {
    accessToken: string
    companyId: string
    companyName: string
  }) => {
    setConnectionStatus('connected')
    setConnectionData(data)
    onConnectionSuccess({
      provider,
      ...data,
    })
  }

  const handleConnectionError = (error: string) => {
    setConnectionStatus('error')
    onConnectionError(error)
  }

  const handleConnect = () => {
    setConnectionStatus('connecting')
  }

  const getProviderName = (provider: ERPProvider) => {
    switch (provider) {
      case 'quickbooks':
        return 'QuickBooks'
      case 'xero':
        return 'Xero'
      case 'freshbooks':
        return 'FreshBooks'
    }
  }

  const renderProviderConnection = () => {
    switch (provider) {
      case 'quickbooks':
        return (
          <QuickBooksConnection
            onSuccess={handleConnectionSuccess}
            onError={handleConnectionError}
            onConnect={handleConnect}
            isConnecting={connectionStatus === 'connecting'}
          />
        )
      case 'xero':
        return (
          <XeroConnection
            onSuccess={handleConnectionSuccess}
            onError={handleConnectionError}
            onConnect={handleConnect}
            isConnecting={connectionStatus === 'connecting'}
          />
        )
      case 'freshbooks':
        return (
          <FreshBooksConnection
            onSuccess={handleConnectionSuccess}
            onError={handleConnectionError}
            onConnect={handleConnect}
            isConnecting={connectionStatus === 'connecting'}
          />
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Connect to {getProviderName(provider)}</CardTitle>
            <CardDescription>
              Authorize Collectfast to access your {getProviderName(provider)} account
            </CardDescription>
          </div>
          <Badge
            variant={
              connectionStatus === 'connected'
                ? 'default'
                : connectionStatus === 'error'
                  ? 'destructive'
                  : 'outline'
            }
            className='flex items-center gap-2'
          >
            {connectionStatus === 'connected' && (
              <>
                <CheckCircle2 className='h-3 w-3' />
                Connected
              </>
            )}
            {connectionStatus === 'connecting' && (
              <>
                <Loader2 className='h-3 w-3 animate-spin' />
                Connecting...
              </>
            )}
            {connectionStatus === 'error' && (
              <>
                <XCircle className='h-3 w-3' />
                Error
              </>
            )}
            {connectionStatus === 'not_connected' && 'Not Connected'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {renderProviderConnection()}

        {connectionStatus === 'connected' && connectionData && (
          <div className='mt-4 p-4 bg-muted rounded-lg space-y-2'>
            <h4 className='font-semibold text-sm'>Connection Details</h4>
            <div className='text-sm space-y-1 text-muted-foreground'>
              <p>
                <span className='font-medium'>Company:</span> {connectionData.companyName}
              </p>
              <p>
                <span className='font-medium'>Company ID:</span> {connectionData.companyId}
              </p>
              <p>
                <span className='font-medium'>Status:</span> Active
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

