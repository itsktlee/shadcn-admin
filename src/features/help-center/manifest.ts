import { HelpCircle } from 'lucide-react'
import type { ModuleManifest } from '@/modules/types'

const helpCenterManifest: ModuleManifest = {
  id: 'help-center',
  kind: 'link',
  title: 'Help Center',
  titleKey: 'sidebar.nav.helpCenter',
  href: '/help-center',
  icon: HelpCircle,
  permission: 'help-center.view',
}

export { helpCenterManifest }
