export function readLegacyRedirectParam() {
  if (typeof window === 'undefined') {
    return undefined
  }

  const redirect = new URLSearchParams(window.location.search).get('redirect')
  return redirect || undefined
}

export function navigateLegacyAuth(
  to: string,
  options?: {
    replace?: boolean
  }
) {
  if (typeof window === 'undefined') {
    return
  }

  if (options?.replace) {
    window.location.replace(to)
    return
  }

  window.location.assign(to)
}
