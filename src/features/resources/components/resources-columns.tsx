import { type ColumnDef } from '@tanstack/react-table'
import type { Resource } from '@/contracts/resources'
import i18n from '@/i18n'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { getResourceCategoryMeta, getResourceStatusMeta } from '../data/data'
import { ResourcesRowActions } from './resources-row-actions'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function getResourcesColumns({
  canDelete,
  canEdit,
  canSelect,
}: {
  canDelete: boolean
  canEdit: boolean
  canSelect: boolean
}): ColumnDef<Resource>[] {
  const columns: ColumnDef<Resource>[] = []

  if (canSelect) {
    columns.push({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={i18n.t('common.selectAll')}
          className='translate-y-0.5'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={i18n.t('common.selectRow')}
          className='translate-y-0.5'
        />
      ),
      enableSorting: false,
      enableHiding: false,
      meta: {
        className: 'w-12',
      },
    })
  }

  columns.push({
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('resources.columns.name')}
      />
    ),
    meta: {
      className: 'min-w-64',
      labelKey: 'resources.columns.name',
    },
    enableHiding: false,
    cell: ({ row }) => (
      <div className='flex min-w-0 flex-col gap-1'>
        <LongText className='max-w-80 font-medium'>
          {row.original.name}
        </LongText>
        <LongText className='max-w-80 text-xs text-muted-foreground'>
          {row.original.slug}
        </LongText>
      </div>
    ),
  })
  columns.push({
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('resources.columns.status')}
      />
    ),
    meta: {
      className: 'w-40',
      labelKey: 'resources.columns.status',
    },
    cell: ({ row }) => {
      const meta = getResourceStatusMeta(row.original.status)
      if (!meta) return null

      return (
        <Badge variant='outline' className={cn('gap-1.5', meta.className)}>
          <meta.icon className='size-3.5' />
          {i18n.t(meta.labelKey)}
        </Badge>
      )
    },
  })
  columns.push({
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('resources.columns.category')}
      />
    ),
    meta: {
      className: 'w-40',
      labelKey: 'resources.columns.category',
    },
    cell: ({ row }) => {
      const meta = getResourceCategoryMeta(row.original.category)

      return (
        <Badge variant='outline' className='capitalize'>
          {meta ? i18n.t(meta.labelKey) : row.original.category}
        </Badge>
      )
    },
  })
  columns.push({
    accessorKey: 'owner',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('resources.columns.owner')}
      />
    ),
    meta: {
      className: 'w-44',
      labelKey: 'resources.columns.owner',
    },
    cell: ({ row }) => (
      <LongText className='max-w-40'>{row.original.owner}</LongText>
    ),
  })
  columns.push({
    accessorKey: 'tags',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('resources.columns.tags')}
      />
    ),
    meta: {
      className: 'w-52',
      labelKey: 'resources.columns.tags',
    },
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-wrap gap-1'>
        {row.original.tags.map((tag) => (
          <Badge key={tag} variant='secondary'>
            {tag}
          </Badge>
        ))}
      </div>
    ),
  })
  columns.push({
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t('resources.columns.updatedAt')}
      />
    ),
    meta: {
      className: 'w-44',
      labelKey: 'resources.columns.updatedAt',
    },
    cell: ({ row }) => (
      <div className='text-sm text-muted-foreground'>
        {dateFormatter.format(new Date(row.original.updatedAt))}
      </div>
    ),
  })

  if (canEdit || canDelete) {
    columns.push({
      id: 'actions',
      cell: ({ row }) => <ResourcesRowActions row={row} />,
      enableSorting: false,
      enableHiding: false,
      meta: {
        className: 'w-14',
      },
    })
  }

  return columns
}

export { getResourcesColumns }
