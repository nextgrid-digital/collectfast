import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CommunicationInbox } from './components/communication-inbox'
import { CommunicationDetail } from './components/communication-detail'
import { CommunicationsPrimaryButtons } from './components/communications-primary-buttons'
import { useCompany } from '@/context/company-context'
import { getCommunicationsByCompany, getInvoicesByCompany } from '@/data/mock/data-service'
import { sortCommunications, type SortOption } from './utils/communication-sorting'
import { getEntityFromCommunication } from './utils/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function Communication() {
  const { currentCompany, isLoading } = useCompany()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [selectedCommunicationId, setSelectedCommunicationId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'communications' | 'invoices'>('communications')

  const allCommunications = useMemo(() => {
    if (!currentCompany) return []
    return getCommunicationsByCompany(currentCompany.id)
  }, [currentCompany])

  const invoices = useMemo(() => {
    if (!currentCompany) return []
    return getInvoicesByCompany(currentCompany.id)
  }, [currentCompany])

  // Filter and sort communications
  const communications = useMemo(() => {
    let filtered = allCommunications

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (comm) =>
          comm.customerName.toLowerCase().includes(query) ||
          comm.relatedInvoiceId?.toLowerCase().includes(query) ||
          comm.subject.toLowerCase().includes(query) ||
          comm.message.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    return sortCommunications(filtered, sortOption, allCommunications)
  }, [allCommunications, searchQuery, sortOption])

  const invoiceLookup = useMemo(() => {
    return invoices.reduce<Record<string, { amount: number; dueDate: Date; status: string; customerId: string }>>(
      (acc, inv) => {
        acc[inv.invoiceNumber] = {
          amount: inv.amount,
          dueDate: inv.dueDate,
          status: inv.status,
          customerId: inv.customerId,
        }
        return acc
      },
      {}
    )
  }, [invoices])

  const viewCommunications = useMemo(() => {
    if (viewMode === 'communications') return communications

    // Invoice view: one row per invoice using latest communication, still respecting search query
    return invoices
      .filter((invoice) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        const matchesInvoice =
          invoice.invoiceNumber.toLowerCase().includes(q) ||
          invoice.customerName.toLowerCase().includes(q)
        const hasMatchingComm = allCommunications.some(
          (comm) =>
            comm.relatedInvoiceId === invoice.invoiceNumber &&
            (comm.customerName.toLowerCase().includes(q) ||
              comm.subject.toLowerCase().includes(q) ||
              comm.message.toLowerCase().includes(q))
        )
        return matchesInvoice || hasMatchingComm
      })
      .map((invoice) => {
        const related = allCommunications
          .filter((comm) => comm.relatedInvoiceId === invoice.invoiceNumber)
          .sort(
            (a, b) =>
              (b.sentDate?.getTime?.() ?? 0) - (a.sentDate?.getTime?.() ?? 0) ||
              (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0)
          )

        const latest = related[0]

        if (latest) return latest

        // Placeholder communication to keep the list aligned with invoices
        return {
          id: `inv-${invoice.invoiceNumber}`,
          customerName: invoice.customerName,
          customerId: invoice.customerId,
          type: 'email' as const,
          subject: `Invoice ${invoice.invoiceNumber} (no communications yet)`,
          message: 'No communications sent yet for this invoice.',
          status: 'sent' as const,
          sentDate: invoice.dueDate,
          scheduledDate: null,
          template: 'Invoice Sent' as const,
          relatedInvoiceId: invoice.invoiceNumber,
          createdAt: invoice.issueDate,
          updatedAt: invoice.updatedAt,
        }
      })
  }, [viewMode, invoices, communications, searchQuery, allCommunications])

  // Find selected communication
  const selectedCommunication = useMemo(() => {
    if (!selectedCommunicationId) return null
    return allCommunications.find((comm) => comm.id === selectedCommunicationId) || null
  }, [selectedCommunicationId, allCommunications])

  // Communication action handlers
  const handleResend = (_id: string) => {
    toast.success('Communication resent successfully')
    // In real app, this would call an API
  }

  const handleMarkAsRead = (_id: string) => {
    toast.success('Communication marked as read')
    // In real app, this would update the communication status
  }

  const handleScheduleFollowUp = (_id: string) => {
    toast.success('Follow-up scheduled')
    // In real app, this would open a dialog to schedule
  }

  const handleAddTask = (suggestion: { title: string; description: string; dueDate: Date | null }) => {
    toast.success(`Task "${suggestion.title}" added`)
    // In real app, this would create a task
  }

  const handleAddNote = (_content: string) => {
    toast.success('Note added')
    // In real app, this would save the note
  }

  const handleSelectCommunication = (id: string) => {
    setSelectedCommunicationId(id)
  }

  const handleBackToList = () => {
    setSelectedCommunicationId(null)
  }

  const handleViewEntityContext = () => {
    if (!selectedCommunication || !currentCompany) return
    
    const entity = getEntityFromCommunication(selectedCommunication, currentCompany.id)
    navigate({
      to: '/app/communication/$entityType/$entityId',
      params: {
        entityType: entity.type,
        entityId: entity.id,
      },
    })
  }

  if (isLoading || !currentCompany) {
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
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading company data...</p>
          </div>
        </Main>
      </>
    )
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

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6 overflow-hidden'>
        {/* Header */}
        <div className='flex flex-wrap items-end justify-between gap-2 flex-shrink-0'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Communications</h2>
            <p className='text-muted-foreground'>
              View and manage all customer communications, reminders, and follow-ups.
            </p>
          </div>
          {!selectedCommunicationId && <CommunicationsPrimaryButtons />}
        </div>

        {/* View toggle */}
        {!selectedCommunicationId && (
          <div className='flex items-center justify-start flex-shrink-0'>
            <div className='inline-flex rounded-full border bg-muted/40 p-1'>
              <Button
                type='button'
                size='sm'
                variant={viewMode === 'communications' ? 'default' : 'ghost'}
                className='px-3 rounded-full'
                onClick={() => setViewMode('communications')}
              >
                Communications
              </Button>
              <Button
                type='button'
                size='sm'
                variant={viewMode === 'invoices' ? 'default' : 'ghost'}
                className='px-3 rounded-full'
                onClick={() => setViewMode('invoices')}
              >
                By Invoice (latest)
              </Button>
            </div>
          </div>
        )}

        {/* Content: List or Detail */}
        <div className='flex-1 overflow-hidden min-h-0'>
          {selectedCommunicationId && selectedCommunication ? (
            <CommunicationDetail
              communication={selectedCommunication}
              allCommunications={allCommunications}
              onResend={handleResend}
              onMarkAsRead={handleMarkAsRead}
              onScheduleFollowUp={handleScheduleFollowUp}
              onAddTask={handleAddTask}
              onAddNote={handleAddNote}
              onSelectCommunication={handleSelectCommunication}
              onBackToList={handleBackToList}
              onViewEntityContext={handleViewEntityContext}
              companyId={currentCompany.id}
            />
          ) : (
            <CommunicationInbox
              communications={viewCommunications}
              allCommunications={allCommunications}
              companyId={currentCompany.id}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortOption={sortOption}
              onSortChange={(sort) => setSortOption(sort as SortOption)}
              selectedId={selectedCommunicationId}
              onSelect={handleSelectCommunication}
              mode={viewMode}
              invoiceLookup={invoiceLookup}
            />
          )}
        </div>
      </Main>
    </>
  )
}
