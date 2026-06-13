'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resourcesQueryKeys } from '@/services/query/resources'
import { resourcesAdapter } from '../data/data'

export function useResourcesMutations() {
  const queryClient = useQueryClient()

  const invalidateResources = async () => {
    await queryClient.invalidateQueries({
      queryKey: resourcesQueryKeys.all,
    })
  }

  const createResourceMutation = useMutation({
    mutationFn: resourcesAdapter.createResource,
    onSuccess: invalidateResources,
  })

  const updateResourceMutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: Parameters<typeof resourcesAdapter.updateResource>[1]
    }) => resourcesAdapter.updateResource(id, input),
    onSuccess: invalidateResources,
  })

  const deleteResourceMutation = useMutation({
    mutationFn: resourcesAdapter.deleteResource,
    onSuccess: invalidateResources,
  })

  const bulkDeleteResourcesMutation = useMutation({
    mutationFn: resourcesAdapter.bulkDeleteResources,
    onSuccess: invalidateResources,
  })

  const bulkUpdateResourcesStatusMutation = useMutation({
    mutationFn: resourcesAdapter.bulkUpdateResourcesStatus,
    onSuccess: invalidateResources,
  })

  return {
    bulkDeleteResourcesMutation,
    bulkUpdateResourcesStatusMutation,
    createResourceMutation,
    deleteResourceMutation,
    updateResourceMutation,
  }
}
