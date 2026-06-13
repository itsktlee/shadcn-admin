import { isTemplateModuleEnabled } from '@/config/template-modules'

const publicPaths = new Set([
  '/sign-in',
  '/sign-in-2',
  '/sign-up',
  '/forgot-password',
  '/otp',
  '/404',
  '/errors/forbidden',
  '/errors/internal-server-error',
  '/errors/maintenance-error',
  '/errors/not-found',
  '/errors/unauthorized',
])

function getProtectedPrefixes() {
  return [
    '/',
    ...(isTemplateModuleEnabled('resources') ? ['/resources'] : []),
    '/tasks',
    '/apps',
    '/chats',
    '/users',
    '/settings',
    '/help-center',
  ]
}

function isPublicPath(pathname: string) {
  return publicPaths.has(pathname)
}

function isProtectedPath(pathname: string) {
  return getProtectedPrefixes().some((prefix) => {
    if (prefix === '/') {
      return pathname === '/'
    }

    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  })
}

export { getProtectedPrefixes, isProtectedPath, isPublicPath, publicPaths }
