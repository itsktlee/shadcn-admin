'use client'

import type { ReactNode } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitch } from '@/components/language-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

type DashboardPageShellProps = {
  badge?: string
  title: string
  description: string
  children?: ReactNode
}

export function DashboardPageShell({
  badge,
  title,
  description,
  children,
}: DashboardPageShellProps) {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <LanguageSwitch />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed>
        <div className='space-y-4'>
          {badge ? (
            <span className='inline-flex rounded-md border bg-background px-3 py-1 text-xs font-medium text-muted-foreground'>
              {badge}
            </span>
          ) : null}
          <div className='space-y-1.5'>
            <h1 className='text-2xl font-semibold tracking-tight md:text-3xl'>
              {title}
            </h1>
            <p className='max-w-3xl text-sm leading-6 text-muted-foreground'>
              {description}
            </p>
          </div>
        </div>

        <div className='mt-6 flex min-h-0 flex-1 flex-col'>{children}</div>
      </Main>
    </>
  )
}
