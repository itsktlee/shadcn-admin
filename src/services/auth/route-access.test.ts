import { beforeEach, describe, expect, it, vi } from 'vitest'

const ORIGINAL_RESOURCES_FLAG =
  process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES

async function importRouteAccess() {
  const module = await import('./route-access')
  return module
}

function restoreResourcesFlag() {
  if (ORIGINAL_RESOURCES_FLAG === undefined) {
    delete process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES
    return
  }

  process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES = ORIGINAL_RESOURCES_FLAG
}

describe('auth route access', () => {
  beforeEach(() => {
    restoreResourcesFlag()
    vi.resetModules()
  })

  it('keeps sign-in routes public', async () => {
    const { isProtectedPath, isPublicPath, publicPaths } = await importRouteAccess()

    expect(publicPaths.has('/sign-in')).toBe(true)
    expect(publicPaths.has('/errors/unauthorized')).toBe(true)
    expect(isPublicPath('/sign-in')).toBe(true)
    expect(isPublicPath('/sign-in-2')).toBe(true)
    expect(isPublicPath('/errors/forbidden')).toBe(true)
    expect(isProtectedPath('/sign-in')).toBe(false)
    expect(isProtectedPath('/errors/not-found')).toBe(false)
  })

  it('includes resources in protected prefixes by default', async () => {
    delete process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES

    const { getProtectedPrefixes, isProtectedPath } = await importRouteAccess()

    expect(getProtectedPrefixes()).toContain('/resources')
    expect(isProtectedPath('/resources')).toBe(true)
    expect(isProtectedPath('/resources/123')).toBe(true)
  })

  it('removes resources from protected prefixes when the reference module is disabled', async () => {
    process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES = 'false'

    const { getProtectedPrefixes, isProtectedPath, isPublicPath } =
      await importRouteAccess()

    expect(getProtectedPrefixes()).not.toContain('/resources')
    expect(isProtectedPath('/resources')).toBe(false)
    expect(isProtectedPath('/resources/123')).toBe(false)
    expect(isProtectedPath('/tasks')).toBe(true)
    expect(isProtectedPath('/')).toBe(true)
    expect(isPublicPath('/unknown')).toBe(false)
  })
})
