import { MessagesSquare } from 'lucide-react'
import type { ModuleManifest } from '@/modules/types'

const chatsManifest: ModuleManifest = {
  id: 'chats',
  kind: 'link',
  title: 'Chats',
  titleKey: 'sidebar.nav.chats',
  href: '/chats',
  badge: '3',
  icon: MessagesSquare,
  permission: 'chats.view',
}

export { chatsManifest }
