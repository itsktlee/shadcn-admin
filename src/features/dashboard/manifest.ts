import { LayoutDashboard } from 'lucide-react'
import type { ModuleManifest } from '@/modules/types'

const dashboardManifest: ModuleManifest = {
  id: 'dashboard',
  kind: 'link',
  title: 'Dashboard',
  titleKey: 'sidebar.nav.dashboard',
  href: '/',
  icon: LayoutDashboard,
  permission: 'dashboard.view',
}

export { dashboardManifest }
