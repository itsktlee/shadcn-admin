import { useCallback, useEffect, useMemo, useState } from 'react'
import { type NavigateFn } from './use-table-url-state'

type LegacySearchRecord = Record<string, unknown>

type UseLegacySearchStateOptions = {
  stringKeys?: string[]
  numberKeys?: string[]
  arrayKeys?: string[]
}

function readLegacySearchRecord({
  stringKeys = [],
  numberKeys = [],
  arrayKeys = [],
}: UseLegacySearchStateOptions): LegacySearchRecord {
  if (typeof window === 'undefined') {
    return {}
  }

  const searchParams = new URLSearchParams(window.location.search)
  const result: LegacySearchRecord = {}

  for (const key of stringKeys) {
    const value = searchParams.get(key)
    if (value !== null && value !== '') {
      result[key] = value
    }
  }

  for (const key of numberKeys) {
    const value = searchParams.get(key)
    if (value === null || value === '') continue
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) {
      result[key] = parsed
    }
  }

  for (const key of arrayKeys) {
    const values = searchParams.getAll(key).filter(Boolean)
    if (values.length > 0) {
      result[key] = values
    }
  }

  return result
}

function writeLegacySearchRecord(
  next: LegacySearchRecord,
  { stringKeys = [], numberKeys = [], arrayKeys = [] }: UseLegacySearchStateOptions,
  replace?: boolean
) {
  if (typeof window === 'undefined') {
    return
  }

  const searchParams = new URLSearchParams(window.location.search)
  const managedKeys = new Set([...stringKeys, ...numberKeys, ...arrayKeys])

  for (const key of managedKeys) {
    searchParams.delete(key)
  }

  for (const key of stringKeys) {
    const value = next[key]
    if (typeof value === 'string' && value !== '') {
      searchParams.set(key, value)
    }
  }

  for (const key of numberKeys) {
    const value = next[key]
    if (typeof value === 'number' && !Number.isNaN(value)) {
      searchParams.set(key, String(value))
    }
  }

  for (const key of arrayKeys) {
    const value = next[key]
    if (Array.isArray(value) && value.length > 0) {
      for (const item of value) {
        if (typeof item === 'string' && item !== '') {
          searchParams.append(key, item)
        }
      }
    }
  }

  const nextSearch = searchParams.toString()
  const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`

  if (replace) {
    window.history.replaceState(null, '', nextUrl)
    return
  }

  window.history.pushState(null, '', nextUrl)
}

export function useLegacySearchState(options: UseLegacySearchStateOptions) {
  const stringKeys = options.stringKeys ?? []
  const numberKeys = options.numberKeys ?? []
  const arrayKeys = options.arrayKeys ?? []
  const stringKeysKey = stringKeys.join('|')
  const numberKeysKey = numberKeys.join('|')
  const arrayKeysKey = arrayKeys.join('|')

  const resolvedOptions = useMemo(
    () => ({
      stringKeys: stringKeysKey ? stringKeysKey.split('|') : [],
      numberKeys: numberKeysKey ? numberKeysKey.split('|') : [],
      arrayKeys: arrayKeysKey ? arrayKeysKey.split('|') : [],
    }),
    [stringKeysKey, numberKeysKey, arrayKeysKey]
  )
  const [search, setSearch] = useState<LegacySearchRecord>(() =>
    readLegacySearchRecord(resolvedOptions)
  )

  useEffect(() => {
    const syncFromLocation = () => {
      setSearch(readLegacySearchRecord(resolvedOptions))
    }

    window.addEventListener('popstate', syncFromLocation)
    return () => window.removeEventListener('popstate', syncFromLocation)
  }, [resolvedOptions])

  const navigate = useCallback<NavigateFn>(
    ({ search: nextSearchInput, replace }) => {
      setSearch((prev) => {
        const nextSearch =
          nextSearchInput === true
            ? prev
            : typeof nextSearchInput === 'function'
              ? (nextSearchInput(prev) as LegacySearchRecord)
              : (nextSearchInput as LegacySearchRecord)

        writeLegacySearchRecord(nextSearch, resolvedOptions, replace)
        return nextSearch
      })
    },
    [resolvedOptions]
  )

  return { search, navigate }
}
