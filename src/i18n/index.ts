import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { en } from './resources/en'
import { zhCN } from './resources/zh-CN'

export const supportedLanguages = ['zh-CN', 'en'] as const

export type AppLanguage = (typeof supportedLanguages)[number]

export const languageCookieName = 'vite-ui-language'

export function normalizeLanguage(language?: string | null): AppLanguage {
  if (!language) return 'zh-CN'
  return language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN'
}

function applyDocumentLanguage(language?: string) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = normalizeLanguage(language)
}

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        'zh-CN': { translation: zhCN },
        zh: { translation: zhCN },
        en: { translation: en },
      },
      fallbackLng: 'zh-CN',
      supportedLngs: ['zh-CN', 'zh', 'en'],
      nonExplicitSupportedLngs: true,
      load: 'currentOnly',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      detection: {
        order: ['cookie', 'navigator', 'htmlTag'],
        caches: ['cookie'],
        lookupCookie: languageCookieName,
        cookieOptions: {
          path: '/',
          sameSite: 'lax',
        },
      },
    })
    .then(() => applyDocumentLanguage(i18n.resolvedLanguage))
}

i18n.on('languageChanged', (language) => {
  applyDocumentLanguage(language)
})

export default i18n
