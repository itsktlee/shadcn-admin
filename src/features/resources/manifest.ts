import type { ModuleManifest } from '@/modules/types'
import { Database } from 'lucide-react'

const resourcesManifest: ModuleManifest = {
  id: 'resources',
  kind: 'link',
  title: 'Resources',
  titleKey: 'sidebar.nav.resources',
  href: '/resources',
  icon: Database,
  permission: 'resources.view',
}

export { resourcesManifest }
