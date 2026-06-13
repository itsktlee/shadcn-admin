import { z } from 'zod'

const appPermissionSchema = z.string().trim().min(1)

const authUserSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  email: z.email(),
  avatar: z.string().trim().min(1).optional().default('/images/shadcn-admin.png'),
  roles: z.array(z.string().trim().min(1)).default([]),
})

const authSessionSchema = z.object({
  user: authUserSchema,
  permissions: z.array(appPermissionSchema).default([]),
  expiresAt: z.iso.datetime(),
  provider: z.enum(['mock']).default('mock'),
})

type AppPermission = z.infer<typeof appPermissionSchema>
type AuthUser = z.infer<typeof authUserSchema>
type AuthSession = z.infer<typeof authSessionSchema>

export {
  appPermissionSchema,
  authSessionSchema,
  authUserSchema,
}

export type {
  AppPermission,
  AuthSession,
  AuthUser,
}
