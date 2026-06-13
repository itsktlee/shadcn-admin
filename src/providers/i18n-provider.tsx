'use client'

import { useEffect, type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n, { applyDocumentLanguage, persistLanguage } from '@/i18n'
import { normalizeLanguage, type AppLanguage } from '@/i18n/config'

export function I18nProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode
  initialLanguage: AppLanguage
}) {
  const language = normalizeLanguage(initialLanguage)

  if (i18n.resolvedLanguage !== language) {
    void i18n.changeLanguage(language)
  }

  useEffect(() => {
    applyDocumentLanguage(language)
    persistLanguage(language)
  }, [language])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
