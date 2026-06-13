'use client'

import { useCallback, useMemo } from 'react'
import type { ResourceListQuery } from '@/contracts/resources'
import { normalizeResourcesListQuery } from '@/services/query/resources'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { NavigateFn } from '@/hooks/use-table-url-state'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_SORT_BY = 'updatedAt'
const DEFAULT_SORT_ORDER = 'desc'

function buildResourcesSearchParams(query: ResourceListQuery) {
  const params = new URLSearchParams()

  if (query.page !== DEFAULT_PAGE) {
    params.set('page', String(query.page))
  }
  if (query.pageSize !== DEFAULT_PAGE_SIZE) {
    params.set('pageSize', String(query.pageSize))
  }
  if (query.search) {
    params.set('search', query.search)
  }
  if (query.sortBy !== DEFAULT_SORT_BY) {
    params.set('sortBy', query.sortBy)
  }
  if (query.sortOrder !== DEFAULT_SORT_ORDER) {
    params.set('sortOrder', query.sortOrder)
  }

  query.status.forEach((value) => params.append('status', value))
  query.category.forEach((value) => params.append('category', value))
  query.owner.forEach((value) => params.append('owner', value))
  query.tags.forEach((value) => params.append('tags', value))

  return params
}

function createHref(pathname: string, query: ResourceListQuery) {
  const params = buildResourcesSearchParams(query)
  const serialized = params.toString()
  return serialized ? `${pathname}?${serialized}` : pathname
}

export function useResourcesRouteState(): {
  search: ResourceListQuery
  navigate: NavigateFn
} {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const search = useMemo(
    () =>
      normalizeResourcesListQuery(new URLSearchParams(searchParams.toString())),
    [searchParams]
  )

  const navigate = useCallback<NavigateFn>(
    ({ search: nextSearch, replace }) => {
      const previous = normalizeResourcesListQuery(
        new URLSearchParams(searchParams.toString())
      )
      const patch =
        typeof nextSearch === 'function'
          ? nextSearch(previous)
          : nextSearch === true
            ? previous
            : nextSearch
      const nextQuery =
        nextSearch === true
          ? previous
          : normalizeResourcesListQuery({
              ...previous,
              ...(patch as Partial<ResourceListQuery>),
            })
      const href = createHref(pathname, nextQuery)

      if (replace) {
        router.replace(href)
        return
      }

      router.push(href)
    },
    [pathname, router, searchParams]
  )

  return {
    search,
    navigate,
  }
}
