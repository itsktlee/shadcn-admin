'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { resourcesQueryKeys } from '@/services/query/resources'
import { useTranslation } from 'react-i18next'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitch } from '@/components/language-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ResourcesDialogs } from './components/resources-dialogs'
import { ResourcesPrimaryButtons } from './components/resources-primary-buttons'
import { ResourcesProvider } from './components/resources-provider'
import { ResourcesTable } from './components/resources-table'
import { resourcesAdapter } from './data/data'
import { useResourcesRouteState } from './hooks/use-resources-route-state'

export function Resources() {
  const { t } = useTranslation()
  const { search, navigate } = useResourcesRouteState()
  const resourcesQuery = useQuery({
    queryKey: resourcesQueryKeys.list(search),
    queryFn: () => resourcesAdapter.listResources(search),
    placeholderData: keepPreviousData,
  })

  return (
    <ResourcesProvider>
      <Header fixed>
        <Search className='me-auto' />
        <LanguageSwitch />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div className='space-y-1'>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('resources.title')}
            </h2>
            <p className='text-muted-foreground'>{t('resources.desc')}</p>
          </div>
          <ResourcesPrimaryButtons />
        </div>
        <ResourcesTable
          data={resourcesQuery.data}
          isPending={resourcesQuery.isPending}
          isFetching={resourcesQuery.isFetching}
          search={search}
          navigate={navigate}
        />
      </Main>

      <ResourcesDialogs />
    </ResourcesProvider>
  )
}
