import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { resourceSchema, type Resource } from '@/contracts/resources'
import { Trash2, UserPen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePermission } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useResources } from './resources-provider'

type ResourcesRowActionsProps = {
  row: Row<Resource>
}

export function ResourcesRowActions({ row }: ResourcesRowActionsProps) {
  const { t } = useTranslation()
  const resource = resourceSchema.parse(row.original)
  const { setOpen, setCurrentRow } = useResources()
  const canEdit = usePermission('resources.edit')
  const canDelete = usePermission('resources.delete')

  if (!canEdit && !canDelete) {
    return null
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>{t('resources.rowActions.openMenu')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        {canEdit ? (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(resource)
              setOpen('update')
            }}
          >
            {t('common.edit')}
            <DropdownMenuShortcut>
              <UserPen size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        ) : null}
        {canEdit && canDelete ? <DropdownMenuSeparator /> : null}
        {canDelete ? (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(resource)
              setOpen('delete')
            }}
            variant='destructive'
          >
            {t('common.delete')}
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
