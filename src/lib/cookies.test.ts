import { clearCookies } from '@/test-utils/cookies'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  getCookie,
  LANGUAGE_COOKIE_NAME,
  LANGUAGE_LEGACY_COOKIE_NAMES,
  readCookieValue,
  removeCookie,
  setCookie,
  syncLegacyCookie,
  THEME_COOKIE_NAME,
  THEME_LEGACY_COOKIE_NAMES,
} from './cookies'

const COOKIE_PREFIX = 'test_cookie_'

describe('cookies', () => {
  const uniqueName = () =>
    `${COOKIE_PREFIX}${Math.random().toString(36).slice(2)}`

  beforeEach(() => {
    clearCookies(COOKIE_PREFIX)
  })

  it('stores a value that can be read back', () => {
    const name = uniqueName()
    const value = 'hello-world'

    setCookie(name, value)

    expect(getCookie(name)).toBe(value)
  })

  it('clears a value so it is no longer readable', () => {
    const name = uniqueName()

    setCookie(name, 'x')
    expect(getCookie(name)).toBe('x')

    removeCookie(name)

    expect(getCookie(name)).toBeUndefined()
  })

  it('reads fallback cookie names when the primary key is absent', () => {
    setCookie(THEME_LEGACY_COOKIE_NAMES[0], 'dark')

    expect(getCookie(THEME_COOKIE_NAME, THEME_LEGACY_COOKIE_NAMES)).toBe('dark')
  })

  it('syncs a legacy cookie into the new primary key and removes the old key', () => {
    setCookie(LANGUAGE_LEGACY_COOKIE_NAMES[0], 'en')

    expect(
      syncLegacyCookie(LANGUAGE_COOKIE_NAME, LANGUAGE_LEGACY_COOKIE_NAMES)
    ).toBe('en')
    expect(getCookie(LANGUAGE_COOKIE_NAME)).toBe('en')
    expect(getCookie(LANGUAGE_LEGACY_COOKIE_NAMES[0])).toBeUndefined()
  })

  it('supports generic fallback reads outside document.cookie', () => {
    const values = new Map<string, string>([[THEME_LEGACY_COOKIE_NAMES[0], 'system']])

    expect(
      readCookieValue(
        (name) => values.get(name),
        THEME_COOKIE_NAME,
        THEME_LEGACY_COOKIE_NAMES
      )
    ).toBe('system')
  })
})
