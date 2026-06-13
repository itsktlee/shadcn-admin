import type { ResourceCategory, ResourceStatus } from '@/contracts/resources'
import { createMockResourcesAdapter } from '@/services/adapters/mock/resources'
import {
  Archive,
  BadgeCheck,
  CircleDashed,
  type LucideIcon,
} from 'lucide-react'

type ResourceStatusOption = {
  value: ResourceStatus
  labelKey: string
  icon: LucideIcon
  className: string
}

type ResourceCategoryOption = {
  value: ResourceCategory
  labelKey: string
}

const resourcesAdapter = createMockResourcesAdapter()

const resourceStatusOptions: ResourceStatusOption[] = [
  {
    value: 'draft',
    labelKey: 'resources.data.statuses.draft',
    icon: CircleDashed,
    className:
      'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  {
    value: 'active',
    labelKey: 'resources.data.statuses.active',
    icon: BadgeCheck,
    className:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  {
    value: 'archived',
    labelKey: 'resources.data.statuses.archived',
    icon: Archive,
    className:
      'border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300',
  },
]

const resourceCategoryOptions: ResourceCategoryOption[] = [
  {
    value: 'operations',
    labelKey: 'resources.data.categories.operations',
  },
  {
    value: 'analytics',
    labelKey: 'resources.data.categories.analytics',
  },
  {
    value: 'workspace',
    labelKey: 'resources.data.categories.workspace',
  },
  {
    value: 'infrastructure',
    labelKey: 'resources.data.categories.infrastructure',
  },
]

function getResourceStatusMeta(status: ResourceStatus) {
  return resourceStatusOptions.find((item) => item.value === status)
}

function getResourceCategoryMeta(category: ResourceCategory) {
  return resourceCategoryOptions.find((item) => item.value === category)
}

export {
  getResourceCategoryMeta,
  getResourceStatusMeta,
  resourceCategoryOptions,
  resourcesAdapter,
  resourceStatusOptions,
}
