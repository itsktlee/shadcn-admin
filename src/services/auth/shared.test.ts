import { describe, expect, it } from 'vitest'
import {
  createMockAuthSession,
  detectPermissionProfile,
  hasAnyPermission,
  hasPermission,
  parseAuthSessionCookieValue,
  permissionProfiles,
  serializeAuthSessionCookieValue,
} from './shared'

describe('auth/shared', () => {
  it('detects viewer, operator, and admin permission profiles from email', () => {
    expect(detectPermissionProfile('viewer@template.dev')).toBe('viewer')
    expect(detectPermissionProfile('ops+viewer@template.dev')).toBe('viewer')
    expect(detectPermissionProfile('OPERATOR@template.dev')).toBe('operator')
    expect(detectPermissionProfile('admin@template.dev')).toBe('admin')
  })

  it('creates a mock auth session with normalized identity and permissions', () => {
    const session = createMockAuthSession(' Operator.Team+operator@Template.dev ')

    expect(session.user.email).toBe('operator.team+operator@template.dev')
    expect(session.user.name).toBe('Operator Team Operator')
    expect(session.user.roles).toEqual(['operator'])
    expect(session.permissions).toEqual(permissionProfiles.operator)
    expect(session.provider).toBe('mock')
  })

  it('serializes and parses auth session cookies, including URI-encoded values', () => {
    const session = createMockAuthSession('viewer@template.dev')
    const serialized = serializeAuthSessionCookieValue(session)

    expect(parseAuthSessionCookieValue(serialized)).toEqual(session)
    expect(parseAuthSessionCookieValue(encodeURIComponent(serialized))).toEqual(
      session
    )
  })

  it('returns null for malformed cookie payloads', () => {
    expect(parseAuthSessionCookieValue()).toBeNull()
    expect(parseAuthSessionCookieValue('not-json')).toBeNull()
    expect(parseAuthSessionCookieValue('%E0%A4%A')).toBeNull()
  })

  it('evaluates permission helpers against the current session', () => {
    const viewerSession = createMockAuthSession('viewer@template.dev')

    expect(hasPermission(viewerSession, 'resources.view')).toBe(true)
    expect(hasPermission(viewerSession, 'users.view')).toBe(false)
    expect(hasPermission(null, 'resources.view')).toBe(false)
    expect(hasPermission(null, null)).toBe(true)

    expect(
      hasAnyPermission(viewerSession, ['users.view', 'resources.view'])
    ).toBe(true)
    expect(hasAnyPermission(viewerSession, ['users.view', 'apps.view'])).toBe(
      false
    )
    expect(hasAnyPermission(null, [])).toBe(true)
  })
})
