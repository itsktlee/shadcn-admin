import { Users } from 'lucide-react'
import type { ModuleManifest } from '@/modules/types'

const usersManifest: ModuleManifest = {
  id: 'users',
  kind: 'link',
  title: 'Users',
  titleKey: 'sidebar.nav.users',
  href: '/users',
  icon: Users,
  permission: 'users.view',
}

export { usersManifest }
