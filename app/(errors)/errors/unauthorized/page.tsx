'use client'

import { UnauthorisedError } from '@/features/errors/unauthorized-error'

export default function UnauthorizedErrorPage() {
  return <UnauthorisedError />
}
