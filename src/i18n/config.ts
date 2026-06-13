export const supportedLanguages = ['zh-CN', 'en'] as const

export type AppLanguage = (typeof supportedLanguages)[number]

export function normalizeLanguage(language?: string | null): AppLanguage {
  if (!language) return 'zh-CN'
  return language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN'
}
