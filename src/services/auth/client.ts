'use client'

import type { AuthSession } from '@/contracts/auth'
import { getCookie, removeCookie, setCookie } from '@/lib/cookies'
import {
  AUTH_SESSION_COOKIE_MAX_AGE,
  AUTH_SESSION_COOKIE_NAME,
  createMockAuthSession,
  parseAuthSessionCookieValue,
  serializeAuthSessionCookieValue,
} from './shared'

type SignInInput = {
  email: string
  password: string
}

async function signIn(input: SignInInput) {
  const session = createMockAuthSession(input.email)

  setCookie(
    AUTH_SESSION_COOKIE_NAME,
    serializeAuthSessionCookieValue(session),
    AUTH_SESSION_COOKIE_MAX_AGE
  )

  return session
}

function signOut() {
  removeCookie(AUTH_SESSION_COOKIE_NAME)
}

function getClientSession(): AuthSession | null {
  return parseAuthSessionCookieValue(getCookie(AUTH_SESSION_COOKIE_NAME))
}

export {
  getClientSession,
  signIn,
  signOut,
}

export type {
  SignInInput,
}
