'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { resolveRequiredPermissionForPath } from '@/modules/navigation'
import { useAuth } from '@/providers/auth-provider'
import { PermissionDeniedState } from './permission-denied-state'

function DashboardRouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { hasPermission } = useAuth()
  const requiredPermission = resolveRequiredPermissionForPath(pathname)

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <PermissionDeniedState actionKey={requiredPermission} />
  }

  return children
}

export { DashboardRouteGuard }
