import {
  Bug,
  Construction,
  FileX,
  Lock,
  ServerOff,
  UserX,
} from 'lucide-react'
import type { ModuleManifest } from '@/modules/types'

const errorManifests: ModuleManifest[] = [
  {
    id: 'errors',
    kind: 'group',
    title: 'Errors',
    titleKey: 'sidebar.nav.errors',
    icon: Bug,
    children: [
      'error-unauthorized',
      'error-forbidden',
      'error-not-found',
      'error-internal-server-error',
      'error-maintenance-error',
    ],
    searchable: false,
  },
  {
    id: 'error-unauthorized',
    kind: 'link',
    title: 'Unauthorized',
    titleKey: 'sidebar.nav.errorUnauthorized',
    href: '/errors/unauthorized',
    icon: Lock,
  },
  {
    id: 'error-forbidden',
    kind: 'link',
    title: 'Forbidden',
    titleKey: 'sidebar.nav.errorForbidden',
    href: '/errors/forbidden',
    icon: UserX,
  },
  {
    id: 'error-not-found',
    kind: 'link',
    title: 'Not Found',
    titleKey: 'sidebar.nav.errorNotFound',
    href: '/errors/not-found',
    icon: FileX,
  },
  {
    id: 'error-internal-server-error',
    kind: 'link',
    title: 'Internal Server Error',
    titleKey: 'sidebar.nav.errorInternalServerError',
    href: '/errors/internal-server-error',
    icon: ServerOff,
  },
  {
    id: 'error-maintenance-error',
    kind: 'link',
    title: 'Maintenance Error',
    titleKey: 'sidebar.nav.errorMaintenanceError',
    href: '/errors/maintenance-error',
    icon: Construction,
  },
]

export { errorManifests }
