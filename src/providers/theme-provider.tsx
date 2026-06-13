'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getCookie,
  removeCookie,
  setCookie,
  syncLegacyCookie,
  THEME_LEGACY_COOKIE_NAMES,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
} from '@/lib/cookies'

export type Theme = 'dark' | 'light' | 'system'
export type ResolvedTheme = Exclude<Theme, 'system'>

const DEFAULT_THEME: Theme = 'system'

type ThemeProviderProps = {
  children: ReactNode
  initialTheme?: Theme
}

type ThemeProviderState = {
  defaultTheme: Theme
  resolvedTheme: ResolvedTheme
  theme: Theme
  setTheme: (theme: Theme) => void
  resetTheme: () => void
}

const ThemeContext = createContext<ThemeProviderState | null>(null)

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

export function ThemeProvider({
  children,
  initialTheme = DEFAULT_THEME,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = getCookie(
      THEME_COOKIE_NAME,
      THEME_LEGACY_COOKIE_NAMES
    ) as Theme | undefined
    return savedTheme ?? initialTheme
  })
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof document !== 'undefined') {
      if (document.documentElement.classList.contains('dark')) return 'dark'
      if (document.documentElement.classList.contains('light')) return 'light'
    }

    return initialTheme === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    syncLegacyCookie(
      THEME_COOKIE_NAME,
      THEME_LEGACY_COOKIE_NAMES,
      THEME_COOKIE_MAX_AGE
    )

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (nextTheme: Theme) => {
      const nextResolvedTheme = resolveTheme(nextTheme)
      const root = window.document.documentElement

      root.classList.remove('light', 'dark')
      root.classList.add(nextResolvedTheme)
      root.style.colorScheme = nextResolvedTheme
      setResolvedTheme(nextResolvedTheme)
    }

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme(theme)
      }
    }

    applyTheme(theme)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const contextValue = useMemo<ThemeProviderState>(
    () => ({
      defaultTheme: DEFAULT_THEME,
      resolvedTheme,
      theme,
      setTheme: (nextTheme: Theme) => {
        setCookie(
          THEME_COOKIE_NAME,
          nextTheme,
          THEME_COOKIE_MAX_AGE,
          THEME_LEGACY_COOKIE_NAMES
        )
        setThemeState(nextTheme)
      },
      resetTheme: () => {
        removeCookie(THEME_COOKIE_NAME, THEME_LEGACY_COOKIE_NAMES)
        setThemeState(DEFAULT_THEME)
      },
    }),
    [resolvedTheme, theme]
  )

  return <ThemeContext value={contextValue}>{children}</ThemeContext>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
