import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import {
  getCookie,
  LANGUAGE_COOKIE_NAME,
  LANGUAGE_LEGACY_COOKIE_NAMES,
  setCookie,
} from '@/lib/cookies'
import { clearCookies } from '@/test-utils/cookies'
import { I18nProvider } from './i18n-provider'

function TranslationProbe() {
  const { t } = useTranslation()
  return <span>{t('common.close')}</span>
}

describe('I18nProvider', () => {
  beforeEach(async () => {
    clearCookies()
    document.documentElement.lang = ''
    await i18n.changeLanguage('zh-CN')
  })

  it('hydrates the requested language into document state and translations', async () => {
    const { getByText } = await render(
      <I18nProvider initialLanguage='en'>
        <TranslationProbe />
      </I18nProvider>
    )

    await vi.waitFor(() => {
      expect(document.documentElement.lang).toBe('en')
      expect(i18n.resolvedLanguage).toBe('en')
    })

    await expect.element(getByText(/^Close$/)).toBeInTheDocument()
  })

  it('migrates a legacy language cookie to the new template key', async () => {
    setCookie(LANGUAGE_LEGACY_COOKIE_NAMES[0], 'en')

    const { getByText } = await render(
      <I18nProvider initialLanguage='en'>
        <TranslationProbe />
      </I18nProvider>
    )

    await vi.waitFor(() => {
      expect(getCookie(LANGUAGE_COOKIE_NAME)).toBe('en')
      expect(getCookie(LANGUAGE_LEGACY_COOKIE_NAMES[0])).toBeUndefined()
      expect(document.documentElement.lang).toBe('en')
      expect(i18n.resolvedLanguage).toBe('en')
    })

    await expect.element(getByText(/^Close$/)).toBeInTheDocument()
  })
})
