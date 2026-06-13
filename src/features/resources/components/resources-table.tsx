'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  type RowSelectionState,
  type OnChangeFn,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ResourceListResponse } from '@/contracts/resources'
import { useTranslation } from 'react-i18next'
import { usePermission } from '@/providers/auth-provider'
import { cn } from '@/lib/utils'
import { useTableUrlState, type NavigateFn } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { resourceCategoryOptions, resourceStatusOptions } from '../data/data'
import { ResourcesBulkActions } from './resources-bulk-actions'
import { getResourcesColumns } from './resources-columns'

type ColumnMetaShape = {
  className?: string
  thClassName?: string
  tdClassName?: string
}

type ResourcesTableProps = {
  data?: ResourceListResponse
  isPending: boolean
  isFetching: boolean
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function ResourcesTable({
  data,
  isPending,
  isFetching,
  search,
  navigate,
}: ResourcesTableProps) {
  const { t } = useTranslation()
  const canEdit = usePermission('resources.edit')
  const canDelete = usePermission('resources.delete')
  const canSelect = canEdit || canDelete
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const columns = useMemo(
    () =>
      getResourcesColumns({
        canDelete,
        canEdit,
        canSelect,
      }),
    [canDelete, canEdit, canSelect]
  )

  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
    reset,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: 'search' },
    columnFilters: [
      { columnId: 'status', searchKey: 'status', type: 'array' },
      { columnId: 'category', searchKey: 'category', type: 'array' },
    ],
  })

  const sorting = useMemo<SortingState>(() => {
    const sortBy =
      typeof search.sortBy === 'string' ? search.sortBy : 'updatedAt'
    const sortOrder =
      typeof search.sortOrder === 'string' ? search.sortOrder : 'desc'

    return [{ id: sortBy, desc: sortOrder === 'desc' }]
  }, [search.sortBy, search.sortOrder])

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater
    const [firstSort] = next

    navigate({
      search: (prev) => ({
        ...(prev as Record<string, unknown>),
        page: undefined,
        sortBy: firstSort?.id ?? 'updatedAt',
        sortOrder: firstSort?.desc ? 'desc' : 'asc',
      }),
    })
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.data.items ?? [],
    columns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      columnFilters,
      globalFilter,
      pagination,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: data?.meta.pageCount ?? 1,
    enableRowSelection: canSelect,
    onSortingChange,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    ensurePageInRange(data?.meta.pageCount ?? 1)
  }, [data?.meta.pageCount, ensurePageInRange])

  useEffect(() => {
    if (!canSelect) {
      setRowSelection({})
    }
  }, [canSelect])

  const emptyMessage = isPending
    ? t('resources.states.loading')
    : t('dataTable.noResults')

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        onReset={reset}
        searchPlaceholder={t('resources.filterPlaceholder')}
        filters={[
          {
            columnId: 'status',
            title: t('resources.filters.status'),
            options: resourceStatusOptions.map((status) => ({
              value: status.value,
              icon: status.icon,
              label: t(status.labelKey),
            })),
          },
          {
            columnId: 'category',
            title: t('resources.filters.category'),
            options: resourceCategoryOptions.map((category) => ({
              value: category.value,
              label: t(category.labelKey),
            })),
          },
        ]}
      />
      <div className='overflow-hidden rounded-md border'>
        <div className='min-h-[420px] overflow-x-auto'>
          <Table className='min-w-5xl'>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as
                      | ColumnMetaShape
                      | undefined

                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          'bg-background/80',
                          meta?.className,
                          meta?.thClassName
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as
                        | ColumnMetaShape
                        | undefined

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            headerCellPadding(cell.column.id),
                            meta?.className,
                            meta?.tdClassName
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-[320px] text-center text-muted-foreground'
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className='flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground'>
        <span>
          {t('resources.states.total', {
            count: data?.data.total ?? 0,
          })}
        </span>
        <span
          className={cn(
            'transition-opacity',
            isFetching ? 'opacity-100' : 'opacity-0'
          )}
        >
          {t('resources.states.syncing')}
        </span>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
      <ResourcesBulkActions table={table} />
    </div>
  )
}

function headerCellPadding(columnId: string) {
  if (columnId === 'name') {
    return 'align-top'
  }

  return undefined
}
