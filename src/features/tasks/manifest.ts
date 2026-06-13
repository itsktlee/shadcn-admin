import { ListTodo } from 'lucide-react'
import type { ModuleManifest } from '@/modules/types'

const tasksManifest: ModuleManifest = {
  id: 'tasks',
  kind: 'link',
  title: 'Tasks',
  titleKey: 'sidebar.nav.tasks',
  href: '/tasks',
  icon: ListTodo,
  permission: 'tasks.view',
}

export { tasksManifest }
