import { useState } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CommunicationList } from './components/communication-list'
import { CommunicationDetail } from './components/communication-detail'
import { CommunicationsPrimaryButtons } from './components/communications-primary-buttons'
import { communications } from './data/communications'

export function Communication() {
  const [selectedCommunicationId, setSelectedCommunicationId] = useState<string | null>(
    communications[0]?.id || null
  )
  const [searchQuery, setSearchQuery] = useState('')

  const selectedCommunication = communications.find(
    (comm) => comm.id === selectedCommunicationId
  ) || null

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
        <div className='flex flex-wrap items-end justify-between gap-2 flex-shrink-0'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Communication</h2>
            <p className='text-muted-foreground'>
              Track and manage all customer communications, reminders, and messages.
            </p>
          </div>
          <CommunicationsPrimaryButtons />
        </div>

        {/* Master-Detail Layout */}
        <div className='flex flex-1 gap-4 overflow-hidden min-h-0'>
          {/* Left Panel - Communication List */}
          <div className='w-full md:w-1/3 lg:w-1/4 flex-shrink-0'>
            <div className='h-full'>
              <CommunicationList
                communications={communications}
                selectedId={selectedCommunicationId}
                onSelect={setSelectedCommunicationId}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          </div>

          {/* Right Panel - Communication Detail */}
          <div className='flex-1 overflow-hidden rounded-md border min-w-0'>
            <CommunicationDetail communication={selectedCommunication} />
          </div>
        </div>
      </Main>
    </>
  )
}
