import {
  resourcesApiErrorResponseSchema,
  resourceBulkDeleteResponseSchema,
  resourceBulkUpdateStatusResponseSchema,
  resourceDeleteResponseSchema,
  resourceDetailResponseSchema,
  resourceListQuerySchema,
  resourceListResponseSchema,
  resourceMutationResponseSchema,
  resourceSortableFieldSchema,
  resourceStatusSchema,
  resourceCategorySchema,
  resourceTagSchema,
  type ResourceListQuery,
} from '@/contracts/resources'

type ResourceListQueryInput =
  | Partial<ResourceListQuery>
  | URLSearchParams
  | Record<string, string | string[] | undefined>

function collectArrayValue(
  source: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string
) {
  if (source instanceof URLSearchParams) {
    return source.getAll(key)
  }

  const value = source[key]
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function collectFirstValue(
  source: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string
) {
  if (source instanceof URLSearchParams) {
    return source.get(key) ?? undefined
  }

  const value = source[key]
  return Array.isArray(value) ? value[0] : value
}

function normalizeResourcesListQuery(input: ResourceListQueryInput = {}) {
  if (
    input instanceof URLSearchParams ||
    (!('page' in input) &&
      !('pageSize' in input) &&
      !('search' in input) &&
      !('sortBy' in input) &&
      !('sortOrder' in input))
  ) {
    const source = input as
      | URLSearchParams
      | Record<string, string | string[] | undefined>

    return resourceListQuerySchema.parse({
      page: Number(collectFirstValue(source, 'page') ?? 1),
      pageSize: Number(collectFirstValue(source, 'pageSize') ?? 10),
      search: collectFirstValue(source, 'search') ?? '',
      sortBy:
        collectFirstValue(source, 'sortBy') ??
        resourceSortableFieldSchema.options[4],
      sortOrder: collectFirstValue(source, 'sortOrder') ?? 'desc',
      status: collectArrayValue(source, 'status'),
      category: collectArrayValue(source, 'category'),
      owner: collectArrayValue(source, 'owner'),
      tags: collectArrayValue(source, 'tags'),
    })
  }

  return resourceListQuerySchema.parse(input)
}

function serializeResourcesListQuery(query: ResourceListQuery) {
  const normalized = normalizeResourcesListQuery(query)
  const params = new URLSearchParams()

  params.set('page', String(normalized.page))
  params.set('pageSize', String(normalized.pageSize))
  if (normalized.search) params.set('search', normalized.search)
  if (normalized.sortBy) params.set('sortBy', normalized.sortBy)
  if (normalized.sortOrder) params.set('sortOrder', normalized.sortOrder)

  normalized.status.forEach((value) => {
    params.append('status', resourceStatusSchema.parse(value))
  })
  normalized.category.forEach((value) => {
    params.append('category', resourceCategorySchema.parse(value))
  })
  normalized.owner.forEach((value) => {
    params.append('owner', value)
  })
  normalized.tags.forEach((value) => {
    params.append('tags', resourceTagSchema.parse(value))
  })

  return params
}

const resourcesQueryKeys = {
  all: ['resources'] as const,
  detail: (id: string) => [...resourcesQueryKeys.all, 'detail', id] as const,
  list: (query: ResourceListQuery) =>
    [
      ...resourcesQueryKeys.all,
      'list',
      serializeResourcesListQuery(query).toString(),
    ] as const,
}

const parseResourceListResponse = resourceListResponseSchema.parse
const parseResourceDetailResponse = resourceDetailResponseSchema.parse
const parseResourceMutationResponse = resourceMutationResponseSchema.parse
const parseResourceDeleteResponse = resourceDeleteResponseSchema.parse
const parseResourceBulkDeleteResponse = resourceBulkDeleteResponseSchema.parse
const parseResourceBulkUpdateStatusResponse =
  resourceBulkUpdateStatusResponseSchema.parse
const parseResourcesApiErrorResponse = resourcesApiErrorResponseSchema.parse

export {
  normalizeResourcesListQuery,
  parseResourceBulkDeleteResponse,
  parseResourceBulkUpdateStatusResponse,
  parseResourceDeleteResponse,
  parseResourceDetailResponse,
  parseResourceListResponse,
  parseResourceMutationResponse,
  parseResourcesApiErrorResponse,
  resourcesQueryKeys,
  serializeResourcesListQuery,
}
