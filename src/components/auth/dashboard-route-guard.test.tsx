import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { DashboardRouteGuard } from './dashboard-route-guard'

const mocks = vi.hoisted(() => ({
  hasPermission: vi.fn(),
  pathname: '/tasks',
  requiredPermission: 'tasks.view' as string | null,
}))

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}))

vi.mock('@/modules/navigation', () => ({
  resolveRequiredPermissionForPath: () => mocks.requiredPermission,
}))

vi.mock('@/providers/auth-provider', () => ({
  useAuth: () => ({
    hasPermission: mocks.hasPermission,
  }),
}))

vi.mock('./permission-denied-state', () => ({
  PermissionDeniedState: ({ actionKey }: { actionKey?: string }) => (
    <div data-testid='permission-denied'>{actionKey}</div>
  ),
}))

describe('DashboardRouteGuard', () => {
  it('renders the denied state when the current route requires a missing permission', async () => {
    mocks.requiredPermission = 'tasks.view'
    mocks.hasPermission.mockReturnValue(false)

    const { getByTestId } = await render(
      <DashboardRouteGuard>
        <div>protected-content</div>
      </DashboardRouteGuard>
    )

    await expect.element(getByTestId('permission-denied')).toHaveTextContent(
      'tasks.view'
    )
    expect(document.body).not.toHaveTextContent('protected-content')
  })

  it('renders children when the route is allowed', async () => {
    mocks.requiredPermission = 'tasks.view'
    mocks.hasPermission.mockReturnValue(true)

    const { getByText } = await render(
      <DashboardRouteGuard>
        <div>protected-content</div>
      </DashboardRouteGuard>
    )

    await expect
      .element(getByText('protected-content'))
      .toBeInTheDocument()
    expect(
      document.querySelector('[data-testid="permission-denied"]')
    ).toBeNull()
  })

  it('renders children when the route does not require a permission', async () => {
    mocks.requiredPermission = null
    mocks.hasPermission.mockReturnValue(false)

    const { getByText } = await render(
      <DashboardRouteGuard>
        <div>public-content</div>
      </DashboardRouteGuard>
    )

    await expect.element(getByText('public-content')).toBeInTheDocument()
  })
})
