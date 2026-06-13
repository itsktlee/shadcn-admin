'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_FONT, isFont, type AppFont } from '@/config/fonts'
import {
  FONT_COOKIE_MAX_AGE,
  FONT_COOKIE_NAME,
  getCookie,
  removeCookie,
  setCookie,
} from '@/lib/cookies'

type FontContextType = {
  font: AppFont
  setFont: (font: AppFont) => void
  resetFont: () => void
}

const FontContext = createContext<FontContextType | null>(null)

function applyFont(font: AppFont) {
  const root = document.documentElement

  root.classList.forEach((className) => {
    if (className.startsWith('font-')) {
      root.classList.remove(className)
    }
  })

  if (font !== 'system') {
    root.classList.add(`font-${font}`)
  }
}

export function FontProvider({
  children,
  initialFont = DEFAULT_FONT,
}: {
  children: ReactNode
  initialFont?: AppFont
}) {
  const [font, setFontState] = useState<AppFont>(() => {
    const savedFont = getCookie(FONT_COOKIE_NAME)
    return isFont(savedFont) ? savedFont : initialFont
  })

  useEffect(() => {
    applyFont(font)
  }, [font])

  const value = useMemo<FontContextType>(
    () => ({
      font,
      setFont: (nextFont) => {
        setCookie(FONT_COOKIE_NAME, nextFont, FONT_COOKIE_MAX_AGE)
        setFontState(nextFont)
      },
      resetFont: () => {
        removeCookie(FONT_COOKIE_NAME)
        setFontState(DEFAULT_FONT)
      },
    }),
    [font]
  )

  return <FontContext value={value}>{children}</FontContext>
}

export function useFont() {
  const context = useContext(FontContext)

  if (!context) {
    throw new Error('useFont must be used within a FontProvider')
  }

  return context
}
