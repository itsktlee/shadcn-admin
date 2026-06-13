import type {
  ResourceBulkDeleteInput,
  ResourceBulkDeleteResponse,
  ResourceBulkUpdateStatusInput,
  ResourceBulkUpdateStatusResponse,
  ResourceCreateInput,
  ResourceDeleteResponse,
  ResourceDetailResponse,
  ResourceListQuery,
  ResourceListResponse,
  ResourceMutationResponse,
  ResourceUpdateInput,
} from '@/contracts/resources'

interface ResourcesAdapter {
  bulkDeleteResources: (
    input: ResourceBulkDeleteInput
  ) => Promise<ResourceBulkDeleteResponse>
  bulkUpdateResourcesStatus: (
    input: ResourceBulkUpdateStatusInput
  ) => Promise<ResourceBulkUpdateStatusResponse>
  createResource: (input: ResourceCreateInput) => Promise<ResourceMutationResponse>
  deleteResource: (id: string) => Promise<ResourceDeleteResponse>
  getResource: (id: string) => Promise<ResourceDetailResponse>
  listResources: (query: ResourceListQuery) => Promise<ResourceListResponse>
  updateResource: (
    id: string,
    input: ResourceUpdateInput
  ) => Promise<ResourceMutationResponse>
}

export type { ResourcesAdapter }
