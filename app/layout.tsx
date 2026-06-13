import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Inter, Manrope } from 'next/font/google'
import type { ReactNode } from 'react'
import { getServerSession } from '@/services/auth/server'
import { DEFAULT_FONT, isFont } from '@/config/fonts'
import { normalizeLanguage } from '@/i18n/config'
import {
  DIRECTION_COOKIE_NAME,
  FONT_COOKIE_NAME,
  LANGUAGE_LEGACY_COOKIE_NAMES,
  LANGUAGE_COOKIE_NAME,
  readCookieValue,
  THEME_LEGACY_COOKIE_NAMES,
  THEME_COOKIE_NAME,
} from '@/lib/cookies'
import { ThemeScript } from '@/components/ui/theme-script'
import { AppProviders } from '@/providers/app-providers'
import type { Direction } from '@/providers/direction-provider'
import type { Theme } from '@/providers/theme-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-app-inter',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-app-manrope',
})

export const metadata: Metadata = {
  title: 'Shadcn Admin Next Template',
  description: 'Next.js shell foundation for the admin template.',
}

function normalizeTheme(theme?: string | null): Theme {
  if (theme === 'light' || theme === 'dark' || theme === 'system') {
    return theme
  }

  return 'system'
}

function normalizeDirection(direction?: string | null): Direction {
  return direction === 'rtl' ? 'rtl' : 'ltr'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const cookieStore = await cookies()
  const getCookieFromStore = (name: string) => cookieStore.get(name)?.value
  const initialTheme = normalizeTheme(
    readCookieValue(
      getCookieFromStore,
      THEME_COOKIE_NAME,
      THEME_LEGACY_COOKIE_NAMES
    )
  )
  const initialLanguage = normalizeLanguage(
    readCookieValue(
      getCookieFromStore,
      LANGUAGE_COOKIE_NAME,
      LANGUAGE_LEGACY_COOKIE_NAMES
    )
  )
  const initialFontValue = cookieStore.get(FONT_COOKIE_NAME)?.value
  const initialFont = isFont(initialFontValue) ? initialFontValue : DEFAULT_FONT
  const initialDirection = normalizeDirection(
    cookieStore.get(DIRECTION_COOKIE_NAME)?.value
  )
  const initialSession = await getServerSession()

  const htmlClassName = [
    inter.variable,
    manrope.variable,
    initialFont !== 'system' ? `font-${initialFont}` : '',
    initialTheme === 'light' || initialTheme === 'dark' ? initialTheme : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <html
      lang={initialLanguage}
      dir={initialDirection}
      className={htmlClassName}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <AppProviders
          initialDir={initialDirection}
          initialFont={initialFont}
          initialLanguage={initialLanguage}
          initialSession={initialSession}
          initialTheme={initialTheme}
        >
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
