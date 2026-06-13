import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import i18n from '@/i18n'
import { SignOutDialog } from './sign-out-dialog'

const mocks = vi.hoisted(() => ({
  pathname: '/resources',
  refresh: vi.fn(),
  replace: vi.fn(),
  searchParams: new URLSearchParams('tab=open&page=2'),
  setSession: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({
    refresh: mocks.refresh,
    replace: mocks.replace,
  }),
  useSearchParams: () => mocks.searchParams,
}))

vi.mock('@/providers/auth-provider', () => ({
  useAuth: () => ({
    setSession: mocks.setSession,
  }),
}))

vi.mock('@/services/auth/client', () => ({
  signOut: mocks.signOut,
}))

describe('SignOutDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('clears the session and redirects to sign-in with the current location as redirect', async () => {
    const { getByRole } = await render(
      <SignOutDialog open onOpenChange={vi.fn()} />
    )

    await userEvent.click(
      getByRole('button', { name: i18n.t('signOutDialog.confirm') })
    )

    expect(mocks.signOut).toHaveBeenCalledOnce()
    expect(mocks.setSession).toHaveBeenCalledWith(null)
    expect(mocks.replace).toHaveBeenCalledWith(
      '/sign-in?redirect=%2Fresources%3Ftab%3Dopen%26page%3D2'
    )
    expect(mocks.refresh).toHaveBeenCalledOnce()
  })

  it('does not clear session or navigate when Cancel is clicked', async () => {
    const { getByRole } = await render(
      <SignOutDialog open onOpenChange={vi.fn()} />
    )

    await userEvent.click(
      getByRole('button', { name: i18n.t('common.cancel') })
    )

    expect(mocks.signOut).not.toHaveBeenCalled()
    expect(mocks.setSession).not.toHaveBeenCalled()
    expect(mocks.replace).not.toHaveBeenCalled()
  })
})
