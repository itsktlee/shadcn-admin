'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

type DashboardSearchContextType = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const DashboardSearchContext =
  createContext<DashboardSearchContextType | null>(null)

export function DashboardSearchProvider({
  children,
}: {
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const value = useMemo(
    () => ({
      open,
      setOpen,
    }),
    [open]
  )

  return (
    <DashboardSearchContext value={value}>{children}</DashboardSearchContext>
  )
}

export function useDashboardSearch() {
  const context = useContext(DashboardSearchContext)

  if (!context) {
    throw new Error(
      'useDashboardSearch must be used within DashboardSearchProvider'
    )
  }

  return context
}
