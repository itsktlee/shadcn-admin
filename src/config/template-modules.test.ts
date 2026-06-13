import { beforeEach, describe, expect, it, vi } from 'vitest'

const ORIGINAL_RESOURCES_FLAG =
  process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES

async function importTemplateModules() {
  const module = await import('./template-modules')
  return module
}

function restoreResourcesFlag() {
  if (ORIGINAL_RESOURCES_FLAG === undefined) {
    delete process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES
    return
  }

  process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES = ORIGINAL_RESOURCES_FLAG
}

describe('template module flags', () => {
  beforeEach(() => {
    restoreResourcesFlag()
    vi.resetModules()
  })

  it('enables resources by default when no env override is provided', async () => {
    delete process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES

    const { isTemplateModuleEnabled, templateModuleFlags } =
      await importTemplateModules()

    expect(templateModuleFlags.resources).toBe(true)
    expect(isTemplateModuleEnabled('resources')).toBe(true)
  })

  it('disables resources when the env flag is set to false', async () => {
    process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES = 'false'

    const { isTemplateModuleEnabled, templateModuleFlags } =
      await importTemplateModules()

    expect(templateModuleFlags.resources).toBe(false)
    expect(isTemplateModuleEnabled('resources')).toBe(false)
  })

  it('keeps resources enabled for any non-false value', async () => {
    process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES = 'true'

    const { isTemplateModuleEnabled, templateModuleFlags } =
      await importTemplateModules()

    expect(templateModuleFlags.resources).toBe(true)
    expect(isTemplateModuleEnabled('resources')).toBe(true)
  })
})
