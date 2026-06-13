const templateModuleFlags = {
  resources: process.env.NEXT_PUBLIC_TEMPLATE_MODULE_RESOURCES !== 'false',
} as const

type TemplateModuleId = keyof typeof templateModuleFlags

function isTemplateModuleEnabled(moduleId: TemplateModuleId) {
  return templateModuleFlags[moduleId]
}

export { isTemplateModuleEnabled, templateModuleFlags }
export type { TemplateModuleId }
