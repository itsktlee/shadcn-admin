import { z } from 'zod'

const apiErrorCodeSchema = z.enum([
  'BAD_REQUEST',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'VALIDATION_ERROR',
  'INTERNAL_SERVER_ERROR',
])

const apiFieldErrorsSchema = z.record(z.string(), z.array(z.string()))

const apiErrorSchema = z.object({
  code: apiErrorCodeSchema,
  message: z.string(),
  fields: apiFieldErrorsSchema.optional(),
})

const errorEnvelopeSchema = z.object({
  success: z.literal(false),
  error: apiErrorSchema,
})

export {
  apiErrorCodeSchema,
  apiErrorSchema,
  apiFieldErrorsSchema,
  errorEnvelopeSchema,
}

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>
export type ApiError = z.infer<typeof apiErrorSchema>
export type ApiFieldErrors = z.infer<typeof apiFieldErrorsSchema>
export type ErrorEnvelope = z.infer<typeof errorEnvelopeSchema>
