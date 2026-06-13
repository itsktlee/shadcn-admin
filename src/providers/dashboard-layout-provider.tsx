'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getCookie, setCookie } from '@/lib/cookies'

export type DashboardCollapsible = 'offcanvas' | 'icon' | 'none'
export type DashboardVariant = 'inset' | 'sidebar' | 'floating'

const LAYOUT_COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible'
const LAYOUT_VARIANT_COOKIE_NAME = 'layout_variant'
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const DEFAULT_VARIANT: DashboardVariant = 'inset'
const DEFAULT_COLLAPSIBLE: DashboardCollapsible = 'icon'

type DashboardLayoutContextType = {
  resetLayout: () => void
  defaultCollapsible: DashboardCollapsible
  collapsible: DashboardCollapsible
  setCollapsible: (collapsible: DashboardCollapsible) => void
  defaultVariant: DashboardVariant
  variant: DashboardVariant
  setVariant: (variant: DashboardVariant) => void
}

const DashboardLayoutContext =
  createContext<DashboardLayoutContextType | null>(null)

export function DashboardLayoutProvider({
  children,
  initialCollapsible,
  initialVariant,
}: {
  children: ReactNode
  initialCollapsible?: DashboardCollapsible
  initialVariant?: DashboardVariant
}) {
  const [collapsible, setCollapsibleState] =
    useState<DashboardCollapsible>(() => {
      if (initialCollapsible) {
        return initialCollapsible
      }

      const saved = getCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME)
      return (saved as DashboardCollapsible) || DEFAULT_COLLAPSIBLE
    })

  const [variant, setVariantState] = useState<DashboardVariant>(() => {
    if (initialVariant) {
      return initialVariant
    }

    const saved = getCookie(LAYOUT_VARIANT_COOKIE_NAME)
    return (saved as DashboardVariant) || DEFAULT_VARIANT
  })

  const value = useMemo<DashboardLayoutContextType>(
    () => ({
      resetLayout: () => {
        setCollapsibleState(DEFAULT_COLLAPSIBLE)
        setVariantState(DEFAULT_VARIANT)
      },
      defaultCollapsible: DEFAULT_COLLAPSIBLE,
      collapsible,
      setCollapsible: (nextCollapsible) => {
        setCollapsibleState(nextCollapsible)
        setCookie(
          LAYOUT_COLLAPSIBLE_COOKIE_NAME,
          nextCollapsible,
          LAYOUT_COOKIE_MAX_AGE
        )
      },
      defaultVariant: DEFAULT_VARIANT,
      variant,
      setVariant: (nextVariant) => {
        setVariantState(nextVariant)
        setCookie(
          LAYOUT_VARIANT_COOKIE_NAME,
          nextVariant,
          LAYOUT_COOKIE_MAX_AGE
        )
      },
    }),
    [collapsible, variant]
  )

  return <DashboardLayoutContext value={value}>{children}</DashboardLayoutContext>
}

export function useDashboardLayout() {
  const context = useContext(DashboardLayoutContext)

  if (!context) {
    throw new Error(
      'useDashboardLayout must be used within DashboardLayoutProvider'
    )
  }

  return context
}
