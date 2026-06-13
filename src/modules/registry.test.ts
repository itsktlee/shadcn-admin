import { beforeEach, describe, expect, it, vi } from 'vitest'

const ORIGINAL_RESOURCES_FLAG =
  process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES

async function importRegistry() {
  const module = await import('./registry')
  return module
}

function restoreResourcesFlag() {
  if (ORIGINAL_RESOURCES_FLAG === undefined) {
    delete process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES
    return
  }

  process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES = ORIGINAL_RESOURCES_FLAG
}

describe('module registry', () => {
  beforeEach(() => {
    restoreResourcesFlag()
    vi.resetModules()
  })

  it('registers the resources manifest by default', async () => {
    delete process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES

    const { getModuleManifest, registeredModules } = await importRegistry()

    expect(getModuleManifest('resources')?.id).toBe('resources')
    expect(registeredModules.some((manifest) => manifest.id === 'resources')).toBe(
      true
    )
  })

  it('skips the resources manifest when the reference module is disabled', async () => {
    process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES = 'false'

    const { getModuleManifest, registeredModules } = await importRegistry()

    expect(getModuleManifest('resources')).toBeUndefined()
    expect(
      registeredModules.some((manifest) => manifest.id === 'resources')
    ).toBe(false)
  })
})
