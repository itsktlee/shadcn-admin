import type { NavigationGroupConfig } from '@/modules/types'

const navigationConfig: NavigationGroupConfig[] = [
  {
    id: 'general',
    title: 'General',
    titleKey: 'sidebar.groups.general',
    items: [
      'dashboard',
      'resources',
      'tasks',
      'apps',
      'chats',
      'users',
    ],
  },
  {
    id: 'pages',
    title: 'Pages',
    titleKey: 'sidebar.groups.pages',
    items: ['auth', 'errors'],
  },
  {
    id: 'other',
    title: 'Other',
    titleKey: 'sidebar.groups.other',
    items: ['settings', 'help-center'],
  },
]

export { navigationConfig }
