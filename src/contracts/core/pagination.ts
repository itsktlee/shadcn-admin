import { z } from 'zod'

const sortOrderSchema = z.enum(['asc', 'desc'])

const pagePaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
})

const pagePaginationMetaSchema = pagePaginationSchema.extend({
  total: z.number().int().nonnegative(),
  pageCount: z.number().int().positive(),
})

export { pagePaginationMetaSchema, pagePaginationSchema, sortOrderSchema }

export type SortOrder = z.infer<typeof sortOrderSchema>
export type PagePagination = z.infer<typeof pagePaginationSchema>
export type PagePaginationMeta = z.infer<typeof pagePaginationMetaSchema>
