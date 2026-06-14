import { registeredModules } from '@/modules/registry'
import { resolveManifestForPath } from '@/modules/navigation'
import type { LinkModuleManifest } from '@/modules/types'

const systemPublicPaths = new Set(['/404'])

function isLinkModuleManifest(
  manifest: (typeof registeredModules)[number]
): manifest is LinkModuleManifest {
  return manifest.kind === 'link'
}

function getPublicPaths() {
  return new Set([
    ...systemPublicPaths,
    ...registeredModules
      .filter((manifest) => isLinkModuleManifest(manifest) && !manifest.permission)
      .map((manifest) => manifest.href),
  ])
}

const publicPaths = getPublicPaths()

function getProtectedPrefixes() {
  return Array.from(
    new Set(
      registeredModules
        .filter((manifest) => isLinkModuleManifest(manifest) && !!manifest.permission)
        .map((manifest) => manifest.href)
    )
  )
}

function isPublicPath(pathname: string) {
  if (systemPublicPaths.has(pathname)) {
    return true
  }

  const manifest = resolveManifestForPath(pathname)
  return manifest !== null && !manifest.permission
}

function isProtectedPath(pathname: string) {
  return resolveManifestForPath(pathname)?.permission != null
}

export { getProtectedPrefixes, isProtectedPath, isPublicPath, publicPaths }
