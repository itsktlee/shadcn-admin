import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import {
  getCookie,
  setCookie,
  THEME_COOKIE_NAME,
  THEME_LEGACY_COOKIE_NAMES,
} from '@/lib/cookies'
import { clearCookies } from '@/test-utils/cookies'
import { ThemeProvider } from './theme-provider'

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearCookies()
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.style.colorScheme = ''

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
  })

  it('applies the initial theme to the document root during hydration', async () => {
    const { getByText } = await render(
      <ThemeProvider initialTheme='dark'>
        <span>theme-ready</span>
      </ThemeProvider>
    )

    await expect.element(getByText('theme-ready')).toBeInTheDocument()

    await vi.waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(document.documentElement.style.colorScheme).toBe('dark')
    })
  })

  it('migrates a legacy theme cookie to the new template key', async () => {
    setCookie(THEME_LEGACY_COOKIE_NAMES[0], 'dark')

    const { getByText } = await render(
      <ThemeProvider initialTheme='system'>
        <span>theme-migrated</span>
      </ThemeProvider>
    )

    await expect.element(getByText('theme-migrated')).toBeInTheDocument()

    await vi.waitFor(() => {
      expect(getCookie(THEME_COOKIE_NAME)).toBe('dark')
      expect(getCookie(THEME_LEGACY_COOKIE_NAMES[0])).toBeUndefined()
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })
})
