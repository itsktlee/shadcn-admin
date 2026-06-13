'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DirectionProvider as RadixDirectionProvider } from '@radix-ui/react-direction'
import {
  DIRECTION_COOKIE_MAX_AGE,
  DIRECTION_COOKIE_NAME,
  getCookie,
  removeCookie,
  setCookie,
} from '@/lib/cookies'

export type Direction = 'ltr' | 'rtl'

const DEFAULT_DIRECTION: Direction = 'ltr'

type DirectionContextType = {
  defaultDir: Direction
  dir: Direction
  setDir: (dir: Direction) => void
  resetDir: () => void
}

const DirectionContext = createContext<DirectionContextType | null>(null)

function isDirection(value?: string | null): value is Direction {
  return value === 'ltr' || value === 'rtl'
}

export function DirectionProvider({
  children,
  initialDir = DEFAULT_DIRECTION,
}: {
  children: ReactNode
  initialDir?: Direction
}) {
  const [dir, setDirState] = useState<Direction>(() => {
    const savedDirection = getCookie(DIRECTION_COOKIE_NAME)
    return isDirection(savedDirection) ? savedDirection : initialDir
  })

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir)
  }, [dir])

  const value = useMemo<DirectionContextType>(
    () => ({
      defaultDir: DEFAULT_DIRECTION,
      dir,
      setDir: (nextDirection) => {
        setCookie(DIRECTION_COOKIE_NAME, nextDirection, DIRECTION_COOKIE_MAX_AGE)
        setDirState(nextDirection)
      },
      resetDir: () => {
        removeCookie(DIRECTION_COOKIE_NAME)
        setDirState(DEFAULT_DIRECTION)
      },
    }),
    [dir]
  )

  return (
    <DirectionContext value={value}>
      <RadixDirectionProvider dir={dir}>{children}</RadixDirectionProvider>
    </DirectionContext>
  )
}

export function useDirection() {
  const context = useContext(DirectionContext)

  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider')
  }

  return context
}
