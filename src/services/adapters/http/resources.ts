import axios, { type AxiosInstance } from 'axios'
import {
  resourceBulkDeleteInputSchema,
  resourceBulkUpdateStatusInputSchema,
  resourceCreateInputSchema,
  resourceUpdateInputSchema,
} from '@/contracts/resources'
import { normalizeAdapterError } from '@/services/adapters/error'
import type { ResourcesAdapter } from '@/services/adapters/types'
import {
  normalizeResourcesListQuery,
  parseResourceBulkDeleteResponse,
  parseResourceBulkUpdateStatusResponse,
  parseResourceDeleteResponse,
  parseResourceDetailResponse,
  parseResourceListResponse,
  parseResourceMutationResponse,
  parseResourcesApiErrorResponse,
  serializeResourcesListQuery,
} from '@/services/query/resources'

function createHttpResourcesAdapter(
  client: AxiosInstance = axios.create({ baseURL: '/api' })
): ResourcesAdapter {
  return {
    async listResources(query) {
      try {
        const normalized = normalizeResourcesListQuery(query)
        const response = await client.get('/resources', {
          params: serializeResourcesListQuery(normalized),
        })

        return parseResourceListResponse(response.data)
      } catch (error) {
        throw normalizeAdapterError(error, parseResourcesApiErrorResponse)
      }
    },

    async getResource(id) {
      try {
        const response = await client.get(`/resources/${id}`)
        return parseResourceDetailResponse(response.data)
      } catch (error) {
        throw normalizeAdapterError(error, parseResourcesApiErrorResponse)
      }
    },

    async createResource(input) {
      try {
        const response = await client.post(
          '/resources',
          resourceCreateInputSchema.parse(input)
        )

        return parseResourceMutationResponse(response.data)
      } catch (error) {
        throw normalizeAdapterError(error, parseResourcesApiErrorResponse)
      }
    },

    async updateResource(id, input) {
      try {
        const response = await client.patch(
          `/resources/${id}`,
          resourceUpdateInputSchema.parse(input)
        )

        return parseResourceMutationResponse(response.data)
      } catch (error) {
        throw normalizeAdapterError(error, parseResourcesApiErrorResponse)
      }
    },

    async deleteResource(id) {
      try {
        const response = await client.delete(`/resources/${id}`)
        return parseResourceDeleteResponse(response.data)
      } catch (error) {
        throw normalizeAdapterError(error, parseResourcesApiErrorResponse)
      }
    },

    async bulkDeleteResources(input) {
      try {
        const response = await client.post(
          '/resources/bulk-delete',
          resourceBulkDeleteInputSchema.parse(input)
        )

        return parseResourceBulkDeleteResponse(response.data)
      } catch (error) {
        throw normalizeAdapterError(error, parseResourcesApiErrorResponse)
      }
    },

    async bulkUpdateResourcesStatus(input) {
      try {
        const response = await client.post(
          '/resources/bulk-update-status',
          resourceBulkUpdateStatusInputSchema.parse(input)
        )

        return parseResourceBulkUpdateStatusResponse(response.data)
      } catch (error) {
        throw normalizeAdapterError(error, parseResourcesApiErrorResponse)
      }
    },
  }
}

export { createHttpResourcesAdapter }
