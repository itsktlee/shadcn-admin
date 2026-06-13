import {
  resourceBulkDeleteInputSchema,
  resourceBulkUpdateStatusInputSchema,
  resourceCreateInputSchema,
  resourceUpdateInputSchema,
} from '@/contracts/resources'
import type { ResourcesAdapter } from '@/services/adapters/types'
import {
  normalizeResourcesListQuery,
  parseResourceBulkDeleteResponse,
  parseResourceBulkUpdateStatusResponse,
  parseResourceDeleteResponse,
  parseResourceDetailResponse,
  parseResourceListResponse,
  parseResourceMutationResponse,
} from '@/services/query/resources'

type ServerResourcesHandlers = {
  bulkDeleteResources: (input: unknown) => Promise<unknown>
  bulkUpdateResourcesStatus: (input: unknown) => Promise<unknown>
  createResource: (input: unknown) => Promise<unknown>
  deleteResource: (id: string) => Promise<unknown>
  getResource: (id: string) => Promise<unknown>
  listResources: (query: unknown) => Promise<unknown>
  updateResource: (id: string, input: unknown) => Promise<unknown>
}

function createServerResourcesAdapter(
  handlers: ServerResourcesHandlers
): ResourcesAdapter {
  return {
    async listResources(query) {
      return parseResourceListResponse(
        await handlers.listResources(normalizeResourcesListQuery(query))
      )
    },

    async getResource(id) {
      return parseResourceDetailResponse(await handlers.getResource(id))
    },

    async createResource(input) {
      return parseResourceMutationResponse(
        await handlers.createResource(resourceCreateInputSchema.parse(input))
      )
    },

    async updateResource(id, input) {
      return parseResourceMutationResponse(
        await handlers.updateResource(id, resourceUpdateInputSchema.parse(input))
      )
    },

    async deleteResource(id) {
      return parseResourceDeleteResponse(await handlers.deleteResource(id))
    },

    async bulkDeleteResources(input) {
      return parseResourceBulkDeleteResponse(
        await handlers.bulkDeleteResources(
          resourceBulkDeleteInputSchema.parse(input)
        )
      )
    },

    async bulkUpdateResourcesStatus(input) {
      return parseResourceBulkUpdateStatusResponse(
        await handlers.bulkUpdateResourcesStatus(
          resourceBulkUpdateStatusInputSchema.parse(input)
        )
      )
    },
  }
}

export { createServerResourcesAdapter }
