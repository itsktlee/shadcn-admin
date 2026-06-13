'use client'

import React from 'react'
import type { AuthSession } from '@/contracts/auth'
import { getClientSession } from '@/services/auth/client'
import { hasPermission as resolvePermission } from '@/services/auth/shared'

type AuthContextValue = {
  hasPermission: (permission?: string | null) => boolean
  isAuthenticated: boolean
  session: AuthSession | null
  setSession: React.Dispatch<React.SetStateAction<AuthSession | null>>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: AuthSession | null
}) {
  const [session, setSession] = React.useState<AuthSession | null>(
    initialSession ?? getClientSession()
  )

  const value = React.useMemo<AuthContextValue>(
    () => ({
      hasPermission: (permission) => resolvePermission(session, permission),
      isAuthenticated: session !== null,
      session,
      setSession,
    }),
    [session]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const value = React.useContext(AuthContext)

  if (!value) {
    throw new Error('useAuth must be used within AuthProvider.')
  }

  return value
}

function useAuthSession() {
  return useAuth().session
}

function usePermission(permission?: string | null) {
  return useAuth().hasPermission(permission)
}

export {
  AuthProvider,
  useAuth,
  useAuthSession,
  usePermission,
}
