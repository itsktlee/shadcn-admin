import { Package } from 'lucide-react'
import type { ModuleManifest } from '@/modules/types'

const appsManifest: ModuleManifest = {
  id: 'apps',
  kind: 'link',
  title: 'Apps',
  titleKey: 'sidebar.nav.apps',
  href: '/apps',
  icon: Package,
  permission: 'apps.view',
}

export { appsManifest }
