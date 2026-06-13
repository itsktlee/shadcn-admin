import { cookies } from 'next/headers'
import type { AuthSession } from '@/contracts/auth'
import { AUTH_SESSION_COOKIE_NAME, parseAuthSessionCookieValue } from './shared'

async function getServerSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()

  return parseAuthSessionCookieValue(
    cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value
  )
}

export { getServerSession }
