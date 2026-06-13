import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import {
  LANGUAGE_LEGACY_COOKIE_NAMES,
  LANGUAGE_COOKIE_MAX_AGE,
  LANGUAGE_COOKIE_NAME,
  setCookie,
} from '@/lib/cookies'
import { normalizeLanguage, supportedLanguages, type AppLanguage } from './config'
import { en } from './resources/en'
import { zhCN } from './resources/zh-CN'

export function applyDocumentLanguage(language?: string) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = normalizeLanguage(language)
}

export function persistLanguage(language: AppLanguage) {
  setCookie(
    LANGUAGE_COOKIE_NAME,
    language,
    LANGUAGE_COOKIE_MAX_AGE,
    LANGUAGE_LEGACY_COOKIE_NAMES
  )
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        'zh-CN': { translation: zhCN },
        en: { translation: en },
      },
      lng: 'zh-CN',
      fallbackLng: 'zh-CN',
      supportedLngs: supportedLanguages,
      load: 'currentOnly',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })
    .then(() => applyDocumentLanguage(i18n.resolvedLanguage))
}

i18n.on('languageChanged', (language) => {
  const normalizedLanguage = normalizeLanguage(language)
  applyDocumentLanguage(normalizedLanguage)
  persistLanguage(normalizedLanguage)
})

export default i18n
export { normalizeLanguage, supportedLanguages }
export type { AppLanguage }
