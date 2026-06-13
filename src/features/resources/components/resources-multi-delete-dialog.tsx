'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import type { Resource } from '@/contracts/resources'
import { isAdapterError } from '@/services/adapters'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useResourcesMutations } from '../hooks/use-resources-mutations'

type ResourcesMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<Resource>
}

const CONFIRM_WORD = 'DELETE'

export function ResourcesMultiDeleteDialog({
  open,
  onOpenChange,
  table,
}: ResourcesMultiDeleteDialogProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const { bulkDeleteResourcesMutation } = useResourcesMutations()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(t('dangerZone.typeToConfirmError', { word: CONFIRM_WORD }))
      return
    }

    try {
      await toast.promise(
        bulkDeleteResourcesMutation.mutateAsync({
          ids: selectedRows.map((row) => row.original.id),
        }),
        {
          loading: t('resources.bulkActions.deleteLoading'),
          success: t('resources.bulkActions.deleteSuccess', {
            count: selectedRows.length,
          }),
          error: (error) =>
            isAdapterError(error) ? error.apiError.message : t('common.error'),
        }
      )

      setValue('')
      table.resetRowSelection()
      onOpenChange(false)
    } catch {
      // Toast already handled the user-facing error.
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='resources-multi-delete-form'
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('resources.bulkActions.deleteTitle', {
            count: selectedRows.length,
          })}
        </span>
      }
      desc={
        <form
          id='resources-multi-delete-form'
          onSubmit={(event) => {
            event.preventDefault()
            void handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>{t('resources.bulkActions.deleteDesc')}</p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>
              {t('dangerZone.confirmByTyping', { word: CONFIRM_WORD })}
            </span>
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={t('dangerZone.typeToConfirm', {
                word: CONFIRM_WORD,
              })}
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t('dangerZone.warningTitle')}</AlertTitle>
            <AlertDescription>{t('dangerZone.warningDesc')}</AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('common.delete')}
      destructive
    />
  )
}
