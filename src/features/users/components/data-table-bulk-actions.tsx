import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type User } from '../data/schema'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const { t } = useTranslation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    const statusKey =
      status === 'active'
        ? 'users.bulkActions.activate'
        : 'users.bulkActions.deactivate'
    toast.promise(sleep(2000), {
      loading: t(`${statusKey}Loading`),
      success: () => {
        table.resetRowSelection()
        return t(`${statusKey}Success`, {
          count: selectedUsers.length,
        })
      },
      error: t(`${statusKey}Error`),
    })
    table.resetRowSelection()
  }

  const handleBulkInvite = () => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    toast.promise(sleep(2000), {
      loading: t('users.bulkActions.inviteLoading'),
      success: () => {
        table.resetRowSelection()
        return t('users.bulkActions.inviteSuccess', {
          count: selectedUsers.length,
        })
      },
      error: t('users.bulkActions.inviteError'),
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar
        table={table}
        entityLabel={t('users.dialogs.bulkDelete.itemSingular')}
        entityLabelPlural={t('users.dialogs.bulkDelete.itemPlural')}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkInvite}
              className='size-8'
              aria-label={t('users.bulkActions.inviteSelected')}
              title={t('users.bulkActions.inviteSelected')}
            >
              <Mail />
              <span className='sr-only'>
                {t('users.bulkActions.inviteSelected')}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.bulkActions.inviteSelected')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label={t('users.bulkActions.activateSelected')}
              title={t('users.bulkActions.activateSelected')}
            >
              <UserCheck />
              <span className='sr-only'>
                {t('users.bulkActions.activateSelected')}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.bulkActions.activateSelected')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label={t('users.bulkActions.deactivateSelected')}
              title={t('users.bulkActions.deactivateSelected')}
            >
              <UserX />
              <span className='sr-only'>
                {t('users.bulkActions.deactivateSelected')}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.bulkActions.deactivateSelected')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label={t('users.bulkActions.deleteSelected')}
              title={t('users.bulkActions.deleteSelected')}
            >
              <Trash2 />
              <span className='sr-only'>
                {t('users.bulkActions.deleteSelected')}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.bulkActions.deleteSelected')}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
