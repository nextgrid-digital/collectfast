import { createFileRoute } from '@tanstack/react-router'
import { EntityDetailPage } from '@/features/collectfast/communication/components/entity-detail-page'
import { useCompany } from '@/context/company-context'
import { getCommunicationsByCompany } from '@/data/mock/data-service'
import {
  getCommunicationsByEntity,
  getInvoicesByEntity,
  getTasksByEntity,
  getEntityInfo,
} from '@/features/collectfast/communication/utils/entity-data'
import { useMemo } from 'react'

export const Route = createFileRoute('/app/communication/$entityType/$entityId')({
  component: EntityDetailPageRoute,
})

function EntityDetailPageRoute() {
  const { entityType, entityId: rawEntityId } = Route.useParams()
  // Decode entityId in case it was URL encoded
  const entityId = decodeURIComponent(rawEntityId)
  const { currentCompany, isLoading } = useCompany()
  
  console.log('EntityDetailPageRoute - entityType:', entityType, 'entityId:', entityId, 'rawEntityId:', rawEntityId)

  // Fetch data based on current company
  const data = useMemo(() => {
    if (!currentCompany || isLoading) {
      return null
    }

    const companyId = currentCompany.id

    // Get all communications for the company
    const allCommunications = getCommunicationsByCompany(companyId)

    // Get entity-specific data
    const communications = getCommunicationsByEntity(
      allCommunications,
      entityType as 'invoice' | 'customer',
      entityId
    )

    const invoices = getInvoicesByEntity(
      companyId,
      entityType as 'invoice' | 'customer',
      entityId
    )

    const tasks = getTasksByEntity(
      allCommunications,
      entityType as 'invoice' | 'customer',
      entityId
    )

    const entityInfo = getEntityInfo(
      companyId,
      entityType as 'invoice' | 'customer',
      entityId
    )

    return {
      entityType: entityType as 'invoice' | 'customer',
      entityId,
      entityName: entityInfo.name,
      communications,
      invoices,
      tasks,
      allCommunications,
      companyId,
    }
  }, [currentCompany, isLoading, entityType, entityId])

  if (isLoading || !currentCompany) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <p className='text-muted-foreground'>Unable to load entity data</p>
          <p className='text-sm text-muted-foreground mt-2'>
            {entityType}: {entityId}
          </p>
        </div>
      </div>
    )
  }

  return (
    <EntityDetailPage
      entityType={data.entityType}
      entityId={data.entityId}
      entityName={data.entityName}
      communications={data.communications}
      invoices={data.invoices}
      tasks={data.tasks}
      allCommunications={data.allCommunications}
      companyId={data.companyId}
    />
  )
}

