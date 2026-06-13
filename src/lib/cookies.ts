export const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
export const THEME_COOKIE_NAME = 'template-ui-theme'
export const THEME_LEGACY_COOKIE_NAMES = ['vite-ui-theme'] as const
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
export const LANGUAGE_COOKIE_NAME = 'template-ui-language'
export const LANGUAGE_LEGACY_COOKIE_NAMES = ['vite-ui-language'] as const
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
export const FONT_COOKIE_NAME = 'font'
export const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
export const DIRECTION_COOKIE_NAME = 'dir'
export const DIRECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function encodeCookieValue(value: string) {
  return encodeURIComponent(value)
}

function decodeCookieValue(value: string) {
  return decodeURIComponent(value)
}

function readClientCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue ? decodeCookieValue(cookieValue) : undefined
  }
  return undefined
}

export function readCookieValue(
  read: (name: string) => string | undefined,
  name: string,
  fallbackNames: readonly string[] = []
): string | undefined {
  for (const cookieName of [name, ...fallbackNames]) {
    const value = read(cookieName)
    if (value !== undefined) {
      return value
    }
  }

  return undefined
}

export function getCookie(
  name: string,
  fallbackNames: readonly string[] = []
): string | undefined {
  return readCookieValue(readClientCookie, name, fallbackNames)
}

function removeCookieByName(name: string): void {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}

export function setCookie(
  name: string,
  value: string,
  maxAge: number = DEFAULT_COOKIE_MAX_AGE,
  legacyNames: readonly string[] = []
): void {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=${encodeCookieValue(value)}; path=/; max-age=${maxAge}; samesite=lax`

  for (const legacyName of legacyNames) {
    if (legacyName !== name) {
      removeCookieByName(legacyName)
    }
  }
}

export function removeCookie(
  name: string,
  legacyNames: readonly string[] = []
): void {
  removeCookieByName(name)

  for (const legacyName of legacyNames) {
    if (legacyName !== name) {
      removeCookieByName(legacyName)
    }
  }
}

export function syncLegacyCookie(
  name: string,
  fallbackNames: readonly string[],
  maxAge: number = DEFAULT_COOKIE_MAX_AGE
): string | undefined {
  if (typeof document === 'undefined') return undefined

  const primaryValue = readClientCookie(name)
  if (primaryValue !== undefined) {
    return primaryValue
  }

  const fallbackValue = readCookieValue(readClientCookie, name, fallbackNames)
  if (fallbackValue === undefined) {
    return undefined
  }

  setCookie(name, fallbackValue, maxAge, fallbackNames)
  return fallbackValue
}
