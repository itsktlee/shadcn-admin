import { z } from 'zod'
import { errorEnvelopeSchema } from './error'

const responseMetaSchema = z.record(z.string(), z.unknown())

function createSuccessEnvelopeSchema<
  TData extends z.ZodTypeAny,
  TMeta extends z.ZodTypeAny = typeof responseMetaSchema,
>(dataSchema: TData, metaSchema?: TMeta) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: (metaSchema ?? responseMetaSchema) as TMeta,
  })
}

export { createSuccessEnvelopeSchema, errorEnvelopeSchema, responseMetaSchema }
