import { authSessionSchema, type AppPermission, type AuthSession, type AuthUser } from '@/contracts/auth'

const AUTH_SESSION_COOKIE_NAME = 'template-auth-session'
const AUTH_SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

const permissionProfiles = {
  admin: [
    'dashboard.view',
    'resources.view',
    'resources.create',
    'resources.edit',
    'resources.delete',
    'resources.export',
    'tasks.view',
    'apps.view',
    'chats.view',
    'users.view',
    'settings.view',
    'help-center.view',
  ],
  operator: [
    'dashboard.view',
    'resources.view',
    'resources.create',
    'resources.edit',
    'tasks.view',
    'apps.view',
    'chats.view',
    'settings.view',
    'help-center.view',
  ],
  viewer: [
    'dashboard.view',
    'resources.view',
    'settings.view',
    'help-center.view',
  ],
} as const satisfies Record<string, AppPermission[]>

type PermissionProfile = keyof typeof permissionProfiles

function detectPermissionProfile(email: string): PermissionProfile {
  const normalized = email.trim().toLowerCase()

  if (normalized.startsWith('viewer@') || normalized.includes('+viewer@')) {
    return 'viewer'
  }

  if (normalized.startsWith('operator@') || normalized.includes('+operator@')) {
    return 'operator'
  }

  return 'admin'
}

function createUserNameFromEmail(email: string) {
  const localPart = email.split('@')[0] ?? 'template-user'

  return localPart
    .split(/[._+-]+/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(' ')
}

function createMockAuthSession(email: string): AuthSession {
  const normalizedEmail = email.trim().toLowerCase()
  const profile = detectPermissionProfile(normalizedEmail)
  const user: AuthUser = {
    id: `mock-${profile}-${normalizedEmail}`,
    name: createUserNameFromEmail(normalizedEmail),
    email: normalizedEmail,
    avatar: '/images/shadcn-admin.png',
    roles: [profile],
  }

  return authSessionSchema.parse({
    user,
    permissions: permissionProfiles[profile],
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    provider: 'mock',
  })
}

function parseAuthSessionCookieValue(value?: string | null) {
  if (!value) {
    return null
  }

  const candidates = [value]

  try {
    candidates.push(decodeURIComponent(value))
  } catch {
    // Ignore malformed URI sequences and fall back to the raw value.
  }

  for (const candidate of candidates) {
    try {
      return authSessionSchema.parse(JSON.parse(candidate))
    } catch {
      // Try the next candidate.
    }
  }

  return null
}

function serializeAuthSessionCookieValue(session: AuthSession) {
  return JSON.stringify(authSessionSchema.parse(session))
}

function hasPermission(
  session: AuthSession | null | undefined,
  permission?: string | null
) {
  if (!permission) {
    return true
  }

  if (!session) {
    return false
  }

  return session.permissions.includes(permission)
}

function hasAnyPermission(
  session: AuthSession | null | undefined,
  permissions: Array<string | null | undefined>
) {
  const requiredPermissions = permissions.filter(Boolean)

  if (requiredPermissions.length === 0) {
    return true
  }

  return requiredPermissions.some((permission) => hasPermission(session, permission))
}

export {
  AUTH_SESSION_COOKIE_MAX_AGE,
  AUTH_SESSION_COOKIE_NAME,
  createMockAuthSession,
  detectPermissionProfile,
  hasAnyPermission,
  hasPermission,
  parseAuthSessionCookieValue,
  permissionProfiles,
  serializeAuthSessionCookieValue,
}

export type {
  PermissionProfile,
}
