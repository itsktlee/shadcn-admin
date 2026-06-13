import { type NextRequest, NextResponse } from 'next/server'
import {
  AUTH_SESSION_COOKIE_NAME,
  parseAuthSessionCookieValue,
} from '@/services/auth/shared'
import { isProtectedPath, isPublicPath } from '@/services/auth/route-access'

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const session = parseAuthSessionCookieValue(
    request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value
  )

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  if (!session && isProtectedPath(pathname)) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect', `${pathname}${search}`)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
