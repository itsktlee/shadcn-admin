import { z } from 'zod'
import {
  createSuccessEnvelopeSchema,
  errorEnvelopeSchema,
  responseMetaSchema,
} from '@/contracts/core/envelope'
import {
  pagePaginationMetaSchema,
  pagePaginationSchema,
  sortOrderSchema,
} from '@/contracts/core/pagination'

const resourceIdSchema = z.string().min(1)
const resourceStatusSchema = z.enum(['draft', 'active', 'archived'])
const resourceCategorySchema = z.enum([
  'operations',
  'analytics',
  'workspace',
  'infrastructure',
])
const resourceTagSchema = z.string().trim().min(1).max(32)
const resourceSortableFieldSchema = z.enum([
  'name',
  'status',
  'category',
  'owner',
  'updatedAt',
  'createdAt',
])

const resourceSchema = z.object({
  id: resourceIdSchema,
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500).optional(),
  status: resourceStatusSchema,
  category: resourceCategorySchema,
  owner: z.string().trim().min(1).max(80),
  tags: z.array(resourceTagSchema).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

const resourceCreateInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500).optional(),
  status: resourceStatusSchema.default('draft'),
  category: resourceCategorySchema,
  owner: z.string().trim().min(1).max(80),
  tags: z.array(resourceTagSchema).default([]),
})

const resourceUpdateInputSchema = resourceCreateInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided.',
  })

const resourceBulkDeleteInputSchema = z.object({
  ids: z.array(resourceIdSchema).min(1),
})

const resourceBulkUpdateStatusInputSchema = z.object({
  ids: z.array(resourceIdSchema).min(1),
  status: resourceStatusSchema,
})

const resourceListQuerySchema = pagePaginationSchema.extend({
  search: z.string().trim().default(''),
  sortBy: resourceSortableFieldSchema.default('updatedAt'),
  sortOrder: sortOrderSchema.default('desc'),
  status: z.array(resourceStatusSchema).default([]),
  category: z.array(resourceCategorySchema).default([]),
  owner: z.array(z.string().trim().min(1)).default([]),
  tags: z.array(resourceTagSchema).default([]),
})

const resourceListDataSchema = z.object({
  items: z.array(resourceSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
})

const resourceListResponseSchema = createSuccessEnvelopeSchema(
  resourceListDataSchema,
  pagePaginationMetaSchema.extend({
    sortBy: resourceSortableFieldSchema,
    sortOrder: sortOrderSchema,
  })
)

const resourceDetailResponseSchema = createSuccessEnvelopeSchema(
  resourceSchema,
  responseMetaSchema
)

const resourceMutationResponseSchema = createSuccessEnvelopeSchema(
  resourceSchema,
  responseMetaSchema
)

const resourceDeleteResponseSchema = createSuccessEnvelopeSchema(
  z.object({
    id: resourceIdSchema,
  }),
  responseMetaSchema
)

const resourceBulkDeleteResponseSchema = createSuccessEnvelopeSchema(
  z.object({
    ids: z.array(resourceIdSchema),
    count: z.number().int().nonnegative(),
  }),
  responseMetaSchema
)

const resourceBulkUpdateStatusResponseSchema = createSuccessEnvelopeSchema(
  z.object({
    ids: z.array(resourceIdSchema),
    status: resourceStatusSchema,
    count: z.number().int().nonnegative(),
  }),
  responseMetaSchema
)

const resourcesApiErrorResponseSchema = errorEnvelopeSchema

export {
  resourceBulkDeleteInputSchema,
  resourceBulkDeleteResponseSchema,
  resourceBulkUpdateStatusInputSchema,
  resourceBulkUpdateStatusResponseSchema,
  resourceCategorySchema,
  resourceCreateInputSchema,
  resourceDeleteResponseSchema,
  resourceDetailResponseSchema,
  resourceIdSchema,
  resourceListDataSchema,
  resourceListQuerySchema,
  resourceListResponseSchema,
  resourceMutationResponseSchema,
  resourceSchema,
  resourceSortableFieldSchema,
  resourceStatusSchema,
  resourceTagSchema,
  resourceUpdateInputSchema,
  resourcesApiErrorResponseSchema,
}

export type Resource = z.infer<typeof resourceSchema>
export type ResourceBulkDeleteInput = z.infer<
  typeof resourceBulkDeleteInputSchema
>
export type ResourceBulkDeleteResponse = z.infer<
  typeof resourceBulkDeleteResponseSchema
>
export type ResourceBulkUpdateStatusInput = z.infer<
  typeof resourceBulkUpdateStatusInputSchema
>
export type ResourceBulkUpdateStatusResponse = z.infer<
  typeof resourceBulkUpdateStatusResponseSchema
>
export type ResourceCategory = z.infer<typeof resourceCategorySchema>
export type ResourceCreateInput = z.infer<typeof resourceCreateInputSchema>
export type ResourceDeleteResponse = z.infer<typeof resourceDeleteResponseSchema>
export type ResourceDetailResponse = z.infer<typeof resourceDetailResponseSchema>
export type ResourceListData = z.infer<typeof resourceListDataSchema>
export type ResourceListQuery = z.infer<typeof resourceListQuerySchema>
export type ResourceListResponse = z.infer<typeof resourceListResponseSchema>
export type ResourceMutationResponse = z.infer<
  typeof resourceMutationResponseSchema
>
export type ResourceSortableField = z.infer<
  typeof resourceSortableFieldSchema
>
export type ResourceStatus = z.infer<typeof resourceStatusSchema>
export type ResourceUpdateInput = z.infer<typeof resourceUpdateInputSchema>
