'use client'

import { useState } from 'react'
import type { Resource } from '@/contracts/resources'
import { isAdapterError } from '@/services/adapters'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useResourcesMutations } from '../hooks/use-resources-mutations'

type ResourcesDeleteDialogProps = {
  currentRow: Resource
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResourcesDeleteDialog({
  currentRow,
  open,
  onOpenChange,
}: ResourcesDeleteDialogProps) {
  const { t } = useTranslation()
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteResourceMutation } = useResourcesMutations()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await toast.promise(deleteResourceMutation.mutateAsync(currentRow.id), {
        loading: t('resources.dialogs.delete.loading'),
        success: t('resources.dialogs.delete.success'),
        error: (error) =>
          isAdapterError(error) ? error.apiError.message : t('common.error'),
      })

      onOpenChange(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={() => {
        void handleDelete()
      }}
      isLoading={isDeleting}
      destructive
      title={t('resources.dialogs.delete.title')}
      desc={t('resources.dialogs.delete.desc', {
        name: currentRow.name,
        slug: currentRow.slug,
      })}
      confirmText={t('common.delete')}
      className='max-w-md'
    />
  )
}
