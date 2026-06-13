import {
  resourceBulkDeleteInputSchema,
  resourceBulkDeleteResponseSchema,
  resourceBulkUpdateStatusInputSchema,
  resourceBulkUpdateStatusResponseSchema,
  resourceCreateInputSchema,
  resourceDeleteResponseSchema,
  resourceDetailResponseSchema,
  resourceListResponseSchema,
  resourceMutationResponseSchema,
  resourceSchema,
  resourceUpdateInputSchema,
  type Resource,
} from '@/contracts/resources'
import { createAdapterError } from '@/services/adapters/error'
import type { ResourcesAdapter } from '@/services/adapters/types'
import { normalizeResourcesListQuery } from '@/services/query/resources'

function createSeedResources(): Resource[] {
  const baseTime = new Date('2026-06-12T09:00:00.000Z').getTime()
  const seeds = [
    {
      slug: 'analytics-core',
      name: 'Analytics Core',
      description: 'Shared analytics workspace and ETL surfaces.',
      status: 'active',
      category: 'analytics',
      owner: 'Platform Team',
      tags: ['analytics', 'shared'],
    },
    {
      slug: 'operations-console',
      name: 'Operations Console',
      description: 'Incident and maintenance orchestration surface.',
      status: 'draft',
      category: 'operations',
      owner: 'Ops Team',
      tags: ['ops', 'incident'],
    },
    {
      slug: 'infrastructure-hub',
      name: 'Infrastructure Hub',
      description: 'Internal infrastructure inventory and status center.',
      status: 'archived',
      category: 'infrastructure',
      owner: 'Infra Team',
      tags: ['infra', 'inventory'],
    },
    {
      slug: 'workspace-portal',
      name: 'Workspace Portal',
      description: 'Shared workspace entry for internal productivity tools.',
      status: 'active',
      category: 'workspace',
      owner: 'Workspace Team',
      tags: ['workspace', 'portal'],
    },
    {
      slug: 'growth-insights',
      name: 'Growth Insights',
      description: 'Acquisition dashboards and funnel monitoring surfaces.',
      status: 'active',
      category: 'analytics',
      owner: 'Growth Team',
      tags: ['growth', 'analytics'],
    },
    {
      slug: 'release-orchestrator',
      name: 'Release Orchestrator',
      description: 'Release calendar, change windows, and rollout controls.',
      status: 'draft',
      category: 'operations',
      owner: 'Platform Team',
      tags: ['release', 'ops'],
    },
    {
      slug: 'asset-catalog',
      name: 'Asset Catalog',
      description: 'Catalog for design assets, downloads, and shared files.',
      status: 'active',
      category: 'workspace',
      owner: 'Brand Team',
      tags: ['assets', 'shared'],
    },
    {
      slug: 'network-observability',
      name: 'Network Observability',
      description: 'Traffic health, edge diagnostics, and network telemetry.',
      status: 'archived',
      category: 'infrastructure',
      owner: 'Infra Team',
      tags: ['network', 'telemetry'],
    },
    {
      slug: 'support-command',
      name: 'Support Command',
      description: 'Unified issue triage workspace for support operations.',
      status: 'active',
      category: 'operations',
      owner: 'Support Team',
      tags: ['support', 'triage'],
    },
    {
      slug: 'data-governance',
      name: 'Data Governance',
      description: 'Ownership, lineage, and policy tracking for data assets.',
      status: 'draft',
      category: 'analytics',
      owner: 'Data Team',
      tags: ['governance', 'data'],
    },
    {
      slug: 'workspace-directory',
      name: 'Workspace Directory',
      description: 'Team spaces, ownership, and collaboration directory.',
      status: 'active',
      category: 'workspace',
      owner: 'Workspace Team',
      tags: ['directory', 'workspace'],
    },
    {
      slug: 'compute-registry',
      name: 'Compute Registry',
      description: 'Runtime inventory and lifecycle tracking for workloads.',
      status: 'active',
      category: 'infrastructure',
      owner: 'Infra Team',
      tags: ['compute', 'registry'],
    },
    {
      slug: 'forecast-board',
      name: 'Forecast Board',
      description: 'Pipeline forecast, scenario planning, and weekly cadence.',
      status: 'draft',
      category: 'analytics',
      owner: 'Revenue Team',
      tags: ['forecast', 'planning'],
    },
    {
      slug: 'maintenance-planner',
      name: 'Maintenance Planner',
      description: 'Planned maintenance runs, approvals, and follow-ups.',
      status: 'active',
      category: 'operations',
      owner: 'Ops Team',
      tags: ['maintenance', 'schedule'],
    },
  ] as const

  return resourceSchema.array().parse(
    seeds.map((seed, index) => {
      const createdAt = new Date(
        baseTime - (index + 7) * 86400000
      ).toISOString()
      const updatedAt = new Date(baseTime - index * 21600000).toISOString()

      return {
        id: `resource-${seed.slug}`,
        ...seed,
        createdAt,
        updatedAt,
      }
    })
  )
}

function applyListQuery(
  resources: Resource[],
  query: ReturnType<typeof normalizeResourcesListQuery>
) {
  const search = query.search.toLowerCase()

  const filtered = resources.filter((resource) => {
    const matchesSearch =
      !search ||
      resource.name.toLowerCase().includes(search) ||
      resource.slug.toLowerCase().includes(search) ||
      resource.owner.toLowerCase().includes(search)
    const matchesStatus =
      query.status.length === 0 || query.status.includes(resource.status)
    const matchesCategory =
      query.category.length === 0 || query.category.includes(resource.category)
    const matchesOwner =
      query.owner.length === 0 || query.owner.includes(resource.owner)
    const matchesTags =
      query.tags.length === 0 ||
      query.tags.every((tag) => resource.tags.includes(tag))

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesOwner &&
      matchesTags
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    const direction = query.sortOrder === 'asc' ? 1 : -1
    const left = a[query.sortBy]
    const right = b[query.sortBy]

    return String(left).localeCompare(String(right)) * direction
  })

  const start = (query.page - 1) * query.pageSize
  const end = start + query.pageSize

  return {
    items: sorted.slice(start, end),
    total: sorted.length,
  }
}

function createMockResourcesAdapter(
  seed = createSeedResources()
): ResourcesAdapter {
  let resources = [...seed]

  function assertUniqueSlug(inputSlug: string, currentId?: string) {
    const conflict = resources.find(
      (resource) => resource.slug === inputSlug && resource.id !== currentId
    )

    if (!conflict) {
      return
    }

    throw createAdapterError({
      code: 'CONFLICT',
      message: 'Slug already exists.',
      fields: {
        slug: ['Slug already exists.'],
      },
    })
  }

  function getExistingResource(id: string) {
    const resource = resources.find((item) => item.id === id)

    if (!resource) {
      throw createAdapterError({
        code: 'NOT_FOUND',
        message: `Resource "${id}" does not exist.`,
      })
    }

    return resource
  }

  return {
    async listResources(query) {
      const normalized = normalizeResourcesListQuery(query)
      const { items, total } = applyListQuery(resources, normalized)
      const pageCount = Math.max(1, Math.ceil(total / normalized.pageSize))

      return resourceListResponseSchema.parse({
        success: true,
        data: {
          items,
          total,
          page: normalized.page,
          pageSize: normalized.pageSize,
        },
        meta: {
          page: normalized.page,
          pageSize: normalized.pageSize,
          total,
          pageCount,
          sortBy: normalized.sortBy,
          sortOrder: normalized.sortOrder,
        },
      })
    },

    async getResource(id) {
      return resourceDetailResponseSchema.parse({
        success: true,
        data: getExistingResource(id),
        meta: {},
      })
    },

    async createResource(input) {
      const parsed = resourceCreateInputSchema.parse(input)
      assertUniqueSlug(parsed.slug)
      const now = new Date().toISOString()
      const resource = resourceSchema.parse({
        id: `resource-${parsed.slug}`,
        ...parsed,
        createdAt: now,
        updatedAt: now,
      })

      resources = [resource, ...resources]

      return resourceMutationResponseSchema.parse({
        success: true,
        data: resource,
        meta: {},
      })
    },

    async updateResource(id, input) {
      const parsed = resourceUpdateInputSchema.parse(input)
      const current = getExistingResource(id)

      if (parsed.slug) {
        assertUniqueSlug(parsed.slug, id)
      }

      const updated = resourceSchema.parse({
        ...current,
        ...parsed,
        updatedAt: new Date().toISOString(),
      })

      resources = resources.map((item) => (item.id === id ? updated : item))

      return resourceMutationResponseSchema.parse({
        success: true,
        data: updated,
        meta: {},
      })
    },

    async deleteResource(id) {
      getExistingResource(id)
      resources = resources.filter((item) => item.id !== id)

      return resourceDeleteResponseSchema.parse({
        success: true,
        data: { id },
        meta: {},
      })
    },

    async bulkDeleteResources(input) {
      const parsed = resourceBulkDeleteInputSchema.parse(input)
      const existingIds = new Set(resources.map((item) => item.id))
      const missingId = parsed.ids.find((id) => !existingIds.has(id))

      if (missingId) {
        throw createAdapterError({
          code: 'NOT_FOUND',
          message: `Resource "${missingId}" does not exist.`,
        })
      }

      resources = resources.filter((item) => !parsed.ids.includes(item.id))

      return resourceBulkDeleteResponseSchema.parse({
        success: true,
        data: {
          ids: parsed.ids,
          count: parsed.ids.length,
        },
        meta: {},
      })
    },

    async bulkUpdateResourcesStatus(input) {
      const parsed = resourceBulkUpdateStatusInputSchema.parse(input)
      const existingIds = new Set(resources.map((item) => item.id))
      const missingId = parsed.ids.find((id) => !existingIds.has(id))

      if (missingId) {
        throw createAdapterError({
          code: 'NOT_FOUND',
          message: `Resource "${missingId}" does not exist.`,
        })
      }

      resources = resources.map((item) =>
        parsed.ids.includes(item.id)
          ? {
              ...item,
              status: parsed.status,
              updatedAt: new Date().toISOString(),
            }
          : item
      )

      return resourceBulkUpdateStatusResponseSchema.parse({
        success: true,
        data: {
          ids: parsed.ids,
          status: parsed.status,
          count: parsed.ids.length,
        },
        meta: {},
      })
    },
  }
}

export { createMockResourcesAdapter }
