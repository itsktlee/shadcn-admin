import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { type Locator, userEvent } from 'vitest/browser'
import i18n from '@/i18n'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { OtpForm } from './otp-form'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}))

const FORM_LABELS = {
  otp: i18n.t('auth.otp.srLabel'),
  verify: i18n.t('auth.otp.action'),
} as const

vi.mock('../../legacy-auth-navigation', () => ({
  navigateLegacyAuth: mocks.navigate,
}))

vi.mock('@/lib/show-submitted-data', () => ({ showSubmittedData: vi.fn() }))

describe('OtpForm', () => {
  let screen: RenderResult
  let otpInput: Locator
  let verifyButton: Locator

  beforeEach(async () => {
    vi.clearAllMocks()

    screen = await render(<OtpForm />)
    otpInput = screen.getByLabelText(FORM_LABELS.otp)
    verifyButton = screen.getByRole('button', { name: FORM_LABELS.verify })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('disables Verify until 6 digits are entered', async () => {
    await expect.element(verifyButton).toBeDisabled()

    await userEvent.fill(otpInput, '12345')
    await expect.element(verifyButton).toBeDisabled()

    await userEvent.fill(otpInput, '123456')
    await expect.element(verifyButton).toBeEnabled()
  })

  it('submits the OTP and navigates after timeout', async () => {
    vi.useFakeTimers()

    await userEvent.fill(otpInput, '123456')
    await userEvent.click(verifyButton)

    expect(showSubmittedData).toHaveBeenCalledOnce()
    expect(showSubmittedData).toHaveBeenCalledWith({ otp: '123456' })

    await vi.advanceTimersByTimeAsync(1000)
    expect(mocks.navigate).toHaveBeenCalledWith('/')
  })
})
