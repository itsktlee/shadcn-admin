import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import i18n from '@/i18n'
import { createAdapterError } from '@/services/adapters'
import { ResourcesMutateDrawer } from './resources-mutate-drawer'

const mocks = vi.hoisted(() => ({
  createMutateAsync: vi.fn(),
  updateMutateAsync: vi.fn(),
  toastError: vi.fn(),
  toastLoading: vi.fn(() => 'toast-id'),
  toastSuccess: vi.fn(),
}))

vi.mock('../hooks/use-resources-mutations', () => ({
  useResourcesMutations: () => ({
    createResourceMutation: {
      isPending: false,
      mutateAsync: mocks.createMutateAsync,
    },
    updateResourceMutation: {
      isPending: false,
      mutateAsync: mocks.updateMutateAsync,
    },
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => mocks.toastError(...args),
    loading: (...args: unknown[]) => mocks.toastLoading(...args),
    success: (...args: unknown[]) => mocks.toastSuccess(...args),
  },
}))

describe('ResourcesMutateDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps duplicate slug adapter errors to the slug field and keeps the drawer open', async () => {
    const onOpenChange = vi.fn()

    mocks.createMutateAsync.mockRejectedValue(
      createAdapterError({
        code: 'CONFLICT',
        message: 'Slug already exists.',
        fields: {
          slug: ['Slug already exists.'],
        },
      })
    )

    const { getByRole, getByText } = await render(
      <ResourcesMutateDrawer open onOpenChange={onOpenChange} />
    )

    await userEvent.fill(
      getByRole('textbox', { name: i18n.t('resources.columns.name') }),
      'QA Resource'
    )
    await userEvent.fill(
      getByRole('textbox', { name: i18n.t('resources.fields.slug') }),
      'operations-console'
    )
    await userEvent.fill(
      getByRole('textbox', { name: i18n.t('resources.columns.owner') }),
      'QA Team'
    )

    await userEvent.click(
      getByRole('combobox', { name: i18n.t('resources.columns.category') })
    )
    await userEvent.click(
      getByRole('option', {
        name: i18n.t('resources.data.categories.operations'),
      })
    )

    await userEvent.click(
      getByRole('button', { name: i18n.t('resources.dialogs.save') })
    )

    await vi.waitFor(() =>
      expect(mocks.createMutateAsync).toHaveBeenCalledWith({
        category: 'operations',
        description: undefined,
        name: 'QA Resource',
        owner: 'QA Team',
        slug: 'operations-console',
        status: 'draft',
        tags: [],
      })
    )

    await expect
      .element(getByText('Slug already exists.').first())
      .toBeInTheDocument()
    expect(onOpenChange).not.toHaveBeenCalledWith(false)
    expect(mocks.toastError).toHaveBeenCalledWith('Slug already exists.', {
      id: 'toast-id',
    })
  })
})
