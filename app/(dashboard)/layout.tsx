import { cookies } from 'next/headers'
import type { ReactNode } from 'react'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { CommandMenu } from '@/components/command-menu'
import { SkipToMain } from '@/components/skip-to-main'
import {
  SIDEBAR_COOKIE_NAME,
  SidebarInset,
} from '@/components/ui/sidebar'
import { DashboardRouteGuard } from '@/components/auth/dashboard-route-guard'
import { cn } from '@/lib/utils'
import { DashboardProviders } from '@/providers/dashboard-providers'
import type {
  DashboardCollapsible,
  DashboardVariant,
} from '@/providers/dashboard-layout-provider'

function normalizeDashboardCollapsible(
  value?: string
): DashboardCollapsible | undefined {
  if (value === 'offcanvas' || value === 'icon' || value === 'none') {
    return value
  }

  return undefined
}

function normalizeDashboardVariant(
  value?: string
): DashboardVariant | undefined {
  if (value === 'inset' || value === 'sidebar' || value === 'floating') {
    return value
  }

  return undefined
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const defaultSidebarOpen =
    cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== 'false'
  const initialLayoutCollapsible = normalizeDashboardCollapsible(
    cookieStore.get('layout_collapsible')?.value
  )
  const initialLayoutVariant = normalizeDashboardVariant(
    cookieStore.get('layout_variant')?.value
  )

  return (
    <DashboardProviders
      defaultSidebarOpen={defaultSidebarOpen}
      initialLayoutCollapsible={initialLayoutCollapsible}
      initialLayoutVariant={initialLayoutVariant}
    >
      <CommandMenu />
      <SkipToMain />
      <AppSidebar />
      <SidebarInset
        className={cn(
          '@container/content',
          'has-data-[layout=fixed]:h-svh',
          'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
        )}
      >
        <main
          id='content'
          data-layout='fixed'
          className='flex min-h-svh flex-1 flex-col'
        >
          <DashboardRouteGuard>{children}</DashboardRouteGuard>
        </main>
      </SidebarInset>
    </DashboardProviders>
  )
}
