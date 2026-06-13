import { navigationConfig } from '@/config/navigation'
import { getModuleManifest, registeredModules } from './registry'
import type {
  ModuleManifest,
  ResolvedNavCollapsible,
  ResolvedNavGroup,
  ResolvedNavItem,
  ResolvedNavLink,
} from './types'

type PermissionResolver = (permission?: string | null) => boolean

function getRegisteredManifest(id: string): ModuleManifest | null {
  const manifest = getModuleManifest(id)

  if (!manifest) {
    return null
  }

  return manifest
}

function resolveLink(
  moduleId: string,
  canAccess: PermissionResolver
): ResolvedNavLink | null {
  const manifest = getRegisteredManifest(moduleId)

  if (
    !manifest ||
    manifest.kind !== 'link' ||
    !canAccess(manifest.permission)
  ) {
    return null
  }

  return {
    moduleId: manifest.id,
    title: manifest.title,
    titleKey: manifest.titleKey,
    badge: manifest.badge,
    icon: manifest.icon,
    permission: manifest.permission,
    url: manifest.href,
  }
}

function resolveItem(
  moduleId: string,
  canAccess: PermissionResolver
): ResolvedNavItem | null {
  const manifest = getRegisteredManifest(moduleId)

  if (!manifest) {
    return null
  }

  if (manifest.kind === 'link') {
    return resolveLink(moduleId, canAccess)
  }

  const items = manifest.children
    .map((childId) => resolveLink(childId, canAccess))
    .filter((item): item is ResolvedNavLink => item !== null)

  if (items.length === 0 || !canAccess(manifest.permission)) {
    return null
  }

  const resolvedGroup: ResolvedNavCollapsible = {
    moduleId: manifest.id,
    title: manifest.title,
    titleKey: manifest.titleKey,
    badge: manifest.badge,
    icon: manifest.icon,
    permission: manifest.permission,
    items,
  }

  return resolvedGroup
}

function resolveNavigationGroups(
  canAccess: PermissionResolver = () => true
): ResolvedNavGroup[] {
  return navigationConfig
    .map((group) => ({
      id: group.id,
      title: group.title,
      titleKey: group.titleKey,
      items: group.items
        .map((item) => resolveItem(item, canAccess))
        .filter((item): item is ResolvedNavItem => item !== null),
    }))
    .filter((group) => group.items.length > 0)
}

function resolveCommandMenuNavigationGroups(
  canAccess: PermissionResolver = () => true
) {
  return resolveNavigationGroups(canAccess).map((group) => ({
    ...group,
    items: group.items
      .map((item) => {
        if ('url' in item) {
          const manifest = getRegisteredManifest(item.moduleId)
          return manifest?.searchable === false ? null : item
        }

        const nestedItems = item.items.filter((nestedItem) => {
          const manifest = getRegisteredManifest(nestedItem.moduleId)
          return manifest?.searchable !== false
        })

        if (nestedItems.length === 0) {
          return null
        }

        return {
          ...item,
          items: nestedItems,
        }
      })
      .filter((item): item is ResolvedNavItem => item !== null),
  }))
}

function resolveRequiredPermissionForPath(pathname: string) {
  const matches = registeredModules
    .filter(
      (manifest): manifest is Extract<ModuleManifest, { kind: 'link' }> =>
        manifest.kind === 'link' &&
        !!manifest.permission &&
        (pathname === manifest.href || pathname.startsWith(`${manifest.href}/`))
    )
    .sort((left, right) => right.href.length - left.href.length)

  return matches[0]?.permission ?? null
}

const resolvedNavigationGroups = resolveNavigationGroups()
const commandMenuNavigationGroups = resolveCommandMenuNavigationGroups()

export {
  commandMenuNavigationGroups,
  resolveCommandMenuNavigationGroups,
  resolveNavigationGroups,
  resolveRequiredPermissionForPath,
  resolvedNavigationGroups,
}
