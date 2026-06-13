'use client'

import type { ReactNode } from 'react'
import type { AppFont } from '@/config/fonts'
import type { AuthSession } from '@/contracts/auth'
import type { AppLanguage } from '@/i18n'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from './auth-provider'
import { DirectionProvider, type Direction } from './direction-provider'
import { FontProvider } from './font-provider'
import { I18nProvider } from './i18n-provider'
import { QueryProvider } from './query-provider'
import { ThemeProvider, type Theme } from './theme-provider'

type AppProvidersProps = {
  children: ReactNode
  initialDir: Direction
  initialFont: AppFont
  initialLanguage: AppLanguage
  initialSession: AuthSession | null
  initialTheme: Theme
}

export function AppProviders({
  children,
  initialDir,
  initialFont,
  initialLanguage,
  initialSession,
  initialTheme,
}: AppProvidersProps) {
  return (
    <I18nProvider initialLanguage={initialLanguage}>
      <ThemeProvider initialTheme={initialTheme}>
        <FontProvider initialFont={initialFont}>
          <DirectionProvider initialDir={initialDir}>
            <AuthProvider initialSession={initialSession}>
              <QueryProvider>
                {children}
                <Toaster position='top-right' />
              </QueryProvider>
            </AuthProvider>
          </DirectionProvider>
        </FontProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}
