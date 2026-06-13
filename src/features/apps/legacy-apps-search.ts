export type AppType = 'all' | 'connected' | 'notConnected'
export type AppSort = 'asc' | 'desc'

export type LegacyAppsSearchState = {
  filter: string
  type: AppType
  sort: AppSort
}

const DEFAULT_SEARCH_STATE: LegacyAppsSearchState = {
  filter: '',
  type: 'all',
  sort: 'asc',
}

export function readLegacyAppsSearch(): LegacyAppsSearchState {
  if (typeof window === 'undefined') {
    return DEFAULT_SEARCH_STATE
  }

  const searchParams = new URLSearchParams(window.location.search)
  const type = searchParams.get('type')
  const sort = searchParams.get('sort')

  return {
    filter: searchParams.get('filter') ?? DEFAULT_SEARCH_STATE.filter,
    type:
      type === 'connected' || type === 'notConnected'
        ? type
        : DEFAULT_SEARCH_STATE.type,
    sort: sort === 'desc' ? 'desc' : DEFAULT_SEARCH_STATE.sort,
  }
}

export function writeLegacyAppsSearch(search: LegacyAppsSearchState) {
  if (typeof window === 'undefined') {
    return
  }

  const nextSearchParams = new URLSearchParams(window.location.search)

  if (search.filter) {
    nextSearchParams.set('filter', search.filter)
  } else {
    nextSearchParams.delete('filter')
  }

  if (search.type !== 'all') {
    nextSearchParams.set('type', search.type)
  } else {
    nextSearchParams.delete('type')
  }

  if (search.sort !== 'asc') {
    nextSearchParams.set('sort', search.sort)
  } else {
    nextSearchParams.delete('sort')
  }

  const nextSearchString = nextSearchParams.toString()
  const nextUrl = `${window.location.pathname}${nextSearchString ? `?${nextSearchString}` : ''}${window.location.hash}`
  window.history.replaceState(null, '', nextUrl)
}
