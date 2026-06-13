'use client'

import { useMemo } from 'react'
import { shellTeams, shellUser } from '@/config/shell'
import { resolveNavigationGroups } from '@/modules/navigation'
import { useAuth } from '@/providers/auth-provider'
import { type SidebarData } from '../types'

function useSidebarData(): SidebarData {
  const { hasPermission, session } = useAuth()

  return useMemo(
    () => ({
      user: session
        ? {
            name: session.user.name,
            email: session.user.email,
            avatar: session.user.avatar || shellUser.avatar,
          }
        : shellUser,
      teams: shellTeams,
      navGroups: resolveNavigationGroups(hasPermission),
    }),
    [hasPermission, session]
  )
}

export { useSidebarData }
