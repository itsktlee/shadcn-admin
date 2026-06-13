'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import type { Resource } from '@/contracts/resources'
import { isAdapterError } from '@/services/adapters'
import { CircleArrowUp, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePermission } from '@/providers/auth-provider'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { resourceStatusOptions } from '../data/data'
import { useResourcesMutations } from '../hooks/use-resources-mutations'
import { ResourcesMultiDeleteDialog } from './resources-multi-delete-dialog'

type ResourcesBulkActionsProps = {
  table: Table<Resource>
}

export function ResourcesBulkActions({ table }: ResourcesBulkActionsProps) {
  const { t } = useTranslation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { bulkUpdateResourcesStatusMutation } = useResourcesMutations()
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const canBulkEdit = usePermission('resources.edit')
  const canBulkDelete = usePermission('resources.delete')

  if (!canBulkEdit && !canBulkDelete) {
    return null
  }

  const handleBulkStatusChange = async (status: Resource['status']) => {
    try {
      const statusLabel =
        resourceStatusOptions.find((item) => item.value === status)?.labelKey ??
        status

      await toast.promise(
        bulkUpdateResourcesStatusMutation.mutateAsync({
          ids: selectedRows.map((row) => row.original.id),
          status,
        }),
        {
          loading: t('resources.bulkActions.statusLoading'),
          success: t('resources.bulkActions.statusSuccess', {
            count: selectedRows.length,
            status: t(statusLabel),
          }),
          error: (error) =>
            isAdapterError(error) ? error.apiError.message : t('common.error'),
        }
      )

      table.resetRowSelection()
    } catch {
      // Toast already handled the user-facing error.
    }
  }

  return (
    <>
      <BulkActionsToolbar
        table={table}
        entityLabel={t('resources.entities.singular')}
        entityLabelPlural={t('resources.entities.plural')}
      >
        {canBulkEdit ? (
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='size-8'
                    aria-label={t('resources.bulkActions.updateStatus')}
                    title={t('resources.bulkActions.updateStatus')}
                  >
                    <CircleArrowUp />
                    <span className='sr-only'>
                      {t('resources.bulkActions.updateStatus')}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('resources.bulkActions.updateStatus')}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent sideOffset={14}>
              {resourceStatusOptions.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() => void handleBulkStatusChange(status.value)}
                >
                  <status.icon className='size-4 text-muted-foreground' />
                  {t(status.labelKey)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        {canBulkDelete ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='destructive'
                size='icon'
                onClick={() => setShowDeleteConfirm(true)}
                className='size-8'
                aria-label={t('resources.bulkActions.deleteSelected')}
                title={t('resources.bulkActions.deleteSelected')}
              >
                <Trash2 />
                <span className='sr-only'>
                  {t('resources.bulkActions.deleteSelected')}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('resources.bulkActions.deleteSelected')}</p>
            </TooltipContent>
          </Tooltip>
        ) : null}
      </BulkActionsToolbar>

      <ResourcesMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
