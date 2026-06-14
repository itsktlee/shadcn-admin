import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { userEvent, type Locator } from 'vitest/browser'
import i18n from '@/i18n'
import { ForgotPasswordForm } from './forgot-password-form'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}))

const FORM_LABELS = {
  email: i18n.t('common.email'),
  continue: i18n.t('auth.forgotPassword.action'),
  emailEmpty: i18n.t('auth.forgotPassword.errors.emailRequired'),
} as const

vi.mock('../../legacy-auth-navigation', () => ({
  navigateLegacyAuth: mocks.navigate,
}))

vi.mock('@/lib/utils', async (orig) => ({
  ...(await orig()),
  sleep: vi.fn(() => Promise.resolve()),
}))

describe('ForgotPasswordForm', () => {
  let screen: RenderResult
  let emailInput: Locator
  let continueButton: Locator

  beforeEach(async () => {
    vi.clearAllMocks()

    screen = await render(<ForgotPasswordForm />)
    emailInput = screen.getByRole('textbox', { name: FORM_LABELS.email })
    continueButton = screen.getByRole('button', { name: FORM_LABELS.continue })
  })

  it('renders email field and continue button', async () => {
    await expect.element(emailInput).toBeInTheDocument()
    await expect.element(continueButton).toBeInTheDocument()
  })

  it('shows validation when submitting empty form', async () => {
    await userEvent.click(continueButton)
    await expect
      .element(screen.getByText(FORM_LABELS.emailEmpty))
      .toBeInTheDocument()
  })

  it('resets the form and navigates to /otp on success', async () => {
    await userEvent.fill(emailInput, 'a@b.com')
    await userEvent.click(continueButton)

    await vi.waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith('/otp'))

    // Form should reset on success
    await expect.element(emailInput).toHaveValue('')
  })
})
