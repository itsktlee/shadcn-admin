'use client'

import type { ReactNode } from 'react'
import {
  SidebarProvider,
  SIDEBAR_COOKIE_NAME,
} from '@/components/ui/sidebar'
import { getCookie } from '@/lib/cookies'
import {
  DashboardLayoutProvider,
  type DashboardCollapsible,
  type DashboardVariant,
} from './dashboard-layout-provider'
import { DashboardSearchProvider } from './dashboard-search-provider'

export function DashboardProviders({
  children,
  defaultSidebarOpen,
  initialLayoutCollapsible,
  initialLayoutVariant,
}: {
  children: ReactNode
  defaultSidebarOpen?: boolean
  initialLayoutCollapsible?: DashboardCollapsible
  initialLayoutVariant?: DashboardVariant
}) {
  const sidebarOpen =
    defaultSidebarOpen ?? getCookie(SIDEBAR_COOKIE_NAME) !== 'false'

  return (
    <DashboardSearchProvider>
      <DashboardLayoutProvider
        initialCollapsible={initialLayoutCollapsible}
        initialVariant={initialLayoutVariant}
      >
        <SidebarProvider defaultOpen={sidebarOpen}>{children}</SidebarProvider>
      </DashboardLayoutProvider>
    </DashboardSearchProvider>
  )
}
