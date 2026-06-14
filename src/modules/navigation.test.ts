import { describe, expect, it } from 'vitest'
import { permissionProfiles } from '@/services/auth/shared'
import {
  resolveManifestForPath,
  resolveCommandMenuNavigationGroups,
  resolveNavigationGroups,
  resolveRequiredPermissionForPath,
} from './navigation'

function createPermissionResolver(permissions: string[]) {
  const allowed = new Set(permissions)

  return (permission?: string | null) => !permission || allowed.has(permission)
}

describe('modules/navigation', () => {
  it('filters sidebar navigation items by permission while preserving accessible groups', () => {
    const groups = resolveNavigationGroups(
      createPermissionResolver(permissionProfiles.viewer)
    )

    const generalGroup = groups.find((group) => group.id === 'general')
    const otherGroup = groups.find((group) => group.id === 'other')

    expect(generalGroup?.items.map((item) => item.moduleId)).toEqual([
      'dashboard',
      'resources',
    ])
    expect(otherGroup?.items.map((item) => item.moduleId)).toEqual([
      'settings',
      'help-center',
    ])
  })

  it('filters command menu items with the same permission resolver', () => {
    const groups = resolveCommandMenuNavigationGroups(
      createPermissionResolver([
        'dashboard.view',
        'resources.view',
        'help-center.view',
      ])
    )

    const generalGroup = groups.find((group) => group.id === 'general')
    const otherGroup = groups.find((group) => group.id === 'other')

    expect(generalGroup?.items.map((item) => item.moduleId)).toEqual([
      'dashboard',
      'resources',
    ])
    expect(otherGroup?.items.map((item) => item.moduleId)).toEqual([
      'help-center',
    ])
  })

  it('resolves the most specific required permission for a pathname', () => {
    expect(resolveRequiredPermissionForPath('/')).toBe('dashboard.view')
    expect(resolveRequiredPermissionForPath('/resources/123')).toBe(
      'resources.view'
    )
    expect(resolveRequiredPermissionForPath('/settings/language')).toBe(
      'settings.view'
    )
    expect(resolveRequiredPermissionForPath('/settings/language/advanced')).toBe(
      'settings.view'
    )
    expect(resolveRequiredPermissionForPath('/sign-in')).toBeNull()
    expect(resolveRequiredPermissionForPath('/unknown')).toBeNull()
  })

  it('resolves the most specific registered manifest for a pathname', () => {
    expect(resolveManifestForPath('/settings/language')?.id).toBe(
      'settings-language'
    )
    expect(resolveManifestForPath('/resources/123')?.id).toBe('resources')
    expect(resolveManifestForPath('/sign-in-2')?.id).toBe('auth-sign-in-2')
    expect(resolveManifestForPath('/unknown')).toBeNull()
  })
})
