import { Shield, UserCheck, Users, CreditCard } from 'lucide-react'
import { type UserStatus } from './schema'

export const callTypes = new Map<UserStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const roles = [
  {
    label: 'Superadmin',
    labelKey: 'users.data.roles.superadmin',
    value: 'superadmin',
    icon: Shield,
  },
  {
    label: 'Admin',
    labelKey: 'users.data.roles.admin',
    value: 'admin',
    icon: UserCheck,
  },
  {
    label: 'Manager',
    labelKey: 'users.data.roles.manager',
    value: 'manager',
    icon: Users,
  },
  {
    label: 'Cashier',
    labelKey: 'users.data.roles.cashier',
    value: 'cashier',
    icon: CreditCard,
  },
] as const

export const statuses = [
  {
    label: 'Active',
    labelKey: 'users.data.statuses.active',
    value: 'active',
  },
  {
    label: 'Inactive',
    labelKey: 'users.data.statuses.inactive',
    value: 'inactive',
  },
  {
    label: 'Invited',
    labelKey: 'users.data.statuses.invited',
    value: 'invited',
  },
  {
    label: 'Suspended',
    labelKey: 'users.data.statuses.suspended',
    value: 'suspended',
  },
] as const
