import axios from 'axios'
import type { ApiError, ErrorEnvelope } from '@/contracts/core/error'

class AdapterError extends Error {
  readonly apiError: ApiError

  constructor(apiError: ApiError) {
    super(apiError.message)
    this.name = 'AdapterError'
    this.apiError = apiError
  }
}

function createAdapterError(apiError: ApiError) {
  return new AdapterError(apiError)
}

function isAdapterError(error: unknown): error is AdapterError {
  return error instanceof AdapterError
}

function normalizeAdapterError(
  error: unknown,
  parseErrorEnvelope?: (input: unknown) => ErrorEnvelope
) {
  if (isAdapterError(error)) {
    return error
  }

  if (axios.isAxiosError(error) && parseErrorEnvelope && error.response?.data) {
    try {
      const parsed = parseErrorEnvelope(error.response.data)
      return createAdapterError(parsed.error)
    } catch {
      // Fall through to a generic adapter error below.
    }
  }

  if (error instanceof Error) {
    return createAdapterError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
    })
  }

  return createAdapterError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Unexpected adapter error.',
  })
}

export {
  AdapterError,
  createAdapterError,
  isAdapterError,
  normalizeAdapterError,
}
